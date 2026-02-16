<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { loadGsapAll } from '$lib/gsap';
	import RollerShutter from './garage/RollerShutter.svelte';
	import GarageInterior from './garage/GarageInterior.svelte';

	let shutterProgress = 1; // DEBUG: forced to 1
	let isVisible = false;
	let garageScroller: HTMLElement;
	let ctx: any;

	onMount(async () => {
		if (!browser) return;
		const { gsap, ScrollTrigger } = await loadGsapAll();

		ctx = gsap.context(() => {
			ScrollTrigger.create({
				scroller: garageScroller,
				trigger: '#garageScrollContent',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1,
				onUpdate: (self: any) => {
					shutterProgress = self.progress;
				},
				onEnter: () => (isVisible = true),
				onLeave: () => (isVisible = false),
				onEnterBack: () => (isVisible = true),
				onLeaveBack: () => (isVisible = false)
			});
		});

		isVisible = true;
	});

	onDestroy(() => {
		ctx?.revert();
	});
</script>

<section class="flex w-screen items-center justify-center bg-slate-50 py-24 dark:bg-surface-dark">
	<div
		bind:this={garageScroller}
		id="garageScroller"
		class="scrollbar-hide container relative aspect-[16/9] min-h-[350px] w-full overflow-x-hidden overflow-y-scroll rounded-lg border-2 border-dashed border-border-light p-4 dark:border-border-dark"
	>
		<!-- Sticky viewport -->
		<div class="sticky top-0 h-full w-full rounded-lg overflow-hidden">
			<div id="garageViewport" class="relative h-full w-full overflow-hidden">
				<!-- Layer 1: Three.js 3D scene -->
				<div class="absolute inset-0 z-0">
					<GarageInterior progress={shutterProgress} {isVisible} />
				</div>

				<!-- Layer 3: Roller shutter -->
				<div class="pointer-events-none absolute inset-0 z-20">
					<RollerShutter progress={shutterProgress} />
				</div>

				<!-- Layer 4: Garage frame -->
				<div
					class="pointer-events-none absolute inset-0 z-30 rounded-xl"
					style="box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.2);"
				/>
			</div>
		</div>

		<!-- Scroll content (invisible, just provides scroll height) -->
		<div id="garageScrollContent" class="pointer-events-none h-[300vh]"></div>
	</div>
</section>
