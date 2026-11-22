# Quran ku (SvelteKit)

A static, fully prerendered Quran reader: 114 surahs, 6,236 ayat, Arabic text with Indonesian and English
translations and Kemenag tafsir, built with SvelteKit 3, Svelte 5 (runes) and `adapter-static`.

This is a SvelteKit rewrite of my earlier [quranJekyll](https://github.com/Zxce3/quranJekyll) site. The original is a Jekyll
site where every surah is a modal on one 13 MB page; this version gives each surah its own URL and adds search,
settings and bookmarks. See [NOTES.md](NOTES.md) for a full comparison and the decisions made.

## Features

- `/` list of all surahs with a filter; `/surah/N/` pages with Arabic (`lang="ar" dir="rtl"`, self-hosted
  Amiri Quran), Indonesian and/or English translation, lazy-loaded Kemenag tafsir and streamed audio.
- Search across Arabic (diacritics ignored), Indonesian and English.
- Settings: dark / light / system theme (Shift+D toggles), Arabic font size, translation. Bookmarks and
  "last read". Everything is stored in `localStorage` only.
- SEO: per-page title and description, canonical and Open Graph tags, `sitemap.xml`, `robots.txt`,
  favicon and web manifest.

## Requirements

Node.js 24 (see `.nvmrc`; `engines` allows `>=22.12`) and [pnpm](https://pnpm.io) 10.

## Commands

```sh
pnpm install          # install dependencies
pnpm dev              # dev server
pnpm check            # svelte-check (types, a11y)
pnpm lint             # prettier --check + eslint
pnpm format           # prettier --write
pnpm test             # vitest (data integrity, utilities; prerender checks if ./build exists)
pnpm build            # prerender everything into ./build
pnpm preview          # serve ./build locally
```

`pnpm test` after `pnpm build` also verifies the prerendered output (every surah page, all ayat, SEO tags,
sitemap, robots, manifest, self-hosted font).

### Regenerating the data

The generated JSON in `src/lib/data` and `static/data` is committed. To rebuild it from a checkout of the
original repository:

```sh
git clone https://github.com/Zxce3/quranJekyll ../quranJekyll-ref
node scripts/build-data.mjs ../quranJekyll-ref
pnpm test    # also compares every ayah and tafsir entry with the reference
```

## Deploying

### GitHub Pages

`.github/workflows/deploy.yml` installs, checks, lints, tests, builds and deploys on every push to `main`.
In the repository settings choose **Pages → Source: GitHub Actions**. The workflow takes the base path and
origin from `actions/configure-pages`, so project sites (`/<repo>/`) and user sites both work.

### Any static host

```sh
BASE_PATH=/subpath VITE_SITE_URL=https://example.com pnpm build   # BASE_PATH is empty for a root site
```

Upload `build/`. `404.html` is generated as the fallback page. `VITE_SITE_URL` sets the origin used in canonical
URLs, Open Graph tags and the sitemap (default `https://zxce3.github.io`).

## Data and licences

- **Code**: [MIT](LICENSE). The original quranJekyll repository has no licence file, so there is no upstream
  licence to inherit; no Jekyll files or code were copied.
- **Quran text, translations, tafsir**: taken unchanged from quranJekyll's `_data/quran-complete.json`. That
  repository does not say where the data came from or under which licence it may be used. The tafsir is
  credited there to the Kementerian Agama RI Quran app; the Indonesian translation appears to be Kemenag's and
  the English one appears to be Sahih International, but neither is stated. Check the upstream terms before
  redistributing the data outside this project.
- **Amiri Quran font**: SIL Open Font License 1.1 (via `@fontsource/amiri-quran`).
- **Audio**: streamed from quranicaudio.com (Mishari Rashid al-Afasy); not bundled.
