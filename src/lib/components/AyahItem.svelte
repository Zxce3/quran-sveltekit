<script lang="ts">
	import { displayArabic, type Verse } from '#lib/data/index.ts';
	import { bookmarks } from '#lib/stores/bookmarks.svelte.ts';
	import { settings } from '#lib/stores/settings.svelte.ts';
	import TafsirPanel from './TafsirPanel.svelte';

	let { surahId, verse }: { surahId: number; verse: Verse } = $props();

	let tafsirOpen = $state(false);
	const bookmarked = $derived(bookmarks.has(surahId, verse.n));
	const isLastRead = $derived(
		bookmarks.lastRead?.surah === surahId && bookmarks.lastRead.ayah === verse.n
	);
	const ref = $derived(`${surahId}:${verse.n}`);
</script>

<article class="card ayah" id={`ayah-${verse.n}`} aria-label={`Ayat ${ref}`}>
	<header>
		<a class="badge" href={`#ayah-${verse.n}`} aria-label={`Link to ayat ${ref}`}>{ref}</a>
		<div class="actions">
			<button
				type="button"
				class="btn"
				aria-pressed={bookmarked}
				onclick={() => bookmarks.toggle(surahId, verse.n)}
			>
				{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
				<span class="sr-only"> ayat {ref}</span>
			</button>
			<button
				type="button"
				class="btn"
				aria-pressed={isLastRead}
				onclick={() => bookmarks.setLastRead(surahId, verse.n)}
			>
				{isLastRead ? '✓ Last read' : 'Mark as last read'}
				<span class="sr-only"> ayat {ref}</span>
			</button>
		</div>
	</header>

	<p class="arabic" lang="ar" dir="rtl">{displayArabic(surahId, verse)}</p>

	{#if settings.translation === 'id' || settings.translation === 'both'}
		<p class="translation" lang="id">{verse.id}</p>
	{/if}
	{#if settings.translation === 'en' || settings.translation === 'both'}
		<p class="translation" lang="en">{verse.en}</p>
	{/if}

	<details ontoggle={(e) => (tafsirOpen = e.currentTarget.open || tafsirOpen)}>
		<summary>Tafsir Kemenag<span class="sr-only"> for ayat {ref}</span></summary>
		{#if tafsirOpen}
			<TafsirPanel {surahId} ayah={verse.n} />
		{/if}
	</details>
</article>

<style>
	.ayah {
		padding: 0.9rem 1.1rem;
		content-visibility: auto;
		contain-intrinsic-size: auto 14rem;
	}
	.ayah:target {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}
	header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}
	.badge {
		display: inline-block;
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		background: var(--surface-2);
		color: var(--text);
		font-size: 0.9rem;
		font-variant-numeric: tabular-nums;
		text-decoration: none;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.actions .btn {
		padding: 0.25rem 0.6rem;
		font-size: 0.85rem;
	}
	.arabic {
		margin: 0.5rem 0 0.75rem;
		font-size: var(--arabic-size);
		line-height: 2.1;
		text-align: right;
	}
	.translation {
		margin-bottom: 0.5rem;
	}
	summary {
		cursor: pointer;
		color: var(--muted);
		padding-block: 0.25rem;
	}
	details[open] summary {
		margin-bottom: 0.5rem;
	}
</style>
