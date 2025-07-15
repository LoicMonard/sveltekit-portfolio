<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import ListScroller from './ListScroller.svelte';
	import Elephantastic from './experiences/Elephantastic.svelte';

	const experiences = [
		{
			company: 'Elephantastic',
			dateStart: new Date(2022, 9, 17),
			dateEnd: new Date(2024, 6, 5),
			skills: ['Vue.js', 'Typescript', 'JavaScript', 'HTML', 'CSS'],
			icon: '/elephantastic_logo_128x128.png',
			iconBgColor: '#DFEAFC',
			shortDescription: 'Pendant près de deux ans, j’ai accompagné Elephantastic en tant que développeur front-end freelance, avec la responsabilité quasi complète du front. Mon rôle allait bien au-delà de l’intégration : j’ai conçu, développé et maintenu l’ensemble des interfaces, avec une grande liberté technique, tout en validant régulièrement mes choix avec le client.',
			component: Elephantastic
		},
		{
			company: 'WebSolutions',
			dateStart: new Date(2019, 5, 1),
			dateEnd: new Date(2020, 11, 31),
			skills: ['HTML', 'CSS', 'Vue.js'],
			icon: '/websolutions_logo.png',
			shortDescription: 'Created responsive websites and implemented Vue.js components.',
			component: Elephantastic
		},
		{
			company: 'DesignStudio',
			dateStart: new Date(2018, 2, 1),
			dateEnd: new Date(2019, 4, 30),
			skills: ['Photoshop', 'Illustrator', 'UI/UX'],
			icon: '/designstudio_logo.png',
			shortDescription: 'Designed user interfaces and graphics for various digital platforms.',
			component: Elephantastic
		},
		{
			company: 'AppDev Inc.',
			dateStart: new Date(2021, 0, 1),
			dateEnd: new Date(2022, 6, 31),
			skills: ['Kotlin', 'Swift', 'Mobile Development'],
			icon: '/appdev_logo.png',
			shortDescription: 'Developed mobile applications for Android and iOS platforms.',
			component: Elephantastic
		},
		{
			company: 'DataAnalytics Co.',
			dateStart: new Date(2017, 8, 1),
			dateEnd: new Date(2018, 1, 31),
			skills: ['Python', 'Pandas', 'Data Visualization'],
			icon: '/dataanalytics_logo.png',
			shortDescription: 'Analyzed data and created visualizations to support business decisions.',
			component: Elephantastic
		},
		{
			company: 'CloudNet',
			dateStart: new Date(2016, 0, 1),
			dateEnd: new Date(2017, 7, 31),
			skills: ['AWS', 'Docker', 'Kubernetes'],
			icon: '/cloudnet_logo.png',
			shortDescription: 'Implemented cloud infrastructure and containerized applications.',
			component: Elephantastic
		},
		{
			company: 'GameStudio',
			dateStart: new Date(2015, 3, 1),
			dateEnd: new Date(2016, 11, 31),
			skills: ['Unity', 'C#', 'Game Design'],
			icon: '/gamestudio_logo.png',
			shortDescription: 'Developed and designed engaging video games using Unity and C#.',
			component: Elephantastic
		},
		{
			company: 'EduTech',
			dateStart: new Date(2014, 6, 1),
			dateEnd: new Date(2015, 2, 28),
			skills: ['Java', 'Spring', 'E-learning Platforms'],
			icon: '/edutech_logo.png',
			shortDescription: 'Built and maintained e-learning platforms using Java and Spring.',
			component: Elephantastic
		}
	];

	let selectedExperience = experiences[0];

	let containerRef: HTMLDivElement;
	let listContainerRef: HTMLDivElement;
</script>

<div
	bind:this={containerRef}
	class="relative grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
>
	<Card id="yes" title="" colSpan={1} rowSpan={1} {containerRef}>
		<div slot="preview" class="text-text-light dark:text-text-dark">
			<div class="text-center"></div>
			<h2 class="text-2xl font-bold">Freelance Web Developer</h2>
			<p class="mt-2">I specialize in creating modern, responsive, and user-friendly websites.</p>
		</div>
	</Card>

	<Card id="anotherone" expandable title="anotherone" colSpan={2} rowSpan={1} {containerRef}></Card>

	<Card
		title=""
		id="test"
		colSpan={1}
		rowSpan={2}
		{containerRef}
		cardClass="p-6"
		expandedCardClass=""
	>
		<div class="absolute left-0 top-0 h-full w-full" bind:this={listContainerRef} slot="preview">
			<ListScroller items={experiences} parentRef={listContainerRef} {selectedExperience} />
		</div>
		<div class="relative bg-none p-2" bind:this={listContainerRef} slot="detailed">
			<svelte:component this={selectedExperience.component} experience={selectedExperience} />
		</div>
	</Card>

	<Card id="teste" title="Test" expandable colSpan={2} rowSpan={1} {containerRef}>
		<div slot="preview">Aperçu rapide ici.</div>
		<p>Sinon</p>
	</Card>

	<Card id="skills" colSpan={1} rowSpan={1} title="" {containerRef} cardClass="" expandable={false}>
		<div slot="preview" class="h-full">
			<div class="flex h-full items-center justify-center rounded-lg text-slate-600">
				<div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#f7dcae] bg-[#FAE4BD] transition-transform duration-300 hover:scale-105 dark:bg-background-dark"
					>
						<img
							src="/svelte_logo_200x200.png"
							alt="svelte logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(171,69,10,0.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#d5e8bc] bg-[#DCECCC] transition-transform duration-300 hover:scale-105 dark:bg-background-dark"
					>
						<img
							src="/vuejs_logo_200x200.png"
							alt="vuejs logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(62,99,79,.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#f6ed76] bg-background-light transition-transform duration-300 hover:scale-105 dark:bg-background-dark"
					>
						<img
							src="/js_logo_no_bg_200x200.png"
							alt="js logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(0,0,0,0.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#c7dedd] bg-[#D0E3E1] transition-transform duration-300 hover:scale-105 dark:bg-background-dark"
					>
						<img
							src="/css3_logo_200x200.png"
							alt="css logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(0,0,0,0.2)]"
						/>
					</div>
				</div>
			</div>
		</div>
		<p>Sinon</p>
	</Card>
</div>
