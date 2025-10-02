import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

type TreeDurations = {
	resize: number;
	trunks: number;
	leaves: number;
};

const config = {
	root: '#treeSvg',
	container: '#treeContainer',
	targetWidth: '40vw',
	leafDur: 0.6,
	overlap: 0.5
} as const;

export const createTree = (ctx: FeatureCtx, range: Range, durations: TreeDurations): void => {
	const { gsap, tl } = ctx;
	const start = range.start;

	gsap.set(`${config.root} path`, { drawSVG: 0 });

	const resizeTl = gsap.timeline().to(config.container, {
		width: config.targetWidth,
		ease: 'none',
		duration: 1
	});
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
};

export const buildForestFeature = (ctx: FeatureCtx, range: Range): void => {
	createTree(ctx, range, {
		resize: 300,
		trunks: 500,
		leaves: 700
	});
};
