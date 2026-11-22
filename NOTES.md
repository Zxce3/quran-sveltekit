# Notes: quranJekyll study and port decisions

Reference: <https://github.com/Zxce3/quranJekyll> (cloned read-only to `../quranJekyll-ref`, last commit
`3bb7e72 update something`). It was built once, in a scratch copy, with Jekyll 4.2.2 to get `_site` for
comparison; the reference checkout itself was never modified.

## 1. What the Jekyll site is

A tiny Jekyll 4.2 site (`minima` gem in the Gemfile but its layouts are overridden), styled by the
[Halfmoon 1.1.1](https://www.gethalfmoon.com) CSS/JS kit and Font Awesome 4.7 loaded from CDNs.
`assets/js/index.js` is an unmodified copy of Halfmoon's JS (modals, dropdowns, dark-mode cookie, shortcuts).
There is no build pipeline, no deploy config (no `.github`, no CNAME) and no tests.
`baseurl` and `url` are empty; the title is "Quran ku".

### Pages and URL patterns

| Jekyll URL         | Source                                  | What it shows                                                                                                                                                                                                                                                |
| ------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                | `index.markdown` + `_layouts/home.html` | One card per surah (number box, `name › Indonesian name › Arabic name`). Each card links to `#N`.                                                                                                                                                            |
| `/#N` (N = 1..114) | `_includes/quran.html`                  | A full-screen Halfmoon **modal** per surah rendered into the same HTML file (114 modals; the page is ~13 MB): type (Makkiyah/Madaniyah), name, "Surat ke N", "N Ayat", the basmalah, then every ayah (Arabic, then Indonesian translation), then "Tafsir …". |
| `/about/`          | `about.markdown`, `layout: page`        | **Blank.** `_layouts/page.html` is an empty file, so the built page is 0 bytes. The markdown is Jekyll boilerplate anyway.                                                                                                                                   |
| `/404.html`        | `404.html`, `layout: default`           | "404 / Page not found :(".                                                                                                                                                                                                                                   |
| `/feed.xml`        | `jekyll-feed` plugin                    | Valid but empty Atom feed (there are no posts).                                                                                                                                                                                                              |

No juz, page, ayah or per-surah URLs exist, and no sitemap or robots.txt.

### Data sources (`_data/`)

| File                  | Size  | Used by the site?        | Content                                                                                                                                                                                                       |
| --------------------- | ----- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `qc.yml`              | 15 MB | **Yes** (`site.data.qc`) | 114 surahs: names (ar/en/id), `number_of_ayah`, `number_of_surah`, `place`, `type`, `recitations`, `verses[]` (`number`, `text`, `translation_en`, `translation_id`), `tafsir.id.kemenag.text` keyed by ayah. |
| `quran-complete.json` | 13 MB | No                       | Same dataset as `qc.yml` in JSON.                                                                                                                                                                             |
| `quran.yml`           | 29 kB | No                       | Surah metadata only plus a per-surah audio URL (`download.quranicaudio.com/.../mishaari_raashid_al_3afaasee/NNN.mp3`).                                                                                        |

Verified by script (see `src/lib/data/reference.test.ts`):

- 114 surahs, 6236 ayahs; ayah numbering is contiguous in every surah.
- `qc.yml` and `quran-complete.json` are identical except that **the JSON prefixes the basmalah to ayah 1 of
  every surah except 1 and 9**, while `qc.yml` stores ayah 1 without it (and has an **empty** `text` for 1:1,
  which makes the Jekyll page show a blank Arabic line for 1:1). YAML folding also stripped trailing spaces
  from 950 tafsir paragraphs.
- Every ayah has a tafsir entry (6236 keys).
- `recitations[].audio_url` in the data are broken (`.../undefined.mp3`) and unused.
- No source or licence is stated for the text, translations or tafsir. The tafsir is labelled "Aplikasi Quran
  Kementrian Agama Republik Indonesia".

### Client-side features

Only what Halfmoon's JS provides: dark mode on by default (`body.dark-mode`), toggled with Shift+D and stored in
a `halfmoon_preferredMode` cookie; modal open/close via URL hash (Esc closes); Shift+S sidebar toggle (there is
no sidebar). **No search, no settings, no bookmarks, no audio player, no PWA.**

### SEO

`<title>` = "Quran ku" (or "<page title> | Quran ku"). No description, canonical, Open Graph, favicon, manifest,
sitemap or robots.txt. `lang="en"` on `<html>`, no `lang`/`dir` on the Arabic text.

### Bugs and things worth improving in the original

- The tafsir block prints the raw Ruby hash (`Tafsir {"1"=>"Surah al-Fatihah …"}`) once per surah instead of
  per-ayah tafsir.
- 1:1 renders an empty Arabic line; the basmalah is hard-coded above every surah, including At-Tawbah (9),
  which has none.
- The home page ships all 114 surahs (~13 MB of HTML) and has no real surah URLs, so nothing is linkable or
  indexable per surah.
- `/about/` is blank; the Jekyll boilerplate content refers to Minima.
- CDN-only CSS/fonts, no self-hosted Arabic font, no a11y metadata, no `lang`/`dir` on Arabic.

## 2. SvelteKit port: routes

| New URL (trailing slash)                               | Notes                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `/`                                                    | Same card list as Jekyll plus a filter box and a "last read" link.                           |
| `/#N`                                                  | Kept working: a small client redirect sends it to `/surah/N/`.                               |
| `/surah/N/` (1..114)                                   | **New.** Replaces the Jekyll modal. Ayah anchors are `#ayah-M`. Prerendered via `entries()`. |
| `/about/`                                              | Now has real content (credits, data sources). Same URL as Jekyll.                            |
| `/404.html`                                            | Same URL (adapter-static `fallback`), served by GitHub Pages for unknown paths.              |
| `/search/?q=…`                                         | **New** (reference had none). Client-side, `noindex`.                                        |
| `/settings/`                                           | **New.** Theme, Arabic size, translation.                                                    |
| `/bookmarks/`                                          | **New.** `noindex`, data lives in `localStorage`.                                            |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | **New** (generated at build time; manifest is static).                                       |
| `/feed.xml`                                            | **Intentionally dropped**: the Jekyll feed was empty (no posts).                             |

No juz/page/ayah routes: the reference has no juz or page data, and inventing it would risk altering the text.

## 3. Data layer decisions

- **Source of truth: `quran-complete.json`**, because it keeps the tafsir whitespace and has text for 1:1.
  `scripts/build-data.mjs` converts it, plus the audio URLs from `quran.yml`, into
  `src/lib/data/surahs.json`, `src/lib/data/verses/NNN.json` and `static/data/tafsir/NNN.json`
  (+ `static/data/search.json` for search). Strings are copied byte-for-byte; only key names changed.
- **Basmalah**: stored text is the JSON's, untouched. To match what Jekyll displayed, `displayArabic()` strips
  the leading basmalah from ayah 1 at display time (surahs other than 1 and 9) and the page shows the basmalah
  once as a heading, except for 1 (where it is ayah 1) and 9 (none). This also fixes the blank 1:1.
- Verse files are code-split JSON loaded by `+page.ts`; tafsir (9 MB total) is fetched only when an ayah's
  "Tafsir" panel is opened; the search index (~3 MB, ~1 MB gzipped) is fetched only on the search page.
- Integrity tests: 114 surahs, 6236 ayahs, contiguous numbering, bundled spot-check samples
  (`reference-samples.fixture.json`), and, when `../quranJekyll-ref` exists, a byte-for-byte comparison of
  every ayah and tafsir entry against the reference.

## 4. Choices made where the brief was ambiguous

- **Folder layout**: the brief asked for `quran-sveltekit` as a sibling of the reference, so the project is at
  `../quran-sveltekit`, not inside the (empty) `QuranSvelte` folder the session started in.
- **Features the reference lacked** (search, settings, bookmarks/last-read, audio): the brief says "if the
  reference has them", but also asks for tests, commits and spot checks for them. They were added as
  clearly-labelled enhancements. Audio is a plain `<audio controls preload="none">` streaming the per-surah
  Mishari al-Afasy URL from `quran.yml`; nothing is bundled.
- **UI language**: the reference mixes English and Indonesian labels ("Surat ke N", "N Ayat"). Those labels
  were kept; new controls are in English.
- **Look and feel**: Halfmoon and Font Awesome are not used (no CDN dependency). Dark is the default theme, as
  in Jekyll; the card list, number box and `name › Indonesian › Arabic` line follow the original.
- **Tailwind**: not used; scoped Svelte styles plus a small `app.css` of design tokens.
- **Licence**: the reference has no licence. The new code is MIT. The data is **not** covered by that
  licence; its origin is unstated upstream (see README).
- **Site URL / base path**: default `https://zxce3.github.io` (the reference's author). Override with
  `VITE_SITE_URL` and `BASE_PATH`; the GitHub Actions workflow derives both from the repository name.
- **Path alias**: this SvelteKit version deprecates `kit.alias`/`$lib`; the project uses Node subpath imports
  (`#lib/*` in `package.json`, imports include the `.ts` extension).
- **Param matchers**: SvelteKit 3 matchers are Standard Schema based; a plain `[id]` route with `entries()` and
  a 404 for out-of-range ids is used instead.

## 5. Verification log

- `pnpm check`, `pnpm lint`, `pnpm test` and `pnpm build` pass with zero errors and warnings.
- `vite preview` spot-checks (headless Chrome): home, short surah (108), Al-Fatihah, Al-Baqarah (286 ayat),
  search ("sabar" gives 92 hits), tafsir panel, bookmarks, settings, mobile viewport (390 px, no horizontal
  scroll), dark and light themes, RTL rendering and the self-hosted font (`Amiri Quran: loaded`).
- Lighthouse (desktop defaults): home 100/100/100/100, `/surah/2/` 99/100/100/100, `/settings/` 100/100/100/100
  (performance / accessibility / best practices / SEO).
- A build with `BASE_PATH=/quran-sveltekit` produces prefixed asset, canonical, sitemap and robots URLs.
