#!/usr/bin/env node
// Converts the quranJekyll reference data into the typed data layer used by the app.
//
//   node scripts/build-data.mjs [path/to/quranJekyll]   (default: ../quranJekyll-ref)
//
// Source of truth: _data/quran-complete.json (Quran text, Indonesian + English translation,
// Kemenag tafsir) and _data/quran.yml (surah-level audio URLs). No text is edited:
// strings are copied byte-for-byte, only the container format and key names change.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ref = resolve(process.argv[2] ?? '../quranJekyll-ref');
const BOM = String.fromCharCode(0xfeff);
const strip = (s) => (s.startsWith(BOM) ? s.slice(1) : s);
const quran = JSON.parse(strip(readFileSync(join(ref, '_data/quran-complete.json'), 'utf8')));
const audio = [
	...strip(readFileSync(join(ref, '_data/quran.yml'), 'utf8')).matchAll(/^\s*audio:\s*(\S+)\s*$/gm)
].map((m) => m[1]);

if (quran.length !== 114) throw new Error(`expected 114 surahs, got ${quran.length}`);
if (audio.length !== 114) throw new Error(`expected 114 audio urls, got ${audio.length}`);

const libData = resolve('src/lib/data');
const verseDir = join(libData, 'verses');
const tafsirDir = resolve('static/data/tafsir');
for (const d of [verseDir, tafsirDir]) {
	rmSync(d, { recursive: true, force: true });
	mkdirSync(d, { recursive: true });
}
const pad = (n) => String(n).padStart(3, '0');
const write = (file, value) => writeFileSync(file, JSON.stringify(value) + '\n');

const surahs = [];
const search = [];
let total = 0;
quran.forEach((s, i) => {
	const id = s.number_of_surah;
	if (id !== i + 1) throw new Error(`surah order mismatch at index ${i}`);
	if (s.verses.length !== s.number_of_ayah) throw new Error(`ayah count mismatch in surah ${id}`);
	s.verses.forEach((v, k) => {
		if (v.number !== k + 1) throw new Error(`verse numbering mismatch at ${id}:${k + 1}`);
	});
	total += s.verses.length;
	surahs.push({
		id,
		name: s.name,
		ar: s.name_translations.ar,
		en: s.name_translations.en,
		idn: s.name_translations.id,
		ayahCount: s.number_of_ayah,
		place: s.place,
		type: s.type,
		audio: audio[i].replace(/\d{3}\.mp3$/, `${pad(id)}.mp3`)
	});
	const verses = s.verses.map((v) => ({
		n: v.number,
		ar: v.text,
		en: v.translation_en,
		id: v.translation_id
	}));
	write(join(verseDir, `${pad(id)}.json`), verses);
	search.push(verses.map((v) => [v.ar, v.en, v.id]));
	const t = s.tafsir.id.kemenag;
	write(join(tafsirDir, `${pad(id)}.json`), { name: t.name, source: t.source, text: t.text });
});
if (total !== 6236) throw new Error(`expected 6236 ayahs, got ${total}`);

write(join(libData, 'surahs.json'), surahs);
write(resolve('static/data/search.json'), search);
console.log(`wrote ${surahs.length} surahs, ${total} ayahs`);
