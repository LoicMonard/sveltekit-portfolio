import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type IntroGridOpts = {
	colsStagger?: number;
	rowsStagger?: number;
	debug?: boolean;
};

const DEFAULTS: Required<IntroGridOpts> = {
	colsStagger: 0.1,
	rowsStagger: 0.1,
	debug: false
} as const;

export const buildIntroGrid = (ctx: FeatureCtx, range: Range, opts: IntroGridOpts = {}) => {
	const { gsap, tl } = ctx;
	const { colsStagger, rowsStagger, debug } = { ...DEFAULTS, ...opts };

	const start = range.start + 100;
	const end = range.start + 500;

	const cols = gsap.utils.toArray<SVGPathElement>('#gridSvg #cols path');
	const rows = gsap.utils.toArray<SVGPathElement>('#gridSvg #rows path');

	if (!cols.length && !rows.length) {
		console.warn('[introGrid] no paths found under #gridSvg');
		return;
	}

	gsap.set([...cols, ...rows], { drawSVG: '0% 0%' });

	gsap.to(cols, {
		drawSVG: '0% 100%',
		ease: 'none',
		stagger: colsStagger,
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			scrub: 1,
			markers: debug
		}
	});

	gsap.to(rows, {
		drawSVG: '0% 100%',
		ease: 'none',
		stagger: rowsStagger,
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			start,
			end,
			scrub: 1,
			markers: debug
		}
	});
};
