<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SeoHead from '#lib/components/SeoHead.svelte';
</script>

<SeoHead title={`${page.status}`} path={resolve('/')} noindex />

<div class="container missing">
	<h1>{page.status}</h1>
	<p><strong>{page.status === 404 ? 'Page not found :(' : 'Something went wrong.'}</strong></p>
	<p>
		{page.status === 404
			? 'The requested page could not be found.'
			: (page.error?.message ?? 'Unexpected error.')}
	</p>
	<p><a href={resolve('/')}>Back to all surahs</a></p>
</div>

<style>
	.missing {
		max-width: 38rem;
		text-align: center;
	}
	h1 {
		margin: 1.5rem 0;
		font-size: 4rem;
		letter-spacing: -1px;
	}
</style>
