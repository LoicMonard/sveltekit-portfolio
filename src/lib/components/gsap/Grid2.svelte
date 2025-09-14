<script lang="ts">
	import { onMount } from 'svelte';

	export let cols = 10;

	let w = 0;
	let h = 0;
	let gap = 0;
	let rows = 0;

	const update = (): void => {
		w = window.innerWidth;
		h = window.innerHeight;
		gap = w / cols;
		rows = Math.ceil(h / gap);
	};

	const onResize = (): void => update();

	onMount(() => {
		update();
		window.addEventListener('resize', onResize, { passive: true });
		return () => window.removeEventListener('resize', onResize);
	});
</script>

<svg
	id="gridSvg"
	class="h-[100svh] w-screen"
	{w}
	{h}
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
			{#if j + 1 <= rows}
				<path d={`M 0 ${(j + 1) * gap} H ${w}`} stroke="#CCD5E1" stroke-width="0.5" fill="none" />
			{/if}
		{/each}
	</g>
</svg>
