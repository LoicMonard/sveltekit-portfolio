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
<div class="pointer-events-none fixed top-0 h-screen w-screen bg-slate-50">
	<div id="bluebox" class="border-radius absolute left-[20px] h-12 w-12 text-lg font-bold">
		{scrollTop}
	</div>
	<!-- <div class="h-full w-[1px] translate-x-[50vw] bg-slate-200"></div> -->
</div>

<div id="gridScene" class="flex h-[100svh] w-screen items-center justify-center">
	<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
		<!-- <div id="scrollDownContainer" class="w-12">
			<ScrollDown />
		</div> -->
		<div id="gridContainer" class="fixed top-0 h-full w-full">
			<Grid2 />
		</div>
		<div id="planeSceneContainer" class="absolute top-0 h-full w-full">
			<div
				id="paperPlaneMotionPathContainer"
				class="invisible absolute bottom-1/2 left-[-5vw] w-[55vw]"
			>
				<PaperPlaneMotionPath />
			</div>
			<div id="planeContainer" class="w-36 -translate-x-full overflow-visible">
				<PaperPlane2 />
			</div>
		</div>
		<div id="welcomeFlaps" class="min-h-16 flex gap-2"></div>
	</div>
	<div id="hiddenElements" class="hidden">
		<PaperPlane />
	</div>
</div>
