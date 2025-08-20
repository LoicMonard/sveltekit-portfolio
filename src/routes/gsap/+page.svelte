<script lang="ts">
	import { gsap } from 'gsap';
	import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
	import { onMount } from 'svelte';

	gsap.registerPlugin(DrawSVGPlugin);

	onMount(() => {
		gsap.set('#scrollDownIcon .path1', { drawSVG: '0% 10%', y: 0 });
		gsap.set('#scrollDownIcon .path2', { drawSVG: '50% 50%', y: -0.5 });

		const seq = gsap.timeline({
			paused: true,
			defaults: { ease: 'none' }
		});

		seq
			.to('#scrollDownIcon .path1', { drawSVG: '0% 100%', y: 2, duration: 0.8 })
			.fromTo('#scrollDownIcon .path2', { opacity: 0, y: 0 }, { opacity: 1, y: 2, duration: 0.01 }) // '<' pour synchroniser avec la précédente
			.to('#scrollDownIcon .path2', { drawSVG: '0% 100%', duration: 0.5 });

		gsap.to(seq, {
			progress: 1,
			duration: seq.duration(),
			ease: 'power1.inOut',
			repeat: -1,
			yoyo: true,
			repeatDelay: 0.35,
			delay: 1
		});
	});
</script>

<main class="h-screen w-screen bg-slate-50">
	<div class="flex h-full w-full items-center justify-center">
		<div class="h-24 w-12">
			<svg id="scrollDownIcon" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M1 15V7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7V15C13 18.3137 10.3137 21 7 21C3.68629 21 1 18.3137 1 15Z"
					stroke="#54514C"
				/>
				<path class="path1" d="M7 7V12" stroke="#54514C" stroke-linecap="round" />
				<path
					class="path2"
					d="M5 10.5L6.29289 11.7929C6.68342 12.1834 7.31658 12.1834 7.70711 11.7929L9 10.5"
					stroke="#54514C"
					stroke-linecap="round"
				/>
			</svg>
			<!-- <svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="-2 -2 91 47"
				fill="none"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12.5 21.5V16.5L87 32L12.5 21.5Z" fill="#4F4B45" fill-opacity="0.5" />
				<path
					d="M87 32L31.0975 1.32782C30.7101 1.11527 30.2632 1.03699 29.8267 1.10521L15.9455 3.27414C15.0847 3.40864 14.41 4.08492 14.2775 4.94605L12.5 16.5M87 32L12.5 16.5M87 32L15.3082 41.8885C14.7901 41.96 14.2647 41.8257 13.8444 41.5144L2.59311 33.1801C1.71101 32.5267 1.52043 31.2844 2.16609 30.3966L8.29318 21.9719C8.72815 21.3738 9.45766 21.0645 10.1899 21.1678L12.5 21.4936M87 32L12.5 21.4936M12.5 16.5V21.4936"
					stroke="#54514C"
					stroke-width="2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M30.5 1L33.5 20.5M33.5 24.5L14.5 42"
					stroke="#54514C"
					stroke-width="0.5"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg> -->
		</div>
	</div>
</main>
