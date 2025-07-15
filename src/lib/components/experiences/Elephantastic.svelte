<script lang="ts">
	import ListScrollerItem from '../ListScrollerItem.svelte';

	export let experience;
</script>

<ListScrollerItem isExpanded {experience}>
	<p class="text-text-lightgray dark:text-text-darkgray overflow-scroll text-sm font-light">
		Pendant près de deux ans, j’ai accompagné Elephantastic en tant que développeur front-end freelance, avec la responsabilité quasi complète du front. Mon rôle allait bien au-delà de l’intégration : j’ai conçu, développé et maintenu l’ensemble des interfaces, avec une grande liberté technique, tout en validant régulièrement mes choix avec le client.

J’ai travaillé en étroite collaboration avec l’équipe backend, ce qui m’a permis de construire une interface parfaitement adaptée aux flux de données complexes du projet, orienté OSINT. Les enjeux étaient forts en termes de lisibilité, de performance et d’accessibilité, notamment pour afficher un grand volume d’informations de manière claire et dynamique.

Aucun framework UI n’a été utilisé : j’ai développé tous les composants sur-mesure, avec une attention particulière portée à l’expérience utilisateur, au responsive design et à l’accessibilité. J’ai aussi pris en main l’aspect design en tant que développeur front avec une forte sensibilité UI/UX, afin de garantir cohérence et ergonomie.

Techniquement, le projet s’appuyait sur Vue.js, pour lequel j’ai géré la migration de Vue 2 vers Vue 3, tout en amorçant une transition vers TypeScript. Côté styling, j’ai supprimé les éléments obsolètes pour introduire TailwindCSS de manière homogène et efficace.

J’ai également manipulé ElasticSearch en rédigeant directement les queries, et mis en place Socket.io pour offrir une expérience fluide et en temps réel. Les tests E2E ont été réalisés avec Playwright, et j’ai maintenu une qualité de code rigoureuse avec ESLint, Prettier et GitLab.

Enfin, lors de mon départ, j’ai formé un nouveau développeur pour assurer la continuité du projet, en partageant les bonnes pratiques et en documentant l’existant.
	</p>
</ListScrollerItem>
