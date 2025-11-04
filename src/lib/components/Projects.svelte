<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { loadGsapAll } from '$lib/gsap';
	import type { GsapType } from '$lib/gsap';
	import { experienceArray } from '$lib/stores/experiences.store';
	import { activeCard } from '$lib/stores';
	import type { Experience } from '$lib/types/experience';

	let isProjectExpanded = false;

	const handleCardMaximize = async (experience: Experience) => {
		console.log('cardExpand');
		const { Flip } = await loadGsapAll();

		const projectsContainer = document.querySelector('#projectList') as HTMLElement | null;
		const expandedProjectContainer = document.querySelector(
			'#expandedProjectContainer'
		) as HTMLElement | null;
		const selectedProject = document.querySelector(
			`#${experience.companyName?.toLowerCase()}`
		) as HTMLElement | null;

		if (!projectsContainer || !expandedProjectContainer) {
			console.warn('Containers not found');
			return;
		}
		if (!selectedProject) {
			console.warn('No element found for the flip project animation');
			return;
		}

		const flipState = Flip.getState(selectedProject);

		const isInProjectList = !!projectsContainer.contains(selectedProject);
		console.log('isInProjectList:', isInProjectList);

		selectedProject.classList.add('z-50');

		if (isInProjectList) {
			expandedProjectContainer.appendChild(selectedProject);
			activeCard.set(experience.companyName);
			isProjectExpanded = true;
		} else {
			const selectedProjectParent =
				(document.getElementById(
					`${experience.companyName.toLowerCase()}Container`
				) as HTMLElement | null) ?? projectsContainer;
			selectedProjectParent.appendChild(selectedProject);
			isProjectExpanded = false;
		}

		Flip.from(flipState, {
			duration: 0.5,
			ease: 'power1.inOut',
			absolute: true,
			fade: true,
			onComplete: () => {
				if (!isProjectExpanded) {
					selectedProject.classList.remove('z-50');
					activeCard.set(null);
				}
			}
		});
	};

	const handleCardMinimize = async (experience) => {
		console.log('red');
	};

	setContext('onCardExpand', handleCardMaximize);
	setContext('onCardReduce', handleCardMinimize);

	onMount(async () => {
		const { gsap, SplitText, Flip } = await loadGsapAll();
		animateCharacters(gsap, SplitText);
	});

	const animateCharacters = (gsap: GsapType, SplitText) => {
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

		gsap.fromTo(
			'#exploreMoreButton',
			{ boxShadow: '-4px 8px black' },
			{
				boxShadow: '-4px -8px black',
				scrollTrigger: {
					trigger: '#exploreMoreButton',
					start: 'bottom bottom',
					scrub: 1
				}
			}
		);
	};
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
			class={`${isProjectExpanded ? 'h-[68lh] md:h-[32lh] lg:h-[32lh]' : 'h-[68lh] md:h-[34lh] lg:h-[32lh] 2xl:h-[16lh]'} relative my-4 transition-all lg:my-8`}
		>
			<div
				id="projectList"
				class={`${isProjectExpanded ? 'max-h-[68lh] md:max-h-[17lh]' : 'max-h-[107lh]'} md:-grid-rows-2 z-10 grid  grid-cols-1 grid-rows-2 flex-col gap-4 transition-all duration-500 ease-in md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 lg:grid-rows-1`}
			>
				{#each $experienceArray as experience}
					<div
						id={`${experience.companyName.toLowerCase()}Container`}
						class="h-full min-h-[15lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
					>
						<div id={experience.companyName.toLowerCase()} class="h-full w-full">
							<svelte:component this={experience.component} data={experience}></svelte:component>
						</div>
					</div>
				{/each}
				<div
					id="project2"
					class="h-full min-h-[15lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
				>
					/
				</div>
				<div
					id="project3"
					class="h-full min-h-[15lh] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
				>
					/
				</div>
			</div>
			<div
				id="expandedProjectContainer"
				class={`${isProjectExpanded ? 'flex' : 'flex pointer-events-none'} absolute border border-red-500 top-0 flex h-full max-h-[95vh] min-h-[32lh] w-full p-4`}
			></div>
		</div>

		<div
			class={`${isProjectExpanded ? '' : 'mt-0'} flex items-center justify-center transition-all duration-500`}
		>
			<button
				id="exploreMoreButton"
				class="border-2 border-double border-black bg-yellow-300 px-4 py-2 font-mono uppercase shadow-[-4px_4px_black]"
				type="button">Explore more</button
			>
		</div>
	</div>
</section>
