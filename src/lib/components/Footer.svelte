<script lang="ts">
	import { resolve } from '$app/paths';
	import { SITE_NAME } from '#lib/config.ts';
</script>

<footer>
	<div class="container">
		<p>
			{SITE_NAME} &middot; a SvelteKit recreation of
			<a href="https://github.com/Zxce3/quranJekyll" rel="noopener">quranJekyll</a> by Zxce3.
			<a href={resolve('/about')}>About &amp; credits</a>
		</p>
	</div>
</footer>

<style>
	footer {
		margin-top: 3rem;
		padding-block: 1.5rem;
		border-top: 1px solid var(--border);
		color: var(--muted);
		font-size: 0.9rem;
	}
	p {
		margin: 0;
	}
</style>
