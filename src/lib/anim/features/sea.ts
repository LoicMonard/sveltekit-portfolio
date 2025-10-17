// src/lib/anim/features/sea.ts
import type { FeatureCtx } from '$lib/anim/master';

export type SeaOpts = {
	containerSel?: string;
	speeds?: [number, number, number]; // vitesses différentes pour chaque couche
	verticalMove?: number; // amplitude du mouvement vertical
	horizontalMove?: number; // distance horizontale parcourue
	debug?: boolean;
};

const DEFAULTS: Required<SeaOpts> = {
	containerSel: '#seaContainer',
	speeds: [3.5, 4, 4.5], // durées en secondes pour chaque vague
	verticalMove: 3, // montée en pixels
	horizontalMove: 80, // déplacement horizontal en pixels
	debug: false
} as const;

const animateWavePath = (
	ctx: FeatureCtx,
	pathSelector: string,
	speed: number,
	verticalMove: number,
	horizontalMove: number
) => {
	const { gsap } = ctx;

	const tl = gsap.timeline({
		repeat: -1,
		ease: 'none'
	});

	// Monte et avance
	tl.to(pathSelector, {
		x: horizontalMove / 2,
		y: -10,
		duration: speed * 0.5,
		ease: 'sine.inOut'
	})
	// Redescend et continue d'avancer
	.to(pathSelector, {
		x: horizontalMove,
		y: 0,
		duration: speed * 0.5,
		ease: 'sine.inOut'
	})
	// Retour à la position initiale (instantané ou rapide)
	.to(pathSelector, {
		x: 0,
		y: 0,
		duration: 0,
		ease: 'none'
	});

	return tl;
};

const initSeaWaves = (
	ctx: FeatureCtx,
	containerSel: string,
	speeds: [number, number, number],
	verticalMove: number,
	horizontalMove: number
) => {
	const container = document.querySelector(containerSel);
	if (!container) throw new Error(`Container ${containerSel} not found`);

	// Trouve le SVG dans le container
	const svg = container.querySelector('svg');
	if (!svg) throw new Error('No SVG found in container');

	const paths = svg.querySelectorAll('path');
	if (paths.length < 3) throw new Error('SVG must have at least 3 paths');

	const animations: gsap.core.Timeline[] = [];

	// Anime chaque path avec une vitesse différente pour le parallax
	paths.forEach((path, index) => {
		if (index < 3) {
			path.setAttribute('data-wave-layer', index.toString());
			const pathSel = `${containerSel} svg path[data-wave-layer="${index}"]`;
			const anim = animateWavePath(ctx, pathSel, speeds[index], verticalMove, horizontalMove);
			animations.push(anim);
		}
	});

	return { animations };
};

export const buildWaves = (ctx: FeatureCtx, opts: SeaOpts = {}) => {
	const { containerSel, speeds, verticalMove, horizontalMove, debug } = { 
		...DEFAULTS, 
		...opts 
	};

	if (debug) {
		console.log('[Sea Feature] Initializing sea waves', { 
			containerSel,
			speeds,
			verticalMove,
			horizontalMove
		});
	}

	const waves = initSeaWaves(ctx, containerSel, speeds, verticalMove, horizontalMove);

	return waves;
};