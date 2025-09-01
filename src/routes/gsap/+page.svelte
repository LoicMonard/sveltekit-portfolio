<script lang="ts">
	import { gsap } from 'gsap';
	import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import MotionPathPlugin from 'gsap/MotionPathPlugin';
	import { onMount } from 'svelte';
	import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
	import { SplitText } from 'gsap/all';
	import PaperPlane from '$lib/components/gsap/PaperPlane.svelte';
	import PaperPlane2 from '$lib/components/gsap/PaperPlane2.svelte';
	import PaperPlaneMotionPath from '$lib/components/gsap/PaperPlaneMotionPath.svelte';
	import SaintMalo from '$lib/components/gsap/SaintMalo.svelte';

	gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, MotionPathPlugin, MorphSVGPlugin, SplitText);

	let scrollScene: HTMLElement;

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
		const cols = gsap.utils.toArray<SVGPathElement>('#gridSvg #cols path');
		const rows = gsap.utils.toArray<SVGPathElement>('#gridSvg #rows path');

		gsap.set([...cols, ...rows], { drawSVG: '0% 0%' });
		gsap.set('#gridScene', { visibility: 'visible' });

		const master = ScrollTrigger.create({
			trigger: '#gridScene',
			scroller: scrollScene,
			start: 'top top',
			end: '+=5000',
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
			end: 5000,
			onEnter: startFloat,
			onLeaveBack: stopFloat
		});

		const cloud1Svg = '#cloud1Svg';
		gsap.set(cloud1Svg, { x: '100vw' });

		gsap.to(cloud1Svg, {
			x: '-=100vw',
			duration: 2,
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2100,
				end: 5000,
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
			end: 5000,
			onEnter: startWind,
			onLeaveBack: stopWind
		});

		const saintMalo = document.querySelector('#saintMaloContainer');
		gsap.set(saintMalo, { x: '100vw' });
		gsap.to(saintMalo, {
			x: '-=100%',
			scrollTrigger: {
				trigger: '#gridScene',
				scroller: scrollScene,
				start: 2300,
				end: 5000,
				scrub: 3
			}
		});

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
				end: 5000
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
					console.log('leave');
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
	};

	onMount(() => {
		initScene();
	});
</script>

<main
	bind:this={scrollScene}
	id="scrollScene"
	class="h-screen w-screen overflow-scroll overflow-x-hidden bg-slate-50"
>
	<div class="h-full w-full flex-col items-center justify-center">
		<section id="scrollDownScene" class="h-[100px] w-screen shrink-0 items-center justify-center">
			<div class="flex h-screen w-full flex-col items-center justify-center gap-4">
				<div class="w-12">
					<svg
						id="scrollDownIcon"
						viewBox="0 0 14 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 15V7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7V15C13 18.3137 10.3137 21 7 21C3.68629 21 1 18.3137 1 15Z"
							stroke="#54514C"
						/>
						<path class="path1" d="M7 7V12" stroke="#54514C" stroke-linecap="round" />
						<path
							class="path2"
							d="M5 10.5L6.29289 11.7929C6.68342 12.1834 7.31658 12.1834 7.70711 11.7929L9 10.5"
							stroke="#54514C"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<p class="whitespace-nowrap text-center font-mono text-sm font-bold text-gray-500">
					scroll down
				</p>
			</div>
		</section>
		<section
			id="gridScene"
			class="invisible h-screen max-h-[100vh] w-screen shrink-0 overflow-hidden"
		>
			<svg class="" id="gridSvg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<!-- Colonnes -->
				<g id="cols">
					<path
						d="M10 0 L10 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M20 0 L20 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M30 0 L30 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M40 0 L40 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M50 0 L50 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M60 0 L60 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M70 0 L70 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M80 0 L80 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M90 0 L90 100"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
				</g>

				<!-- Lignes -->
				<g id="rows">
					<path
						d="M0 10 L100 10"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 20 L100 20"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 30 L100 30"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 40 L100 40"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 50 L100 50"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 60 L100 60"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 70 L100 70"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 80 L100 80"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
					<path
						d="M0 90 L100 90"
						stroke="#CCD5E1"
						stroke-width="0.5"
						fill="none"
						vector-effect="non-scaling-stroke"
					/>
				</g>
			</svg>
			<div id="planeContainer" class="absolute top-0 z-20 h-screen w-full">
				<div id="planeSvgContainer" class="w-36">
					<div id="planeWrapper">
						<div class="relative">
							<div
								id="textContainer"
								class="absolute right-40 w-screen -translate-y-1/4 overfelow-hidden text-end"
							>
								<!-- <div class="absolute h-full w-[2px] bg-gray-700 right-0"></div> -->
								<h1 class="text-[10vh] font-bold text-gray-700">welcome</h1>
							</div>
							<div class="absolute left-[-400px] top-4 w-96">
								<svg
									id="wind2Svg"
									viewBox="0 0 146 25"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M11 4C25 2.16667 59.4 -0.799997 85 2C110.6 4.8 135 3.16667 144 2"
										stroke="#CAD5E2"
										stroke-linecap="round"
									/>
									<path
										d="M12 24C26 22.1667 60.4 19.2 86 22C111.6 24.8 136 23.1667 145 22"
										stroke="#CAD5E2"
										stroke-linecap="round"
									/>
									<path
										d="M1 15C15 13.1667 49.4 10.2 75 13C100.6 15.8 125 14.1667 134 13"
										stroke="#CAD5E2"
										stroke-linecap="round"
									/>
								</svg>
							</div>
							<div class="w-36">
								<PaperPlane />
								<div class="hidden">
									<PaperPlane2 />
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
					<svg id="windSvg" viewBox="0 0 789 287" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							vector-effect="non-scaling-stroke"
							d="M0.5 269C51.1667 256.333 202.3 238.6 401.5 269C600.7 299.4 742.167 281.667 788 269"
							stroke="#54514C"
							stroke-linecap="round"
						/>
						<path
							vector-effect="non-scaling-stroke"
							d="M26 87C80 80 212.4 70.2 310 87C407.6 103.8 503.667 94 539.5 87C560.5 81.8333 604.8 75.9 604 43.5C603.856 37.6861 602.637 32.1931 600.664 27.0863C586.18 -10.3997 529.048 -6.18255 518.888 32.6991C516.342 42.4451 516.491 52.7307 521 62.5C535.4 93.7 591.333 88.5 613.5 87C650.5 84.4962 693.5 63 717 53.5"
							stroke="#54514C"
							stroke-linecap="round"
						/>
						<path
							vector-effect="non-scaling-stroke"
							d="M54.5 162C128.5 165 170 142.5 235 142.5C254.755 142.5 275.712 144.905 294.994 148.428C341.274 156.882 388.229 169.96 435.275 170.273C462.041 170.452 487.66 170.204 500.5 169"
							stroke="#54514C"
							stroke-linecap="round"
						/>
					</svg>
				</div>
			</div>
			<div id="cloudsContainer" class="absolute top-[15vh] z-20 h-[40vh] w-full">
				<div class="z-20 w-36">
					<svg id="cloud1Svg" viewBox="0 0 42 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M5 18C5 22.8 7.66667 24.6667 9 25H32.5L34.5 24.5L37 23.5L38.5 22.5L40 20L41 17V14.5L40 12L38 9.5L36 8L33.5 7H30.5L30 6.5L28.5 4.5L26.5 3L23.5 1.5L20 1L16.5 1.5L13.5 3L9 11C7.66667 11.3333 5 13.2 5 18Z"
							fill="#E0E7FF"
						/>
						<path
							d="M9.73353 11.2509C9.1718 11.1002 8.58896 11.0137 8 11C8.75762 6.47958 12.6475 2.80424 17 1.5C12.5 4.5 10.5 7.52502 10.5 11.5C9.95054 11.188 10.3549 11.4177 9.73353 11.2509Z"
							fill="#4C4C4C"
						/>
						<path
							d="M9.73353 25H8C4.13401 25 1 21.866 1 18C1 14.134 4.13401 11 8 11C8.58896 11.0137 9.1718 11.1002 9.73353 11.251C8.48902 11.834 6 14 6 18C6 22 8.48902 24.3333 9.73353 25Z"
							fill="#4C4C4C"
						/>
						<path
							d="M8 11C4.13401 11 1 14.134 1 18C1 21.866 4.13401 25 8 25H9.73353H20H32C36.9706 25 41 20.9706 41 16C41 11.0294 36.9706 7 32 7C31.478 7 30.9663 7.04445 30.4686 7.12976M8 11C8.05535 11 7.94496 10.9987 8 11ZM8 11C8.95136 5.32363 14.0533 1 20 1C24.495 1 28.4128 3.47152 30.4686 7.12976M8 11C8.58896 11.0137 9.1718 11.1002 9.73353 11.251C11.2706 11.6634 12.6496 12.5563 13.5635 13.7512M30.4686 7.12976C29.2024 7.34681 28.0266 7.81283 27 8.5C26.8479 8.60143 26.6772 8.72986 26.5 8.88177"
							stroke="black"
							stroke-width="1"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<div class="w-48">
					<svg id="cloud2Svg" viewBox="0 0 42 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M5 18C5 22.8 7.66667 24.6667 9 25H32.5L34.5 24.5L37 23.5L38.5 22.5L40 20L41 17V14.5L40 12L38 9.5L36 8L33.5 7H30.5L30 6.5L28.5 4.5L26.5 3L23.5 1.5L20 1L16.5 1.5L13.5 3L9 11C7.66667 11.3333 5 13.2 5 18Z"
							fill="#EEF2FF"
						/>
						<path
							d="M9.73353 11.2509C9.1718 11.1002 8.58896 11.0137 8 11C8.75762 6.47958 12.6475 2.80424 17 1.5C12.5 4.5 10.5 7.52502 10.5 11.5C9.95054 11.188 10.3549 11.4177 9.73353 11.2509Z"
							fill="#4C4C4C"
						/>
						<path
							d="M9.73353 25H8C4.13401 25 1 21.866 1 18C1 14.134 4.13401 11 8 11C8.58896 11.0137 9.1718 11.1002 9.73353 11.251C8.48902 11.834 6 14 6 18C6 22 8.48902 24.3333 9.73353 25Z"
							fill="#4C4C4C"
						/>
						<path
							d="M8 11C4.13401 11 1 14.134 1 18C1 21.866 4.13401 25 8 25H9.73353H20H32C36.9706 25 41 20.9706 41 16C41 11.0294 36.9706 7 32 7C31.478 7 30.9663 7.04445 30.4686 7.12976M8 11C8.05535 11 7.94496 10.9987 8 11ZM8 11C8.95136 5.32363 14.0533 1 20 1C24.495 1 28.4128 3.47152 30.4686 7.12976M8 11C8.58896 11.0137 9.1718 11.1002 9.73353 11.251C11.2706 11.6634 12.6496 12.5563 13.5635 13.7512M30.4686 7.12976C29.2024 7.34681 28.0266 7.81283 27 8.5C26.8479 8.60143 26.6772 8.72986 26.5 8.88177"
							stroke="black"
							stroke-width="1"
							stroke-linecap="round"
						/>
					</svg>
				</div>
			</div>
			<div
				id="saintMaloContainer"
				class="absolute bottom-[20vh] z-0 aspect-[2741/194] h-[40vh] will-change-transform"
			>
				<SaintMalo />
			</div>
			<div id="sunContainer" class="absolute top-[10vh] z-10 h-[30vh] w-full will-change-transform">
				<div class="z-10 w-24" id="sunSvgContainer">
					<svg id="sunSvg" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M49 25C49 38.2548 38.2548 49 25 49C11.7452 49 1 38.2548 1 25C1 11.7452 11.7452 1 25 1C38.2548 1 49 11.7452 49 25Z"
							fill="white"
							stroke="black"
							stroke-width="2"
						/>
					</svg>
				</div>
				<div class="z-10 w-[120vw] translate-x-[-10vw]">
					<svg
						id="sunPathSvg"
						viewBox="0 0 1218 185"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M1 184C166.733 45.6667 641.959 -148 1217 184" stroke="black" />
					</svg>
				</div>
			</div>
		</section>
	</div>
</main>
