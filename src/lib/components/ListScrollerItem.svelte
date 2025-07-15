<script lang="ts">
	import { getContext } from 'svelte';
	import { Maximize, Minimize } from 'lucide-svelte';
	export let experience;
	export let isExpanded = false;

	const onCardExpand = getContext('onCardExpand');
	const onCardReduce = getContext('onCardReduce');

	const handleMaximize = () => {
		onCardExpand();
	};

	const handleMinimize = () => {
		onCardReduce();
	};
</script>

<article
	class="flex h-fit flex-col rounded-xl border border-border-light bg-white text-text-light outline outline-8 outline-offset-0 outline-white dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:outline-surface-dark"
>
	<header
		class="relative min-h-[150px] rounded-xl rounded-b-none bg-gray-100 dark:bg-surface-darkhover"
	>
		<!-- <img placeholder> -->
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
	</header>
	<main
		class="relative flex flex-1 flex-col border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
	>
		<div
			class={`absolute left-0 top-0 p-2 h-12 w-12 -translate-y-1/2 translate-x-4 rounded-lg border-2 border-white  dark:border-surface-dark`}
			style={`background-color: ${experience.iconBgColor};`}
		>
			<img src={experience.icon} alt="Company Logo" class="h-full w-full" />
		</div>
		<div class="mt-4 flex items-center gap-2">
			<h1 class="font-normal dark:text-text-dark">{experience.company}</h1>
			<p
				class="bg-surface-lightgray dark:bg-surface-darkgray dark:text-text-darkaccent px-2 text-xs font-light"
			>
				{experience.dateStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
				{experience.dateEnd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
			</p>
		</div>

		<slot>
			<p class="text-text-lightgray dark:text-text-darkgray line-clamp-2 text-sm font-light">
				{experience.shortDescription}
			</p>
		</slot>
	</main>
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
</article>
