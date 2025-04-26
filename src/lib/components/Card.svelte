<script lang="ts">
	import { activeCard } from '$lib/stores';
	import { tick } from 'svelte';

	export let id: string;
	export let title: string;
	export let containerRef: HTMLDivElement;
	export let colSpan: number = 1;
	export let rowSpan: number = 1;

	let cardRef: HTMLDivElement;
	let rect = { top: 0, left: 0, width: 0, height: 0 };
	let showOverlay = false;
	let expanded = false;

	$: isDimmed = $activeCard !== null && $activeCard !== id;

	const handleClick = async () => {
		if (!containerRef) {
			console.warn('containerRef is not passed to Card');
			return;
		}

		const cardBox = cardRef.getBoundingClientRect();
		const containerBox = containerRef.getBoundingClientRect();

		rect = {
			top: cardBox.top - containerBox.top,
			left: cardBox.left - containerBox.left,
			width: cardBox.width,
			height: cardBox.height
		};

		showOverlay = true;

		await tick();
		requestAnimationFrame(() => {
			expanded = true;
			activeCard.set(id);
		});
	};

	const closeOverlay = () => {
		expanded = false;
		setTimeout(() => {
			showOverlay = false;
			activeCard.set(null);
		}, 500);
	};
</script>

<div
	bind:this={cardRef}
	class={`rounded-lg border bg-white p-6 transition-opacity duration-300 lg:col-span-${colSpan} lg:row-span-${rowSpan}`}
	class:invisible={showOverlay}
	class:opacity-30={isDimmed}
	class:blur-sm={isDimmed}
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
	tabindex="0"
	aria-label="Ouvrir la carte {title}"
	role="button"
>
	{#if title}
		<h2 class="font-bold">{title}</h2>
	{/if}
	<slot name="preview" />
</div>

{#if showOverlay}
	<div
		class="absolute z-50 overflow-hidden rounded-lg border bg-white transition-all duration-500 ease-in-out lg:col-span-2 lg:row-span-1"
		style="
      top: {expanded ? '5%' : rect.top + 'px'};
      left: {expanded ? '5%' : rect.left + 'px'};
      width: {expanded ? '90%' : rect.width + 'px'};
      height: {expanded ? '90%' : rect.height + 'px'};
    "
	>
		<div class="relative h-full overflow-auto p-6">
			<button on:click={closeOverlay} class="absolute right-4 top-4 rounded bg-gray-200 px-3 py-1">
				⬅ Retour
			</button>
			{showOverlay}
			<h2 class="font-bold">{title}</h2>
			{#if $$slots.detailed}
				<slot name="detailed" />
			{:else}
				<slot name="preview" />
			{/if}
		</div>
	</div>
{/if}
