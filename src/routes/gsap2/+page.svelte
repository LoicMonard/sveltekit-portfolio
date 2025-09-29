<script lang="ts">
	import { onMount } from 'svelte';
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

	let scrollTop: number = 0;

	const buildFeatures = (ctx: any) => {
		// buildScrollDown(ctx, RANGES.intro, { fadeUnits: 100 });
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
		buildCityFeature(ctx, { start: 1800, end: 2100 }, {});
	};

	onMount(async () => {
		await createMaster(RANGES, buildFeatures);

		window.addEventListener('scroll', () => {
			scrollTop = window.scrollY;
		});
	});
</script>

<!-- Helpers -->
<div class="pointer-events-none fixed top-0 min-h-[100svh] w-full bg-slate-50">
	<div id="bluebox" class="border-radius absolute left-[20px] h-12 w-12 text-lg font-bold">
		{scrollTop}
	</div>
</div>

<div id="gridScene" class="flex h-[100svh] w-screen items-center justify-center">
	<div
		class="flex min-h-[100svh] w-full flex-col items-center justify-center gap-4 overflow-x-hidden"
	>
		<div id="gridContainer" class="pointer-events-none fixed top-0 h-full w-full">
			<Grid2 />
		</div>
		<div
			id="planeSceneContainer"
			class="pointer-events-none absolute top-0 z-50 min-h-[100svh] w-screen"
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
					<div id="threeWind" class="invisible absolute right-full top-0 aspect-[146/25] h-[57%]">
						<ThreeWind />
					</div>
				</div>
			</div>
		</div>
		<div
			id="welcomeFlaps"
			class="z-40 flex min-h-[100svh] w-full max-w-[1024px] items-center justify-center gap-1 px-2 text-3xl sm:gap-2 lg:text-7xl"
		></div>
		<div
			id="cityContainer"
			class="fixed bottom-[5vh] left-0 z-40 flex aspect-[2779/194] h-[40vh] origin-bottom-left scale-75 transform-gpu flex-row items-end will-change-transform"
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
