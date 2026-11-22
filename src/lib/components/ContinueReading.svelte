<script lang="ts">
	import { resolve } from '$app/paths';
	import { getSurah } from '#lib/data/index.ts';
	import { bookmarks } from '#lib/stores/bookmarks.svelte.ts';

	const last = $derived(bookmarks.lastRead);
	const surah = $derived(last ? getSurah(last.surah) : undefined);
</script>

{#if last && surah}
	<p class="card continue">
		<span class="muted">Last read:</span>
		<a href={resolve(`/surah/[id]#ayah-${last.ayah}`, { id: String(last.surah) })}>
			{surah.name} ({surah.idn}), ayat {last.ayah}
		</a>
	</p>
{/if}

<style>
	.continue {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		margin-bottom: 1rem;
	}
</style>
