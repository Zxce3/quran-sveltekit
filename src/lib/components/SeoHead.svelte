<script lang="ts">
	import { asset } from '$app/paths';
	import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from '#lib/config.ts';

	interface Props {
		/** Page title without the site name. Omit on the home page. */
		title?: string;
		description?: string;
		/** Resolved pathname (including any base path and trailing slash). */
		path: string;
		/** Keep the page out of search indexes (e.g. personal pages). */
		noindex?: boolean;
	}

	let { title, description = SITE_DESCRIPTION, path, noindex = false }: Props = $props();

	const fullTitle = $derived(title ? `${title} | ${SITE_NAME}` : SITE_NAME);
	const canonical = $derived(absoluteUrl(path));
	const image = $derived(`${SITE_URL}${asset('icons/icon-512.png')}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
