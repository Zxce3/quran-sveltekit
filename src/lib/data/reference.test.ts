import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadVerses, surahs } from './index';

// Full comparison against the quranJekyll checkout. Skipped when the reference repo is absent
// (e.g. in CI); the bundled fixture in data.test.ts still covers spot checks there.
const refFile = resolve('../quranJekyll-ref/_data/quran-complete.json');
const hasRef = existsSync(refFile);

interface RefSurah {
	name: string;
	number_of_ayah: number;
	number_of_surah: number;
	place: string;
	type: string;
	name_translations: { ar: string; en: string; id: string };
	verses: { number: number; text: string; translation_en: string; translation_id: string }[];
	tafsir: { id: { kemenag: { text: Record<string, string> } } };
}

describe.skipIf(!hasRef)('integrity against the quranJekyll reference', () => {
	const ref: RefSurah[] = hasRef
		? (JSON.parse(readFileSync(refFile, 'utf8').replace(/^\ufeff/, '')) as RefSurah[])
		: [];

	it('has identical surah metadata', () => {
		expect(ref).toHaveLength(114);
		ref.forEach((r, i) => {
			expect(surahs[i]).toMatchObject({
				id: r.number_of_surah,
				name: r.name,
				ar: r.name_translations.ar,
				en: r.name_translations.en,
				idn: r.name_translations.id,
				ayahCount: r.number_of_ayah,
				place: r.place,
				type: r.type
			});
		});
	});

	it('has byte-identical Arabic text and translations for all 6236 ayahs', async () => {
		for (const r of ref) {
			const verses = await loadVerses(r.number_of_surah);
			expect(verses).toEqual(
				r.verses.map((v) => ({
					n: v.number,
					ar: v.text,
					en: v.translation_en,
					id: v.translation_id
				}))
			);
		}
	});

	it('has byte-identical tafsir files', () => {
		for (const r of ref) {
			const file = resolve(`static/data/tafsir/${String(r.number_of_surah).padStart(3, '0')}.json`);
			const tafsir = JSON.parse(readFileSync(file, 'utf8')) as { text: Record<string, string> };
			expect(tafsir.text).toEqual(r.tafsir.id.kemenag.text);
		}
	});
});
