import { browser } from '$app/environment';
import type { gsap as GsapNS } from 'gsap';

export type GsapType = typeof GsapNS;

export type GsapAll = {
	gsap: GsapType;
	ScrollTrigger: any;
	SplitText: any;
	Draggable: any;
	DrawSVGPlugin: any;
	MotionPathPlugin: any;
	MorphSVGPlugin: any;
	Flip: any;
};

let cachedAll: GsapAll | null = null;
let loadingAll: Promise<GsapAll> | null = null;

const makeSsrStub = (): GsapAll => ({
	gsap: {} as GsapType,
	ScrollTrigger: undefined,
	SplitText: undefined,
	Draggable: undefined,
	DrawSVGPlugin: undefined,
	MotionPathPlugin: undefined,
	MorphSVGPlugin: undefined,
	Flip: undefined
});

export const loadGsapAll = async (): Promise<GsapAll> => {
	if (cachedAll) return cachedAll;
	if (loadingAll) return loadingAll;

	loadingAll = (async () => {
		if (!browser) return (cachedAll = makeSsrStub());

		const { gsap } = await import('gsap');

		const [
			{ default: ScrollTrigger },
			{ SplitText },
			{ default: Draggable },
			{ default: DrawSVGPlugin },
			{ default: MotionPathPlugin },
			{ default: MorphSVGPlugin },
			{ default: Flip }
		] = await Promise.all([
			import('gsap/ScrollTrigger'),
			import('gsap/SplitText'),
			import('gsap/Draggable'),
			import('gsap/DrawSVGPlugin'),
			import('gsap/MotionPathPlugin'),
			import('gsap/MorphSVGPlugin'),
			import('gsap/Flip')
		]);

		gsap.registerPlugin(
			ScrollTrigger,
			SplitText,
			Draggable,
			DrawSVGPlugin,
			MotionPathPlugin,
			MorphSVGPlugin,
			Flip
		);

		cachedAll = {
			gsap,
			ScrollTrigger,
			SplitText,
			Draggable,
			DrawSVGPlugin,
			MotionPathPlugin,
			MorphSVGPlugin,
			Flip
		};
		return cachedAll;
	})().finally(() => {
		if (!cachedAll) loadingAll = null;
	});

	return loadingAll;
};
