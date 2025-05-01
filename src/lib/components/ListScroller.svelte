<script lang="ts">
	import { writable } from 'svelte/store';
	import { ChevronDown, ChevronUp, Apple } from 'lucide-svelte';

	export let items: string[] = [];
	export let itemsPerView = 4;

	const activeIndex = writable(0);

	let itemRefs: (HTMLDivElement | null)[] = [];

	const next = () => {
		activeIndex.update((n) => Math.min(n + 1, items.length - itemsPerView));
		console.time('observer');
	};

	const prev = () => {
		activeIndex.update((n) => Math.max(n - 1, 0));
	};

	const getTransform = (i: number, activeIndex: number) => {
		const distance = Math.abs(i - activeIndex);

		if (distance === 0) return 'translateY(0) scale(1)';

		const scaleStep = 0.1;
		const yStep = 12; // tu peux ajuster
		const logBase = 2;

		const scale = 1 - (scaleStep * Math.log(distance + 1)) / Math.log(logBase);
		const translateY = (-yStep * Math.log(distance + 1)) / Math.log(logBase);

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
</script>

<div class="py-O relative h-full w-full overflow-hidden bg-white px-10">
	<!-- Chevron Up -->
	{#if $activeIndex > 0}
		<button
			on:click={prev}
			class="absolute left-1/2 top-2 z-50 -translate-x-1/2 transform rounded-full bg-white p-2 shadow transition hover:bg-gray-100"
		>
			<ChevronUp class="h-6 w-6 text-gray-800" />
		</button>
	{/if}

	<!-- Items container -->
	<div
		class="relative flex h-full w-full flex-col items-center gap-2 pt-10 transition-transform duration-1000"
	>
		{#each items as item, i (item)}
			<div
				bind:this={itemRefs[i]}
				class="border-gray absolute z-30 flex w-[100%] origin-top rounded-lg border bg-gray-50 px-4 py-2 transition-transform"
				class:border-2={$activeIndex === i}
				class:!bg-gray-100={$activeIndex === i}
				style={`transform: ${i < $activeIndex ? getTransform(i, $activeIndex) : `translateY(calc(${Math.abs(i - $activeIndex)} * (100% + 8px)))`};`}
			>
				<div class="flex gap-4">
					<Apple class="h-5 w-5 text-gray-800" />
					<div class="gap flex flex-col">
						<div class="flex gap-2">
							<span class="text-sm font-bold text-text-dark">{item.company}</span>
							<span class="text-sm font-light text-gray-500">
								{computeTimePassed(item.dateStart, item.dateEnd)}
							</span>
						</div>
						<div class="flex gap-2">
							{#each item.skills as skill}
								<span class="py rounded-full bg-gray-600 px-2 text-xs text-pastel-white"
									>{skill}</span
								>
							{/each}
						</div>
						<p class="mt-4 text-sm text-gray-600">
							{item.shortDescription}
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if $activeIndex + itemsPerView < items.length}
		<button
			on:click={next}
			class="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-white p-2 shadow transition hover:bg-gray-100"
		>
			<ChevronDown class="h-6 w-6 text-gray-800" />
		</button>
	{/if}
</div>
