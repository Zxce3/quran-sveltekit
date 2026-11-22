<script lang="ts">
	import { onMount } from 'svelte';
	import { asset, resolve } from '$app/paths';
	import { replaceState } from '$app/navigation';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { displayArabicText, getSurah, surahs } from '#lib/data/index.ts';
	import { normalizeSearch } from '#lib/text.ts';

	type Raw = [ar: string, en: string, id: string][][];
	interface Entry {
		surah: number;
		ayah: number;
		ar: string;
		en: string;
		id: string;
		haystack: string;
	}

	const MAX_RESULTS = 100;
	const MIN_LENGTH = 2;

	let query = $state('');
	let status = $state<'idle' | 'loading' | 'ready' | 'error'>('idle');
	let entries: Entry[] = [];

	const needle = $derived(normalizeSearch(query));

	const surahMatches = $derived(
		needle.length >= 1
			? surahs.filter((s) =>
					normalizeSearch(`${s.name} ${s.idn} ${s.en} ${s.ar} ${s.id}`).includes(needle)
				)
			: []
	);

	const verseMatches = $derived.by(() => {
		if (status !== 'ready' || needle.length < MIN_LENGTH) return [];
		return entries.filter((e) => e.haystack.includes(needle));
	});

	async function loadIndex() {
		if (status === 'loading' || status === 'ready') return;
		status = 'loading';
		try {
			const response = await fetch(asset('data/search.json'));
			if (!response.ok) throw new Error(String(response.status));
			const raw = (await response.json()) as Raw;
			entries = raw.flatMap((verses, i) =>
				verses.map(([ar, en, id], k) => ({
					surah: i + 1,
					ayah: k + 1,
					ar,
					en,
					id,
					haystack: normalizeSearch(`${ar} ${en} ${id}`)
				}))
			);
			status = 'ready';
		} catch {
			status = 'error';
		}
	}

	onMount(() => {
		query = new URLSearchParams(location.search).get('q') ?? '';
		void loadIndex();
	});

	function syncUrl() {
		const url = resolve('/search') + (query ? `?q=${encodeURIComponent(query)}` : '');
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void replaceState(url, {});
	}
</script>

<SeoHead
	title="Search"
	description="Search the Quran in Arabic, Indonesian and English."
	path={resolve('/search')}
	noindex
/>

<div class="container narrow">
	<h1>Search</h1>

	<form role="search" onsubmit={(e) => e.preventDefault()}>
		<label for="q">Search surah names and ayat (Arabic, Indonesian or English)</label>
		<input
			id="q"
			type="search"
			bind:value={query}
			oninput={syncUrl}
			placeholder="e.g. sabar, patience, الرحمن"
			autocomplete="off"
		/>
	</form>

	<p class="muted status" role="status" aria-live="polite">
		{#if status === 'loading'}
			Loading search index…
		{:else if status === 'error'}
			Could not load the search index. Check your connection and reload.
		{:else if needle.length === 0}
			Type to search.
		{:else if needle.length < MIN_LENGTH}
			Keep typing: at least {MIN_LENGTH} characters.
		{:else}
			{verseMatches.length} ayat found{verseMatches.length > MAX_RESULTS
				? `, showing the first ${MAX_RESULTS}`
				: ''}.
		{/if}
	</p>

	{#if surahMatches.length > 0 && surahMatches.length < surahs.length}
		<h2>Surahs</h2>
		<ul class="plain">
			{#each surahMatches.slice(0, 10) as s (s.id)}
				<li>
					<a href={resolve('/surah/[id]', { id: String(s.id) })}>
						{s.id}. {s.name} · {s.idn} ·
						<span lang="ar" dir="rtl">{s.ar}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	{#if verseMatches.length > 0}
		<h2>Ayat</h2>
		<ol class="results">
			{#each verseMatches.slice(0, MAX_RESULTS) as hit (`${hit.surah}:${hit.ayah}`)}
				<li class="card hit">
					<a class="ref" href={resolve(`/surah/[id]#ayah-${hit.ayah}`, { id: String(hit.surah) })}>
						{getSurah(hit.surah).name}
						{hit.surah}:{hit.ayah}
					</a>
					<p class="arabic" lang="ar" dir="rtl">{displayArabicText(hit.surah, hit.ayah, hit.ar)}</p>
					<p lang="id">{hit.id}</p>
					<p lang="en">{hit.en}</p>
				</li>
			{/each}
		</ol>
	{/if}
</div>

<style>
	.narrow {
		max-width: 46rem;
	}
	form {
		display: grid;
		gap: 0.35rem;
	}
	form input {
		width: 100%;
	}
	.status {
		margin: 0.5rem 0 1rem;
	}
	.plain {
		margin: 0 0 1rem;
		padding-left: 1.2rem;
	}
	.results {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.hit {
		padding: 0.8rem 1rem;
	}
	.hit p {
		margin: 0.35rem 0 0;
	}
	.arabic {
		font-size: calc(var(--arabic-size) * 0.85);
		line-height: 2;
		text-align: right;
	}
</style>
