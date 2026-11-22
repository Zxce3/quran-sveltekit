import { error } from '@sveltejs/kit';
import { getSurah, isSurahId, loadVerses, SURAH_COUNT, surahs } from '#lib/data/index.ts';
import type { EntryGenerator, PageLoad } from './$types';

// One prerendered page per surah: /surah/1/ … /surah/114/
export const entries: EntryGenerator = () => surahs.map((s) => ({ id: String(s.id) }));

export const load: PageLoad = async ({ params }) => {
	const id = Number(params.id);
	if (!/^[1-9]\d*$/.test(params.id) || !isSurahId(id)) error(404, 'Surah not found');
	return {
		surah: getSurah(id),
		verses: await loadVerses(id),
		prev: id > 1 ? getSurah(id - 1) : undefined,
		next: id < SURAH_COUNT ? getSurah(id + 1) : undefined
	};
};
