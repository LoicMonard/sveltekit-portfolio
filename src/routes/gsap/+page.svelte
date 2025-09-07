<script lang="ts">
	import { onMount } from 'svelte';
	import Grid from '$lib/components/gsap/Grid.svelte';
	import PaperPlane from '$lib/components/gsap/PaperPlane.svelte';
	import PaperPlane2 from '$lib/components/gsap/PaperPlane2.svelte';
	import PaperPlaneMotionPath from '$lib/components/gsap/PaperPlaneMotionPath.svelte';
	import SaintMalo from '$lib/components/gsap/SaintMalo.svelte';
	import Tree from '$lib/components/gsap/Tree.svelte';
	import ScrollDown from '$lib/components/gsap/ScrollDown.svelte';
	import ThreeWind from '$lib/components/gsap/ThreeWind.svelte';
	import SingleWind from '$lib/components/gsap/SingleWind.svelte';
	import Cloud from '$lib/components/gsap/Cloud.svelte';
	import Sun from '$lib/components/gsap/Sun.svelte';
	import SunPath from '$lib/components/gsap/SunPath.svelte';
	import PaperPlane3 from '$lib/components/gsap/PaperPlane3.svelte';
	import SaintMaloLeft from '$lib/components/gsap/SaintMaloLeft.svelte';
	import SaintMaloRight from '$lib/components/gsap/SaintMaloRight.svelte';
	import SaintMaloCenter from '$lib/components/gsap/SaintMaloCenter.svelte';

	let gsap: any;
	let ScrollTrigger: any;
	let SplitText: any;
	let Draggable: any;
	let timelineDuration: number = 5000;
	let scrollTop: number = 0;

	let scrollScene: HTMLElement;

	function handleScroll() {
		scrollTop = scrollScene.scrollTop;
		// console.log(scrollY);
	}

	onMount(async () => {
		scrollScene.addEventListener('scroll', handleScroll);

		const gsapMod = await import('gsap');
		gsap = gsapMod.default || gsapMod.gsap;

		ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
		SplitText = (await import('gsap/SplitText')).SplitText;
		Draggable = (await import('gsap/Draggable')).default;
		const { default: DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
		const { default: MotionPathPlugin } = await import('gsap/MotionPathPlugin');
		const { default: MorphSVGPlugin } = await import('gsap/MorphSVGPlugin');

		gsap.registerPlugin(
			DrawSVGPlugin,
			ScrollTrigger,
			MotionPathPlugin,
			MorphSVGPlugin,
			SplitText,
			Draggable
		);
		initScene();
	});

	const initScene = () => {
		initScrollDownAnimation();
		initScrollDownScrollTrigger();
		initGridScrollTrigger();
	};

	const initScrollDownAnimation = () => {
		gsap.set('#scrollDownIcon .path1', { drawSVG: '0% 10%', y: 0 });
		gsap.set('#scrollDownIcon .path2', { drawSVG: '50% 50%', y: -0.5 });

		const seq = gsap.timeline({
			paused: true,
			defaults: { ease: 'none' }
		});

		seq
			.to('#scrollDownIcon .path1', { drawSVG: '0% 100%', y: 1.5, duration: 0.8 })
			.fromTo(
				'#scrollDownIcon .path2',
				{ opacity: 0, y: 0 },
				{ opacity: 1, y: 1.5, duration: 0.01 }
			)
			.to('#scrollDownIcon .path2', { drawSVG: '0% 100%', duration: 0.5 });

		gsap.to(seq, {
			progress: 1,
			duration: seq.duration(),
			ease: 'power1.inOut',
			repeat: -1,
			yoyo: true,
			repeatDelay: 0.35,
			delay: 1
		});
	};

	const initScrollDownScrollTrigger = () => {
		gsap.to('#scrollDownScene > div', {
			scale: 1.6,
			opacity: 0,
			duration: 0.5,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: '#scrollDownScene',
				scroller: scrollScene,
				start: 0,
				end: 100,
				pin: true,
				anticipatePin: 1,
				scrub: 1
			}
		});
	};

	const initGridScrollTrigger = () => {
		const cols = gsap.utils.toArray('#gridSvg #cols path');
		const rows = gsap.utils.toArray('#gridSvg #rows path');

		gsap.set([...cols, ...rows], { drawSVG: '0% 0%' });
		gsap.set('#gridScene', { visibility: 'visible' });

		const master = ScrollTrigger.create({
			trigger: '#gridScene',
			scroller: scrollScene,
			start: 'top top',
			end: timelineDuration,
			pin: true,
			anticipatePin: 1
		});

		gsap.to(cols, {
			drawSVG: '0% 100%',
			stagger: 0.1,
			immediateRender: false,
			ease: 'none',
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 'top top',
				end: '+=500',
				scrub: 1
			}
		});

		gsap.to(rows, {
			drawSVG: '0% 100%',
			stagger: 0.1,
			immediateRender: false,
			ease: 'none',
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 'top top',
				end: '+=500',
				scrub: 1
			}
		});

		gsap.set('#planeWrapper', {
			scale: 0.5
		});

		const planeSvgPath = '#paperPlaneMotionPath path';

		gsap.to('#planeWrapper', {
			visibility: 'visible',
			scale: 1,
			motionPath: {
				path: planeSvgPath,
				align: planeSvgPath,
				autoRotate: true,
				alignOrigin: [0.5, 0.5],
				start: 1,
				end: 0
			},
			scrollTrigger: {
				scrub: 2,
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 400,
				end: 1000
			}
		});

		gsap.set(planeSvgPath, { drawSVG: '100% 100%' });

		gsap.to(planeSvgPath, {
			ease: 'none',
			keyframes: [
				{ drawSVG: '100% 90%', duration: 0.1 },
				{ drawSVG: '10% 0%', duration: 1.0 },
				{ drawSVG: '0% 0%', duration: 0.1 }
			],
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 0,
				end: 800,
				scrub: 1
			}
		});

		const windSvgPaths = gsap.utils.toArray<SVGPathElement>('#windSvg path');

		gsap.set(windSvgPaths, { drawSVG: '100% 100%' });

		gsap.to(windSvgPaths, {
			ease: 'none',
			stagger: 0.5,
			keyframes: [
				{ drawSVG: '100% 90%', duration: 0.1 },
				{ drawSVG: '10% 0%', duration: 1.0 },
				{ drawSVG: '0% 0%', duration: 0.1 }
			],
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2100,
				end: 2300,
				scrub: 1
			}
		});

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 1100,
				end: 1500,
				scrub: 2
			}
		});

		tl.to('#planeSvgContainer', { x: 200, duration: 1 })
			.to('#planeSvgContainer', { x: 200, duration: 2 })
			.to('#planeSvgContainer', { x: 0, duration: 1 }); // segment 2

		let floatTween: gsap.core.Tween | null = null;

		const startFloat = () => {
			if (!floatTween) {
				floatTween = gsap.to('#planeSvg', {
					y: '+=12',
					rotate: '+=2',
					duration: 1.6,
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
			}
		};

		const stopFloat = () => {
			if (floatTween) {
				floatTween.kill();
				floatTween = null;
			}
		};

		ScrollTrigger.create({
			trigger: '#gridScene',
			scroller: scrollScene,
			start: 1000,
			end: timelineDuration,
			onEnter: startFloat,
			onLeaveBack: stopFloat
		});

		const cloud1Svg = '#cloud1Svg';
		gsap.set(cloud1Svg, { x: '100vw' });

		const cloud3Svg = '#cloud3Svg';
		gsap.set(cloud3Svg, { x: '50vw' });
		gsap.to(cloud3Svg, {
			scale: 20,
			duration: 2,
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2500,
				end: 2700,
				scrub: 3
			}
		});

		gsap.to(cloud1Svg, {
			x: '-=100vw',
			duration: 2,
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2100,
				end: timelineDuration,
				scrub: 3
			}
		});

		const cloud2Svg = '#cloud2Svg';
		gsap.set(cloud2Svg, { x: '100vw', y: '-10vh' });

		gsap.to(cloud2Svg, {
			x: '-=120vw',
			duration: 2,
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2600,
				end: 3000,
				scrub: 3
			}
		});

		const root = '#treeSvg';

		// tout invisible au départ
		gsap.set(`${root} path`, { drawSVG: 0 });

		const tlTree = gsap.timeline({
			defaults: { ease: 'none', duration: 0.8 },
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 200,
				end: 800, // augmente si tu veux plus d'espace de scroll
				scrub: 2
				// markers: true
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

		const wind2SvgPaths = gsap.utils.toArray<SVGPathElement>('#wind2Svg path');
		gsap.set(wind2SvgPaths, { drawSVG: '100% 100%' });

		let windTween: gsap.core.Tween | null = null;

		const startWind = () => {
			if (!windTween) {
				windTween = gsap.to(wind2SvgPaths, {
					ease: 'none',
					stagger: 0.3,
					keyframes: [
						{ drawSVG: '100% 60%', duration: 0.2 },
						{ drawSVG: '40% 0%', duration: 0.2 },
						{ drawSVG: '0% 0%', duration: 0.2 }
					],
					repeat: -1
				});
			}
		};

		const stopWind = () => {
			if (windTween) {
				windTween.kill();
				windTween = null;
				gsap.set(wind2SvgPaths, { drawSVG: '100% 100%' });
			}
		};

		ScrollTrigger.create({
			trigger: '#gridScene',
			scroller: scrollScene,
			start: 2300,
			end: timelineDuration,
			onEnter: startWind,
			onLeaveBack: stopWind
		});

		const saintMalo = document.querySelector('#saintMaloContainer');
		const saintMaloLeftSvg = document.querySelector('#saintMaloLeftSvg');
		const saintMaloRightSvg = document.querySelector('#saintMaloRightSvg');
		gsap.set(saintMalo, { x: '0vw', force3D: true, transformOrigin: 'left center' });

		ScrollTrigger.create({
			trigger: '#gridScene',
			scroller: scrollScene,
			start: 2200,
			end: 2200.1,
			onEnter: () => {
				const centerRect = document.getElementById('saintMaloCenterSvg')?.getBoundingClientRect();

				if (centerRect) {
					const offsetX = centerRect.left + centerRect.width / 2 - window.innerWidth / 2;

					gsap.to(saintMalo, {
						x: -offsetX,
						ease: 'none',
						snap: { x: 1 },
						scrollTrigger: {
							trigger: '#gridScene',
							scroller: scrollScene,
							start: 2300,
							end: 3000,
							scrub: 2
						}
					});

					const movementX = (window.innerWidth - centerRect.width) / 2;

					gsap.to(saintMaloLeftSvg, {
						x: -movementX,
						ease: 'none',
						scrollTrigger: {
							trigger: '#gridScene',
							scroller: scrollScene,
							start: 3000,
							end: 3200,
							scrub: 1
						}
					});

					gsap.to(saintMaloRightSvg, {
						x: movementX,
						ease: 'none',
						scrollTrigger: {
							trigger: '#gridScene',
							scroller: scrollScene,
							start: 3000,
							end: 3200,
							scrub: 1
						}
					});
				}
			}
		});

		gsap.fromTo(
			saintMalo,
			{
				bottom: '-40vh',
				scale: 0.5,
				transformOrigin: 'left center'
			},
			{
				bottom: '10vh',
				scale: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: '#gridScene',
					scroller: scrollScene,
					start: 300,
					end: 1000,
					scrub: 3
				}
			}
		);

		gsap.to('#grandeRouePath', {
			rotate: 360,
			transformOrigin: '50% 50%',
			ease: 'none',
			duration: 30,
			repeat: -1
		});

		const sunPath = '#sunPathSvg path';
		gsap.set(sunPath, { drawSVG: '0% 0%' });
		gsap.to('#sunSvgContainer', {
			zIndex: -1,
			motionPath: {
				path: sunPath,
				align: sunPath,
				autoRotate: true,
				alignOrigin: [0.5, 0.5],
				start: 1,
				end: 0
			},
			scrollTrigger: {
				scrub: 2,
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2000,
				end: timelineDuration
			}
		});

		const fromPlanePaths = gsap.utils.toArray<SVGPathElement>('#planeSvg path');
		const toPlanePaths = gsap.utils.toArray<SVGPathElement>('#plane2Svg path');

		const morphPlaneTl = gsap.timeline({
			defaults: {
				ease: 'power1.inOut'
			},
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2000,
				end: 2200,
				scrub: 2
			}
		});

		fromPlanePaths.forEach((p, i) => {
			morphPlaneTl.to(
				p,
				{
					morphSVG: toPlanePaths[i]
				},
				0
			);
		});

		const fromPlanePaths2 = gsap.utils.toArray<SVGPathElement>('#planeSvg path');
		const toPlanePaths3 = gsap.utils.toArray<SVGPathElement>('#plane3Svg path');

		const morphPlaneTl2 = gsap.timeline({
			defaults: {
				ease: 'power1.inOut'
			},
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2400,
				end: 2600,
				scrub: 2
			}
		});

		fromPlanePaths2.forEach((p, i) => {
			morphPlaneTl2.to(
				p,
				{
					morphSVG: toPlanePaths3[i]
				},
				0
			);
		});

		let welcomeSplit = SplitText.create('#textContainer h1', {
			type: 'chars, words'
		});

		gsap.set('#textContainer', { opacity: 0 });

		const textTl = gsap.timeline({
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 1100,
				end: 1500,
				scrub: 2,
				onEnter: () => {
					gsap.to('#textContainer', { opacity: 1, duration: 0.5 });
				},
				onLeaveBack: () => {
					gsap.to('#textContainer', { opacity: 0, duration: 0.5 });
				}
			}
		});

		textTl
			.from(welcomeSplit.chars, {
				x: 400,
				opacity: 0,
				stagger: 0.03,
				ease: 'back.out(1.2)',
				duration: 1
			})
			.to(
				welcomeSplit.chars.reverse(),
				{
					opacity: 0,
					x: 450,
					stagger: 0.03,
					ease: 'back.in(1.2)',
					duration: 1
				},
				'+=0.5'
			); // petit délai avant le "disappear"

		// Draggable.create('#planeSvg', {
		// 	type: 'x, y'
		// });
	};
</script>

<main
	bind:this={scrollScene}
	id="scrollScene"
	class="transition-duration-[0s] h-screen w-screen overflow-auto overflow-x-hidden bg-slate-50 transition-none"
>
	<div id="bluebox" class="border-radius absolute left-[20px] h-12 w-12 text-lg font-bold">
		{scrollTop}
	</div>
	<div class="h-full w-full flex-col items-center justify-center">
		<section id="scrollDownScene" class="h-[100px] w-screen shrink-0 items-center justify-center">
			<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
				<div class="w-12">
					<ScrollDown />
				</div>
				<p class="whitespace-nowrap text-center font-mono text-sm font-bold text-gray-500">
					scroll down
				</p>
			</div>
		</section>
		<div id="treeContainer" class="fixed top-0 flex h-screen w-screen items-center justify-center">
			<div class="w-12">
				<Tree />
			</div>
		</div>
		<section
			id="gridScene"
			style="transition-duration: 0s;"
			class="transition-duration-[0s] invisible z-50 h-screen max-h-[100vh] w-screen shrink-0 overflow-hidden transition-none"
		>
			<Grid />
			<div id="planeContainer" class="pointer-events-none absolute top-0 z-20 h-screen w-full">
				<div id="planeSvgContainer" class="w-36">
					<div id="planeWrapper">
						<div class="relative">
							<div
								id="textContainer"
								class="overfelow-hidden absolute right-40 w-screen -translate-y-1/4 text-end"
							>
								<h1 class="text-[10vh] font-bold text-gray-700">welcome</h1>
							</div>
							<div class="absolute left-[-400px] top-4 w-96">
								<ThreeWind />
							</div>
							<div class="w-36">
								<PaperPlane />
								<div class="hidden">
									<PaperPlane2 />
								</div>
								<div class="hidden">
									<PaperPlane3 />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="paperPlaneMotionPathContainer" class="absolute bottom-1/2 left-[-5vw] w-[55vw]">
					<PaperPlaneMotionPath />
				</div>
			</div>
			<div id="fxContainer" class="absolute top-0 h-full w-full">
				<div class="w-[40%] translate-x-[20vw] translate-y-[30vh]">
					<SingleWind />
				</div>
			</div>
			<div id="cloudsContainer" class="absolute top-[0vh] z-20 flex h-[20vh] w-full items-end">
				<div class="z-20 w-36">
					<Cloud id={'cloud1Svg'} />
					<!-- <div class="z-20 w-2">
						<Cloud id={'cloud3Svg'} />
					</div> -->
				</div>
				<div class="w-48">
					<Cloud id={'cloud2Svg'} />
				</div>
			</div>
			<div
				id="saintMaloContainer"
				class="absolute bottom-[20vh] z-0 flex aspect-[2781/194] h-[60vh] transform-gpu flex-row items-end will-change-transform"
			>
				<!-- LEFT -->
				<div class="aspect-[890/90] w-full basis-[32.41%]">
					<SaintMaloLeft />
				</div>

				<!-- CENTER -->
				<div class="aspect-[42/29] w-full basis-[1.53%]">
					<SaintMaloCenter />
				</div>

				<!-- RIGHT -->
				<div class="aspect-[1814/194] w-full basis-[66.06%]">
					<SaintMaloRight />
				</div>
			</div>

			<div id="sunContainer" class="absolute top-[10vh] z-10 h-[30vh] w-full will-change-transform">
				<div class="z-10 w-24" id="sunSvgContainer">
					<Sun />
				</div>
				<div class="z-10 w-[120vw] translate-x-[-10vw]">
					<SunPath />
				</div>
			</div>
		</section>
	</div>
</main>
