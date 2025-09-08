<script lang="ts">
	import { onMount } from 'svelte';

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
		const root = '#treeSvg';

		// tout invisible au départ
		gsap.set(`${root} path`, { drawSVG: 0 });

		const tlTree = gsap.timeline({
			defaults: { ease: 'none', duration: 0.8 },
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3200,
				end: 3600, // augmente si tu veux plus d'espace de scroll
				scrub: 2
				// markers: true
			}
		});

		tlTree.to(root, {
			width: '20vw',
      y: '-20vh',
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 3000,
				end: 3200,
				scrub: 2
			}
		});

		// 🌳 troncs (attention à .tronc4 : on ne veut QUE ses enfants directs)
		tlTree
			.to(`${root} .tronc1 path`, { drawSVG: '0% 100%' })
			.to(`${root} .tronc2 path`, { drawSVG: '0% 100%' }, '>')
			.to(`${root} .tronc3 path`, { drawSVG: '0% 100%' }, '>')
			.to(`${root} .tronc4 > path`, { drawSVG: '0% 100%' }, '>'); // <-- clé ici

		// 🍃 feuilles : un vrai stagger par groupe (chaque g.feuille4-* contient 2 paths)
		const leafGroups = gsap.utils.toArray(`${root} g[class^="feuille4-"]`);
		gsap.utils.shuffle(leafGroups); // optionnel: ordre aléatoire

		// réglages de chevauchement
		const LEAF_DUR = 0.6; // durée d'une feuille
		const OVERLAP = 0.5; // 50% de chevauchement
		const STEP = LEAF_DUR * (1 - OVERLAP); // temps entre démarrages

		leafGroups.forEach((g, i) => {
			const paths = g.querySelectorAll('path'); // 2 paths par feuille → en même temps
			tlTree.to(
				paths,
				{ drawSVG: '0% 100%', duration: LEAF_DUR, ease: 'none' },
				i === 0 ? '>+0.1' : `<+${STEP}` // chevauchement: démarre avant que la précédente finisse
			);
		});
	};
</script>

<svg id="treeSvg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 800 792">
	<g class="Tree">
		<g class="troncs">
			<g class="tronc4">
				<g class="feuille4-24">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M400.007 7.543c-24.454 19.33-58.633 70.342.282 119.749 24.299-17.202 58.262-65.236-.282-119.749Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M400.007 7.543c22.774 45.052 9.677 98.604.282 119.749"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-24">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M466.25 151.862c30.454-6.644 83.546-37.493 52.275-107.737-29.383 4.8-80.974 33.067-52.275 107.737Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M466.25 151.862c-.704-50.476 34.557-92.856 52.275-107.737"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-23">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M461.123 281.743c24.526-8.691 65.266-39.798 32.014-94.699-23.832 7.052-63.6 35.863-32.014 94.699Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M461.123 281.743c-5.868-41.73 18.898-80.52 32.014-94.699"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-22">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M509.237 512.631c-.762 26.914 13.392 77.538 76.107 64.729 2.03-25.656-10.35-74.521-76.107-64.729Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M509.237 512.631c40.705 9.118 67.699 46.952 76.107 64.729"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-21">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M531.666 458.88c11.201 25.766 46.998 67.328 100.579 27.446-9.446-25.14-42.787-65.825-100.579-27.446Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M531.666 458.88c42.498-9.415 84.761 14.374 100.579 27.446"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-20">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M649.303 444.285c-6.622 26.655-3.544 80.189 61.747 81.086 7.611-25.127 5.918-76.52-61.747-81.086Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M649.303 444.285c38.58 17.954 57.239 61.538 61.747 81.086"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-19">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M680.845 407.552c11.546 29.613 50.213 78.149 112.515 35.384-9.59-28.829-45.519-76.267-112.515-35.384Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M680.845 407.552c48.451-8.803 95.198 19.922 112.515 35.384"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-18">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M678.813 359.352c26.319 17.821 85.707 35.82 112.71-34.757-24.263-18.286-80.774-36.936-112.71 34.757Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M678.813 359.352c34.886-34.756 89.676-37.653 112.71-34.757"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-17">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M589.039 317.174c20.695-3.868 57.045-23.059 36.883-68.872-19.944 2.692-55.243 20.235-36.883 68.872Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M589.039 317.174c.236-32.618 24.687-59.506 36.883-68.872"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-16">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M653.656 306.577c33.365 1.542 96.472-14.893 81.973-92.967-31.778-3.086-92.662 11.187-81.973 92.967Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M653.656 306.577c12.211-50.288 59.737-82.931 81.973-92.967"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-15">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M600.811 207.266c26.367 7.914 80.112 7.409 84.152-57.915-24.789-8.83-76.324-9.609-84.152 57.915Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M600.811 207.266c19.832-37.76 64.365-54.343 84.153-57.915"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-14">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M543.697 174.722c31.496-2.04 89.044-24.073 67.265-95.88-30.167.425-85.854 20.195-67.265 95.88Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M543.697 174.722c6.211-48.503 47.431-84.13 67.265-95.88"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-13">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M458 402.5c27.833-5.667 76.6-33.1 49-97.5-26.833 4-74.2 29.1-49 97.5Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M458 402.5c0-46 32.667-84.167 49-97.5"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-12">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M333.75 151.862c-30.454-6.644-83.546-37.493-52.275-107.737 29.383 4.8 80.974 33.067 52.275 107.737Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M333.75 151.862c.704-50.476-34.557-92.856-52.275-107.737"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-11">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M338.877 281.743c-24.526-8.691-65.266-39.798-32.014-94.699 23.832 7.052 63.6 35.863 32.014 94.699Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M338.877 281.743c5.868-41.73-18.898-80.52-32.014-94.699"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-10">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M290.763 512.631c.762 26.914-13.392 77.538-76.107 64.729-2.03-25.656 10.35-74.521 76.107-64.729Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M290.763 512.631c-40.705 9.118-67.699 46.952-76.107 64.729"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-9">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M268.334 458.88c-11.201 25.766-46.998 67.328-100.579 27.446 9.446-25.14 42.787-65.825 100.579-27.446Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M268.334 458.88c-42.498-9.415-84.761 14.374-100.579 27.446"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-8">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M150.697 444.285c6.622 26.655 3.544 80.189-61.747 81.086-7.611-25.127-5.918-76.52 61.747-81.086Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M150.697 444.285c-38.58 17.954-57.24 61.538-61.747 81.086"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-7">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M119.155 407.552c-11.546 29.613-50.213 78.149-112.515 35.384 9.59-28.829 45.52-76.267 112.515-35.384Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M119.155 407.552c-48.451-8.803-95.198 19.922-112.515 35.384"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-6">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M121.187 359.352c-26.319 17.821-85.707 35.82-112.71-34.757 24.263-18.286 80.774-36.936 112.71 34.757Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M121.187 359.352c-34.886-34.756-89.676-37.653-112.71-34.757"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-5">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M210.961 317.174c-20.695-3.868-57.045-23.059-36.883-68.872 19.944 2.692 55.243 20.235 36.883 68.872Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M210.961 317.174c-.236-32.618-24.687-59.506-36.883-68.872"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-4">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M146.344 306.577c-33.365 1.542-96.472-14.893-81.973-92.967 31.778-3.086 92.662 11.187 81.973 92.967Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M146.344 306.577c-12.211-50.288-59.737-82.931-81.973-92.967"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-3">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M199.189 207.266c-26.367 7.914-80.112 7.409-84.152-57.915 24.789-8.83 76.324-9.609 84.152 57.915Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M199.189 207.266c-19.832-37.76-64.365-54.343-84.153-57.915"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-2">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M256.303 174.722c-31.496-2.04-89.044-24.073-67.265-95.88 30.167.425 85.854 20.195 67.265 95.88Z"
						class="feuille4-2"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M256.303 174.722c-6.211-48.503-47.431-84.13-67.265-95.88"
						class="feuille4-1"
					/>
				</g>
				<g class="feuille4-1">
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="5"
						d="M342 402.5c-27.833-5.667-76.6-33.1-49-97.5 26.833 4 74.2 29.1 49 97.5Z"
						class="feuille4-1"
					/>
					<path
						stroke="#000"
						stroke-linecap="round"
						stroke-width="2"
						d="M342 402.5c0-46-32.667-84.167-49-97.5"
						class="feuille4-1"
					/>
				</g>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M551 282.5c-4.167-21.667-11.5-72.8-7.5-104"
					class="tronc4-8"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M551 282.5c-.167-11.667 9.1-42.5 47.5-72.5"
					class="tronc4-7"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M547.5 411.05c24-6.683 77.6-10.348 100 28.45"
					class="tronc4-6"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M547.5 411 C591.042 394.098 642.058 384.672 679 406"
					class="tronc4-5"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M249 282.5c4.167-21.667 11.5-72.8 7.5-104"
					class="tronc4-4"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M249 282.5c.167-11.667-9.1-42.5-47.5-72.5"
					class="tronc4-3"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M252.5 411.05c-24-6.683-77.6-10.348-100 28.45"
					class="tronc4-2"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M252.5 411.05 C208.958 394.098 157.942 384.672 121 406"
					class="tronc4-1"
				/>
			</g>
			<g class="tronc3">
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M437.048 494.5S445 481.5 445 450s13-47.5 13-47.5"
					class="tronc3-12"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M479.111 446.5C504 423.222 558.2 374.9 551 282.5"
					class="tronc3-11"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M479.111 446.5c16.104-10.886 40.739-24.686 68.389-35.451"
					class="tronc3-10"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M574 381s21.5-10.5 53-11.5 53-11.5 53-11.5"
					class="tronc3-9"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M574 381c14.167-6.667 50.4-31.1 82-75.5"
					class="tronc3-8"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M574 381c-.667-7 1-29.2 13-62"
					class="tronc3-7"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M362.952 494.5S355 481.5 355 450s-13-47.5-13-47.5"
					class="tronc3-6"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M320.889 446.5C296 423.222 241.8 374.9 249 282.5"
					class="tronc3-5"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M320.889 446.5c-16.104-10.886-40.739-24.686-68.389-35.451"
					class="tronc3-4"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M226 381s-21.5-10.5-53-11.5-53-11.5-53-11.5"
					class="tronc3-3"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M226 381c-14.167-6.667-50.4-31.1-82-75.5"
					class="tronc3-2"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M226 381c.667-7-1-29.2-13-62"
					class="tronc3-1"
				/>
			</g>
			<g class="tronc2">
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 377.5s8.69-16.254 16-26c5.846-7.794 11.263-15.016 17.5-22.5 15.001-18 26.5-43.5 26.5-43.5"
					class="tronc2-12"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 233V131"
					class="tronc2-11"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 233s6.63-14.908 12-23.5 9.875-12.328 17.5-19c8-7 14.885-11.873 22.5-19 7.615-7.127 14.5-19 14.5-19"
					class="tronc2-10"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M446.562 513.5C459 496 478.4 459.5 528 459.5"
					class="tronc2-9"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M446.562 513.5c9.938-5.5 35.438-11 57.438-3"
					class="tronc2-8"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 582.5c1.495-18.189 11.06-51.028 37.048-88 10.917-15.531 24.732-31.79 42.063-48 24.207-22.64 55.274-45.181 94.889-65.5"
					class="tronc2-7"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 377.5s-8.69-16.254-16-26c-5.846-7.794-11.263-15.016-17.5-22.5-15.001-18-26.5-43.5-26.5-43.5"
					class="tronc2-6"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 233V131"
					class="tronc2-5"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 233s-6.63-14.908-12-23.5-9.875-12.328-17.5-19c-8-7-14.885-11.873-22.5-19-7.615-7.127-14.5-19-14.5-19"
					class="tronc2-4"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M353.438 513.5C341 496 321.6 459.5 272 459.5"
					class="tronc2-3"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M353.438 513.5c-9.938-5.5-35.438-11-57.438-3"
					class="tronc2-2"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 582.5c-1.495-18.189-11.06-51.028-37.048-88-10.917-15.531-24.732-31.79-42.063-48-24.207-22.64-55.274-45.181-94.889-65.5"
					class="tronc2-1"
				/>
			</g>
			<g class="tronc1">
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M551 786.5h-57c-13.749-1.333-39-13-52.5-46-7.208-17.618-9.135-36.136-11.5-56.5-3.037-26.151-4-49.5-4-86.5 0-44.278 8.979-65.507 20.562-84"
					class="tronc1-3"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M400 582.5V233"
					class="tronc1-2"
				/>
				<path
					stroke="#000"
					stroke-linecap="round"
					stroke-width="5"
					d="M249 786.5h57c13.749-1.333 39-13 52.5-46 7.208-17.618 9.135-36.136 11.5-56.5 3.037-26.151 4-49.5 4-86.5 0-44.278-8.979-65.507-20.562-84"
					class="tronc1-1"
				/>
			</g>
		</g>
	</g>
</svg>
