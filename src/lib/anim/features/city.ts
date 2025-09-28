import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type CityOpts = {
	cityEl?: string;
	saintMaloLeftEl?: string;
	saintMaloRightEl?: string;
	grandeRoueEl?: string;
};

const DEFAULTS: Required<CityOpts> = {
	cityEl: '#cityContainer',
	saintMaloLeftEl: '#saintMaloLeft',
	saintMaloRightEl: '#saintMaloRight',
	grandeRoueEl: '#grandeRoue'
} as const;

export const buildCityFeature = (ctx: FeatureCtx, range: Range, opts: CityOpts) => {
	const { gsap, tl } = ctx;
	const { cityEl, saintMaloLeftEl, saintMaloRightEl } = { ...DEFAULTS, ...opts };

	const start = range.start;
	const end = range.end ?? start + 500;
	const span = Math.max(end - start, 0.0001);

	const cityNode = document.querySelector<HTMLElement>(cityEl);
	const left = document.querySelector<SVGElement>(saintMaloLeftEl);
	const right = document.querySelector<SVGElement>(saintMaloRightEl);

	if (!cityNode || !left || !right) {
		console.warn('[city] element(s) missing', {
			cityNode: !!cityNode,
			left: !!left,
			right: !!right
		});
		return;
	}

	const scaleTl = scaleCity(gsap, cityNode, { to: 1 });
	scaleTl.totalDuration(span);
	tl.add(scaleTl, start);
};

const scaleCity = (gsap: any, node: HTMLElement, opts: { to: number }) => {
	const current = Number(gsap.getProperty(node, 'scale')) || 1;

	const t = gsap.timeline();
	t.fromTo(
		node,
		{ scale: current },
		{ scale: opts.to, ease: 'power1.inOut', immediateRender: false },
		0
	);

	return t;
};
