<script lang="ts">
	import BentoGrid from '$lib/components/BentoGrid.svelte';
	import RollingCube from '$lib/components/RollingCube.svelte';

	let title = 'loïc monard';
</script>

<main class="h-full w-full">
	<section
		class="flex h-[700px] w-full justify-center border-b-2 border-accent-beige bg-pastel-yellow pt-32 text-slate-700"
	>
		<div class="container my-16 flex flex-row items-center gap-2 px-4">
			<div class="flex flex-col items-start gap-2">
				<div class="flex flex-col items-start">
					<h1 class="text-7xl font-bold">{title}</h1>
					<h1 class="text-7xl font-semibold">web developper</h1>
				</div>
				<p class="text-wrap text-xl">
					front-end specialized web developer. Svelte, Vue.js, Javascript, HTML, CSS.
				</p>
			</div>
			<div class="min-w-[50%]">
				<div class="w-full h-[500px] border border-gray-300 rounded-lg overflow-hidden">
					<RollingCube />
				</div>
			</div>
		</div>
	</section>

	<section
		class="relative flex h-screen w-full justify-center bg-[repeating-linear-gradient(90deg,#f9f9f6_0px,#f9f9f6_20px,#fcfcfa_20px,#fcfcfa_40px)] text-black"
	>
		<div class="container absolute top-[-70px] w-full px-4">
			<div class="">
				<BentoGrid />
			</div>
		</div>
	</section>
</main>
