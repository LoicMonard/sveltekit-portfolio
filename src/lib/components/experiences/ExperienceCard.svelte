<script lang="ts">
	import { getContext } from 'svelte';
	import { Maximize, Minimize } from 'lucide-svelte';
	import { activeCard } from '$lib/stores';

	export let experience;
	export let hasActionButton = true;
	export let isInFullPageMode = false;

	$: isExpanded = $activeCard === 'experiences';

	const onCardExpand = getContext('onCardExpand');
	const onCardReduce = getContext('onCardReduce');

	const handleMaximize = () => {
		onCardExpand();
	};

	const handleMinimize = () => {
		onCardReduce();
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

<article
	class="flex h-fit flex-col rounded-xl border border-border-light bg-white text-text-light outline outline-8 outline-offset-0 outline-white dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:outline-surface-dark"
>
	<header
		class="relative rounded-xl rounded-b-none bg-slate-100 dark:bg-surface-darkhover"
		style={`height: ${isExpanded ? '200px' : '150px'};`}
	>
		<slot name="header" />
		{#if hasActionButton}
			{#if isExpanded}
				<button
					class="border-border-lign absolute right-4 top-4 cursor-pointer rounded-lg border bg-surface-light p-2 hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
					on:click={handleMinimize}
					on:keydown={(e) => e.key === 'Enter' && handleMinimize()}
					aria-label="Maximize card"
				>
					<Minimize class="h-4 w-4 text-text-light dark:text-text-dark" strokeWidth={1.5} />
				</button>
			{:else}
				<button
					class="border-border-lign absolute right-4 top-4 cursor-pointer rounded-lg border bg-surface-light p-2 hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
					on:click={handleMaximize}
					on:keydown={(e) => e.key === 'Enter' && handleMaximize()}
					aria-label="Maximize card"
				>
					<Maximize class="h-4 w-4 text-text-light dark:text-text-dark" strokeWidth={1.5} />
				</button>
			{/if}
		{/if}
	</header>
	<main
		class="relative flex flex-1 flex-col border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
	>
		<div
			class={`absolute left-0 top-0 h-12 w-12 -translate-y-1/2 translate-x-4 rounded-lg border-2 border-white p-2  dark:border-surface-dark`}
			style={`background-color: ${experience?.iconBgColor};`}
		>
			<img src={experience?.icon} alt="Company Logo" class="h-full w-full" />
		</div>
		<div class="mt-4 flex items-center gap-2">
			<h1 class="font-normal dark:text-text-dark">
				{experience?.companyName}
			</h1>
			<p
				class="bg-surface-lightgray px-2 text-xs font-light dark:bg-surface-darkgray dark:text-text-darkaccent"
			>
				{computeTimePassed(experience?.dateStart, experience?.dateEnd)}
			</p>
		</div>

		<slot name="main">
			<p class="line-clamp-2 text-sm font-light text-text-lightgray dark:text-text-darkgray">
				{experience?.shortDescription}
			</p>
		</slot>
	</main>
	{#if !isInFullPageMode}
		<footer
			class="flex items-center justify-between rounded-xl rounded-t-none border-t border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
		>
			{#if isExpanded}
				<button
					class="rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm outline-4 outline-offset-0 outline-black hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
					on:click={handleMinimize}
				>
					Hide Details
				</button>
			{:else}
				<button
					class="rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm outline-4 outline-offset-0 outline-black hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
					on:click={handleMaximize}
				>
					View Details
				</button>
			{/if}
			<span class="text-sm">Vue.js, TailwindCSS</span>
		</footer>
	{/if}
</article>
