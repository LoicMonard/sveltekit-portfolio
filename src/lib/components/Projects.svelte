<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { loadGsapAll } from '$lib/gsap';
	import { experienceArray } from '$lib/stores/experiences.store';
	import type { Experience } from '$lib/types/experience';

	const handleClick = async (experience: Experience) => {
		console.log(experience);
		const { Flip } = await loadGsapAll();
	};

	setContext('onCardExpand', handleClick);

	onMount(() => {
		console.log('mounted');
	});
</script>

<section
	id="projects"
	class="flex w-screen items-center justify-center bg-white py-24 dark:bg-background-dark"
>
	<div class="container flex flex-col px-4">
		<div class="flex flex-col gap-2 lg:gap-4">
			<h1 class="text-4xl font-semibold text-text-light dark:text-text-dark lg:text-7xl">
				Crafted with love.
			</h1>
			<p class="text-xl text-text-light">Here's a list of some of my projects</p>
		</div>
		<div
			class="my-4 grid grid-cols-1 grid-rows-2 flex-col gap-4 lg:my-8 lg:grid-cols-4 lg:grid-rows-1"
		>
			{#each $experienceArray as experience}
				<div
					id="project2"
					class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4"
				>
					<svelte:component this={experience.component} data={experience}></svelte:component>
				</div>
			{/each}
			<div
				id="project2"
				class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4"
			>
				/
			</div>
			<div
				id="project3"
				class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4"
			>
				/
			</div>
		</div>
		<div id="expandedProjectContainer" class="absolute"></div>
	</div>
</section>
