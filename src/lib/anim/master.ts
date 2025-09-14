// src/lib/anim/master.ts
import { loadGsapAll } from '$lib/gsap';
import type { Range } from './ranges';

export type FeatureCtx = {
	gsap: Awaited<ReturnType<typeof loadGsapAll>>['gsap'];
	tl: gsap.core.Timeline;
	scrollScene: HTMLElement; // ton scroller custom
	scope?: Element; // optionnel: root pour scoper
	utils: {
		at: (range: Range, t: number) => number; // helper timeline position
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
			trigger: '#gridScene',
			start: 'top top',
			end: () => `+=${total}`, // 👈 distance de scroll, pas absolu
			scrub: 1,
			pin: true,
			pinType: 'fixed',
			pinSpacing: true, // laisse ST gérer l’espace
			anticipatePin: 1,
			invalidateOnRefresh: true
			// markers: true
		}
	});

	// Étire la TL pour matcher les ranges (1 unité = 1 ms "timeline")
	tl.to({}, { duration: total }, 0);

	const ctx: FeatureCtx = {
		gsap,
		tl,
		scrollScene: document.documentElement,
		utils: { at: (r, p) => gsap.utils.mapRange(0, 1, r.start, r.end)(p) }
	};

	build(ctx);
	return { gsap, tl, ScrollTrigger };
};
