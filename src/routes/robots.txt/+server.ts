import { resolve } from '$app/paths';
import { SITE_URL } from '#lib/config.ts';
import type { RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'ignore';

export const GET: RequestHandler = () => {
	const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}${resolve('/')}sitemap.xml
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
