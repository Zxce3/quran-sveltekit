<script lang="ts">
	import { loadTafsir, paragraphs } from '#lib/tafsir.ts';

	let { surahId, ayah }: { surahId: number; ayah: number } = $props();

	let attempt = $state(0);
	const request = $derived.by(() => {
		void attempt; // re-run on retry
		return loadTafsir(surahId);
	});
</script>

{#await request}
	<p class="muted" role="status">Loading tafsir…</p>
{:then tafsir}
	{@const text = tafsir.text[String(ayah)]}
	{#if text}
		<div class="tafsir" lang="id">
			{#each paragraphs(text) as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
			<p class="muted source">{tafsir.name} · {tafsir.source}</p>
		</div>
	{:else}
		<p class="muted">No tafsir is available for this ayat.</p>
	{/if}
{:catch}
	<p role="alert">
		Could not load the tafsir.
		<button type="button" class="btn" onclick={() => attempt++}>Try again</button>
	</p>
{/await}

<style>
	.tafsir p {
		margin-bottom: 0.75rem;
		white-space: pre-line;
	}
	.source {
		font-size: 0.85rem;
	}
</style>
