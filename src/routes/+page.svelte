<script lang="ts">
	import BentoGrid from '$lib/components/BentoGrid.svelte';
	import RollingCube from '$lib/components/RollingCube.svelte';

	let title = 'loïc monard';
	let sceneRef: RollingCube;
	let isSceneActive = false;

	const toggleScene = () => {
		isSceneActive = !isSceneActive;
		if (isSceneActive) {
			sceneRef.start();
		} else {
			// sceneRef.stop();
		}
	};
</script>

<main class="h-full w-full">
	<section
		class={`${isSceneActive ? 'h-[100vh]' : 'h-[800px]'} border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark flex w-full justify-center border-b-2 pt-32 text-slate-700 transition-all duration-500`}
	>
		<div class="container mb-20 flex flex-row items-center gap-2 px-4">
			<div
				class={`${isSceneActive ? '-translate-y-[250%]' : '-translate-y-[0px]'} z-20 flex flex-col items-start gap-2 transition-transform duration-500`}
			>
				<div class="flex flex-col items-start">
					<h1 class="text-7xl font-bold">{title}</h1>
					<h1 class="text-7xl font-semibold">web developper</h1>
				</div>
				<p class="text-wrap text-xl">
					front-end specialized web developer. Svelte, Vue.js, Javascript, HTML, CSS.
				</p>
				<button
					on:click={toggleScene}
					class="text-md bg-background-light dark:bg-background-dark mt-4 rounded-lg border-2 border-slate-800 px-4 py-2 font-semibold text-slate-800"
				>
					See my work
				</button>
			</div>
			<div class="z-10 h-fit min-w-[50%]">
				<div
					class={`${isSceneActive ? 'max-h-[100vh]' : 'max-h-[800px]'} absolute right-0 top-0 z-0 h-full w-full overflow-hidden rounded-lg border-gray-300 transition-all duration-500`}
				>
					<RollingCube bind:this={sceneRef} />
				</div>
			</div>
		</div>
	</section>

	<section
		class="bg-light-pattern relative flex h-screen w-full justify-center text-black dark:bg-background-dark dark:bg-none"
	>
		<div
			class={`container absolute z-20 w-full -translate-y-[70px] px-4 transition-transform duration-500`}
		>
			<div class="">
				<BentoGrid />
			</div>
		</div>
	</section>
</main>
