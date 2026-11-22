import { asset } from '$app/paths';
import type { Tafsir } from '#lib/data/index.ts';

const cache = new Map<number, Promise<Tafsir>>();

/** Fetches (once) the Kemenag tafsir of a surah from the static data folder. */
export function loadTafsir(surahId: number): Promise<Tafsir> {
	let promise = cache.get(surahId);
	if (!promise) {
		const file = `data/tafsir/${String(surahId).padStart(3, '0')}.json`;
		promise = fetch(asset(file as Parameters<typeof asset>[0]))
			.then((response) => {
				if (!response.ok) throw new Error(`Tafsir request failed (${response.status})`);
				return response.json() as Promise<Tafsir>;
			})
			.catch((error: unknown) => {
				cache.delete(surahId); // allow retry
				throw error;
			});
		cache.set(surahId, promise);
	}
	return promise;
}

/** Splits tafsir text into paragraphs. Blank lines separate paragraphs. */
export function paragraphs(text: string): string[] {
	return text
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);
}
