import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

type SkyDurations = {
	descend: number;
};

const config = {
	container: '#skyContainer',
	leftCloud: '#bigCloud1',
	rightCloud: '#bigCloud2',
	cloudsSelector: '#skyContainer > *'
} as const;

export const createSky = (ctx: FeatureCtx, range: Range, durations: SkyDurations): void => {
	const { gsap, tl } = ctx;
	const start = range.start;

	gsap.set(config.container, { yPercent: -50 });
	gsap.set(config.leftCloud, { xPercent: -20 });
	gsap.set(config.rightCloud, { xPercent: 20 });

	const descendTl = gsap
		.timeline()
		.to(config.container, { yPercent: 100, ease: 'none', duration: 1 }, 0)
		.to(config.cloudsSelector, { xPercent: 0, ease: 'none', duration: 1 }, 0);

	descendTl.totalDuration(durations.descend);
	tl.add(descendTl, start);
};

export const buildSkyFeature = (ctx: FeatureCtx, range: Range): void => {
	createSky(ctx, range, { descend: 600 });
};
