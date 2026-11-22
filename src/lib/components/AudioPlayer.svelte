<script lang="ts">
	let { src, title }: { src: string; title: string } = $props();
</script>

<figure>
	<figcaption class="muted">
		Recitation: Mishari Rashid al-Afasy (streamed from quranicaudio.com)
	</figcaption>
	<audio controls preload="none" {src} aria-label={`Recitation of ${title}`}>
		Your browser does not support audio playback.
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
		<a href={src}>Download the recitation</a>.
	</audio>
</figure>

<style>
	figure {
		margin: 0 0 1.5rem;
	}
	figcaption {
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
	}
	audio {
		width: 100%;
	}
</style>
