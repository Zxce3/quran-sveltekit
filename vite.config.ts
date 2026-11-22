import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';

// When deployed to a project page (e.g. https://user.github.io/quran-sveltekit)
// set BASE_PATH=/quran-sveltekit at build time. Locally it stays empty.
const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// 404.html is the client-side fallback GitHub Pages serves for unknown URLs.
			adapter: adapter({ pages: 'build', assets: 'build', fallback: '404.html' }),
			// Root-relative URLs (not relative ones) so canonical/OG/sitemap URLs can be made absolute.
			paths: { base, relative: false },
			prerender: { handleHttpError: 'fail', handleMissingId: 'fail' }
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
