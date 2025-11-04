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
			<div class="text-sm font-light text-text-lightgray dark:text-text-darkgray">
				<p class="line-clamp-3 text-sm font-light text-text-lightgray dark:text-text-darkgray">
					Chez Simco, éditeur de logiciels à destination des collectivités locales, j'ai intégré une
					équipe technique d'une dizaine de personnes en tant que développeur front-end. Rapidement,
					j'ai pris en charge le pôle front, intervenant sur une dizaine d'applications web, à la
					fois pour maintenir l'existant (notamment sous AngularJS) et pour initier la refonte des
					outils vers une stack moderne.
				</p>
			</div>
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
