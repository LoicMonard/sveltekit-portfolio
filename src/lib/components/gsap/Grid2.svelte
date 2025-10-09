<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const isExpanded = getContext<Writable<boolean>>('isExpanded');

	export let cols = 10;

	let w = 0;
	let h = 0;
	let gap = 0;
	let rows = 0;

	let scroller: HTMLElement | null = null;
	let ro: ResizeObserver | null = null;

	const measure = (): void => {
		const el = scroller;
		if (el) {
			w = el.clientWidth;
			h = el.clientHeight;
		}
		gap = w / cols;
		rows = Math.ceil(h / Math.max(gap, 1));
	};

	const setupResizeObserver = (): void => {
		if (!scroller) return;
		ro = new ResizeObserver(() => measure());
		ro.observe(scroller);
	};

	const onExpandedChange = async (): Promise<void> => {
		await tick();
		measure();
	};

	onMount(() => {
		scroller = document.getElementById('portfolioScroller');
		setupResizeObserver();
		tick().then(() => {
			measure();
		});
		window.addEventListener('resize', measure, { passive: true });
		return () => {
			ro?.disconnect();
			window.removeEventListener('resize', measure);
		};
	});

	$: ($isExpanded, onExpandedChange());
	$: (cols, measure());
</script>

<svg
	id="gridSvg"
	class="h-full w-screen"
	viewBox={`0 0 ${w} ${h}`}
	preserveAspectRatio="none"
	style="shape-rendering: crispEdges;"
>
	<g id="cols">
		{#each Array(cols + 1) as _, i}
			<path d={`M ${i * gap} 0 V ${h}`} stroke="#CCD5E1" stroke-width="0.5" fill="none" />
		{/each}
	</g>

	<g id="rows">
		{#each Array(rows) as _, j}
			<path d={`M 0 ${(j + 1) * gap} H ${w}`} stroke="#CCD5E1" stroke-width="0.5" fill="none" />
		{/each}
	</g>
</svg>
