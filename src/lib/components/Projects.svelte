<script lang="ts">
	import { onMount, setContext, tick } from 'svelte';
	import { loadGsapAll } from '$lib/gsap';
	import type { GsapType } from '$lib/gsap';
	import { experienceArray } from '$lib/stores/experiences.store';
	import { activeCard } from '$lib/stores';
	import type { Experience } from '$lib/types/experience';
	import ExperienceModal from './experiences/ExperienceModal.svelte';

	let isModalOpen = false;
	let currentExperience: Experience | null = null;
	let modalComponent: ExperienceModal;
	let projectListEl: HTMLElement;

	const handleCardExpand = async (experience: Experience) => {
		const { Flip } = await loadGsapAll();

		activeCard.set(experience.companyName);

		const cardId = experience.companyName?.toLowerCase();
		const selectedProject = document.getElementById(cardId);

		if (!projectListEl || !modalComponent || !selectedProject) return;

		const flipState = Flip.getState(selectedProject);

		const modalContainer = modalComponent.getContainer();
		const innerContainer = modalContainer?.querySelector(':scope > div');
		if (!innerContainer) return;

		innerContainer.appendChild(selectedProject);

		isModalOpen = true;
		currentExperience = experience;

		Flip.from(flipState, {
			duration: 0.5,
			ease: 'power2.inOut',
			absolute: true,
			onComplete: () => {
				// activeCard.set(experience.companyName);
			}
		});
	};

	const handleCardReduce = async (experience: Experience) => {
		const { Flip } = await loadGsapAll();

		const cardId = experience.companyName?.toLowerCase();
		const selectedProject = document.getElementById(cardId);

		if (!selectedProject) return;

		activeCard.set(null);
		isModalOpen = false;

		await tick();

		const flipState = Flip.getState(selectedProject);


		const originalContainer = document.getElementById(`${cardId}Container`);
		if (originalContainer) {
			originalContainer.appendChild(selectedProject);
		}

		Flip.from(flipState, {
			duration: .5,
			ease: 'power2.inOut',
			absolute: true,
			zIndex: 1000,
			onComplete: () => {
				currentExperience = null;
			}
		});
	};

	const handleModalClose = () => {
		if (currentExperience) {
			handleCardReduce(currentExperience);
		}
	};

	setContext('onCardExpand', handleCardExpand);
	setContext('onCardReduce', handleCardReduce);

	onMount(async () => {
		const { gsap, SplitText } = await loadGsapAll();
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

		<div class="my-4 lg:my-8">
			<div
				bind:this={projectListEl}
				id="projectList"
				class="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-2 2xl:grid-cols-4 2xl:grid-rows-1"
			>
				{#each $experienceArray as experience}
					<div
						id={`${experience.companyName.toLowerCase()}Container`}
						class="min-h-[350px] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 transition-opacity duration-300 dark:border-border-dark"
					>
						<div id={experience.companyName.toLowerCase()} class="h-full w-full">
							<svelte:component this={experience.component} data={experience}></svelte:component>
						</div>
					</div>
				{/each}
				<div
					class="min-h-[350px] w-full rounded-lg border-2 border-dashed border-slate-200 p-4 dark:border-border-dark"
				>
					/
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center">
			<button
				id="exploreMoreButton"
				class="border-2 border-double border-black bg-yellow-300 px-4 py-2 font-mono uppercase shadow-[-4px_4px_black]"
				type="button">Explore more</button
			>
		</div>
	</div>
</section>

<ExperienceModal bind:this={modalComponent} isOpen={isModalOpen} on:close={handleModalClose} />
