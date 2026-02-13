<script lang="ts">
	import { onMount } from 'svelte';
	import { loadGsapAll } from '$lib/gsap';
	import type { GsapType } from '$lib/gsap';

	const skillCategories = [
		{
			title: 'Langages',
			skills: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Python']
		},
		{
			title: 'Frameworks',
			skills: ['React', 'Next.js', 'Vue.js', 'Svelte', 'SvelteKit', 'Angular', 'Node.js', 'Capacitor']
		},
		{
			title: 'Outils',
			skills: ['Git', 'Tailwind CSS', 'GSAP', 'Supabase', 'Firebase', 'Mapbox', 'Figma', 'Docker']
		}
	];

	onMount(async () => {
		const { gsap, SplitText } = await loadGsapAll();
		animateSection(gsap, SplitText);
	});

	const animateSection = (gsap: GsapType, SplitText: any) => {
		const split = SplitText.create('#aboutTitle', { type: 'chars' });
		gsap.to(split.chars, {
			keyframes: [
				{ y: -10, duration: 0.2, ease: 'power1.out' },
				{ y: 0, duration: 0.2, ease: 'power1.in' }
			],
			stagger: 0.02,
			scrollTrigger: {
				trigger: '#about',
				start: 'top 85%',
				toggleActions: 'play none none none'
			},
			duration: 0.2
		});

		gsap.to('#aboutTitleUnderline', {
			width: '100%',
			scrollTrigger: {
				trigger: '#about',
				start: 'top 85%',
				toggleActions: 'play none none none'
			},
			duration: 0.5,
			ease: 'power2.inOut'
		});

		gsap.from('#aboutBio', {
			y: 20,
			opacity: 0,
			duration: 0.6,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '#about',
				start: 'top 85%',
				toggleActions: 'play none none none'
			}
		});

		gsap.from('.skill-category', {
			y: 30,
			opacity: 0,
			stagger: 0.15,
			duration: 0.6,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '#skillsGrid',
				start: 'top bottom',
				toggleActions: 'play none none none'
			}
		});
	};
</script>

<section
	id="about"
	class="flex w-screen items-center justify-center bg-white py-24 dark:bg-background-dark"
>
	<div class="container flex flex-col px-4">
		<div class="relative flex flex-col gap-2 lg:gap-4">
			<div class="relative h-fit w-fit">
				<h1
					id="aboutTitle"
					class="relative z-20 w-fit text-4xl font-semibold text-text-light dark:text-text-dark lg:text-7xl"
				>
					About me.
				</h1>

				<div
					id="aboutTitleUnderline"
					class="absolute top-0 z-0 h-[60%] w-0 translate-x-[.5ch] translate-y-[70%] rounded-full bg-emerald-200 text-7xl font-semibold text-transparent mix-blend-plus-darker dark:bg-emerald-900"
				></div>
			</div>
			<p class="text-xl text-text-light dark:text-text-dark">
				A bit about who I am
			</p>
		</div>

		<div id="aboutBio" class="my-8 max-w-3xl lg:my-12">
			<p class="text-base leading-8 text-text-lightgray dark:text-text-darkgray">
				Développeur front-end passionné, basé en France. Je conçois et développe des
				interfaces web et mobiles avec un souci du détail et une approche centrée sur
				l'expérience utilisateur. Curieux de nature, j'aime explorer de nouvelles
				technologies et relever des défis techniques, que ce soit sur des projets freelance
				ou personnels.
			</p>
		</div>

		<div id="skillsGrid" class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each skillCategories as category}
				<div
					class="skill-category rounded-xl border border-border-light bg-surface-light p-6 dark:border-border-dark dark:bg-surface-dark"
				>
					<h3
						class="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-400"
					>
						{category.title}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each category.skills as skill}
							<span
								class="inline-flex items-center rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1.5 text-sm text-text-light backdrop-blur dark:border-neutral-700/60 dark:bg-neutral-800/50 dark:text-text-dark"
							>
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
