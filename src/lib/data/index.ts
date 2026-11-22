import surahData from './surahs.json';
import type { Surah, Verse } from './types';

export type { Surah, Verse, Tafsir, TranslationChoice } from './types';
export { BISMILLAH, displayArabic, displayArabicText, showsBismillahHeading } from './bismillah';

export const SURAH_COUNT = 114;
export const AYAH_COUNT = 6236;

export const surahs: readonly Surah[] = surahData as Surah[];

export function isSurahId(value: unknown): value is number {
	return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= SURAH_COUNT;
}

export function getSurah(id: number): Surah {
	const surah = surahs[id - 1];
	if (!surah) throw new RangeError(`Unknown surah ${id}`);
	return surah;
}

const verseFiles = import.meta.glob<Verse[]>('./verses/*.json', {
	import: 'default'
});

/** Loads the ayat of one surah (code-split: one small chunk per surah). */
export async function loadVerses(id: number): Promise<Verse[]> {
	const loader = verseFiles[`./verses/${String(id).padStart(3, '0')}.json`];
	if (!loader) throw new RangeError(`Unknown surah ${id}`);
	return loader();
}
