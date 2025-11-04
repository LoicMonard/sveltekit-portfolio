import { readable, derived } from 'svelte/store';
import type { Experience } from '$lib/types/experience';
import Elephantastic from '$lib/components/experiences/Elephantastic.svelte';
import Simco from '$lib/components/experiences/Simco.svelte';

const experienceList: Experience[] = [
	{
		companyName: 'Elephantastic',
		dateStart: new Date(2022, 9, 17),
		dateEnd: new Date(2024, 8, 5),
		skills: ['Vue.js', 'Typescript', 'JavaScript', 'HTML', 'CSS'],
		icon: '/elephantastic_logo_128x128.png',
		iconBgColor: '#DFEAFC',
		isFreelance: true,
		description:
			'Pendant près de deux ans, j’ai accompagné Elephantastic en tant que développeur front-end freelance, avec la responsabilité quasi complète du front. Mon rôle allait bien au-delà de l’intégration : j’ai conçu, développé et maintenu l’ensemble des interfaces, avec une grande liberté technique, tout en validant régulièrement mes choix avec le client.',
		component: Elephantastic
	},
	{
		companyName: 'Simco',
		dateStart: new Date(2020, 6, 1),
		dateEnd: new Date(2022, 8, 5),
		skills: ['Vue.js', 'Angular.js', 'JavaScript', 'HTML', 'CSS'],
		icon: '/simco_logo_200x200.jpeg',
		iconBgColor: '#FFF',
		isFreelance: false,
		description:
			'Pendant près de deux ans, j’ai accompagné Elephantastic en tant que développeur front-end freelance, avec la responsabilité quasi complète du front. Mon rôle allait bien au-delà de l’intégration : j’ai conçu, développé et maintenu l’ensemble des interfaces, avec une grande liberté technique, tout en validant régulièrement mes choix avec le client.',
		component: Simco
	}
];

const experiencesMap = new Map<string, Experience>(
	experienceList.map((exp) => [exp.companyName, exp])
);

export const experiences = readable(experiencesMap);

export const experienceArray = derived(experiences, ($map) => Array.from($map.values()));

export const getExperienceByName = (name: string): Experience | undefined =>
	experiencesMap.get(name);
