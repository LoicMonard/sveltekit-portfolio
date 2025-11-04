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
				lang="fr"
				class="flex flex-col gap-8 rounded-lg py-4 font-readex text-neutral-900 selection:bg-yellow-200/70  dark:text-neutral-100"
			>
				<header>
					<h1 class="mt-5 text-4xl font-semibold leading-tight">
						Mission chez Elephantastic <span class="opacity-60">(freelance)</span>
					</h1>

					<p class="mt-4 text-[1.05rem] leading-7 text-neutral-700 dark:text-neutral-300">
						Pendant près de deux ans, j'ai accompagné Elephantastic en tant que développeur
						front-end freelance, avec une responsabilité quasi complète sur le front.
					</p>
				</header>

				<div class="grid grid-cols-12 gap-10">
					<section class="col-span-12 flex flex-col justify-between lg:col-span-6">
						<div>
							<div class="mb-4 flex items-center gap-3">
								<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
								<h2 class="text-xl font-semibold">Rôle et périmètre</h2>
							</div>
							<p class="leading-7 text-neutral-700 dark:text-neutral-300">
								Mon rôle dépassait largement la simple intégration : j'ai conçu, développé et
								maintenu l'ensemble des interfaces, avec une grande liberté technique tout en
								validant régulièrement mes choix avec le client.
							</p>
						</div>

						<figure
							class="flex flex-col justify-end overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:ring-neutral-700/50"
						>
							<img
								src="elephantastic/elephantastic-fingerprints.png"
								alt="Aperçu général de l'interface Elephantastic"
								class="h-auto w-full"
							/>
							<figcaption class="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
								Aperçu d'une interface principale réalisée sur mesure (Vue 3 + TailwindCSS).
							</figcaption>
						</figure>
					</section>

					<section class="col-span-12 flex flex-col justify-between lg:col-span-6">
						<div>
							<div class="mb-4 flex items-center gap-3">
								<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
								<h2 class="text-xl font-semibold">Contexte et enjeux</h2>
							</div>
							<p class="leading-7 text-neutral-700 dark:text-neutral-300">
								Projet orienté OSINT avec des flux de données complexes. Collaboration étroite avec
								l'équipe backend pour bâtir une interface performante, claire et adaptée aux besoins
								métiers, capable d'afficher un grand volume d'informations de manière fluide et
								lisible.
							</p>
						</div>

						<figure
							class="mt-5 flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:ring-neutral-700/50"
						>
							<img
								src="elephantastic/elephantastic-data.png"
								alt="Visualisation et agrégations de données"
								class="h-auto w-full"
							/>
							<figcaption class="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
								Agrégations et visualisations de résultats en temps réel.
							</figcaption>
						</figure>
					</section>

					<section class="col-span-12">
						<div class="mb-4 flex items-center gap-3">
							<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
							<h2 class="text-xl font-semibold">Conception UI/UX</h2>
						</div>
						<div
							class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:ring-neutral-700/50"
						>
							<p class="leading-7 text-neutral-700 dark:text-neutral-300">
								Aucun framework UI n'a été utilisé : composants sur mesure, attention portée à
								l'expérience, au responsive et à l'accessibilité. J'ai également assuré la cohérence
								visuelle et l'ergonomie globale.
							</p>
							<figure class="mt-5 overflow-hidden rounded-xl">
								<img
									src="elephantastic/elephantastic-component.png"
									alt="Composants UI sur mesure"
									class="h-auto w-full"
								/>
							</figure>
						</div>
					</section>

					<section class="col-span-12 lg:col-span-7">
						<div class="mb-4 flex items-center gap-3">
							<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
							<h2 class="text-xl font-semibold">Stack et contributions techniques</h2>
						</div>
						<ul class="grid gap-2 sm:grid-cols-2">
							<li
								class="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-900 ring-1 ring-yellow-200/60 dark:bg-yellow-300/10 dark:text-yellow-200 dark:ring-yellow-300/20"
							>
								Migration Vue 2 → Vue 3
							</li>
							<li
								class="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-900 ring-1 ring-yellow-200/60 dark:bg-yellow-300/10 dark:text-yellow-200 dark:ring-yellow-300/20"
							>
								Transition vers TypeScript
							</li>
							<li
								class="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-900 ring-1 ring-yellow-200/60 dark:bg-yellow-300/10 dark:text-yellow-200 dark:ring-yellow-300/20"
							>
								TailwindCSS homogénéisé
							</li>
							<li
								class="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-900 ring-1 ring-yellow-200/60 dark:bg-yellow-300/10 dark:text-yellow-200 dark:ring-yellow-300/20"
							>
								Requêtes ElasticSearch
							</li>
							<li
								class="rounded-full bg-yellow-50 px-3 py-1.5 text-sm text-yellow-900 ring-1 ring-yellow-200/60 dark:bg-yellow-300/10 dark:text-yellow-200 dark:ring-yellow-300/20"
							>
								Socket.io temps réel
							</li>
						</ul>
					</section>

					<section class="col-span-12 lg:col-span-5">
						<div class="mb-4 flex items-center gap-3">
							<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
							<h2 class="text-xl font-semibold">Qualité et outillage</h2>
						</div>
						<div
							class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-800 dark:ring-neutral-700/50"
						>
							<ul class="list-disc space-y-1.5 pl-5 text-neutral-700 dark:text-neutral-300">
								<li>Tests E2E avec Playwright</li>
								<li>Linting via ESLint & Prettier</li>
								<li>CI GitLab</li>
							</ul>
						</div>
					</section>

					<section class="col-span-12">
						<div class="mb-4 flex items-center gap-3">
							<span class="h-5 w-1.5 rounded-full bg-yellow-400"></span>
							<h2 class="text-xl font-semibold">Transmission et continuité</h2>
						</div>

						<p>
							Lors de mon départ, j'ai formé un nouveau développeur pour assurer la continuité du
							projet, en partageant les bonnes pratiques et en documentant l'existant.
						</p>
					</section>
				</div>
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
