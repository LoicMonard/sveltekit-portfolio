import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

/*
 - Draw motion path with drawSVG
 - Move plane along path with motionPath
 - Add the welcome text 
 - Rotate the plane 
*/

export type PlaneOpts = {
	windPathEl?: string;
	planeEl?: string;
  plane2El?: string;
  plane3El?: string;
};

const DEFAULTS: Required<PlaneOpts> = {
	windPathEl: '#paperPlaneMotionPath path',
	planeEl: '#planeContainer',
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


export const buildPlaneFeature = (ctx: FeatureCtx, range: Range) => {
	const windPath = drawWindPath(ctx, range, DEFAULTS);

  const planeMotion = makePlaneFollowPath(ctx, range);

	return { windPath };
};
