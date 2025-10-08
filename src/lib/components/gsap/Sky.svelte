<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BigCloud from '$lib/components/gsap/BigCloud.svelte';
	import BigCloud2 from './BigCloud2.svelte';
	import BigCloud3 from './BigCloud3.svelte';
	import BigCloud4 from './BigCloud4.svelte';
	import { SkyFactory, registerSkyFactory } from '$lib/anim/features/sky';

	let skyFactory: SkyFactory | null = null;
	let skyContainer: HTMLElement;

	export let minClouds = 4;
	export let maxClouds = 6;
	export let minSpeed = 15;
	export let maxSpeed = 40;
	export let minScale = 0.7;
	export let maxScale = 1.3;

	onMount(() => {
		skyFactory = new SkyFactory(skyContainer, [BigCloud, BigCloud2, BigCloud3, BigCloud4], {
			minClouds,
			maxClouds,
			minSpeed,
			maxSpeed,
			minScale,
			maxScale,
			minY: 20,
			maxY: 40,
			spawnInterval: 4000
		});

		skyFactory.init();
		
		registerSkyFactory(skyFactory);

		const handleVisibilityChange = () => {
			if (document.hidden) {
				skyFactory?.pause();
			} else {
				skyFactory?.resume();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	onDestroy(() => {
		skyFactory?.destroy();
	});

	export function pause() {
		skyFactory?.pause();
	}

	export function resume() {
		skyFactory?.resume();
	}

	export function updateSpeed(minSpeed: number, maxSpeed: number) {
		skyFactory?.updateConfig({ minSpeed, maxSpeed });
	}
</script>

<div
	bind:this={skyContainer}
	id="skyContainer"
	class="sky-container pointer-events-none absolute left-0 top-0 z-10 h-full w-full overflow-hidden"
></div>

<style>
	:global(.cloud) {
		pointer-events: none;
		opacity: 0.9;
		animation: float 6s ease-in-out infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
