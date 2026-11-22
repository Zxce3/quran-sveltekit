import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { surahs } from './lib/data/index';

// Verifies the prerendered static site. Run `pnpm build` first; skipped when no build exists.
const build = resolve('build');
const hasBuild = existsSync(resolve(build, 'index.html'));
const read = (file: string) => readFileSync(resolve(build, file), 'utf8');

describe.skipIf(!hasBuild)('prerendered build output', () => {
	it('contains the static pages', () => {
		for (const page of ['index.html', '404.html', 'about/index.html', 'search/index.html']) {
			expect(existsSync(resolve(build, page)), page).toBe(true);
		}
		for (const page of ['settings/index.html', 'bookmarks/index.html']) {
			expect(existsSync(resolve(build, page)), page).toBe(true);
		}
	});

	it('contains a page for every surah with all of its ayat', () => {
		for (const s of surahs) {
			const file = `surah/${s.id}/index.html`;
			expect(existsSync(resolve(build, file)), file).toBe(true);
			const html = read(file);
			expect(html.match(/<article[^>]*id="ayah-\d+"/g)?.length, `ayat in surah ${s.id}`).toBe(
				s.ayahCount
			);
		}
		expect(existsSync(resolve(build, 'surah/0/index.html'))).toBe(false);
		expect(existsSync(resolve(build, 'surah/115/index.html'))).toBe(false);
	});

	it('marks Arabic text as RTL Arabic', () => {
		const html = read('surah/1/index.html');
		expect(html).toMatch(/lang="ar"[^>]*dir="rtl"|dir="rtl"[^>]*lang="ar"/);
	});

	it('has SEO tags on the home page and a surah page', () => {
		for (const file of ['index.html', 'surah/36/index.html']) {
			const html = read(file);
			expect(html, file).toMatch(/<title>[^<]+<\/title>/);
			expect(html, file).toMatch(/<meta name="description" content="[^"]+"/);
			expect(html, file).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+\/"/);
			expect(html, file).toMatch(/property="og:title"/);
			expect(html, file).toMatch(/rel="manifest"/);
		}
		expect(read('surah/36/index.html')).toContain(surahs[35].name);
	});

	it('has sitemap.xml, robots.txt, manifest and favicon', () => {
		const sitemap = read('sitemap.xml');
		expect(sitemap.match(/<loc>/g)).toHaveLength(2 + surahs.length);
		expect(sitemap).toContain('/surah/114/</loc>');
		expect(read('robots.txt')).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
		const manifest = JSON.parse(read('manifest.webmanifest')) as { icons: { src: string }[] };
		for (const icon of manifest.icons) expect(existsSync(resolve(build, icon.src))).toBe(true);
		expect(existsSync(resolve(build, 'favicon.svg'))).toBe(true);
	});

	it('ships the lazy-loaded data files', () => {
		expect(existsSync(resolve(build, 'data/search.json'))).toBe(true);
		for (const s of surahs) {
			expect(existsSync(resolve(build, `data/tafsir/${String(s.id).padStart(3, '0')}.json`))).toBe(
				true
			);
		}
	});

	it('self-hosts the Arabic font (no external font requests)', () => {
		const assets = resolve(build, '_app/immutable/assets');
		const fonts = readdirSync(assets).filter((f) => f.endsWith('.woff2'));
		expect(fonts.length).toBeGreaterThan(0);
		const css = readdirSync(assets)
			.filter((f) => f.endsWith('.css'))
			.map((f) => readFileSync(resolve(assets, f), 'utf8'))
			.join('\n');
		expect(css).toContain('Amiri Quran');
		expect(css).not.toMatch(/https?:\/\/fonts\.(googleapis|gstatic)\.com/);
	});
});
