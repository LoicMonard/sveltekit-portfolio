<script lang="ts">
	import ExperienceCard from './ExperienceCard.svelte';
	import { activeCard } from '$lib/stores';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	$: isExpanded = $activeCard === 'Elephantastic';

	export let data;
	export let hasActionButton = true;
	export let isInFullPageMode = false;
</script>

<ExperienceCard experience={data} {hasActionButton} {isInFullPageMode}>
	<div slot="main" class="overflow-auto">
		{#if !isExpanded}
			<p class="line-clamp-3 text-sm font-light text-text-lightgray dark:text-text-darkgray">
				Pendant près de deux ans, j'ai accompagné Elephantastic en tant que développeur front-end
				freelance, avec la responsabilité quasi complète du front. Mon rôle allait bien au-delà de
				l'intégration : j'ai conçu, développé et maintenu l'ensemble des interfaces, avec une grande
				liberté technique, tout en validant régulièrement mes choix avec le client.
			</p>
		{:else}
			<article
				class="relative flex flex-col gap-8 overflow-hidden font-readex text-neutral-700 dark:text-neutral-300"
			>
				<section class="flex flex-col gap-3 py-8">
					<header class="flex flex-col gap-2">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
							# Elephantastic
						</p>
						<h2 class="text-base font-semibold leading-relaxed">Contexte de la mission</h2>
						<p class="text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
							Éditeur d'une solution SaaS d'OSINT pour les enquêtes numériques
						</p>
					</header>
					<p class="text-sm leading-7">
						J'ai rejoint l'équipe d'Elephantastic en octobre 2022, au poste de développeur
						front-end. Tout juste freelance, c'était pour moi un nouveau défi : faire valoir mes
						compétences et mes connaissances, qui plus est dans un domaine que je connaissais peu,
						l'OSINT.
					</p>
					<p class="text-sm leading-7">
						Dans cette mission à long terme, j'étais l'unique développeur front-end, au sein d'une
						équipe composée d'un product owner et d'un développeur back-end. J'avais donc la
						responsabilité quasi complète sur une partie essentielle du projet.
					</p>
				</section>

				<section class="flex flex-col gap-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-sky-400" aria-hidden="true">#</span>
						<span>Conception et développement</span>
					</h2>
					<p class="text-sm leading-7">
						Au moment de mon arrivée, Elephantastic était une web app sous Vue 2, avec du CSS
						personnalisé. Afin de pérenniser l'application, j'ai entrepris une migration vers Vue 3,
						tout en convertissant les nouveaux composants en TypeScript. Côté style, nous avons
						uniformisé le code en adoptant TailwindCSS et notre propre design system.
					</p>
					<p class="text-sm leading-7">
						Une application d'OSINT telle qu'Elephantastic demande un travail conséquent sur
						l'affichage des données. Il a fallu rendre la donnée lisible, accessible et
						compréhensible pour les utilisateurs finaux. L'évolution constante des datasets a
						également nécessité une customisation importante des composants et des templates.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-12 p-4 md:flex-row">
					<div class="flex flex-col justify-around gap-6 py-2 md:w-1/3">
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-sky-400">COMPONENTS</h3>
							<p class="text-sm leading-7">
								Travaillant sans bibliothèque graphique ni UI kit, l'application reposait sur des
								composants Vue.js conçus sur mesure pour répondre aux besoins spécifiques du projet.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-sky-400">TEMPLATES</h3>
							<p class="text-sm leading-7">
								Pour chaque scénario de résultat, des templates personnalisables ont été imaginés et
								implémentés, avec des règles dédiées pour chacun d'entre eux.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-sky-400">MODULES</h3>
							<p class="text-sm leading-7">
								Grâce au système avancé de filtres à facettes et à des logiques spécifiques, la
								création de modules custom a été nécessaire tout au long du projet.
							</p>
						</div>
					</div>

					<figure
						class="flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-background-dark dark:bg-background-dark dark:text-text-dark"
					>
						<img
							src="elephantastic/elephantastic-fingerprints.png"
							alt="Interface d'agrégation de mots-clés anonymisés dans l'application Elephantastic"
							class="aspect-[1.54] w-full object-cover"
						/>
						<figcaption class="px-3 py-2 text-[11px] leading-6">
							Aperçu d'une interface d'agrégation de mots-clés (anonymisés) issue d'un composant Vue
							personnalisé.
						</figcaption>
					</figure>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3 px-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-sky-400" aria-hidden="true">#</span>
						<span>Enseignements</span>
					</h2>
					<p class="text-sm leading-7">
						Après presque deux ans de mission, je peux affirmer avoir énormément appris. En tant que
						seul développeur front, j'ai gagné en autonomie, en rigueur et en force de proposition.
						J'ai également renforcé mes compétences relationnelles, en défendant mes idées avec
						pragmatisme et en adoptant une vision orientée produit.
					</p>
					<p class="text-sm leading-7">
						Durant ma période de passation, j'ai eu l'opportunité de former mon successeur pendant
						trois mois. Cette expérience a mis en avant mon goût pour la pédagogie, l'écoute et la
						transmission des connaissances.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3 px-3 pb-4">
					<h2 class="flex items-center gap-2 text-lg font-semibold leading-relaxed">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
							# Stack technique
						</p>
					</h2>
					<dl class="mt-1 space-y-1 text-sm leading-7">
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Vue 3</dt>
							<span aria-hidden="true">→</span>
							<dd>Migration de Vue 2 à Vue 3, de Javascript à Typescript.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Pinia</dt>
							<span aria-hidden="true">→</span>
							<dd>Gestion du state global de l'application.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Axios</dt>
							<span aria-hidden="true">→</span>
							<dd>Communication avec le backend en Python.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Socket.io</dt>
							<span aria-hidden="true">→</span>
							<dd>Gestion des données en temps réel pour les différentes vues de résultats.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">ElasticSearch</dt>
							<span aria-hidden="true">→</span>
							<dd>Système de requêtage de données depuis le front.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">TailwindCSS</dt>
							<span aria-hidden="true">→</span>
							<dd>Theming global de l'application.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Playwright</dt>
							<span aria-hidden="true">→</span>
							<dd>Tests end-to-end de l'application.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Gitlab</dt>
							<span aria-hidden="true">→</span>
							<dd>Versionning et repository git.</dd>
						</div>
					</dl>
				</section>
			</article>
		{/if}
	</div>
	<div class="h-full w-full" slot="header">
		<div
			id="lottieContainer"
			class="relative flex h-full items-center justify-center overflow-hidden"
		>
			<!-- <DotLottieSvelte
				src="/lottie_assets/squares_animation.lottie"
				style="height: 100%; aspect-ratio: 2 / 1"
				loop
				autoplay
				renderConfig={{
					autoResize: true
				}}
			/> -->
		</div>
	</div>
</ExperienceCard>
