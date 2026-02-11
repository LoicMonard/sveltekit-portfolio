<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';
	import ExperienceCard from './ExperienceCard.svelte';
	import { activeCard } from '$lib/stores';
	import { ExternalLink, Star } from 'lucide-svelte';

	$: isExpanded = $activeCard === 'Mantaradar';

	export let data;
	export let hasActionButton = true;
	export let isInFullPageMode = false;

	let hoverTimeline: gsap.core.Timeline;
	let idleContentEl: HTMLDivElement;
	let topGroupEl: HTMLDivElement;
	let bottomGroupEl: HTMLDivElement;
	let starsEl: HTMLDivElement;
	let blob1El: HTMLDivElement;
	let blob2El: HTMLDivElement;
	let blob3El: HTMLDivElement;

	onMount(() => {
		hoverTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

		// Idle content fade out
		hoverTimeline.to(idleContentEl, { opacity: 0, duration: 0.25 }, 0);

		// Blobs scatter to corners
		hoverTimeline.to(blob1El, { x: 60, y: -40, scale: 0.7, duration: 0.5, ease: 'power2.inOut' }, 0);
		hoverTimeline.to(blob2El, { x: -50, y: 30, scale: 0.7, duration: 0.5, ease: 'power2.inOut' }, 0);
		hoverTimeline.to(blob3El, { x: 40, y: 40, scale: 0.7, duration: 0.5, ease: 'power2.inOut' }, 0);

		// Top group slide down
		hoverTimeline.fromTo(
			topGroupEl,
			{ y: -20, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.4 },
			0.05
		);

		// Stars pop in
		const stars = starsEl.querySelectorAll(':scope > *');
		hoverTimeline.fromTo(
			stars,
			{ scale: 0.5, opacity: 0 },
			{ scale: 1, opacity: 1, duration: 0.3, stagger: 0.06 },
			0.15
		);

		// Bottom group slide up
		hoverTimeline.fromTo(
			bottomGroupEl,
			{ y: 20, opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.4 },
			0.1
		);
	});

	onDestroy(() => {
		hoverTimeline?.kill();
	});

	const handleMouseEnter = () => {
		hoverTimeline?.play();
	};

	const handleMouseLeave = () => {
		hoverTimeline?.reverse();
	};
</script>

<ExperienceCard experience={data} {hasActionButton} {isInFullPageMode} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
	<div slot="main" class="overflow-auto">
		{#if !isExpanded}
			<p class="line-clamp-3 text-sm font-light text-text-lightgray dark:text-text-darkgray">
				Application mobile iOS/Android et web pour les sports nautiques. Prévisions météo
				intelligentes avec scoring par activité, carte interactive des spots, alertes personnalisées
				et communauté. Projet personnel conçu et développé de A à Z, disponible sur iOS, Android et
				web.
			</p>
		{:else}
			<article
				class="relative flex flex-col gap-8 overflow-hidden font-readex text-neutral-700 dark:text-neutral-300"
			>
				<section class="flex flex-col gap-3 py-8">
					<header class="flex flex-col gap-2">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
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
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-violet-300 hover:text-violet-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-violet-500/50 dark:hover:text-violet-400"
						>
							App Store
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=com.loicmonard.mantaradar"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-violet-300 hover:text-violet-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-violet-500/50 dark:hover:text-violet-400"
						>
							Google Play
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
						<a
							href="https://mantaradar.com"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-violet-300 hover:text-violet-500 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-violet-500/50 dark:hover:text-violet-400"
						>
							mantaradar.com
							<ExternalLink class="h-3 w-3" strokeWidth={2} />
						</a>
					</div>
					<p class="text-sm leading-7">
						Mantaradar est née d'un besoin personnel : trouver rapidement les meilleurs créneaux
						pour pratiquer des activités nautiques. Plutôt que de jongler entre plusieurs apps
						météo, j'ai voulu créer un outil unique qui analyse les conditions (vent, houle, marées)
						et fournit un score clair de 0 à 100, adapté à chaque sport parmi 10 disciplines : surf,
						kitesurf, paddle, plongée, pêche, voile, windsurf, kayak, baignade et longe-côte.
					</p>
					<p class="text-sm leading-7">
						J'ai conçu, développé et publié l'application seul, de l'idée initiale jusqu'à sa mise
						en ligne sur l'App Store, ainsi que sur Google Play. Le projet couvre le web (Next.js) et le mobile natif via
						Capacitor, avec une architecture full-stack reposant sur Supabase.
					</p>
				</section>

				<section class="flex flex-col gap-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-violet-400" aria-hidden="true">#</span>
						<span>Fonctionnalités</span>
					</h2>
					<p class="text-sm leading-7">
						L'application propose des prévisions heure par heure sur 7 jours, couvrant la hauteur,
						la période et la direction de la houle, la force et la direction du vent, les horaires
						et coefficients de marées, ainsi que les températures de l'eau et de l'air. Un
						algorithme de scoring custom évalue les conditions pour chaque activité en croisant
						l'ensemble de ces données.
					</p>
					<p class="text-sm leading-7">
						Les utilisateurs peuvent enregistrer leurs spots favoris, découvrir de nouveaux spots
						sur une carte interactive Mapbox, configurer des alertes push personnalisées, et
						contribuer via un système d'avis et de notation.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-12 md:flex-row">
					<div class="flex flex-col justify-around gap-6 py-2 md:w-1/3">
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-violet-400">SCORING</h3>
							<p class="text-sm leading-7">
								Algorithme custom qui croise vent, houle et marées pour attribuer un score de 0 à
								100 à chaque activité, avec un système de cache intelligent par géolocalisation.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-violet-400">
								MULTI-PLATEFORME
							</h3>
							<p class="text-sm leading-7">
								Application web Next.js wrappée avec Capacitor pour iOS et Android, avec
								authentification OAuth native (Google/Apple) et gestion des abonnements via
								RevenueCat.
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-xs font-medium tracking-[0.28em] text-violet-400">COMMUNAUTÉ</h3>
							<p class="text-sm leading-7">
								Système d'avis, profils publics, notation des spots et badges gamifiés pour
								encourager les contributions et enrichir la base de données collaborative.
							</p>
						</div>
					</div>

					<figure
						class="flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-background-dark dark:bg-background-dark dark:text-text-dark"
					>
						<img
							src="mantaradar/MantaradarMockup.png"
							alt="Interface d'agrégation de mots-clés anonymisés dans l'application Elephantastic"
							class="aspect-[1.54] w-full object-cover"
						/>
						<figcaption class="px-3 py-2 text-[11px] leading-6">
							Aperçu de l'interface principale de Mantaradar, avec les données météo et le scoring par activité.
						</figcaption>
					</figure>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3">
					<h2 class="inline-flex items-baseline gap-2 text-lg font-semibold leading-relaxed">
						<span class="text-violet-400" aria-hidden="true">#</span>
						<span>Enseignements</span>
					</h2>
					<p class="text-sm leading-7">
						Ce projet m'a permis de mener un produit de bout en bout : idéation, conception UX,
						développement full-stack, tests, publication sur l'App Store et itérations basées sur
						les retours utilisateurs. L'application est notée 5/5 sur l'App Store et Google Play.
					</p>
					<p class="text-sm leading-7">
						J'ai acquis une vraie maîtrise de l'architecture multi-plateforme (web + natif via
						Capacitor), de l'intégration Supabase en production (auth, RLS, Edge Functions,
						Realtime) et de la gestion d'un produit avec abonnements, push notifications.
					</p>
				</section>

				<hr class="my-6 border-t border-border-light dark:border-border-dark" aria-hidden="true" />

				<section class="flex flex-col gap-3 pb-4">
					<h2 class="flex items-center gap-2 text-lg font-semibold leading-relaxed">
						<p class="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
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
	<div
		class="relative h-full w-full overflow-hidden rounded-t-xl bg-[#FFFBFE] dark:bg-[#343434]"
		slot="header"
	>
		<!-- Blob violet — haut droite -->
		<div
			bind:this={blob1El}
			class="blob-1 absolute right-1/4 top-1/4 h-[100px] w-[120px] -translate-y-1/2 rounded-full bg-[#7C3AED] opacity-80 blur-[50px] dark:opacity-70"
		></div>
		<!-- Blob indigo/bleu — centre gauche -->
		<div
			bind:this={blob2El}
			class="blob-2 absolute left-1/4 top-1/2 h-[90px] w-[110px] -translate-y-1/2 rounded-full bg-[#413ECE] opacity-70 blur-[45px] dark:opacity-60"
		></div>
		<!-- Blob magenta — bas centre -->
		<div
			bind:this={blob3El}
			class="blob-3 absolute bottom-1/4 left-1/2 h-[100px] w-[130px] -translate-x-1/2 rounded-full bg-[#B338DE] opacity-75 blur-[45px] dark:opacity-65"
		></div>

		<!-- Idle content (logo + ghost text) -->
		<div bind:this={idleContentEl} class="absolute inset-0 flex items-center justify-center">
			
		</div>

		<!-- Hover content -->
		<div
			class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3"
		>
			<!-- Top group: title + stars -->
			<div bind:this={topGroupEl} class="flex flex-col items-center gap-1.5 opacity-0">
				<h2
					class="font-readex text-lg font-semibold tracking-wide text-slate-800 dark:text-violet-300"
				>
					Mantaradar
				</h2>
				<div bind:this={starsEl} class="flex items-center gap-0.5">
					{#each Array(5) as _}
						<Star class="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
					{/each}
				</div>
			</div>

			<!-- Bottom group: store buttons -->
			<div bind:this={bottomGroupEl} class="pointer-events-auto flex items-center gap-2 opacity-0">
				<a
					href="https://apps.apple.com/fr/app/mantaradar/id6755652819"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 dark:bg-neutral-800"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
						/>
					</svg>
					App Store
				</a>
				<a
					href="https://play.google.com/store/apps/details?id=com.loicmonard.mantaradar"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80 dark:bg-neutral-800"
				>
					<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12 17.72 9.79l-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"
						/>
					</svg>
					Google Play
				</a>
			</div>
		</div>

		<!-- Noise texture overlay -->
		<div
			class="pointer-events-none absolute inset-0 h-full w-full bg-repeat-round opacity-[0.08] mix-blend-multiply dark:opacity-80"
			style="background-image: url('/mantaradar/NoiseTexture.png');"
		></div>
	</div>
</ExperienceCard>

<style>
	.blob-1 {
		animation: floatBlob1 3.5s ease-in-out infinite;
		will-change: transform;
	}
	.blob-2 {
		animation: floatBlob2 4.5s ease-in-out infinite;
		will-change: transform;
	}
	.blob-3 {
		animation: floatBlob3 4s ease-in-out infinite;
		will-change: transform;
	}

	@keyframes floatBlob1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -20px) scale(1.15);
		}
		66% {
			transform: translate(-15px, 15px) scale(0.9);
		}
	}

	@keyframes floatBlob2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(25px, 25px) scale(1.12);
		}
	}

	@keyframes floatBlob3 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		40% {
			transform: translate(-20px, -25px) scale(1.15);
		}
		80% {
			transform: translate(15px, 10px) scale(0.92);
		}
	}
</style>
