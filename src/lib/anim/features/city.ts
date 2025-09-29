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

	// ton scale, inchangé
	const scaleTl = scaleCity(gsap, cityNode, { to: 1 });
	scaleTl.totalDuration(span);
	tl.add(scaleTl, start);

	// ⚠️ on ne l'ajoute PAS dans tl, il est déjà piloté par containerAnimation: tl
	setTreeAtCenter(ctx, range, opts);
	splitCitySides(ctx, range, {
		...opts, // puis on écarte + zoom
		startOffset: 820,
		endOffset: 1100,
		scale: 2
	});
	unsplitCitySides(ctx, range, { startOffset: 1320, endOffset: 1600 });
	resetCityPan(ctx, range, { startOffset: 1620, endOffset: 1820 });
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

// ✅ corrige la signature pour passer range
const setTreeAtCenter = (ctx: FeatureCtx, range: Range, opts: CityOpts) => {
	const { gsap, tl } = ctx;
	const { cityEl, saintMaloCenterEl } = { ...DEFAULTS, ...opts };

	const cityNode = document.querySelector<HTMLElement>(cityEl);
	const centerNode = document.querySelector<SVGGraphicsElement | HTMLElement>(saintMaloCenterEl);

	if (!cityNode || !centerNode) {
		console.warn('[city] element(s) missing', { cityNode: !!cityNode, centerNode: !!centerNode });
		return;
	}

	// Optionnel : pour que l’origine SVG soit fiable si tu scales ailleurs
	if (centerNode instanceof SVGGraphicsElement) {
		gsap.set(centerNode, { transformBox: 'fill-box' as any });
	}

	let offsetX = 0;
	const compute = (): void => {
		const r = centerNode.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		offsetX = window.innerWidth / 2 - cx; // ➜ translation à appliquer au container
	};

	// petit trigger pour (re)calculer au bon moment
	gsap.to(
		{},
		{
			scrollTrigger: {
				containerAnimation: tl,
				trigger: cityNode,
				start: range.start + 490, // ⚙️ ajuste pour que ce soit juste AVANT le pan
				end: range.start + 491,
				onEnter: compute,
				onRefresh: compute
			}
		}
	);

	// tween scrollé qui centre réellement le bloc
	const t = gsap.to(cityNode, {
		x: () => offsetX, // re-évalué à chaque refresh
		ease: 'none',
		snap: { x: 1 },
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			trigger: cityNode,
			start: range.start + 500, // ⚙️ tes bornes (ex: 500 ➜ 800)
			end: range.start + 800,
			scrub: 1,
			invalidateOnRefresh: true,
			onRefresh: compute,
			onLeaveBack: () => gsap.set(cityNode, { x: 0 }) // ✅ ajout
		}
	});

	return t; // on peut retourner le tween si tu veux le garder sous la main
};

// Types
type SplitSidesOpts = {
	startOffset?: number; // doit commencer après setTreeAtCenter
	endOffset?: number;
	scale?: number; // par défaut 3
};

// ⚙️ Split des côtés après le centrage
export const splitCitySides = (
	ctx: FeatureCtx,
	range: Range,
	opts: CityOpts & SplitSidesOpts = {}
) => {
	const { gsap, tl } = ctx;
	const { saintMaloLeftEl, saintMaloRightEl, saintMaloCenterEl } = { ...DEFAULTS, ...opts };

	const start = range.start + (opts.startOffset ?? 820); // ajuste selon ta TL
	const end = range.start + (opts.endOffset ?? 1100);
	const scale = opts.scale ?? 3;

	const left = document.querySelector<SVGElement>(saintMaloLeftEl);
	const right = document.querySelector<SVGElement>(saintMaloRightEl);
	const center = document.querySelector<HTMLElement | SVGGraphicsElement>(saintMaloCenterEl);

	if (!left || !right || !center) {
		console.warn('[city] splitCitySides missing el(s)', {
			left: !!left,
			right: !!right,
			center: !!center
		});
		return;
	}

	// Origins “bord intérieur” + boîte SVG correcte
	gsap.set([left, right], { transformBox: 'fill-box' as any });
	gsap.set(left, { transformOrigin: 'right bottom' });
	gsap.set(right, { transformOrigin: 'left bottom' });

	// Amplitude latérale par rapport au bloc central
	let movementX = 0;
	const compute = (): void => {
		const r = center.getBoundingClientRect();
		movementX = (window.innerWidth - r.width) / 2; // moitié de l'espace libre → pousse vers les bords
	};

	// LEFT : x négatif + scale via ta scaleCity()
	const leftTl = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: center,
			start,
			end,
			scrub: 1,
			invalidateOnRefresh: true,
			onEnter: compute,
			onRefresh: compute
		}
	});
	leftTl.add(scaleCity(gsap, left as unknown as HTMLElement, { to: scale }), 0);
	leftTl.to(left, { x: () => -movementX, ease: 'none' }, 0);

	// RIGHT : x positif + scale via ta scaleCity()
	const rightTl = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: center,
			start,
			end,
			scrub: 1,
			invalidateOnRefresh: true,
			onEnter: compute,
			onRefresh: compute
		}
	});
	rightTl.add(scaleCity(gsap, right as unknown as HTMLElement, { to: scale }), 0);
	rightTl.to(right, { x: () => movementX, ease: 'none' }, 0);

	return { leftTl, rightTl };
};

type UnsplitSidesOpts = {
	startOffset?: number; // doit commencer après le split
	endOffset?: number;
};

export const unsplitCitySides = (
	ctx: FeatureCtx,
	range: Range,
	opts: CityOpts & UnsplitSidesOpts = {}
) => {
	const { gsap, tl } = ctx;
	const { saintMaloLeftEl, saintMaloRightEl } = { ...DEFAULTS, ...opts };

	const start = range.start + (opts.startOffset ?? 1120); // adapte à ta TL
	const end = range.start + (opts.endOffset ?? 1400);

	const left = document.querySelector<SVGElement>(saintMaloLeftEl);
	const right = document.querySelector<SVGElement>(saintMaloRightEl);

	if (!left || !right) {
		console.warn('[city] unsplitCitySides missing el(s)', { left: !!left, right: !!right });
		return;
	}

	// sécurité pour SVG
	gsap.set([left, right], { transformBox: 'fill-box' as any });

	// LEFT: retour scale→1 + x→0
	const leftTl = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: left,
			start,
			end,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});
	leftTl.add(scaleCity(gsap, left as unknown as HTMLElement, { to: 1 }), 0);
	leftTl.to(left, { x: 0, ease: 'none', overwrite: 'auto' }, 0);

	// RIGHT: retour scale→1 + x→0
	const rightTl = gsap.timeline({
		scrollTrigger: {
			containerAnimation: tl,
			trigger: right,
			start,
			end,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});
	rightTl.add(scaleCity(gsap, right as unknown as HTMLElement, { to: 1 }), 0);
	rightTl.to(right, { x: 0, ease: 'none', overwrite: 'auto' }, 0);

	return { leftTl, rightTl };
};

type ResetPanOpts = { startOffset?: number; endOffset?: number };

const resetCityPan = (ctx: FeatureCtx, range: Range, opts: CityOpts & ResetPanOpts = {}) => {
	const { gsap, tl } = ctx;
	const { cityEl } = { ...DEFAULTS, ...opts };

	const cityNode = document.querySelector<HTMLElement>(cityEl);
	if (!cityNode) return;

	const start = range.start + (opts.startOffset ?? 1620);
	const end = range.start + (opts.endOffset ?? 1820);

	return gsap.to(cityNode, {
		x: 0,
		ease: 'none',
		overwrite: 'auto',
		immediateRender: false,
		scrollTrigger: {
			containerAnimation: tl,
			trigger: cityNode,
			start,
			end,
			scrub: 1,
			invalidateOnRefresh: true
		}
	});
};
