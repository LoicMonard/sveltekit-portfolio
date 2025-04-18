<script lang="ts">
	import BentoGrid from '$lib/components/BentoGrid.svelte';

	let title = 'loïc monard';
</script>

<main class="w-full h-full">
	<section
		class="w-full h-[700px] flex border-b-2 border-accent-beige justify-center pt-32 bg-pastel-yellow text-slate-700"
	>
		<div class="container my-16 px-4 flex gap-2 flex-row items-center">
			<div class="flex flex-col gap-2 items-start">
				<div class="flex flex-col items-start">
					<h1 class="text-7xl font-bold">{title}</h1>
					<h1 class="text-7xl font-semibold">web developper</h1>
				</div>
				<p class="text-xl text-wrap">
					front-end specialized web developer. Svelte, Vue.js, Javascript, HTML, CSS.
				</p>
			</div>
			<div class="min-w-[50%]"></div>
		</div>
	</section>

	<section
		class="w-full h-screen flex justify-center relative bg-[repeating-linear-gradient(90deg,#f9f9f6_0px,#f9f9f6_20px,#fcfcfa_20px,#fcfcfa_40px)] text-black"
	>
		<div class="container absolute w-full top-[-70px] px-4">
			<div class="">
				<BentoGrid />
			</div>
		</div>
	</section>
</main>
