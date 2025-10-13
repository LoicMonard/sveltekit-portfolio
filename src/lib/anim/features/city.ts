import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type CityOpts = {
	cityEl?: string;
	saintMaloLeftEl?: string;
	saintMaloCenterEl?: string;
	saintMaloRightEl?: string;
	grandeRoueEl?: string;
};

const DEFAULTS: Required<CityOpts> = {
	cityEl: '#cityContainer',
	saintMaloLeftEl: '#saintMaloLeft',
	saintMaloCenterEl: '#saintMaloCenter',
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

	setTreeAtCenter(ctx, range, opts);
	citySidesSequence(ctx, range, opts);
};

const scaleCity = (gsap: GSAP, node: Element, opts: { to: number }) => {
	const t = gsap.timeline();
	t.to(
		node,
		{
			scale: opts.to,
			ease: 'power1.inOut',
			immediateRender: false,
			startAt: { scale: () => Number(gsap.getProperty(node, 'scale')) || 1 }
		},
		0
	);
	return t;
};

const setTreeAtCenter = (ctx: FeatureCtx, range: Range, opts: CityOpts) => {
	const { gsap, tl } = ctx;
	const { cityEl, saintMaloCenterEl } = { ...DEFAULTS, ...opts };

	const cityNode = document.querySelector<HTMLElement>(cityEl);
	const centerNode = document.querySelector<SVGGraphicsElement | HTMLElement>(saintMaloCenterEl);

	if (!cityNode || !centerNode) {
		console.warn('[city] element(s) missing', { cityNode: !!cityNode, centerNode: !!centerNode });
		return;
	}

	if (centerNode instanceof SVGGraphicsElement) {
		gsap.set(centerNode, { transformBox: 'fill-box' as any });
	}

	let offsetX = 0;
	const compute = (): void => {
		const r = centerNode.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		offsetX = window.innerWidth / 2 - cx;
	};

	gsap.to(
		{},
		{
			scrollTrigger: {
				containerAnimation: tl,
				trigger: cityNode,
				start: range.start + 490,
				end: range.start + 491,
				onEnter: compute,
				onRefresh: compute
			}
		}
	);

	const t = gsap.to(cityNode, {
		x: () => offsetX,
		ease: 'none',
		snap: { x: 1 },
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			trigger: cityNode,
			start: range.start + 500,
			end: range.start + 800,
			scrub: 1,
			invalidateOnRefresh: true,
			onRefresh: compute,
			onLeaveBack: () => gsap.set(cityNode, { x: 0 })
		}
	});

	return t;
};

export const citySidesSequence = (ctx: FeatureCtx, range: Range, opts: CityOpts = {}) => {
	const { gsap, tl } = ctx;
	const { saintMaloLeftEl, saintMaloRightEl, saintMaloCenterEl } = { ...DEFAULTS, ...opts };

	const left = document.querySelector<SVGElement>(saintMaloLeftEl);
	const right = document.querySelector<SVGElement>(saintMaloRightEl);
	const center = document.querySelector<HTMLElement | SVGGraphicsElement>(saintMaloCenterEl);
	if (!left || !right || !center) return;

	gsap.set([left, right], { transformBox: 'fill-box' as any });
	gsap.set(left, { transformOrigin: 'right bottom' });
	gsap.set(right, { transformOrigin: 'left bottom' });

	const halfFree = () => (window.innerWidth - center.getBoundingClientRect().width) / 2;

	const splitSequence = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: center,
			start: range.start + 800,
			end: range.start + 1100,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});

	splitSequence.to(left, { x: () => -halfFree(), scale: 3, ease: 'power2.inOut' }, 0);
	splitSequence.to(right, { x: () => +halfFree(), scale: 3, ease: 'power2.inOut' }, 0);

	const unsplitSequence = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: center,
			start: range.start + 2500,
			end: range.start + 2800,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});

	unsplitSequence.to(left, { x: 0, scale: 1, ease: 'power2.inOut' }, 0);
	unsplitSequence.to(right, { x: 0, scale: 1, ease: 'power2.inOut' }, 0);

	return { splitSequence, unsplitSequence };
};
