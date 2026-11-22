export const SITE_NAME = 'Quran ku';
export const SITE_DESCRIPTION =
	'Read all 114 surahs of the Quran in Arabic with Indonesian and English translations and Kemenag tafsir.';

/**
 * Public origin used for canonical URLs, Open Graph and the sitemap.
 * Override at build time with VITE_SITE_URL (no trailing slash).
 */
const rawSiteUrl =
	(import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://zxce3.github.io';
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const STORAGE_KEYS = {
	settings: 'quran:settings:v1',
	bookmarks: 'quran:bookmarks:v1',
	lastRead: 'quran:last-read:v1'
} as const;

/** Absolute URL for a resolved pathname, always with a trailing slash (matches `trailingSlash: 'always'`). */
export function absoluteUrl(pathname: string): string {
	return `${SITE_URL}${pathname.endsWith('/') ? pathname : `${pathname}/`}`;
}
