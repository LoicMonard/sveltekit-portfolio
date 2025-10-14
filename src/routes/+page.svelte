<script lang="ts">
	import { dev } from '$app/environment';
	import { buildCityFeature } from '$lib/anim/features/city';
	import { buildForestFeature } from '$lib/anim/features/forest';
	import { buildIntroGrid } from '$lib/anim/features/introGrid';
	import { buildPlaneFeature } from '$lib/anim/features/plane';
	import { buildSkyFeature } from '$lib/anim/features/sky';
	import { buildWelcomeText } from '$lib/anim/features/welcomeText';
	import { createMaster } from '$lib/anim/master';
	import { RANGES } from '$lib/anim/ranges';
	import ForestTexts from '$lib/components/gsap/ForestTexts.svelte';
	import Grid2 from '$lib/components/gsap/Grid2.svelte';
	import PaperPlane from '$lib/components/gsap/PaperPlane.svelte';
	import PaperPlane2 from '$lib/components/gsap/PaperPlane2.svelte';
	import PaperPlaneMotionPath from '$lib/components/gsap/PaperPlaneMotionPath.svelte';
	import SaintMaloCenter from '$lib/components/gsap/SaintMaloCenter.svelte';
	import SaintMaloLeft from '$lib/components/gsap/SaintMaloLeft.svelte';
	import SaintMaloRight from '$lib/components/gsap/SaintMaloRight.svelte';
	import Sky from '$lib/components/gsap/Sky.svelte';
	import ThreeWind from '$lib/components/gsap/ThreeWind.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import { onMount, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	let scrollTop: number = 0;
	let totalRangeHeight = 0;
	const isExpanded = writable<boolean>(false);
	setContext<Writable<boolean>>('isExpanded', isExpanded);

	const buildFeatures = (ctx: any) => {
		buildIntroGrid(ctx, RANGES.intro, { debug: false });
		buildPlaneFeature(ctx, RANGES.plane);
		buildWelcomeText(
			ctx,
			{ start: 0, end: 500 },
			{
				fromText: 'SCROLL⬇️',
				toText: 'WELCOME'
			}
		);
		buildCityFeature(ctx, RANGES.city, {});
		buildForestFeature(ctx, RANGES.forest);
		buildSkyFeature(ctx, RANGES.sky);
		// const waves = buildWaves(ctx, {
		// 	containerSel: '#seaContainer',
		// 	speeds: [3.5, 4, 4.5], // vitesses légèrement différentes pour l'effet parallax
		// 	verticalMove: 3, // monte de 3px
		// 	horizontalMove: 80, // avance de 80px
		// 	debug: false
		// });
	};

	const toggleHeight = () => {
		isExpanded.update((v) => !v);
	};

	setContext('isExpanded', isExpanded);

	onMount(async () => {
		totalRangeHeight = Object.values(RANGES).at(-1)!.end;

		await createMaster(RANGES, buildFeatures);

		const scroller = document.querySelector('#portfolioScroller');
		scroller?.addEventListener('scroll', () => {
			scrollTop = scroller.scrollTop;
		});
	});
</script>

<!-- Helpers -->
<!-- <div class="pointer-events-none fixed top-0 z-[100] min-h-[100dvh] w-full">
	<div id="bluebox" class="absolute left-[20px] flex flex-row text-lg italic">
		<div class="min-w-[5ch]">
			{scrollTop}
		</div>
		⚠️ Website under construction ⚠️
	</div>
</div> -->

{#if dev}
	<button
		on:click={toggleHeight}
		class="pointer-events-auto fixed right-5 top-5 z-[101] rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-lg transition-colors hover:bg-blue-600"
	>
		{$isExpanded ? '35vh' : '100vh'}
	</button>
{/if}

<div class="flex h-full w-full flex-col items-center">
	<div
		id="portfolioScroller"
		class="relative w-screen overflow-x-hidden overflow-y-scroll text-slate-700 dark:text-slate-300 bg-slate-50 transition-all duration-500 dark:bg-surface-dark"
		style="height: {$isExpanded ? '100vh' : '70vh'}"
	>
		<div class="sticky left-0 top-0 h-full w-full">
			<div id="gridScene" class="flex h-full w-full items-center justify-center">
				<div
					class="flex h-full w-full flex-col items-center justify-center gap-4 overflow-x-hidden"
				>
					<div
						id="gridContainer"
						class="pointer-events-none absolute top-0 h-full w-full overflow-hidden text-slate-300 dark:text-border-dark"
					>
						<Grid2 />
					</div>

					<Sky />

					<div
						id="planeSceneContainer"
						class="pointer-events-none absolute top-0 z-50 min-h-full w-screen"
					>
						<div
							id="paperPlaneMotionPathContainer"
							class="invisible absolute bottom-1/2 left-[-5vw] w-[55vw]"
						>
							<PaperPlaneMotionPath />
						</div>
						<div
							id="planeContainer"
							class="relative z-50 w-16 -translate-x-full overflow-visible md:w-24 lg:w-36"
						>
							<div
								id="planeFloat"
								class="relative inline-block h-full w-full origin-center will-change-transform"
							>
								<PaperPlane2 />
								<div
									id="threeWind"
									class="invisible absolute right-full top-0 aspect-[146/25] h-[57%]"
								>
									<ThreeWind />
								</div>
							</div>
						</div>
					</div>

					<div
						id="welcomeFlaps"
						class="z-50 flex min-h-full w-full max-w-[1024px] items-center justify-center gap-1 px-2 text-3xl sm:gap-2 lg:text-7xl"
					></div>

					<div
						id="cityContainer"
						class="absolute bottom-[5%] left-0 z-40 flex aspect-[2779/194] h-[40vh] origin-bottom-left scale-75 transform-gpu flex-row items-end text-text-light will-change-transform dark:text-text-dark"
					>
						<div id="saintMaloLeft" class="aspect-[890/89] basis-[32.44%]">
							<SaintMaloLeft />
						</div>
						<div
							id="saintMaloCenter"
							class="aspect-[800 792] flex h-[80vh] w-full basis-[1.46%] items-end"
						>
							<SaintMaloCenter />
						</div>
						<div id="saintMaloRight" class="aspect-[1814/193] basis-[66.10%]">
							<SaintMaloRight />
						</div>
						<!-- <div id="seaContainer" class="flex items-end justify-end fixed bottom-[-40%] w-full h-auto translate-x-[-160px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 -10 2904 51"
							>
								<path
									fill="#F5F5F5"
									stroke="#868686"
									d="M70 7C50-4.547 36.667 2 30 7v20h2874V7c-7.81 5-23.69 11.547-47.12 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.875 0-23.437-11.547-39.063-5-46.875 0-7.812 5-23.438 11.547-46.875 0S865.312 2 857.5 7c-7.812 5-23.438 11.547-46.875 0s-39.063-5-46.875 0c-7.812 5-23.438 11.547-46.875 0S677.812 2 670 7c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0Z"
								/>
								<path
									stroke="#868686"
									fill="#fff"
									d="M55 9C35-2.547 21.667 4 15 9v20h2874V9c-7.81 5-23.69 11.547-47.12 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.875 0-23.437-11.547-39.063-5-46.875 0-7.812 5-23.438 11.547-46.875 0S850.312 4 842.5 9c-7.812 5-23.438 11.547-46.875 0s-39.063-5-46.875 0c-7.812 5-23.438 11.547-46.875 0S662.812 4 655 9c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0Z"
								/>
								<path
									stroke="#868686"
									fill="#fff"
									d="M40 11C20-.547 6.667 6 0 11v20h2874V11c-7.81 5-23.69 11.547-47.12 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-6.67 5-20 11.547-40 0s-33.33-5-40 0c-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.44 11.547-46.88 0-23.43-11.547-39.06-5-46.87 0-7.81 5-23.44 11.547-46.87 0-23.44-11.547-39.07-5-46.88 0-7.81 5-23.438 11.547-46.875 0s-39.063-5-46.875 0c-7.812 5-23.438 11.547-46.875 0s-39.063-5-46.875 0c-7.812 5-23.438 11.547-46.875 0s-39.063-5-46.875 0c-7.812 5-23.438 11.547-46.875 0S647.812 6 640 11c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0s-33.333-5-40 0c-6.667 5-20 11.547-40 0Z"
								/>
							</svg>
						</div> -->
					</div>

					<div class="pointer-events-none absolute left-0 top-0 h-full w-full">
						<ForestTexts />
					</div>
				</div>

				<div id="hiddenElements" class="hidden">
					<PaperPlane />
				</div>
			</div>
		</div>

		<div id="petalsContainer" class="pointer-events-none fixed top-0 h-full w-full">
			<div id="petalsWrapper" class="h-full w-full"></div>
		</div>

		<div id="scrollContent" class="pointer-events-none" style="height: {totalRangeHeight}px"></div>
	</div>

	<!-- {#if dev} -->
		<Projects />
	<!-- {/if} -->
</div>
