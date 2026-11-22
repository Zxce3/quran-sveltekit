import { describe, expect, it } from 'vitest';
import samples from './reference-samples.fixture.json';
import {
	AYAH_COUNT,
	BISMILLAH,
	SURAH_COUNT,
	displayArabic,
	getSurah,
	isSurahId,
	loadVerses,
	showsBismillahHeading,
	surahs
} from './index';

describe('surah metadata', () => {
	it('has 114 surahs numbered 1..114 in order', () => {
		expect(surahs).toHaveLength(SURAH_COUNT);
		surahs.forEach((s, i) => expect(s.id).toBe(i + 1));
	});

	it('sums to 6236 ayahs', () => {
		expect(surahs.reduce((sum, s) => sum + s.ayahCount, 0)).toBe(AYAH_COUNT);
	});

	it('has 86 Makkiyah and 28 Madaniyah surahs', () => {
		expect(surahs.filter((s) => s.type === 'Makkiyah')).toHaveLength(86);
		expect(surahs.filter((s) => s.type === 'Madaniyah')).toHaveLength(28);
	});

	it('spot-checks known surahs', () => {
		expect(getSurah(1)).toMatchObject({
			name: 'Al-Fatiha',
			ar: 'الفاتحة',
			idn: 'Pembukaan',
			ayahCount: 7
		});
		expect(getSurah(2).ayahCount).toBe(286);
		expect(getSurah(108).ayahCount).toBe(3);
		expect(getSurah(114).ar).toBe('الناس');
	});

	it('has a well-formed audio URL for every surah', () => {
		for (const s of surahs) {
			expect(s.audio).toBe(
				`https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${String(s.id).padStart(3, '0')}.mp3`
			);
		}
	});

	it('validates ids', () => {
		expect(isSurahId(1)).toBe(true);
		expect(isSurahId(114)).toBe(true);
		expect(isSurahId(0)).toBe(false);
		expect(isSurahId(115)).toBe(false);
		expect(isSurahId(1.5)).toBe(false);
		expect(() => getSurah(115)).toThrow(RangeError);
	});
});

describe('verse data', () => {
	it('has 6236 ayahs in total with contiguous numbering and non-empty text', async () => {
		let total = 0;
		for (const s of surahs) {
			const verses = await loadVerses(s.id);
			expect(verses, `surah ${s.id}`).toHaveLength(s.ayahCount);
			verses.forEach((v, i) => {
				expect(v.n).toBe(i + 1);
				expect(v.ar.length).toBeGreaterThan(0);
				expect(v.en.length).toBeGreaterThan(0);
				expect(v.id.length).toBeGreaterThan(0);
			});
			total += verses.length;
		}
		expect(total).toBe(AYAH_COUNT);
	});

	it('matches spot-check samples taken from the reference data', async () => {
		for (const sample of samples) {
			const verse = (await loadVerses(sample.s))[sample.a - 1];
			expect(verse, `${sample.s}:${sample.a}`).toEqual({
				n: sample.a,
				ar: sample.ar,
				en: sample.en,
				id: sample.id
			});
		}
	});

	it('rejects unknown surahs', async () => {
		await expect(loadVerses(0)).rejects.toThrow(RangeError);
		await expect(loadVerses(115)).rejects.toThrow(RangeError);
	});
});

describe('basmalah handling', () => {
	it('shows the basmalah heading for every surah except 1 and 9', () => {
		expect(showsBismillahHeading(1)).toBe(false);
		expect(showsBismillahHeading(9)).toBe(false);
		expect(showsBismillahHeading(2)).toBe(true);
		expect(showsBismillahHeading(114)).toBe(true);
	});

	it('keeps ayah 1 of Al-Fatihah intact', async () => {
		const [first] = await loadVerses(1);
		expect(displayArabic(1, first)).toBe(BISMILLAH);
	});

	it('strips the stored basmalah prefix only from ayah 1 for display', async () => {
		const [first, second] = await loadVerses(2);
		expect(first.ar.startsWith(BISMILLAH)).toBe(true);
		expect(displayArabic(2, first)).toBe('الٓمٓ');
		expect(displayArabic(2, second)).toBe(second.ar);
	});

	it('leaves At-Tawbah untouched', async () => {
		const [first] = await loadVerses(9);
		expect(displayArabic(9, first)).toBe(first.ar);
	});
});
