<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { displayArabic, getSurah, loadVerses } from '#lib/data/index.ts';
	import { bookmarks } from '#lib/stores/bookmarks.svelte.ts';
	import { settings } from '#lib/stores/settings.svelte.ts';
</script>

<SeoHead
	title="Bookmarks"
	description="Your saved ayat. Bookmarks are stored in this browser only."
	path={resolve('/bookmarks')}
	noindex
/>

<div class="container narrow">
	<h1>Bookmarks</h1>

	{#if bookmarks.lastRead}
		{@const last = bookmarks.lastRead}
		<p class="card last">
			<span class="muted">Last read:</span>
			<a href={resolve(`/surah/[id]#ayah-${last.ayah}`, { id: String(last.surah) })}>
				{getSurah(last.surah).name}, ayat {last.ayah}
			</a>
		</p>
	{/if}

	{#if !bookmarks.loaded}
		<p class="muted" role="status">Loading…</p>
	{:else if bookmarks.items.length === 0}
		<p class="muted">
			No bookmarks yet. Open a <a href={resolve('/')}>surah</a> and press “Bookmark” on an ayat.
		</p>
	{:else}
		<ul class="list">
			{#each bookmarks.sorted as bookmark (`${bookmark.surah}:${bookmark.ayah}`)}
				{@const surah = getSurah(bookmark.surah)}
				<li class="card item">
					<div class="top">
						<a href={resolve(`/surah/[id]#ayah-${bookmark.ayah}`, { id: String(bookmark.surah) })}>
							{surah.name} ({surah.idn}) {bookmark.surah}:{bookmark.ayah}
						</a>
						<button
							type="button"
							class="btn"
							onclick={() => bookmarks.toggle(bookmark.surah, bookmark.ayah)}
						>
							Remove<span class="sr-only"> bookmark {bookmark.surah}:{bookmark.ayah}</span>
						</button>
					</div>
					{#await loadVerses(bookmark.surah) then verses}
						{@const verse = verses[bookmark.ayah - 1]}
						{#if verse}
							<p class="arabic" lang="ar" dir="rtl">{displayArabic(bookmark.surah, verse)}</p>
							{#if settings.translation !== 'none'}
								<p class="tr">
									{settings.translation === 'en' ? verse.en : verse.id}
								</p>
							{/if}
						{/if}
					{/await}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.narrow {
		max-width: 46rem;
	}
	.last {
		padding: 0.6rem 1rem;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.list {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.item {
		padding: 0.8rem 1rem;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.arabic {
		font-size: calc(var(--arabic-size) * 0.85);
		line-height: 2;
		text-align: right;
		margin: 0.5rem 0;
	}
	.tr {
		margin: 0;
	}
</style>
