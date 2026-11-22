import { STORAGE_KEYS } from '#lib/config.ts';
import { readJson, writeJson } from '#lib/storage.ts';

export interface Position {
	surah: number;
	ayah: number;
}

export interface Bookmark extends Position {
	/** Epoch milliseconds when the bookmark was added */
	at: number;
}

const valid = (p: unknown): p is Position =>
	typeof p === 'object' &&
	p !== null &&
	Number.isInteger((p as Position).surah) &&
	Number.isInteger((p as Position).ayah) &&
	(p as Position).surah >= 1 &&
	(p as Position).surah <= 114 &&
	(p as Position).ayah >= 1;

class Bookmarks {
	items = $state<Bookmark[]>([]);
	lastRead = $state<Position | undefined>(undefined);
	loaded = $state(false);

	load() {
		const items = readJson<Bookmark[]>(STORAGE_KEYS.bookmarks);
		if (Array.isArray(items)) this.items = items.filter(valid);
		const last = readJson<Position>(STORAGE_KEYS.lastRead);
		if (valid(last)) this.lastRead = { surah: last.surah, ayah: last.ayah };
		this.loaded = true;
	}

	has(surah: number, ayah: number): boolean {
		return this.items.some((b) => b.surah === surah && b.ayah === ayah);
	}

	toggle(surah: number, ayah: number): boolean {
		const exists = this.has(surah, ayah);
		this.items = exists
			? this.items.filter((b) => !(b.surah === surah && b.ayah === ayah))
			: [...this.items, { surah, ayah, at: Date.now() }];
		writeJson(STORAGE_KEYS.bookmarks, this.items);
		return !exists;
	}

	clear() {
		this.items = [];
		writeJson(STORAGE_KEYS.bookmarks, this.items);
	}

	setLastRead(surah: number, ayah: number) {
		this.lastRead = { surah, ayah };
		writeJson(STORAGE_KEYS.lastRead, this.lastRead);
	}

	/** Newest first, then surah/ayah order for stable display. */
	get sorted(): Bookmark[] {
		return [...this.items].sort((a, b) => b.at - a.at || a.surah - b.surah || a.ayah - b.ayah);
	}
}

export const bookmarks = new Bookmarks();
