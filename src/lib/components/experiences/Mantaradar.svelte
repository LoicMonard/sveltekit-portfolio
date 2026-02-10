<script lang="ts">
	import ExperienceCard from './ExperienceCard.svelte';
	import { activeCard } from '$lib/stores';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
	import { ExternalLink } from 'lucide-svelte';

	$: isExpanded = $activeCard === 'Mantaradar';

	export let data;
	export let hasActionButton = true;
	export let isInFullPageMode = false;
</script>

<ExperienceCard experience={data} {hasActionButton} {isInFullPageMode}>
	<div slot="main" class="overflow-auto">
		{#if !isExpanded}
			<p class="line-clamp-3 text-sm font-light text-text-lightgray dark:text-text-darkgray">
				Application mobile iOS/Android et web pour les sports nautiques. Prévisions météo
				intelligentes avec scoring par activité, carte interactive des spots, alertes personnalisées
				et communauté. Projet personnel conçu et développé de A à Z, disponible sur iOS, Android et web.
			</p>
		{:else}
			<article
				class="relative flex flex-col gap-8 overflow-hidden font-readex text-neutral-700 dark:text-neutral-300"
			>
				<section class="flex flex-col gap-3 py-8">
					<header class="flex flex-col gap-2">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-teal-400">
							# Mantaradar
						</p>
						<h2 class="text-base font-semibold leading-relaxed">Projet personnel</h2>
						<p class="text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
							Application météo pour les sports nautiques — iOS, Android & Web
						</p>
					</header>
					<div class="flex flex-wrap gap-3">
						<a
							href="https://apps.apple.com/fr/app/mantaradar/id6755652819"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-teal-300 hover:text-teal-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-teal-500/50 dark:hover:text-teal-400"
						>
							App Store
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=com.loicmonard.mantaradar"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-teal-300 hover:text-teal-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-teal-500/50 dark:hover:text-teal-400"
						>
							Google Play
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
						<a
							href="https://mantaradar.com"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-teal-300 hover:text-teal-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-teal-500/50 dark:hover:text-teal-400"
						>
							mantaradar.com
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
					</div>
					<p class="text-sm leading-7">
						Mantaradar est née d'un besoin personnel : trouver rapidement les meilleurs créneaux
						pour pratiquer des activités nautiques. Plutôt que de jongler entre plusieurs apps météo,
						j'ai voulu créer un outil unique qui analyse les conditions (vent, houle, marées) et
						fournit un score clair de 0 à 100, adapté à chaque sport parmi 10 disciplines : surf,
						kitesurf, paddle, plongée, pêche, voile, windsurf, kayak, baignade et longe-côte.
					</p>
					<p class="text-sm leading-7">
						J'ai conçu, développé et publié l'application seul, de l'idée initiale jusqu'à sa mise
						en ligne sur l'App Store. Le projet couvre le web (Next.js) et le mobile natif via
						Capacitor, avec une architecture full-stack reposant sur Supabase.
					</p>
				</section>

				<section class="flex flex-col gap-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-teal-400" aria-hidden="true">#</span>
						<span>Fonctionnalités</span>
					</h2>
					<p class="text-sm leading-7">
						L'application propose des prévisions heure par heure sur 7 jours, couvrant la hauteur,
						la période et la direction de la houle, la force et la direction du vent, les horaires et
						coefficients de marées, ainsi que les températures de l'eau et de l'air. Un algorithme de
						scoring custom évalue les conditions pour chaque activité en croisant l'ensemble de ces
						données.
					</p>
					<p class="text-sm leading-7">
						Les utilisateurs peuvent enregistrer leurs spots favoris, découvrir de nouveaux spots sur
						une carte interactive Mapbox, configurer des alertes push personnalisées, et contribuer
						via un système d'avis et de notation. Un système de badges gamifié récompense
						l'engagement de la communauté.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-12 p-4 md:flex-row">
					<div class="flex flex-col justify-around gap-6 py-2 md:w-1/3">
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-teal-400">SCORING</h3>
							<p class="text-sm leading-7">
								Algorithme custom qui croise vent, houle et marées pour attribuer un score de 0 à
								100 à chaque activité, avec un système de cache intelligent par géolocalisation.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-teal-400">MULTI-PLATEFORME</h3>
							<p class="text-sm leading-7">
								Application web Next.js wrappée avec Capacitor pour iOS et Android, avec
								authentification OAuth native (Google/Apple) et gestion des abonnements via
								RevenueCat.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-teal-400">COMMUNAUTÉ</h3>
							<p class="text-sm leading-7">
								Système d'avis, profils publics, notation des spots et badges gamifiés pour
								encourager les contributions et enrichir la base de données collaborative.
							</p>
						</div>
					</div>

					<figure
						class="flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-background-dark dark:bg-background-dark dark:text-text-dark"
					>
						<div
							class="flex aspect-[1.54] w-full items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30"
						>
							<p class="text-sm text-neutral-400 dark:text-neutral-500">
								Visuels à venir
							</p>
						</div>
						<figcaption class="px-3 py-2 text-[11px] leading-6">
							Aperçu de l'interface Mantaradar.
						</figcaption>
					</figure>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3 px-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-teal-400" aria-hidden="true">#</span>
						<span>Enseignements</span>
					</h2>
					<p class="text-sm leading-7">
						Ce projet m'a permis de mener un produit de bout en bout : idéation, conception UX,
						développement full-stack, tests, publication sur l'App Store et itérations basées sur les
						retours utilisateurs. L'application est notée 5/5 sur l'App Store.
					</p>
					<p class="text-sm leading-7">
						J'ai acquis une vraie maîtrise de l'architecture multi-plateforme (web + natif via
						Capacitor), de l'intégration Supabase en production (auth, RLS, Edge Functions, Realtime)
						et de la gestion d'un produit avec abonnements, push notifications et gamification.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3 px-3 pb-4">
					<h2 class="flex items-center gap-2 text-lg font-semibold leading-relaxed">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-teal-400">
							# Stack technique
						</p>
					</h2>
					<dl class="mt-1 space-y-1 text-sm leading-7">
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Next.js 15</dt>
							<span aria-hidden="true">→</span>
							<dd>App Router, React 19, TypeScript.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Capacitor</dt>
							<span aria-hidden="true">→</span>
							<dd>Wrapper natif iOS/Android.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Supabase</dt>
							<span aria-hidden="true">→</span>
							<dd>Auth, PostgreSQL, Edge Functions, Realtime, RLS.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Mapbox GL</dt>
							<span aria-hidden="true">→</span>
							<dd>Carte interactive et découverte de spots.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">RevenueCat</dt>
							<span aria-hidden="true">→</span>
							<dd>Gestion des abonnements premium.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Tailwind CSS</dt>
							<span aria-hidden="true">→</span>
							<dd>Dark mode et thème océan custom.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">Framer Motion</dt>
							<span aria-hidden="true">→</span>
							<dd>Animations et transitions UI.</dd>
						</div>
						<div class="flex flex-wrap items-baseline gap-1">
							<dt class="font-semibold">FCM</dt>
							<span aria-hidden="true">→</span>
							<dd>Push notifications via Supabase Edge Functions.</dd>
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
		</div>
	</div>
</ExperienceCard>
