<script lang="ts">
	import { getContext } from 'svelte';
	import { Maximize } from 'lucide-svelte';
	export let experience;

	const onCardExpand = getContext('onCardExpand');

	const handleMaximize = () => {
		onCardExpand();
	};
</script>

<article
	class="flex flex-col rounded-xl border border-border-light bg-white text-text-light outline outline-8 outline-offset-0 outline-white dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:outline-surface-dark"
>
	<header
		class="relative h-[150px] rounded-xl rounded-b-none bg-gray-100 dark:bg-surface-darkhover"
	>
		<!-- <img placeholder> -->
		<div
			class="border-border-lign absolute right-4 top-4 cursor-pointer rounded-lg border bg-surface-light p-2 hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
			on:click={handleMaximize}
			on:keydown={(e) => e.key === 'Enter' && handleMaximize()}
			tabindex="0"
			aria-label="Maximize card"
		>
			<Maximize class="h-4 w-4 text-text-light dark:text-text-dark" strokeWidth={1.5} />
		</div>
	</header>
	<main
		class="relative flex flex-col border-b border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark"
	>
		<div
			class="absolute left-0 top-0 h-12 w-12 -translate-y-1/2 translate-x-4 rounded-lg border-2 border-white bg-yellow-200 dark:border-surface-dark"
		></div>
		<div class="mt-4 flex items-center gap-2">
			<h1 class="font-normal dark:text-text-dark">Lorem Ipsum</h1>
			<p
				class="bg-surface-lightgray dark:bg-surface-darkgray dark:text-text-darkaccent px-2 text-xs font-light"
			>
				1 year and 10 months
			</p>
		</div>
		<p class="text-text-lightgray dark:text-text-darkgray text-sm font-light">
			Lorem ipsum dolor sit amet consectetur adipisicing elit.
		</p>
	</main>
	<footer
		class="flex items-center justify-between rounded-xl rounded-t-none bg-surface-light p-4 dark:bg-surface-dark"
	>
		<button
			class="rounded-lg border border-border-light bg-surface-light px-4 py-2 text-sm outline-4 outline-offset-0 outline-black hover:bg-surface-lighthover dark:border-border-dark dark:bg-surface-dark dark:hover:bg-surface-darkhover"
			on:click={handleMaximize}
		>
			View Details
		</button>
		<span class="text-sm">Vue.js, TailwindCSS</span>
	</footer>
</article>
