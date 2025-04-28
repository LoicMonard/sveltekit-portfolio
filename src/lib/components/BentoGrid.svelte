<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	let containerRef: HTMLDivElement;
</script>

<div
	bind:this={containerRef}
	class="relative grid auto-rows-[250px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
>
	<Card id="yes" colSpan={1} rowSpan={1} {containerRef}>
		<div slot="preview">
			<div class="text-center"></div>
			<h2 class="text-2xl font-bold text-gray-800">Freelance Web Developer</h2>
			<p class="mt-2 text-gray-600">
				I specialize in creating modern, responsive, and user-friendly websites.
			</p>
			<a
				href="/contact"
				class="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-600"
			>
				Contact Me
			</a>
		</div>
	</Card>

	<Card id="test" title="Test" colSpan={2} rowSpan={1} {containerRef}>
		<div slot="preview">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum assumenda libero animi
			illum? Soluta fugiat nam recusandae illo animi provident.
		</div>
		<p>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo veritatis voluptas mollitia
			illum possimus totam tempora nostrum officia provident temporibus!
		</p>
	</Card>

	<Card id="anotherone" title="anotherone" colSpan={1} rowSpan={2} {containerRef}>
		<span slot="preview">Aperçu rapide ici.</span>
		<p>Sinon</p>
	</Card>

	<Card id="teste" title="Test" colSpan={2} rowSpan={1} {containerRef}>
		<span slot="preview">Aperçu rapide ici.</span>
		<p>Sinon</p>
	</Card>

	<Card id="skills" colSpan={1} rowSpan={1} {containerRef} cardClass="" expandable={false}>
		<span slot="preview">
			<div class="flex h-full items-center justify-center rounded-lg text-slate-600">
				<div class="grid h-full w-full grid-cols-2 grid-rows-2 gap-2">
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#f7dcae] bg-[#FAE4BD] transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/svelte_logo_200x200.png"
							alt="svelte logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(171,69,10,0.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#d5e8bc] bg-[#DCECCC] transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/vuejs_logo_200x200.png"
							alt="vuejs logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(62,99,79,.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#f6ed76] bg-pastel-yellow transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/js_logo_no_bg_200x200.png"
							alt="js logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(0,0,0,0.3)]"
						/>
					</div>
					<div
						class="flex items-center justify-center rounded-lg border-2 border-[#c7dedd] bg-[#D0E3E1] transition-transform duration-300 hover:scale-105"
					>
						<img
							src="/css3_logo_200x200.png"
							alt="css logo"
							class="h-3/4 max-h-[80px] object-contain drop-shadow-[-4px_2px_2px_rgba(0,0,0,0.2)]"
						/>
					</div>
				</div>
			</div>
		</span>
		<p>Sinon</p>
	</Card>
</div>
