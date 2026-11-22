<script lang="ts">
	import { resolve } from '$app/paths';
	import SeoHead from '#lib/components/SeoHead.svelte';
	import { AYAH_COUNT, SURAH_COUNT } from '#lib/data/index.ts';
</script>

<SeoHead
	title="About"
	description="About Quran ku, a static Quran reader by Zxce3 (a SvelteKit rewrite of quranJekyll), with credits and data sources."
	path={resolve('/about')}
/>

<div class="container prose">
	<h1>About</h1>
	<p>
		Quran ku is a fast, static Quran reader: {SURAH_COUNT} surahs, {AYAH_COUNT.toLocaleString('en')} ayat,
		Arabic text with Indonesian and English translations, and Kemenag tafsir. Made by
		<a href="https://github.com/Zxce3" rel="noopener">Zxce3</a>. It is a SvelteKit rewrite of my
		earlier
		<a href="https://github.com/Zxce3/quranJekyll" rel="noopener">quranJekyll</a> site, which was built
		with Jekyll and the Halfmoon UI kit.
	</p>

	<h2>Features</h2>
	<ul>
		<li>
			All surahs with Arabic (RTL) text and a choice of Indonesian, English, both, or no
			translation.
		</li>
		<li>Kemenag tafsir per ayat, loaded on demand.</li>
		<li>Full-text <a href={resolve('/search')}>search</a> across Arabic and both translations.</li>
		<li>
			<a href={resolve('/bookmarks')}>Bookmarks</a> and a “last read” marker, stored only in your browser.
		</li>
		<li>
			<a href={resolve('/settings')}>Settings</a>: dark/light/system theme (Shift+D toggles), Arabic
			font size, translation.
		</li>
		<li>Old Jekyll links such as <code>/#2</code> redirect to the matching surah page.</li>
	</ul>

	<h2>Data and credits</h2>
	<ul>
		<li>
			Quran text, translations and tafsir come unchanged from the quranJekyll repository (<code>
				_data/quran-complete.json
			</code>). That repository does not state the origin of its text or a licence. The tafsir is
			credited in the data to “Aplikasi Quran Kementrian Agama Republik Indonesia” (Kemenag), and
			the Indonesian translation appears to be the Kemenag translation. The English translation
			appears to be Sahih International; this has not been verified.
		</li>
		<li>
			Arabic text is set in <a href="https://fonts.google.com/specimen/Amiri+Quran" rel="noopener">
				Amiri Quran
			</a>
			(SIL Open Font License 1.1), self-hosted via Fontsource.
		</li>
		<li>
			Recitation audio (Mishari Rashid al-Afasy) streams from
			<a href="https://quranicaudio.com" rel="noopener">quranicaudio.com</a>.
		</li>
	</ul>
</div>

<style>
	.prose {
		max-width: 46rem;
	}
	li {
		margin-bottom: 0.4rem;
	}
</style>
