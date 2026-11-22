<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AudioPlayer from '#lib/components/AudioPlayer.svelte';
	import AyahItem from '#lib/components/AyahItem.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { BISMILLAH, showsBismillahHeading } from '#lib/data/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const surah = $derived(data.surah);
	const path = $derived(resolve('/surah/[id]', { id: String(surah.id) }));
	const description = $derived(
		`Read Surah ${surah.name} (${surah.idn}, ${surah.ar}): ${surah.type}, ${surah.ayahCount} ayat. Arabic text with Indonesian and English translation and Kemenag tafsir.`
	);

	let jump = $state('');
	function jumpToAyah(event: SubmitEvent) {
		event.preventDefault();
		const n = Number(jump);
		if (Number.isInteger(n) && n >= 1 && n <= surah.ayahCount) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			void goto(`${path}#ayah-${n}`);
		}
	}
</script>

<SeoHead title={`${surah.name} (${surah.idn})`} {description} {path} />

<div class="container">
	<nav class="pager" aria-label="Surah navigation">
		{#if data.prev}
			<a class="btn" rel="prev" href={resolve('/surah/[id]', { id: String(data.prev.id) })}>
				← {data.prev.name}
			</a>
		{:else}
			<span></span>
		{/if}
		<a class="btn" href={resolve('/')}>All surahs</a>
		{#if data.next}
			<a class="btn" rel="next" href={resolve('/surah/[id]', { id: String(data.next.id) })}>
				{data.next.name} →
			</a>
		{:else}
			<span></span>
		{/if}
	</nav>

	<header class="head">
		<p class="muted type">{surah.type} › {surah.place}</p>
		<h1>
			{surah.name}
			<span lang="ar" dir="rtl" class="ar">{surah.ar}</span>
		</h1>
		<p class="meta">
			Surat ke {surah.id} › <span class="muted">{surah.ayahCount} Ayat</span> › {surah.idn}
			<span class="muted">({surah.en})</span>
		</p>

		<form class="jump" onsubmit={jumpToAyah}>
			<label for="jump">Go to ayat</label>
			<input
				id="jump"
				type="text"
				inputmode="numeric"
				pattern="[0-9]*"
				bind:value={jump}
				placeholder={`1–${surah.ayahCount}`}
				size="6"
			/>
			<button class="btn" type="submit">Go</button>
		</form>
	</header>

	<AudioPlayer src={surah.audio} title={`Surah ${surah.name}`} />

	{#if showsBismillahHeading(surah.id)}
		<p class="bismillah" lang="ar" dir="rtl">{BISMILLAH}</p>
	{/if}

	<div class="ayat">
		{#each data.verses as verse (verse.n)}
			<AyahItem surahId={surah.id} {verse} />
		{/each}
	</div>

	<nav class="pager bottom" aria-label="Surah navigation (bottom)">
		{#if data.prev}
			<a class="btn" rel="prev" href={resolve('/surah/[id]', { id: String(data.prev.id) })}>
				← {data.prev.name}
			</a>
		{:else}
			<span></span>
		{/if}
		{#if data.next}
			<a class="btn" rel="next" href={resolve('/surah/[id]', { id: String(data.next.id) })}>
				{data.next.name} →
			</a>
		{/if}
	</nav>
</div>

<style>
	.pager {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.pager.bottom {
		margin-top: 1.5rem;
	}
	.head {
		margin-bottom: 1rem;
	}
	.type {
		margin: 0;
		font-size: 1.1rem;
	}
	.ar {
		font-size: 1.2em;
	}
	.meta {
		font-size: 1.1rem;
	}
	.jump {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}
	.bismillah {
		text-align: center;
		font-size: calc(var(--arabic-size) * 1.1);
		line-height: 2;
		margin: 1rem 0;
	}
	.ayat {
		display: grid;
		gap: 0.75rem;
	}
</style>
