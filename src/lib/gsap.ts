import { browser } from '$app/environment';

let gsapCached: typeof import('gsap').gsap | null = null;
const registered = {
	ScrollTrigger: false,
	DrawSVGPlugin: false,
	MotionPathPlugin: false,
	MorphSVGPlugin: false,
	Flip: false,
	SplitText: false
};

export const getGsap = async () => {
	if (gsapCached) return gsapCached;
	if (!browser) return {} as unknown as typeof import('gsap').gsap;
	const { gsap } = await import('gsap');
	gsapCached = gsap;
	return gsap;
};

const registerOnce = (plugin: any) => {
	const gsap = gsapCached!;
	if (plugin && typeof plugin.name === 'string' && !(plugin.name in gsap.plugins)) {
		gsap.registerPlugin(plugin);
	}
};

export const useScrollTrigger = async () => {
	const gsap = await getGsap();
	if (!registered.ScrollTrigger && browser) {
		const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
		registerOnce(ScrollTrigger);
		registered.ScrollTrigger = true;
	}
	// @ts-expect-error:
	return { gsap, ScrollTrigger: gsap.plugins.ScrollTrigger };
};

export const useDrawSVG = async () => {
	const { gsap } = await useScrollTrigger();
	if (!registered.DrawSVGPlugin && browser) {
		const { default: DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
		registerOnce(DrawSVGPlugin);
		registered.DrawSVGPlugin = true;
	}
	return { gsap };
};

export const useMotionPath = async () => {
	const gsap = await getGsap();
	if (!registered.MotionPathPlugin && browser) {
		const { default: MotionPathPlugin } = await import('gsap/MotionPathPlugin');
		registerOnce(MotionPathPlugin);
		registered.MotionPathPlugin = true;
	}
	return { gsap };
};

export const useMorphSVG = async () => {
	const gsap = await getGsap();
	if (!registered.MorphSVGPlugin && browser) {
		const { default: MorphSVGPlugin } = await import('gsap/MorphSVGPlugin');
		registerOnce(MorphSVGPlugin);
		registered.MorphSVGPlugin = true;
	}
	return { gsap };
};

export const useFlip = async () => {
	const gsap = await getGsap();
	if (!registered.Flip && browser) {
		const { default: Flip } = await import('gsap/Flip');
		registerOnce(Flip);
		registered.Flip = true;
	}
	return { gsap };
};

export const useSplitText = async () => {
	const gsap = await getGsap();
	if (!registered.SplitText && browser) {
		const { SplitText } = await import('gsap/SplitText');
		registerOnce(SplitText);
		registered.SplitText = true;
	}
	return { gsap };
};
