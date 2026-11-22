import { browser } from '$app/env';

/** localStorage helpers that never throw (private mode, blocked storage, SSR). */
export function readJson<T>(key: string): T | undefined {
	if (!browser) return undefined;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : undefined;
	} catch {
		return undefined;
	}
}

export function writeJson(key: string, value: unknown): void {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// storage unavailable or full: the app keeps working for this session
	}
}
