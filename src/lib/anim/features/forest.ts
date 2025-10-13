import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';
import { makePetalsEngine } from './petalsFactory';

type TreeDurations = {
	resize: number;
	trunks: number;
	leaves: number;
};

type KeywordsOpts = {
	offset?: number;
	each?: number;
	stretch?: number;
	wordStagger?: number;
};

const config = {
	root: '#treeSvg',
	container: '#treeContainer',
	keywordsSel: '#forestKeywords',
	targetWidth: '90vw',
	targetHeight: '80vh',
	leafDur: 0.6,
	overlap: 0.5
} as const;

export const createTree = (ctx: FeatureCtx, range: Range, durations: TreeDurations): void => {
	const { gsap, tl } = ctx;
	const start = range.start;

	gsap.set(`${config.root} path`, { drawSVG: 0 });

	// Capturer la taille initiale du container
	const container = document.querySelector<HTMLElement>(config.container);
	const rootSvg = document.querySelector<SVGElement>(config.root);
	const initialSize = {
		width: container?.offsetWidth ?? 0,
		height: container?.offsetHeight ?? 0
	};
	const initialStrokeWidth = rootSvg ? Number(gsap.getProperty(rootSvg, 'strokeWidth')) || 1 : 1;

	const getTarget = (): number => {
		const el = document.getElementById('portfolioScroller');
		const h = el?.getBoundingClientRect().height ?? 0;
		return h * 0.8;
	};

	const makeResizeTween = (): GSAPTween =>
		gsap
			.to(config.container, {
				height: () => getTarget(),
				width: () => getTarget(),
				ease: 'power2.inOut',
				duration: 1,
				immediateRender: false,
				overwrite: 'auto'
			})
			.eventCallback('onStart', function (this: GSAPTween) {
				this.invalidate();
			});

	const resizeTl = gsap.timeline().add(makeResizeTween(), 0);
	resizeTl.totalDuration(durations.resize);

	resizeTl.totalDuration(durations.resize);

	const strokeTl = gsap.timeline().to(config.root, {
		strokeWidth: 3,
		ease: 'none',
		duration: 1
	});
	strokeTl.totalDuration(durations.resize);

	const trunksTl = gsap
		.timeline({ defaults: { ease: 'none', duration: 0.8 } })
		.to(`${config.root} .tronc1 path`, { drawSVG: '0% 100%' })
		.to(`${config.root} .tronc2 path`, { drawSVG: '0% 100%' }, '>')
		.to(`${config.root} .tronc3 path`, { drawSVG: '0% 100%' }, '>')
		.to(`${config.root} .tronc4 > path`, { drawSVG: '0% 100%' }, '>');
	trunksTl.totalDuration(durations.trunks);

	const groups = gsap.utils.toArray<SVGGElement>(`${config.root} g[class^="feuille4-"]`);
	gsap.utils.shuffle(groups);

	const leavesTl = gsap.timeline({ defaults: { ease: 'none' } });
	const step = config.leafDur * (1 - config.overlap);
	groups.forEach((g, i) => {
		leavesTl.to(
			g.querySelectorAll('path'),
			{ drawSVG: '0% 100%', duration: config.leafDur },
			i === 0 ? '>+0.1' : `<+${step}`
		);
	});
	leavesTl.totalDuration(durations.leaves);

	const parallelSpan = Math.max(durations.resize, durations.trunks);
	const featureTl = gsap
		.timeline()
		.add(resizeTl, 0)
		.add(strokeTl, 0)
		.add(trunksTl, 0)
		.add(leavesTl, parallelSpan);

	tl.add(featureTl, start);

	const shrinkDuration = 300;
	const shrinkOffset = 400;

	const shrinkTl = gsap.timeline();

	shrinkTl.to(
		config.container,
		{
			width: initialSize.width,
			height: initialSize.height,
			ease: 'power2.inOut',
			duration: 1
		},
		0
	);

	shrinkTl.to(
		config.root,
		{
			strokeWidth: initialStrokeWidth,
			ease: 'power2.inOut',
			duration: 1
		},
		0
	);

	shrinkTl.totalDuration(shrinkDuration);

	const exitStart = start + parallelSpan + durations.leaves + shrinkOffset;
	tl.add(shrinkTl, exitStart);
};

const createKeywords = (ctx: FeatureCtx, range: Range, opts: KeywordsOpts = {}): void => {
	const { gsap, tl, SplitText } = ctx;
	const offset = opts.offset ?? 0;
	const each = opts.each ?? 0.05;
	const stretch = opts.stretch ?? 300;
	const wordStagger = 200;

	const items = gsap.utils.toArray<HTMLElement>(`${config.keywordsSel} .keyword`);
	if (!items.length) return;

	const keywordsTl = gsap.timeline();

	items.forEach((el, i) => {
		const split = new SplitText(el, { type: 'chars' });

		gsap.set(split.chars, { autoAlpha: 0, x: '200%', willChange: 'transform' });

		const textTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

		textTl.set(el, { visibility: 'visible' }, 0);

		textTl.fromTo(
			split.chars,
			{ autoAlpha: 0, x: '200%' },
			{ autoAlpha: 1, x: '0%', duration: 0.6, stagger: each, immediateRender: false },
			0
		);

		const exitDelay = 2;
		textTl.to(
			split.chars,
			{ autoAlpha: 0, x: '-200%', duration: 0.6, stagger: each },
			`+=${exitDelay}`
		);

		textTl.totalDuration(stretch);

		keywordsTl.add(textTl, i * wordStagger);
	});

	tl.add(keywordsTl, range.start + offset);
};

const createPetalScene = (ctx: FeatureCtx, range: Range, d: TreeDurations) => {
	const { gsap, tl, ScrollTrigger } = ctx;
	const approxEnd = range.start + Math.max(d.resize, d.trunks) + d.leaves + 400;
	const forestEnd = (range as any).end ?? approxEnd;

	const petals = makePetalsEngine({
		containerSel: '#petalsWrapper',
		count: 24,
		size: 20,
		speed: 90,
		driftVw: 10
	});

	if (ScrollTrigger) {
		ScrollTrigger.create({
			scroller: '#portfolioScroller',
			trigger: config.container,
			start: range.start,
			end: forestEnd,
			onEnter: () => {
				if (!petals.isAlive()) petals.start();
				petals.enableSpawning(true);
			},
			onEnterBack: () => {
				petals.enableSpawning(true);
			},
			onLeave: () => {
				petals.enableSpawning(false);
			},
			onLeaveBack: () => {
				petals.enableSpawning(false);
			}
		});
	} else {
		petals.start();
		petals.enableSpawning(true);
	}

	const parallelSpan = Math.max(d.resize, d.trunks);
	const featureTl = gsap.timeline().add(gsap.timeline().to({}, { duration: parallelSpan }), 0);
	tl.add(featureTl, range.start);
};

export const buildForestFeature = (ctx: FeatureCtx, range: Range): void => {
	const d = { resize: 300, trunks: 500, leaves: 700 } as const;
	createTree(ctx, range, d);

	const afterTree = Math.max(d.resize, d.trunks);
	createKeywords(ctx, range, { offset: afterTree, each: 0.06, stretch: 400 });

	createPetalScene(ctx, range, d);
};
