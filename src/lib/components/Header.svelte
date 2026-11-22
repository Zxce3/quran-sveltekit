<script lang="ts">
	import { page } from '$app/state';
	import { asset, resolve } from '$app/paths';
	import { SITE_NAME } from '#lib/config.ts';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: resolve('/'), label: 'Surahs' },
		{ href: resolve('/bookmarks'), label: 'Bookmarks' },
		{ href: resolve('/settings'), label: 'Settings' },
		{ href: resolve('/about'), label: 'About' }
	];

	const isCurrent = (href: string) => page.url.pathname === href;
</script>

<header>
	<div class="container bar">
		<a class="brand" href={resolve('/')}>
			<img class="logo" src={asset('favicon.svg')} alt="" width="32" height="32" />
			{SITE_NAME}
		</a>

		<form class="search" role="search" action={resolve('/search')} method="get">
			<label class="sr-only" for="site-search">Search the Quran</label>
			<input
				id="site-search"
				type="search"
				name="q"
				placeholder="Search ayat…"
				autocomplete="off"
				enterkeyhint="search"
			/>
		</form>

		<nav aria-label="Main">
			<ul>
				{#each links as link (link.href)}
					<li>
						<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="theme"><ThemeToggle /></div>
	</div>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1rem;
		padding-block: 0.5rem;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--text);
		text-decoration: none;
	}
	.logo {
		display: block;
		border-radius: 0.4rem;
	}
	.brand {
		order: 1;
	}
	.theme {
		order: 2;
		margin-left: auto;
	}
	.search {
		order: 3;
		flex: 1 1 100%;
		min-width: 0;
	}
	nav {
		order: 4;
	}
	@media (min-width: 52rem) {
		.theme {
			order: 5;
			margin-left: 0;
		}
		.search {
			order: 2;
			flex: 1 1 12rem;
		}
		nav {
			order: 3;
		}
	}
	.search input {
		width: 100%;
	}
	nav ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	nav a {
		display: inline-block;
		padding: 0.4rem 0.7rem;
		border-radius: var(--radius);
		color: var(--text);
		text-decoration: none;
	}
	nav a:hover {
		background: var(--surface-2);
	}
	nav a[aria-current='page'] {
		background: var(--accent-bg);
		font-weight: 600;
	}
</style>
