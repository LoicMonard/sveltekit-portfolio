import { loadGsapAll } from '$lib/gsap';
import type { Range } from './ranges';

export type FeatureCtx = {
	gsap: Awaited<ReturnType<typeof loadGsapAll>>['gsap'];
	tl: gsap.core.Timeline;
	scrollScene: HTMLElement;
	utils: {
		at: (range: Range, progress: number) => number;
	};
};

export const createMaster = async (
	ranges: Record<string, Range>,
	build: (ctx: FeatureCtx) => void
) => {
	const { gsap, ScrollTrigger } = await loadGsapAll();
	const total = Object.values(ranges).at(-1)!.end;

	const tl = gsap.timeline({
		paused: true,
		scrollTrigger: {
			scroller: '#portfolioScroller',
			trigger: '#scrollContent',
			start: 0,
			end: total,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});

	tl.to({}, { duration: total }, 0);

	const ctx: FeatureCtx = {
		gsap,
		tl,
		scrollScene: document.querySelector('#portfolioScroller') as HTMLElement,
		utils: { at: (r, p) => gsap.utils.mapRange(0, 1, r.start, r.end)(p) }
	};

	build(ctx);

	return { gsap, tl, ScrollTrigger };
};
