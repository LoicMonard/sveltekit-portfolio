<script lang="ts">
	import { onMount } from 'svelte';
	import { createMaster } from '$lib/anim/master';
	import { RANGES } from '$lib/anim/ranges';
	import { buildScrollDown } from '$lib/anim/features/intro';
	import { buildIntroGrid } from '$lib/anim/features/introGrid';
	import ScrollDown from '$lib/components/gsap/ScrollDown.svelte';
	import Grid2 from '$lib/components/gsap/Grid2.svelte';

	const buildFeatures = (ctx: any) => {
		buildScrollDown(ctx, RANGES.intro, { fadeUnits: 100 });
		buildIntroGrid(ctx, RANGES.intro, { debug: false });
	};

	onMount(async () => {
		await createMaster(RANGES, buildFeatures);
	});
</script>

<div id="gridScene" class="flex h-[100svh] w-screen items-center justify-center">
	<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
		<div id="scrollDownContainer" class="w-12">
			<ScrollDown />
		</div>
		<div id="gridContainer" class="fixed top-0 h-full w-full">
			<Grid2 />
		</div>
	</div>
</div>
