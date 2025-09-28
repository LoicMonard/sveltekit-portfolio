import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type PlaneOpts = {
	windPathEl?: string;
	threeWindEl?: string;
	planeEl?: string;
	planeFloatEl?: string;
	plane1El?: string;
	plane2El?: string;
	plane3El?: string;
};

const DEFAULTS: Required<PlaneOpts> = {
	windPathEl: '#paperPlaneMotionPath path',
	threeWindEl: '#threeWind',
	planeEl: '#planeContainer',
	planeFloatEl: '#planeFloat',
	plane1El: '#plane1Svg',
	plane2El: '#plane2Svg',
	plane3El: '#plane3Svg'
} as const;

const drawWindPath = (ctx: FeatureCtx, range: Range, opts: PlaneOpts) => {
	const { gsap, tl } = ctx;
	const { windPathEl } = { ...DEFAULTS, ...opts };

	const windPathNode = document.querySelector<SVGPathElement>(windPathEl);

	const start = range.start;
	const end = range.start + 800;

	if (!windPathNode) {
		console.warn('[plane] no path found under #paperPlaneMotionPath');
		return;
	}

	gsap.set(windPathNode, { drawSVG: '100% 100%', opacity: 0 });

	gsap.to(windPathNode, {
		keyframes: [
			{ drawSVG: '100% 90%', duration: 0.1, opacity: 1 },
			{ drawSVG: '10% 0%', duration: 1.0 },
			{ drawSVG: '0% 0%', opacity: 0, duration: 0.1 }
		],
		ease: 'none',
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			scrub: 1
		}
	});
};

export const drawThreeWindPath = (ctx: FeatureCtx, range: Range, opts: PlaneOpts) => {
	const { gsap, tl } = ctx;
	const { threeWindEl } = { ...DEFAULTS, ...opts };

	const threeWindPathNodes = gsap.utils.toArray<SVGPathElement>(`${threeWindEl} path`);

	gsap.set(threeWindPathNodes, { drawSVG: '100% 100%', visibility: 'visible', opacity: 0 });

	const start = range.start + 1500;
	const end = range.end;

	let t: gsap.core.Tween;

	t = gsap.to(threeWindPathNodes, {
		keyframes: [
			{ drawSVG: '100% 60%', opacity: 1, duration: 0.2 },
			{ drawSVG: '40% 0%', opacity: 1, duration: 0.2 },
			{ drawSVG: '0% 0%', opacity: 1, duration: 0.2 }
		],
		ease: 'none',
		stagger: 0.3,
		repeat: -1,
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			onEnter: () => t.play(),
			onEnterBack: () => t.play(),
			onLeave: () => t.pause(),
			onLeaveBack: () => {
				t.pause();
				t.progress(0);
			},
			invalidateOnRefresh: true
		}
	});
};

export const makePlaneFloat = (ctx: FeatureCtx, range: Range) => {
	const { gsap, tl } = ctx;
	const { planeFloatEl } = { ...DEFAULTS };

	const planeFloatNode = document.querySelector<HTMLElement | SVGElement>(planeFloatEl);
	if (!planeFloatNode) {
		console.warn('[plane] no element found for', planeFloatEl);
		return;
	}

	const start = range.start + 1000;
	const end = range.end;

	if (planeFloatNode instanceof SVGElement) {
		gsap.set(planeFloatNode, { transformBox: 'fill-box' });
	}

	let t: gsap.core.Tween;
	t = gsap.to(planeFloatNode, {
		y: '+=12',
		rotate: '+=2',
		duration: 1.6,
		ease: 'sine.inOut',
		yoyo: true,
		repeat: -1,
		paused: true,
		force3D: true,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			onEnter: () => t.play(),
			onEnterBack: () => t.play(),
			onLeave: () => t.pause(),
			onLeaveBack: () => t.pause(),
			invalidateOnRefresh: true
		}
	});

	return t;
};

const makePlaneFollowPath = (ctx: FeatureCtx, range: Range) => {
	const { gsap, tl } = ctx;
	const { planeEl, windPathEl } = { ...DEFAULTS };

	const planeNode = document.querySelector<SVGElement>(planeEl);
	const windPathNode = document.querySelector<SVGPathElement>(windPathEl);

	const start = range.start + 200;
	const end = range.start + 1000;

	if (!planeNode || !windPathNode) {
		console.warn('[plane] no element found with id #paperPlane');
		return;
	}

	gsap.set(planeNode, { transformOrigin: '50% 50%' });

	gsap.to(planeNode, {
		motionPath: {
			path: windPathNode,
			align: windPathNode,
			autoRotate: true,
			alignOrigin: [0.5, 0.5],
			start: 1,
			end: 0
		},
		ease: 'none',
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			scrub: 1
		}
	});
};

type MorphParams = {
	from: number;
	to: number;
	startOffset?: number;
	endOffset?: number;
	triggerEl?: string;
};

export const morphPlaneBetween = (ctx: FeatureCtx, range: Range, params: MorphParams) => {
	const { gsap, tl } = ctx;
	const { planeEl } = { ...DEFAULTS };

	const { from, to, startOffset = 800, endOffset = 1200, triggerEl = planeEl } = params;

	const triggerNode = document.querySelector<SVGElement>(triggerEl);
	if (!triggerNode) {
		console.warn('[plane] trigger not found for selector:', triggerEl);
		return;
	}

	const start = range.start + startOffset;
	const end = range.start + endOffset;

	const fromSel = `#plane${from}Svg path`;
	const toSel = `#plane${to}Svg path`;

	const fromPaths = gsap.utils.toArray<SVGPathElement>(fromSel);
	const toPaths = gsap.utils.toArray<SVGPathElement>(toSel);

	if (!fromPaths.length || !toPaths.length) {
		console.warn('[plane] missing paths', {
			fromSel,
			fromLen: fromPaths.length,
			toSel,
			toLen: toPaths.length
		});
		return;
	}

	const len = Math.min(fromPaths.length, toPaths.length);
	if (fromPaths.length !== toPaths.length) {
		console.warn('[plane] path count mismatch, using min length', {
			from: fromPaths.length,
			to: toPaths.length,
			used: len
		});
	}

	const tlMorph = gsap.timeline({
		defaults: { ease: 'power1.inOut' },
		scrollTrigger: {
			containerAnimation: tl,
			trigger: triggerNode,
			start,
			end,
			scrub: 0,
			invalidateOnRefresh: true
		}
	});

	for (let i = 0; i < len; i++) {
		tlMorph.to(fromPaths[i], { morphSVG: toPaths[i] }, 0);
	}

	return tlMorph;
};

export const buildPlaneFeature = (ctx: FeatureCtx, range: Range) => {
	drawWindPath(ctx, range, DEFAULTS);
	makePlaneFollowPath(ctx, range);
	morphPlaneBetween(ctx, range, { from: 2, to: 1, startOffset: 700, endOffset: 1100 });
	morphPlaneBetween(ctx, range, { from: 2, to: 2, startOffset: 1300, endOffset: 1600 });
	makePlaneFloat(ctx, range);
	drawThreeWindPath(ctx, range, DEFAULTS);
};
