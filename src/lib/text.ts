// Character classes are written as escapes on purpose: they are invisible or combining marks.
const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭ࣓-ࣿـ]/g;
const ALEF_VARIANTS = /[ٱآأإ]/g; // alef wasla, madda, hamza above / below
const ALEF = /ا/g;
const ALEF_MAKSURA = /ى/g;
const TA_MARBUTA = /ة/g;
const LATIN_MARKS = /[̀-ͯ]/g;

/**
 * Normalises text for searching: lower-case, strips Arabic diacritics / Quranic marks / tatweel,
 * folds common Arabic letter variants and drops alef, so a plain-letter query matches fully
 * vowelled Quranic orthography.
 *
 * Alef is dropped entirely: Quranic orthography writes long vowels as a dagger alef or omits the
 * letter, while people type the plain letter. Both sides are reduced the same way.
 */
export function normalizeSearch(input: string): string {
	return input
		.normalize('NFKD')
		.replace(ARABIC_MARKS, '')
		.replace(ALEF_VARIANTS, 'ا')
		.replace(ALEF_MAKSURA, 'ي')
		.replace(TA_MARBUTA, 'ه')
		.replace(ALEF, '')
		.replace(LATIN_MARKS, '')
		.toLowerCase()
		.replace(/\s+/g, ' ')
		.trim();
}
