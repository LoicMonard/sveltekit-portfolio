import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export interface PlaneOptions {
	windPathEl?: string;
	threeWindEl?: string;
	planeEl?: string;
	planeFloatEl?: string;
	plane1El?: string;
	plane2El?: string;
	plane3El?: string;
}

export interface MorphParameters {
	from: number;
	to: number;
	startOffset?: number;
	endOffset?: number;
	triggerEl?: string;
}

const DEFAULT_OPTIONS: Required<PlaneOptions> = {
	windPathEl: '#paperPlaneMotionPath path',
	threeWindEl: '#threeWind',
	planeEl: '#planeContainer',
	planeFloatEl: '#planeFloat',
	plane1El: '#plane1Svg',
	plane2El: '#plane2Svg',
	plane3El: '#plane3Svg'
} as const;

const ANIMATION_TIMINGS = {
	windPath: {
		startOffset: 0,
		duration: 800,
		keyframes: [
			{ drawSVG: '100% 90%', duration: 0.1, opacity: 1 },
			{ drawSVG: '10% 0%', duration: 1.0 },
			{ drawSVG: '0% 0%', opacity: 0, duration: 0.1 }
		]
	},
	motionPath: {
		startOffset: 200,
		duration: 800
	},
	threeWind: {
		startOffset: 1500,
		stagger: 0.3,
		keyframes: [
			{ drawSVG: '100% 60%', opacity: 1, duration: 0.2 },
			{ drawSVG: '40% 0%', opacity: 1, duration: 0.2 },
			{ drawSVG: '0% 0%', opacity: 1, duration: 0.2 }
		]
	},
	float: {
		startOffset: 1000,
		yOffset: 12,
		rotation: 2,
		duration: 1.6
	},
	morph: {
		defaultStartOffset: 800,
		defaultEndOffset: 1200
	}
} as const;

const queryElement = <T extends Element>(
	selector: string | undefined,
	elementName: string
): T | null => {
	if (!selector) return null;

	const element = document.querySelector<T>(selector);
	if (!element) {
		console.warn(`[plane] ${elementName} not found for selector: ${selector}`);
	}
	return element;
};

const mergeOptions = (userOptions?: Partial<PlaneOptions>): Required<PlaneOptions> => ({
	...DEFAULT_OPTIONS,
	...userOptions
});

export const drawWindPath = (ctx: FeatureCtx, range: Range, options?: PlaneOptions): void => {
	const { gsap, tl } = ctx;
	const { windPathEl } = mergeOptions(options);

	const windPathNode = queryElement<SVGPathElement>(windPathEl, 'wind path');
	if (!windPathNode) return;

	const { startOffset, duration, keyframes } = ANIMATION_TIMINGS.windPath;
	const start = range.start + startOffset;
	const end = start + duration;

	gsap.set(windPathNode, { drawSVG: '100% 100%', opacity: 0 });

	gsap.to(windPathNode, {
		keyframes,
		ease: 'none',
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			trigger: windPathNode,
			start,
			end,
			scrub: 1
		}
	});
};

export const drawThreeWindPath = (
	ctx: FeatureCtx,
	range: Range,
	options?: PlaneOptions
): gsap.core.Tween | void => {
	const { gsap, tl } = ctx;
	const { threeWindEl } = mergeOptions(options);

	const windPaths = gsap.utils.toArray<SVGPathElement>(`${threeWindEl} path`);
	if (!windPaths.length) {
		console.warn('[plane] No paths found for three wind animation');
		return;
	}

	const { startOffset, stagger, keyframes } = ANIMATION_TIMINGS.threeWind;
	const start = range.start + startOffset;
	const end = range.end;

	gsap.set(windPaths, {
		drawSVG: '100% 100%',
		visibility: 'visible',
		opacity: 0
	});

	let animation: gsap.core.Tween;

	animation = gsap.to(windPaths, {
		keyframes,
		ease: 'none',
		stagger,
		repeat: -1,
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			onEnter: () => animation.play(),
			onEnterBack: () => animation.play(),
			onLeave: () => animation.pause(),
			onLeaveBack: () => {
				animation.pause();
				animation.progress(0);
			},
			invalidateOnRefresh: true
		}
	});

	return animation;
};

export const makePlaneFloat = (
	ctx: FeatureCtx,
	range: Range,
	options?: PlaneOptions
): gsap.core.Tween | void => {
	const { gsap, tl } = ctx;
	const { planeFloatEl } = mergeOptions(options);

	const planeNode = queryElement<HTMLElement | SVGElement>(planeFloatEl, 'plane float element');
	if (!planeNode) return;

	const { startOffset, yOffset, rotation, duration } = ANIMATION_TIMINGS.float;
	const start = range.start + startOffset;
	const end = range.end;

	if (planeNode instanceof SVGElement) {
		gsap.set(planeNode, { transformBox: 'fill-box' });
	}

	let animation: gsap.core.Tween;

	animation = gsap.to(planeNode, {
		y: `+=${yOffset}`,
		rotate: `+=${rotation}`,
		duration,
		ease: 'sine.inOut',
		yoyo: true,
		repeat: -1,
		paused: true,
		force3D: true,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			onEnter: () => animation.play(),
			onEnterBack: () => animation.play(),
			onLeave: () => animation.pause(),
			onLeaveBack: () => animation.pause(),
			invalidateOnRefresh: true
		}
	});

	return animation;
};

export const makePlaneFollowPath = (
	ctx: FeatureCtx,
	range: Range,
	options?: PlaneOptions
): void => {
	const { gsap, tl } = ctx;
	const { planeEl, windPathEl } = mergeOptions(options);

	const planeNode = queryElement<SVGElement>(planeEl, 'plane container');
	const pathNode = queryElement<SVGPathElement>(windPathEl, 'motion path');

	if (!planeNode || !pathNode) return;

	const { startOffset, duration } = ANIMATION_TIMINGS.motionPath;
	const start = range.start + startOffset;
	const end = start + duration;

	gsap.set(planeNode, { transformOrigin: '50% 50%' });

	gsap.to(planeNode, {
		motionPath: {
			path: pathNode,
			align: pathNode,
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

export const morphPlaneBetween = (
	ctx: FeatureCtx,
	range: Range,
	params: MorphParameters,
	options?: PlaneOptions
): gsap.core.Timeline | void => {
	const { gsap, tl } = ctx;
	const { planeEl } = mergeOptions(options);

	const {
		from,
		to,
		startOffset = ANIMATION_TIMINGS.morph.defaultStartOffset,
		endOffset = ANIMATION_TIMINGS.morph.defaultEndOffset,
		triggerEl = planeEl
	} = params;

	// Validate trigger element
	const triggerNode = queryElement<SVGElement>(triggerEl, 'morph trigger');
	if (!triggerNode) return;

	// Get source and target paths
	const fromSelector = `#plane${from}Svg path`;
	const toSelector = `#plane${to}Svg path`;

	const fromPaths = gsap.utils.toArray<SVGPathElement>(fromSelector);
	const toPaths = gsap.utils.toArray<SVGPathElement>(toSelector);

	// Validate paths
	if (!fromPaths.length || !toPaths.length) {
		console.warn('[plane] Missing paths for morphing', {
			from: fromSelector,
			to: toSelector,
			foundFrom: fromPaths.length,
			foundTo: toPaths.length
		});
		return;
	}

	// Handle path count mismatch
	const pathCount = Math.min(fromPaths.length, toPaths.length);
	if (fromPaths.length !== toPaths.length) {
		console.warn('[plane] Path count mismatch, using minimum', {
			from: fromPaths.length,
			to: toPaths.length,
			using: pathCount
		});
	}

	// Create morph timeline
	const morphTimeline = gsap.timeline({
		defaults: { ease: 'power1.inOut' },
		scrollTrigger: {
			containerAnimation: tl,
			trigger: triggerNode,
			start: range.start + startOffset,
			end: range.start + endOffset,
			scrub: 0,
			invalidateOnRefresh: true
		}
	});

	// Add morph animations for each path pair
	for (let i = 0; i < pathCount; i++) {
		morphTimeline.to(fromPaths[i], { morphSVG: toPaths[i] }, 0);
	}

	return morphTimeline;
};

export const buildPlaneFeature = (ctx: FeatureCtx, range: Range, options?: PlaneOptions): void => {
	const mergedOptions = mergeOptions(options);

	drawWindPath(ctx, range, mergedOptions);
	makePlaneFollowPath(ctx, range, mergedOptions);

	morphPlaneBetween(
		ctx,
		range,
		{
			from: 2,
			to: 1,
			startOffset: 700,
			endOffset: 1100
		},
		mergedOptions
	);

	morphPlaneBetween(
		ctx,
		range,
		{
			from: 2,
			to: 2,
			startOffset: 1300,
			endOffset: 1600
		},
		mergedOptions
	);

	makePlaneFloat(ctx, range, mergedOptions);
	drawThreeWindPath(ctx, range, mergedOptions);
};
