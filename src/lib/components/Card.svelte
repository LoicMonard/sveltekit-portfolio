<script lang="ts">
	import { activeCard } from '$lib/stores';
	import { tick } from 'svelte';
	import { Maximize, Minimize } from 'lucide-svelte';

	export let id: string;
	export let title: string;
	export let containerRef: HTMLDivElement;
	export let cardClass: string = 'rounded-lg border bg-white p-6';
	export let expandable: boolean = true;
	export let colSpan: number = 1;
	export let rowSpan: number = 1;

	let cardRef: HTMLDivElement;
	let rect = { top: 0, left: 0, width: 0, height: 0 };
	let showOverlay = false;
	let expanded = false;

	$: isDimmed = $activeCard !== null && $activeCard !== id;

	$: if ($activeCard !== id && showOverlay) {
		expanded = false;
		setTimeout(() => {
			showOverlay = false;
		}, 300);
	}

	const handleClick = async () => {
		if (!expandable) return;
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

		await tick();
		activeCard.set(id);
		showOverlay = true;
		requestAnimationFrame(() => {
			expanded = true;
		});
	};

	const closeOverlay = () => {
		console.log('click');
		expanded = false;
		activeCard.set(null);
		setTimeout(() => {
			showOverlay = false;
		}, 300);
	};
</script>

<div
	bind:this={cardRef}
	class={`${cardClass} relative overflow-hidden transition-opacity duration-300 lg:col-span-${colSpan} lg:row-span-${rowSpan} flex h-full flex-col`}
	class:invisible={showOverlay}
	class:opacity-50={isDimmed}
	class:cursor-pointer={expandable}
	class:cursor-default={!expandable}
>
	<div class="flex items-center justify-between">
		{#if title}
			<h2 class="font-bold">{title}</h2>
			{#if expandable}
				<button
					on:click={handleClick}
					on:keydown={(e) => e.key === 'Enter' && handleClick()}
					tabindex="0"
					aria-label="Ouvrir la carte {title}"
				>
					<Maximize class="h-5 w-5 text-gray-500" strokeWidth={2.5} />
				</button>
			{/if}
		{/if}
	</div>
	<slot class="flex-1" name="preview" />
</div>

{#if showOverlay}
	<div
		class={`absolute ${expanded ? 'z-50' : 'z-20'} ${expanded ? 'shadow-2xl' : 'shadow-none'} overflow-hidden rounded-lg border bg-white transition-all duration-300 ease-in-out lg:col-span-2 lg:row-span-1`}
		style="
      top: {expanded ? '5%' : rect.top + 'px'};
      left: {expanded ? '5%' : rect.left + 'px'};
      width: {expanded ? '90%' : rect.width + 'px'};
      height: {expanded ? '90%' : rect.height + 'px'};
    "
		class:opacity-30={isDimmed}
	>
		<div class="relative h-full overflow-auto p-6">
			<div class="flex items-center justify-between">
				{#if title}
					<h2 class="font-bold">{title}</h2>
				{/if}
				<button on:click={closeOverlay} tabindex="0" aria-label="Fermer la carte {title}">
					<Minimize
						on:click={closeOverlay}
						role="button"
						class="h-5 w-5 cursor-pointer text-gray-500"
						strokeWidth={2.5}
					/>
				</button>
			</div>
			{#if $$slots.detailed}
				<slot name="detailed" />
			{:else}
				<slot name="preview" />
			{/if}
		</div>
	</div>
{/if}
