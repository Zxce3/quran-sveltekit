<script lang="ts">
	import { surahs } from '#lib/data/index.ts';
	import { normalizeSearch } from '#lib/text.ts';
	import SurahCard from './SurahCard.svelte';

	let query = $state('');

	// Pre-computed once: lower-cased / diacritic-free haystack per surah.
	const haystacks = surahs.map((s) =>
		normalizeSearch(`${s.id} ${s.name} ${s.idn} ${s.en} ${s.ar} ${s.type}`)
	);

	const visible = $derived.by(() => {
		const q = normalizeSearch(query);
		if (!q) return surahs;
		return surahs.filter((_, i) => haystacks[i].includes(q));
	});
</script>

<div class="filter">
	<label for="surah-filter">Filter surahs</label>
	<input
		id="surah-filter"
		type="search"
		bind:value={query}
		placeholder="Name, meaning, or number…"
		autocomplete="off"
	/>
	<p class="muted count" role="status" aria-live="polite">
		{visible.length === surahs.length
			? `${surahs.length} surahs`
			: `${visible.length} of ${surahs.length} surahs`}
	</p>
</div>

<ul class="list">
	{#each visible as surah (surah.id)}
		<li><SurahCard {surah} /></li>
	{:else}
		<li class="muted empty">No surah matches “{query}”.</li>
	{/each}
</ul>

<style>
	.filter {
		display: grid;
		gap: 0.35rem;
		margin-bottom: 1rem;
	}
	.filter input {
		width: 100%;
	}
	.count {
		margin: 0;
		font-size: 0.9rem;
	}
	.list {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	@media (min-width: 48rem) {
		.list {
			grid-template-columns: 1fr 1fr;
		}
		.empty {
			grid-column: 1 / -1;
		}
	}
	.list li {
		content-visibility: auto;
		contain-intrinsic-size: auto 5rem;
	}
</style>
