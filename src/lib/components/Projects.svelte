<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { loadGsapAll } from '$lib/gsap';
	import { experienceArray } from '$lib/stores/experiences.store';
	import type { Experience } from '$lib/types/experience';

	const handleClick = async (experience: Experience) => {
		console.log(experience);
	};

	setContext('onCardExpand', handleClick);

	onMount(async () => {
		const { gsap, SplitText } = await loadGsapAll();

		const split = SplitText.create('#projectTitle', { type: 'chars' });

		gsap.to(split.chars, {
			keyframes: [
				{ y: -10, duration: 0.2, ease: 'power1.out' },
				{ y: 0, duration: 0.2, ease: 'power1.in' }
			],
			stagger: 0.02,
			scrollTrigger: {
				trigger: '#projectTitle',
				start: 'top 50%',
				toggleActions: 'play none none reverse'
			},
			duration: 0.2
		});

		gsap.to('#projectTitleUnderline', {
			width: '100%',
			scrollTrigger: {
				trigger: '#projectTitle',
				start: 'top 50%',
				toggleActions: 'play none none reverse'
			},
			duration: 0.5,
			ease: 'power2.inOut'
		});
	});
</script>

<section
	id="projects"
	class="flex w-screen items-center justify-center bg-slate-50 py-24 dark:bg-surface-dark"
>
	<div class="container flex flex-col px-4">
		<div class="relative flex flex-col gap-2 lg:gap-4">
			<div class="relative h-fit w-fit">
				<h1
					id="projectTitle"
					class="relative z-20 w-fit text-4xl font-semibold text-text-light dark:text-text-dark lg:text-7xl"
				>
					Crafted with love.
				</h1>

				<div
					id="projectTitleUnderline"
					class="absolute top-0 z-0 h-[60%] w-0 translate-x-[.5ch] translate-y-[70%] rounded-full bg-yellow-200 text-7xl font-semibold text-transparent mix-blend-plus-darker dark:bg-stone-700"
				></div>
			</div>
			<p class="text-xl text-text-light dark:text-text-dark">
				Here's a list of some of my projects
			</p>
		</div>
		<div
			id="projectList"
			class="md:-grid-rows-2 my-4 grid grid-cols-1 grid-rows-2 flex-col gap-4 md:grid-cols-2 lg:my-8 lg:grid-cols-4 lg:grid-rows-1"
		>
			{#each $experienceArray as experience}
				<div
					id="project2"
					class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
				>
					<svelte:component this={experience.component} data={experience}></svelte:component>
				</div>
			{/each}
			<div
				id="project2"
				class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
			>
				/
			</div>
			<div
				id="project3"
				class="h-full min-h-[6lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
			>
				/
			</div>
		</div>
		<div id="expandedProjectContainer" class="absolute"></div>
	</div>
</section>
