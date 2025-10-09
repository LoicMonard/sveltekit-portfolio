<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { createMaster } from '$lib/anim/master';
	import { RANGES } from '$lib/anim/ranges';
	import { buildIntroGrid } from '$lib/anim/features/introGrid';
	import Grid2 from '$lib/components/gsap/Grid2.svelte';
	import { buildPlaneFeature } from '$lib/anim/features/plane';
	import PaperPlaneMotionPath from '$lib/components/gsap/PaperPlaneMotionPath.svelte';
	import PaperPlane2 from '$lib/components/gsap/PaperPlane2.svelte';
	import PaperPlane from '$lib/components/gsap/PaperPlane.svelte';
	import { buildWelcomeText } from '$lib/anim/features/welcomeText';
	import SaintMaloLeft from '$lib/components/gsap/SaintMaloLeft.svelte';
	import SaintMaloRight from '$lib/components/gsap/SaintMaloRight.svelte';
	import SaintMaloCenter from '$lib/components/gsap/SaintMaloCenter.svelte';
	import { buildCityFeature } from '$lib/anim/features/city';
	import ThreeWind from '$lib/components/gsap/ThreeWind.svelte';
	import { buildForestFeature } from '$lib/anim/features/forest';
	import { buildSkyFeature } from '$lib/anim/features/sky';
	import Sky from '$lib/components/gsap/Sky.svelte';
	import { writable, type Writable } from 'svelte/store';


	let scrollTop: number = 0;
	let totalRangeHeight = 0;
  const isExpanded = writable<boolean>(true);
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
	};

	const toggleHeight = () => {
    isExpanded.update(v => !v);
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
<div class="pointer-events-none fixed top-0 z-[100] min-h-[100svh] w-full">
	<div id="bluebox" class="absolute left-[20px] flex flex-row text-lg italic">
		<div class="min-w-[5ch]">
			{scrollTop}
		</div>
		⚠️ Website under construction ⚠️
	</div>
</div>

<button
	on:click={toggleHeight}
	class="pointer-events-auto fixed right-5 top-5 z-[101] rounded-lg bg-blue-500 px-4 py-2 text-white font-semibold shadow-lg hover:bg-blue-600 transition-colors"
>
	{$isExpanded ? '50vh' : '100vh'}
</button>

<div class="flex h-full w-full flex-col">

<div
	id="portfolioScroller"
	class="relative w-screen overflow-x-hidden overflow-y-scroll border bg-slate-50 transition-all duration-500"
	style="height: {$isExpanded ? '100vh' : '50vh'}"
>
	<div class="sticky left-0 top-0 h-full w-full">
		<div id="gridScene" class="flex h-full w-full items-center justify-center">
			<div class="flex h-full w-full flex-col items-center justify-center gap-4 overflow-x-hidden">
				<div id="gridContainer" class="pointer-events-none absolute top-0 h-full overflow-hidden w-full">
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
					class="z-40 flex min-h-full w-full max-w-[1024px] items-center justify-center gap-1 px-2 text-3xl sm:gap-2 lg:text-7xl"
				></div>
				<div
					id="cityContainer"
					class="absolute bottom-[5%] left-0 z-40 flex aspect-[2779/194] h-[40vh] origin-bottom-left scale-75 transform-gpu flex-row items-end will-change-transform"
				>
					<div id="saintMaloLeft" class="aspect-[890/89] basis-[32.44%]">
						<SaintMaloLeft />
					</div>
					<div id="saintMaloCenter" class="aspect-[800 792] flex w-full basis-[1.46%] items-end">
						<SaintMaloCenter />
					</div>
					<div id="saintMaloRight" class="aspect-[1814/193] basis-[66.10%]">
						<SaintMaloRight />
					</div>
				</div>
			</div>

			<div id="hiddenElements" class="hidden">
				<PaperPlane />
			</div>
		</div>
	</div>

	<div id="scrollContent" class="pointer-events-none" style="height: {totalRangeHeight}px"></div>
</div>

<div class="h-screen z-50 bg-slate-50">hey</div>
</div>