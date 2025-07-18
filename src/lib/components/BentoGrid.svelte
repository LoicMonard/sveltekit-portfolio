<script lang="ts">
	import { get } from 'svelte/store';
	import { experienceArray } from '$lib/stores/experiences.store';
	import type { Experience } from '$lib/types/experience.ts';
	import Card from '$lib/components/Card.svelte';
	import ListScroller from './ListScroller.svelte';

	let selectedItem: Experience | undefined = get(experienceArray)[0];

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
		id="experiences"
		colSpan={1}
		rowSpan={2}
		{containerRef}
		cardClass="p-6"
		expandedCardClass=""
	>
		<div class="absolute left-0 top-0 h-full w-full" bind:this={listContainerRef} slot="preview">
			<ListScroller items={$experienceArray} parentRef={listContainerRef} {selectedItem} />
		</div>
		<div class="relative bg-none p-2" bind:this={listContainerRef} slot="detailed">
			<svelte:component this={selectedItem?.component} data={selectedItem} />
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
	</Card>
</div>
