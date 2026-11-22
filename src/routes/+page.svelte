<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ContinueReading from '#lib/components/ContinueReading.svelte';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import SurahList from '#lib/components/SurahList.svelte';
	import { isSurahId } from '#lib/data/index.ts';

	// The Jekyll site opened surahs as modals at "/#<number>". Keep those old links working.
	onMount(() => {
		const redirect = () => {
			const hash = location.hash.slice(1);
			if (/^\d+$/.test(hash) && isSurahId(Number(hash))) {
				void goto(resolve('/surah/[id]', { id: String(Number(hash)) }), { replaceState: true });
			}
		};
		redirect();
		window.addEventListener('hashchange', redirect);
		return () => window.removeEventListener('hashchange', redirect);
	});
</script>

<SeoHead path={resolve('/')} />

<div class="container">
	<h1 class="sr-only">Quran ku: all 114 surahs</h1>
	<ContinueReading />
	<SurahList />
</div>
