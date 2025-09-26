<script lang="ts">
	import { onMount } from 'svelte';
	import { createMaster } from '$lib/anim/master';
	import { RANGES } from '$lib/anim/ranges';
	import { buildScrollDown } from '$lib/anim/features/intro';
	import { buildIntroGrid } from '$lib/anim/features/introGrid';
	import ScrollDown from '$lib/components/gsap/ScrollDown.svelte';
	import Grid2 from '$lib/components/gsap/Grid2.svelte';
	import { buildPlaneFeature } from '$lib/anim/features/plane';
	import PaperPlaneMotionPath from '$lib/components/gsap/PaperPlaneMotionPath.svelte';
	import PaperPlane2 from '$lib/components/gsap/PaperPlane2.svelte';
	import PaperPlane from '$lib/components/gsap/PaperPlane.svelte';
	import { buildWelcomeText } from '$lib/anim/features/welcomeText';

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
	};

	onMount(async () => {
		await createMaster(RANGES, buildFeatures);

		window.addEventListener('scroll', () => {
			scrollTop = window.scrollY;
		});
	});
</script>

<!-- Helpers -->
<div class="pointer-events-none fixed top-0 h-screen w-full bg-slate-50">
	<div id="bluebox" class="border-radius absolute left-[20px] h-12 w-12 text-lg font-bold">
		{scrollTop}
	</div>
</div>

<div id="gridScene" class="flex h-[100svh] w-screen items-center justify-center">
	<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
		<!-- <div id="scrollDownContainer" class="w-12">
			<ScrollDown />
		</div> -->
		<div id="gridContainer" class="fixed top-0 h-full w-full">
			<Grid2 />
		</div>
		<div id="planeSceneContainer" class="absolute z-30 top-0 h-screen w-screen">
			<div
				id="paperPlaneMotionPathContainer"
				class="invisible absolute bottom-1/2 left-[-5vw] w-[55vw]"
			>
				<PaperPlaneMotionPath />
			</div>
			<div id="planeContainer" class="w-16 md:w-24 lg:w-36 -translate-x-full overflow-visible">
				<PaperPlane2 />
			</div>
		</div>
		<div id="welcomeFlaps" class="text-3xl z-20 lg:text-7xl max-w-[1280px] flex gap-1 sm:gap-2 w-full px-2 items-center justify-center"></div>
	</div>
	<div id="hiddenElements" class="hidden">
		<PaperPlane />
	</div>
</div>
