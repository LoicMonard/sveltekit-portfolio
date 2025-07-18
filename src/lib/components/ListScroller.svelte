<script lang="ts">
	import { activeIndex } from '$lib/stores/listScroller.store';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import ListScrollerItem from './ListScrollerItem.svelte';
	import type { Experience } from '$lib/types/experience';

	export let items: Experience[] = [];
	export let selectedItem;

	let itemRefs: (HTMLDivElement | null)[] = [];

	const next = () => {
		activeIndex.update((n) => n + 1);
	};

	const prev = () => {
		activeIndex.update((n) => Math.max(n - 1, 0));
	};

	const getTransform = (i: number, activeIndex: number): string => {
		const distance = Math.abs(i - activeIndex);

		if (distance === 0) return 'translateY(0) scale(1)';

		const scaleStep = 0.1;
		const yStep = 12;
		const logBase = 2;

		const scale = 1 - (scaleStep * Math.log(distance + 1)) / Math.log(logBase);
		let translateY = (-yStep * Math.log(distance + 1)) / Math.log(logBase);

		return `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(3)})`;
	};

	const selectItem = (index: number) => (event: MouseEvent | KeyboardEvent) => {
		if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
			activeIndex.set(index);
			selectedItem = items[index];
		}
	};
</script>

<div
	class="absolute h-[calc(100%+2.5rem)] w-full -translate-y-10 text-text-light dark:text-text-dark"
>
	<div
		class="py-O relative h-full w-full pt-10 [-webkit-mask-image:linear-gradient(to_bottom,black_90%,transparent)]
            [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
	>
		{#if $activeIndex > 0}
			<button
				on:click={prev}
				class="absolute left-1/2 top-4 z-50 -translate-x-1/2 transform rounded-full bg-surface-light p-2 shadow transition hover:bg-surface-lighthover dark:bg-surface-dark dark:hover:bg-surface-darkhover"
			>
				<ChevronUp class="h-6 w-6 text-text-light dark:text-text-dark" />
			</button>
		{/if}

		<div
			class="relative flex h-full w-full flex-col items-center transition-transform duration-1000"
		>
			{#each items as item, i (item)}
				<div
					bind:this={itemRefs[i]}
					on:click={selectItem(i)}
					on:keydown={selectItem(i)}
					tabindex="0"
					role="button"
					class={`group absolute z-30 flex h-auto w-full origin-top overflow-hidden rounded-xl p-2 transition duration-300 hover:shadow-sm dark:border-border-dark dark:bg-surface-dark`}
					style={`transform: ${
						i < $activeIndex
							? getTransform(i, $activeIndex)
							: `translateY(calc(${Math.abs(i - $activeIndex)} * (100% + 8px)))`
					};`}
				>
					<ListScrollerItem data={item} />
				</div>
			{/each}
		</div>
	</div>
	{#if $activeIndex < items.length - 1}
		<button
			on:click={next}
			class="absolute bottom-0 left-1/2 z-50 -translate-x-1/2 transform rounded-full border-border-light bg-surface-light p-2 shadow transition hover:bg-surface-lighthover dark:bg-surface-dark dark:hover:bg-surface-darkhover"
		>
			<ChevronDown class="h-6 w-6 text-text-light dark:text-text-dark" />
		</button>
	{/if}
</div>
