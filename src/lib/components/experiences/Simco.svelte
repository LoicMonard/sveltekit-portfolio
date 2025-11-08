<script lang="ts">
	import ExperienceCard from './ExperienceCard.svelte';
	import { activeCard } from '$lib/stores';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	$: isExpanded = $activeCard === 'Simco';

	export let data;
	export let hasActionButton = true;
	export let isInFullPageMode = false;
</script>

<ExperienceCard experience={data} {hasActionButton} {isInFullPageMode}>
	<div slot="main" class="overflow-auto">
		{#if !isExpanded}
			<p class="line-clamp-3 text-sm font-light text-text-lightgray dark:text-text-darkgray">
				Chez Simco, éditeur de logiciels à destination des collectivités locales, j'ai intégré une
				équipe technique d'une dizaine de personnes en tant que développeur front-end. Rapidement,
				j'ai pris en charge le pôle front, intervenant sur une dizaine d'applications web, à la fois
				pour maintenir l'existant (notamment sous AngularJS) et pour initier la refonte des outils
				vers une stack moderne.
			</p>
		{:else}
			<article
				class="relative flex flex-col gap-10 overflow-hidden font-readex text-neutral-700 dark:text-neutral-300"
			>
				<!-- Contexte de la mission -->
				<section class="flex flex-col gap-6 pt-8 md:grid-cols-3 md:items-start">
					<header class="flex flex-col gap-2">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-rose-400"># Simco</p>
						<h2 class="text-base font-semibold leading-relaxed">Contexte de la mission</h2>
						<p class="text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
							Éditeur de solutions métier pour les collectivités locales.
						</p>
					</header>

					<div class="flex flex-col gap-3 md:col-span-2">
						<p class="text-sm leading-7">
							J'ai rejoint Simco en tant que développeur front-end au sein d'une équipe technique
							d'une dizaine de personnes. Très rapidement, j'ai pris en charge le pôle front sur un
							ensemble d'applications web utilisées au quotidien par les collectivités.
						</p>
						<p class="text-sm leading-7">
							Mon rôle couvrait à la fois la maintenance de l'existant (notamment des interfaces
							sous AngularJS) et l'initiation d'une refonte progressive vers une stack moderne, plus
							fiable et plus cohérente, en étroite collaboration avec les product owners, les
							développeurs back-end, les équipes d'infrastructure et la direction technique.
						</p>
					</div>
				</section>

				<hr class="border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<!-- Conception et développement -->
				<section
					class="flex flex-col gap-4 rounded-2xl border border-border-light bg-white/60 p-4 shadow-sm
                  dark:border-border-dark/80 dark:bg-background-dark/60"
				>
					<div class="flex items-baseline gap-2">
						<span class="text-rose-400" aria-hidden="true">#</span>
						<h2 class="text-base font-semibold leading-relaxed">Conception et développement</h2>
					</div>
					<p class="text-sm leading-7">
						Pour accélérer et fiabiliser le développement, j'ai défini une architecture front
						moderne autour de Vue.js et d'une logique de composants réutilisables. Après une
						première phase en CSS custom, j'ai introduit TailwindCSS afin d'harmoniser les
						interfaces et de poser les fondations d'un design system interne adapté aux usages
						métier des collectivités.
					</p>
					<p class="text-sm leading-7">
						Une part importante du travail concernait la représentation de données complexes :
						tableaux hiérarchiques, calculs métiers, vues croisées, filtres avancés. Chaque écran
						était pensé pour rester lisible, accessible et exploitable par des utilisateurs non
						techniques, tout en respectant les contraintes fonctionnelles fortes.
					</p>
				</section>

				<hr class="border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<!-- Visuels + points clés (layout inversé par rapport à Elephantastic) -->
				<section class="flex flex-col gap-10 md:flex-row md:items-start md:gap-8">
					<figure
						class="order-2 flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white
             dark:border-background-dark dark:bg-background-dark md:order-1"
					>
						<img
							src="simco/simco-prep.png"
							alt="Interface de gestion avancée de tableaux hiérarchiques développée pour Simco"
							class="aspect-[1.7] w-full object-cover"
						/>
						<figcaption
							class=" py-2 text-[11px] leading-6 text-neutral-600 dark:text-neutral-400"
						>
							Exemple d'une interface complexe avec tableaux multi-niveaux et logique récursive,
							conçue pour faciliter la lecture et la navigation dans des données métiers denses.
						</figcaption>
					</figure>

					<div class="order-1 flex flex-1 flex-col gap-6 md:order-2">
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-rose-400">ARCHITECTURE FRONT</h3>
							<p class="text-sm leading-7">
								Mise en place d'une architecture de composants Vue.js modulaires, pensée pour
								couvrir plusieurs applications tout en mutualisant les briques communes (navigation,
								tableaux, formulaires, filtres, blocs métiers spécifiques).
							</p>
						</div>

						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-rose-400">DESIGN SYSTEM</h3>
							<p class="text-sm leading-7">
								Construction progressive d'un design system adapté aux usages des collectivités :
								typographies, couleurs, états, composants standards et patterns d'interaction, afin
								d'offrir une expérience cohérente sur l'ensemble des outils.
							</p>
						</div>

						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-rose-400">QUALITÉ & TESTS</h3>
							<p class="text-sm leading-7">
								Adoption d'outils de qualité (ESLint, Prettier) et de tests end-to-end avec Cypress,
								combinés à une intégration continue sous GitLab, pour sécuriser les évolutions sur
								un parc applicatif large et critique.
							</p>
						</div>
					</div>
				</section>

				<hr class="border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<!-- Enseignements -->
				<section class="flex flex-col gap-6 md:grid-cols-3 md:items-start">
					<header class="flex items-baseline gap-2">
						<span class="text-rose-400" aria-hidden="true">#</span>
						<h2 class="text-base font-semibold leading-relaxed">Enseignements</h2>
					</header>

					<div class="flex flex-col gap-3 md:col-span-2">
						<p class="text-sm leading-7">
							Chez Simco, j'ai consolidé mon rôle de référent front, en conciliant enjeux métiers,
							contraintes techniques et dette historique. Cette expérience m'a appris à faire
							évoluer un existant tout en construisant une base moderne, stable et partagée.
						</p>
						<p class="text-sm leading-7">
							J'y ai également développé mes compétences de collaboration inter-équipes et de
							mentoring, en accompagnant un stagiaire sur six mois et en diffusant de bonnes
							pratiques de développement, de revue de code et d'organisation des composants.
						</p>
					</div>
				</section>

				<hr class="border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<!-- Stack technique (présentation plus compacte / différente) -->
				<section class="flex flex-col gap-3  pb-4">
					<h2 class="flex items-center gap-2 text-base font-semibold leading-relaxed">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-rose-400"># Stack technique</p>
					</h2>

					<dl class="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Vue 3</dt>
							<span aria-hidden="true">→</span>
							<dd>Architecture modulaire pour les nouvelles applications.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">AngularJS</dt>
							<span aria-hidden="true">→</span>
							<dd>Maintenance et évolution progressive de l'existant.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">TailwindCSS</dt>
							<span aria-hidden="true">→</span>
							<dd>Base du design system interne.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Storybook</dt>
							<span aria-hidden="true">→</span>
							<dd>Documentation des composants réutilisables.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Cypress</dt>
							<span aria-hidden="true">→</span>
							<dd>Tests end-to-end sur les écrans critiques.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">GitLab CI</dt>
							<span aria-hidden="true">→</span>
							<dd>CI/CD et gestion de versions.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">ESLint & Prettier</dt>
							<span aria-hidden="true">→</span>
							<dd>Qualité et cohérence du code.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Docker</dt>
							<span aria-hidden="true">→</span>
							<dd>Environnements de développement et intégration.</dd>
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
