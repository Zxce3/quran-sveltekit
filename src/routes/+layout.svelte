<script lang="ts">
	import '@fontsource/amiri-quran/arabic-400.css';
	import '../app.css';
	import { onMount } from 'svelte';
	import { asset } from '$app/paths';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import { bookmarks } from '#lib/stores/bookmarks.svelte.ts';
	import { settings } from '#lib/stores/settings.svelte.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Persisted state is read after hydration so the first client render matches the prerendered HTML.
	onMount(() => {
		settings.load();
		bookmarks.load();
	});

	// Keep <html> in sync with the settings (theme + Arabic font size).
	$effect(() => {
		document.documentElement.setAttribute('data-theme', settings.resolvedTheme);
	});
	$effect(() => {
		document.documentElement.style.setProperty('--arabic-size', `${settings.arabicSize}px`);
	});

	// Follow the OS theme while "system" is selected.
	$effect(() => {
		if (settings.theme !== 'system') return;
		const query = matchMedia('(prefers-color-scheme: light)');
		const onChange = () =>
			document.documentElement.setAttribute('data-theme', query.matches ? 'light' : 'dark');
		query.addEventListener('change', onChange);
		return () => query.removeEventListener('change', onChange);
	});

	// Shift+D toggles dark/light, as in the Jekyll site (Halfmoon shortcut).
	function onKeydown(event: KeyboardEvent) {
		if (event.ctrlKey || event.metaKey || event.altKey || !event.shiftKey) return;
		if (event.key.toLowerCase() !== 'd') return;
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
		event.preventDefault();
		settings.toggleTheme();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<link rel="icon" href={asset('favicon.svg')} type="image/svg+xml" />
	<link rel="apple-touch-icon" href={asset('icons/apple-touch-icon.png')} />
	<link rel="manifest" href={asset('manifest.webmanifest')} />
	<meta name="theme-color" content="#191c20" />
</svelte:head>

<a class="skip" href="#main">Skip to content</a>
<Header />
<main id="main" tabindex="-1">
	{@render children()}
</main>
<Footer />

<style>
	.skip {
		position: absolute;
		left: 0.5rem;
		top: -4rem;
		z-index: 20;
		padding: 0.5rem 1rem;
		background: var(--primary);
		color: var(--primary-contrast);
		border-radius: var(--radius);
	}
	.skip:focus {
		top: 0.5rem;
	}
	main {
		padding-block: 1.5rem;
		min-height: 60vh;
	}
	main:focus {
		outline: none;
	}
</style>
