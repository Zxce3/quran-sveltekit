<script lang="ts">
	import { settings } from '#lib/stores/settings.svelte.ts';

	const next = $derived(settings.resolvedTheme === 'dark' ? 'light' : 'dark');
</script>

<button
	type="button"
	class="toggle"
	onclick={() => settings.toggleTheme()}
	aria-label={`Switch to ${next} theme (Shift+D)`}
	title={`Switch to ${next} theme (Shift+D)`}
>
	<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
		{#if settings.resolvedTheme === 'dark'}
			<!-- sun: shown in dark mode, switches to light -->
			<circle cx="12" cy="12" r="4.5" fill="currentColor" />
			<path
				d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
		{:else}
			<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" fill="currentColor" />
		{/if}
	</svg>
</button>

<style>
	.toggle {
		display: inline-grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--surface);
		color: var(--text);
		cursor: pointer;
	}
	.toggle:hover {
		background: var(--surface-2);
	}
</style>
