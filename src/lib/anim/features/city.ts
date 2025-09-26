import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type CityOpts = {
	saintMaloLeftEl?: string;
	saintMaloRightEl?: string;
	grandeRoueEl?: string;
};

const DEFAULTS: Required<CityOpts> = {
	saintMaloLeftEl: '#saintMaloLeft',
	saintMaloRightEl: '#saintMaloRight',
	grandeRoueEl: '#grandeRoue'
} as const;

export const buildCityFeature = (ctx: FeatureCtx, range: Range, opts: CityOpts) => {
	const { gsap, tl } = ctx;
	const { saintMaloLeftEl, saintMaloRightEl, grandeRoueEl } = { ...DEFAULTS, ...opts };
	const start = range.start;
	const end = range.end;
	const span = Math.max(end ? end - start : 500, 0.0001);

	const saintMaloLeftNode = document.querySelector<SVGElement>(saintMaloLeftEl);
	const saintMaloRightNode = document.querySelector<SVGElement>(saintMaloRightEl);
	const grandeRoueNode = document.querySelector<SVGElement>(grandeRoueEl);
	if (!saintMaloLeftNode) {
		console.warn('[city] no element found under', saintMaloLeftEl);
		return;
	}
	if (!saintMaloRightNode) {
		console.warn('[city] no element found under', saintMaloRightEl);
		return;
	}
	if (!grandeRoueNode) {
		console.warn('[city] no element found under', grandeRoueEl);
		return;
	}
};
