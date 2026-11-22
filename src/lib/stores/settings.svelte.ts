import { browser } from '$app/env';
import { STORAGE_KEYS } from '#lib/config.ts';
import type { TranslationChoice } from '#lib/data/index.ts';
import { readJson, writeJson } from '#lib/storage.ts';

export type ThemeChoice = 'dark' | 'light' | 'system';

export const ARABIC_SIZE = { min: 24, max: 56, step: 2, default: 32 } as const;

interface Stored {
	theme: ThemeChoice;
	arabicSize: number;
	translation: TranslationChoice;
}

const THEMES: ThemeChoice[] = ['dark', 'light', 'system'];
const TRANSLATIONS: TranslationChoice[] = ['id', 'en', 'both', 'none'];

class Settings {
	// Defaults mirror what was prerendered; stored values are applied in load() after hydration.
	theme = $state<ThemeChoice>('dark');
	arabicSize = $state<number>(ARABIC_SIZE.default);
	translation = $state<TranslationChoice>('id');
	loaded = $state(false);

	load() {
		const stored = readJson<Partial<Stored>>(STORAGE_KEYS.settings);
		if (stored) {
			if (stored.theme && THEMES.includes(stored.theme)) this.theme = stored.theme;
			if (stored.translation && TRANSLATIONS.includes(stored.translation))
				this.translation = stored.translation;
			if (typeof stored.arabicSize === 'number') {
				this.arabicSize = Math.min(ARABIC_SIZE.max, Math.max(ARABIC_SIZE.min, stored.arabicSize));
			}
		}
		this.loaded = true;
	}

	private save() {
		writeJson(STORAGE_KEYS.settings, {
			theme: this.theme,
			arabicSize: this.arabicSize,
			translation: this.translation
		} satisfies Stored);
	}

	setTheme(theme: ThemeChoice) {
		this.theme = theme;
		this.save();
	}

	/** Shift+D in the Jekyll site: flip between dark and light. */
	toggleTheme() {
		this.setTheme(this.resolvedTheme === 'dark' ? 'light' : 'dark');
	}

	setArabicSize(size: number) {
		this.arabicSize = size;
		this.save();
	}

	setTranslation(translation: TranslationChoice) {
		this.translation = translation;
		this.save();
	}

	reset() {
		this.theme = 'dark';
		this.arabicSize = ARABIC_SIZE.default;
		this.translation = 'id';
		this.save();
	}

	get resolvedTheme(): 'dark' | 'light' {
		if (this.theme !== 'system') return this.theme;
		return browser && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}
}

export const settings = new Settings();
