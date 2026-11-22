<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import type { TranslationChoice } from '#lib/data/index.ts';
	import { bookmarks } from '#lib/stores/bookmarks.svelte.ts';
	import { ARABIC_SIZE, settings, type ThemeChoice } from '#lib/stores/settings.svelte.ts';

	const themes: { value: ThemeChoice; label: string }[] = [
		{ value: 'dark', label: 'Dark' },
		{ value: 'light', label: 'Light' },
		{ value: 'system', label: 'Match system' }
	];
	const translations: { value: TranslationChoice; label: string }[] = [
		{ value: 'id', label: 'Indonesian' },
		{ value: 'en', label: 'English' },
		{ value: 'both', label: 'Both' },
		{ value: 'none', label: 'Arabic only' }
	];
</script>

<SeoHead
	title="Settings"
	description="Choose the theme, Arabic font size and translation used when reading the Quran."
	path={resolve('/settings')}
/>

<div class="container narrow">
	<h1>Settings</h1>
	<p class="muted">Saved in this browser only.</p>

	<fieldset class="card">
		<legend>Theme</legend>
		{#each themes as option (option.value)}
			<label>
				<input
					type="radio"
					name="theme"
					value={option.value}
					checked={settings.theme === option.value}
					onchange={() => settings.setTheme(option.value)}
				/>
				{option.label}
			</label>
		{/each}
		<p class="muted hint">
			Shortcut: press <kbd>Shift</kbd> + <kbd>D</kbd> to toggle dark and light.
		</p>
	</fieldset>

	<fieldset class="card">
		<legend>Translation</legend>
		{#each translations as option (option.value)}
			<label>
				<input
					type="radio"
					name="translation"
					value={option.value}
					checked={settings.translation === option.value}
					onchange={() => settings.setTranslation(option.value)}
				/>
				{option.label}
			</label>
		{/each}
	</fieldset>

	<fieldset class="card">
		<legend>Arabic font size</legend>
		<label class="range">
			<span>Size: <output>{settings.arabicSize}px</output></span>
			<input
				type="range"
				min={ARABIC_SIZE.min}
				max={ARABIC_SIZE.max}
				step={ARABIC_SIZE.step}
				value={settings.arabicSize}
				oninput={(e) => settings.setArabicSize(Number(e.currentTarget.value))}
			/>
		</label>
		<p class="preview" lang="ar" dir="rtl" style:font-size={`${settings.arabicSize}px`}>
			ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
		</p>
	</fieldset>

	<div class="row">
		<button type="button" class="btn" onclick={() => settings.reset()}>Reset to defaults</button>
		<button
			type="button"
			class="btn"
			disabled={bookmarks.items.length === 0}
			onclick={() => {
				if (confirm('Remove all bookmarks?')) bookmarks.clear();
			}}
		>
			Clear bookmarks ({bookmarks.items.length})
		</button>
	</div>
</div>

<style>
	.narrow {
		max-width: 40rem;
	}
	fieldset {
		display: grid;
		gap: 0.4rem;
		margin: 0 0 1rem;
		padding: 0.9rem 1.1rem;
	}
	legend {
		padding-inline: 0.4rem;
		font-weight: 600;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2rem;
	}
	.range {
		flex-direction: column;
		align-items: stretch;
		gap: 0.25rem;
	}
	.hint {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
	}
	kbd {
		padding: 0.05rem 0.4rem;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		background: var(--surface-2);
		font-size: 0.85em;
	}
	.preview {
		margin: 0;
		line-height: 2;
		text-align: right;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.btn:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>
