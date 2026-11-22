<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Surah } from '#lib/data/index.ts';

	let { surah }: { surah: Surah } = $props();
</script>

<a class="card surah" href={resolve('/surah/[id]', { id: String(surah.id) })}>
	<span class="num" aria-hidden="true">{surah.id}</span>
	<span class="body">
		<span class="titles">
			<span class="name">{surah.name}</span>
			<span class="sep" aria-hidden="true">›</span>
			<span class="idn">{surah.idn}</span>
			<span class="sep" aria-hidden="true">›</span>
			<span class="ar" lang="ar" dir="rtl">{surah.ar}</span>
		</span>
		<span class="meta muted">Surat ke {surah.id} · {surah.type} · {surah.ayahCount} Ayat</span>
	</span>
</a>

<style>
	.surah {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		padding: 0.6rem 0.9rem 0.6rem 0.6rem;
		color: var(--text);
		text-decoration: none;
	}
	.surah:hover {
		background: var(--surface-2);
	}
	.num {
		flex: none;
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: var(--radius);
		background: var(--surface-2);
		font-size: 1.4rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.body {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.titles {
		font-weight: 500;
	}
	.sep {
		margin-inline: 0.3rem;
		color: var(--muted);
	}
	.ar {
		font-size: 1.35rem;
	}
	.meta {
		font-size: 0.85rem;
	}
</style>
