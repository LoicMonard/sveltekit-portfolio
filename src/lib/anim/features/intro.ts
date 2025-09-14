// src/lib/anim/features/intro.ts
import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type IntroOpts = {
	iconSel?: string;
	fadeUnits?: number;
	loopDelay?: number;
	loopRepeatDelay?: number;
	debug?: boolean;
};

const DEFAULTS: Required<IntroOpts> = {
	iconSel: '#scrollDownIcon',
	fadeUnits: 100,
	loopDelay: 1,
	loopRepeatDelay: 0.35,
	debug: false
} as const;

const initScrollDownLoop = (
	ctx: FeatureCtx,
	iconSel: string,
	delay: number,
	repeatDelay: number
) => {
	const { gsap } = ctx;

	gsap.set(`${iconSel} .path1`, { drawSVG: '0% 10%', y: 0 });
	gsap.set(`${iconSel} .path2`, { drawSVG: '50% 50%', y: -0.5 });

	const seq = gsap
		.timeline({ paused: true, defaults: { ease: 'none' } })
		.to(`${iconSel} .path1`, { drawSVG: '0% 100%', y: 1.5, duration: 0.8 })
		.fromTo(`${iconSel} .path2`, { opacity: 0, y: 0 }, { opacity: 1, y: 1.5, duration: 0.01 })
		.to(`${iconSel} .path2`, { drawSVG: '0% 100%', duration: 0.5 });

	const driver = gsap.to(seq, {
		progress: 1,
		duration: seq.duration(),
		ease: 'power1.inOut',
		repeat: -1,
		yoyo: true,
		repeatDelay,
		delay
	});

	return { seq, driver };
};

const initScrollDownScaling = (
	ctx: FeatureCtx,
	iconSel: string,
	range: Range,
	fadeUnits: number,
	debug: boolean
) => {
	const { gsap, tl } = ctx;

	gsap.set(iconSel, { transformOrigin: '50% 50%' });

	return gsap.to(iconSel, {
		scale: 1.6,
		opacity: 0,
		ease: 'power2.out',
		scrollTrigger: {
			containerAnimation: tl,
			start: range.start,
			end: range.start + fadeUnits,
			scrub: 1,
			markers: debug
		}
	});
};

export const buildScrollDown = (ctx: FeatureCtx, range: Range, opts: IntroOpts = {}) => {
	const { iconSel, fadeUnits, loopDelay, loopRepeatDelay, debug } = { ...DEFAULTS, ...opts };

	const loop = initScrollDownLoop(ctx, iconSel, loopDelay, loopRepeatDelay);

	const st = initScrollDownScaling(ctx, iconSel, range, fadeUnits, debug);

	return { ...loop, st };
};
