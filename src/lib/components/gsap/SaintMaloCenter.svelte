<script lang="ts">
	import { onMount } from 'svelte';
	import SimpleTree from '$lib/components/gsap/SimpleTree.svelte';
	import Tree from '$lib/components/gsap/Tree.svelte';

	let gsap: any;
	let ScrollTrigger: any;

	onMount(async () => {
		const gsapMod = await import('gsap');
		gsap = gsapMod.default || gsapMod.gsap;
		ScrollTrigger = (await import('gsap/ScrollTrigger')).default;

		gsap.registerPlugin(ScrollTrigger);

		initScene();
	});

	const initScene = () => {
		const scrollScene = document.getElementById('scrollScene');

		const leftTreesGroup = document.getElementById('leftTreesGroup');
		const rightTreesGroup = document.getElementById('rightTreesGroup');

		const secondLeftTree = document.querySelector('#leftTreesGroup .leftTree:nth-child(2)');
		// gsap.set(secondLeftTree, { position: 'absolute' })

		gsap.to('#treesGroup', {
			y: '+=2vh',
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3000,
				end: 3200,
				scrub: 1
			}
		});

		// Animation pour l'arbre de gauche qui part vers la gauche
		gsap.to('#leftTreesGroup .leftTree:nth-child(1)', {
			transformOrigin: 'right bottom',
			x: '-60vw', // Translation négative
			width: '30vw',
			ease: 'none', // Un 'ease' linéaire est souvent préférable avec scrub
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3000,
				end: 3200,
				scrub: 1
			}
		});

		// Animation pour l'arbre de gauche qui part vers la gauche
		gsap.to('#leftTreesGroup .leftTree:nth-child(2)', {
			transformOrigin: 'right bottom',
			opacity: 1,
			x: '-50vw', // Translation négative
			y: '-=5vh',
			width: '25vw',
			ease: 'none', // Un 'ease' linéaire est souvent préférable avec scrub
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3100,
				end: 3200,
				scrub: 1
			}
		});

		// Animation pour l'arbre de droite qui part vers la droite
		gsap.to('#rightTreesGroup .rightTree:nth-child(1)', {
			transformOrigin: 'right bottom',
			x: '35vw', // Translation négative
			width: '30vw',
			ease: 'none', // Un 'ease' linéaire est souvent préférable avec scrub
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3000,
				end: 3200,
				scrub: 1
			}
		});

		gsap.to('#rightTreesGroup .rightTree:nth-child(2)', {
			transformOrigin: 'right bottom',
			opacity: 1,
			x: '25vw', // Translation négative
			y: '-=5vh',
			width: '25vw',
			ease: 'none', // Un 'ease' linéaire est souvent préférable avec scrub
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3100,
				end: 3200,
				scrub: 1
			}
		});
	};
</script>

<div id="treesGroup" class="flex h-full w-full flex-row">
	<div id="leftTreesGroup" class="relative h-full w-full">
		<div class="leftTree absolute bottom-0 left-0 z-20 h-auto w-full">
			<SimpleTree />
		</div>
		<div class="leftTree absolute bottom-0 left-0 -z-20 h-auto w-full opacity-0">
			<SimpleTree />
		</div>
	</div>
	<div class="w-full">
		<Tree />
	</div>
	<div id="rightTreesGroup" class="relative h-full w-full">
		<div class="rightTree absolute bottom-0 left-0 z-20 h-auto w-full">
			<SimpleTree />
		</div>
		<div class="rightTree absolute bottom-0 left-0 -z-10 h-auto w-full opacity-0">
			<SimpleTree />
		</div>
	</div>
</div>
