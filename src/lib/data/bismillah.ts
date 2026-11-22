import type { Verse } from './types';

// Escaped so the exact code point order (shadda before fatha) matches the source data.
export const BISMILLAH =
	'\u0628\u0650\u0633\u0652\u0645\u0650\u0020\u0671\u0644\u0644\u0651\u064E\u0647\u0650\u0020\u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0670\u0646\u0650\u0020\u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650'; // bismillah

/** At-Tawbah (9) is the only surah that does not begin with the basmalah. */
export const NO_BISMILLAH_SURAH = 9;
/** Al-Fatihah (1) counts the basmalah as its own first ayah. */
export const BISMILLAH_IS_AYAH_SURAH = 1;

/** Whether the surah page should show the basmalah as a heading above the ayat. */
export function showsBismillahHeading(surahId: number): boolean {
	return surahId !== NO_BISMILLAH_SURAH && surahId !== BISMILLAH_IS_AYAH_SURAH;
}

/**
 * The source JSON stores the basmalah as a prefix of ayah 1 for every surah except 1 and 9.
 * The Jekyll site rendered the basmalah once as a heading and showed ayah 1 without it, so we do
 * the same at display time. The stored text is never modified.
 */
export function displayArabic(surahId: number, verse: Verse): string {
	if (verse.n === 1 && showsBismillahHeading(surahId) && verse.ar.startsWith(BISMILLAH)) {
		return verse.ar.slice(BISMILLAH.length).trimStart();
	}
	return verse.ar;
}
