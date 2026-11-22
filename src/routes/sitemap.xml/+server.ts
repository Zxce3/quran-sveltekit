import { resolve } from '$app/paths';
import { absoluteUrl } from '#lib/config.ts';
import { surahs } from '#lib/data/index.ts';
import type { RequestHandler } from './$types';

export const prerender = true;
// Endpoint names that look like files must not get a trailing slash.
export const trailingSlash = 'ignore';

export const GET: RequestHandler = () => {
	const paths = [
		resolve('/'),
		resolve('/about'),
		...surahs.map((s) => resolve('/surah/[id]', { id: String(s.id) }))
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `\t<url><loc>${absoluteUrl(p)}</loc></url>`).join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
