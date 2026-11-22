/** Surah metadata (from quranJekyll `_data/quran-complete.json` + `_data/quran.yml`). */
export interface Surah {
	/** Surah number, 1-114 */
	id: number;
	/** Transliterated name, e.g. "Al-Fatiha" */
	name: string;
	/** Arabic name */
	ar: string;
	/** English meaning of the name */
	en: string;
	/** Indonesian meaning of the name */
	idn: string;
	ayahCount: number;
	place: 'Mecca' | 'Medina';
	/** "Makkiyah" | "Madaniyah" (as written in the source data) */
	type: 'Makkiyah' | 'Madaniyah';
	/** Full-surah recitation (Mishari Rashid al-Afasy, quranicaudio.com) */
	audio: string;
}

export interface Verse {
	/** Ayah number inside the surah, starting at 1 */
	n: number;
	/** Arabic text, exactly as in the source data */
	ar: string;
	/** English translation */
	en: string;
	/** Indonesian translation */
	id: string;
}

export interface Tafsir {
	name: string;
	source: string;
	/** Tafsir text keyed by ayah number (as a string) */
	text: Record<string, string>;
}

export type TranslationChoice = 'id' | 'en' | 'both' | 'none';
