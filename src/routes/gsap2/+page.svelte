<script lang="ts">
	import { onMount } from 'svelte';
	import { createMaster } from '$lib/anim/master';
	import { RANGES } from '$lib/anim/ranges';
	import { buildScrollDown } from '$lib/anim/features/intro';
	import ScrollDown from '$lib/components/gsap/ScrollDown.svelte';

	const buildFeatures = (ctx: any) => {
		buildScrollDown(ctx, RANGES.intro, {
			fadeUnits: 100,
			loopDelay: 1,
			loopRepeatDelay: 0.35,
			debug: false
		});
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
	</div>
</div>
