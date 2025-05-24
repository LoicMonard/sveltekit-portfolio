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

	const getContainerYOffset = (activeIndex: number) => {
		const yStep = 12;
		const translateY = (yStep * Math.log(activeIndex + 1)) / Math.log(2);
		return `translateY(${translateY.toFixed(2)}px)`;
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

<div class="absolute h-[calc(100%+2.5rem)] w-full -translate-y-10">
	<div
		class="py-O relative h-full w-full pt-10 [-webkit-mask-image:linear-gradient(to_bottom,black_90%,transparent)]
            [mask-image:linear-gradient(to_bottom,black_90%,transparent)]"
	>
		<!-- Chevron Up -->
		{#if $activeIndex > 0}
			<button
				on:click={prev}
				class="bg-surface-light dark:bg-surface-dark hover:bg-surface-lighthover dark:hover:bg-surface-darkhover absolute left-1/2 top-2 z-50 -translate-x-1/2 transform rounded-full p-2 shadow transition"
			>
				<ChevronUp class="h-6 w-6 text-text-dark dark:text-text-light" />
			</button>
		{/if}

		<!-- Items container -->
		<div
			class="relative flex h-full w-full flex-col items-center gap-2 transition-transform duration-1000"
		>
			{#each items as item, i (item)}
				<div
					bind:this={itemRefs[i]}
					class={`border-border-light border dark:border-border-dark absolute z-30 flex w-[100%] origin-top rounded-lg px-4 py-2 transition-transform
						${
							$activeIndex === i
								? 'bg-surface-lighthover dark:bg-surface-darkhover border-2 '
								: 'bg-surface-light dark:bg-surface-dark'
						}`}
					style={`transform: ${
						i < $activeIndex
							? getTransform(i, $activeIndex)
							: `translateY(calc(${Math.abs(i - $activeIndex)} * (100% + 8px)))`
					};`}
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
				class="bg-surface-light dark:bg-surface-dark hover:bg-surface-lighthover dark:hover:bg-surface-darkhover absolute bottom-2 left-1/2 z-50 -translate-x-1/2 transform rounded-full p-2 shadow transition"
			>
				<ChevronDown class="h-6 w-6 text-text-dark dark:text-text-light" />
			</button>
		{/if}
	</div>
</div>
