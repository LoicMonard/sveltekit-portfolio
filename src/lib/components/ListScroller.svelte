<script lang="ts">
	import { activeIndex, expandedIndex } from '$lib/stores/listScroller.store';
	import { ChevronDown, ChevronUp, Apple } from 'lucide-svelte';
	import { get } from 'svelte/store';
	import ListScrollerItem from './ListScrollerItem.svelte';

	export let items: string[] = [];
	export let selectedExperience;

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

	const computeTimePassed = (startDate: string, endDate: string): string => {
		const start = new Date(startDate);
		const end = new Date(endDate);

		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
		const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)) % 12;

		if (diffYears > 0 && diffMonths > 0) {
			return `${diffYears} year${diffYears > 1 ? 's' : ''} ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
		} else if (diffYears > 0) {
			return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
		} else {
			return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
		}
	};

	const selectItem = (index: number) => (event: MouseEvent | KeyboardEvent) => {
		if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
			activeIndex.set(index);
			selectedExperience = items[index];
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
		<!-- Chevron Up -->
		{#if $activeIndex > 0}
			<button
				on:click={prev}
				class="absolute left-1/2 top-4 z-50 -translate-x-1/2 transform rounded-full bg-surface-light p-2 shadow transition hover:bg-surface-lighthover dark:bg-surface-dark dark:hover:bg-surface-darkhover"
			>
				<ChevronUp class="h-6 w-6 text-text-light dark:text-text-dark" />
			</button>
		{/if}

		<!-- Items container -->
		<div
			class="relative flex h-full w-full flex-col items-center transition-transform duration-1000"
		>
			{#each items as item, i (item)}
				<div
					bind:this={itemRefs[i]}
					on:click={selectItem(i)}
					on:keydown={selectItem(i)}
					role="button"
					tabindex="0"
					class={`group absolute z-30 flex h-auto w-full origin-top overflow-hidden rounded-xl p-2 transition duration-300 hover:shadow-sm dark:border-border-dark dark:bg-surface-dark`}
					style={`transform: ${
						i < $activeIndex
							? getTransform(i, $activeIndex)
							: `translateY(calc(${Math.abs(i - $activeIndex)} * (100% + 8px)))`
					};`}
				>
					<ListScrollerItem />
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
