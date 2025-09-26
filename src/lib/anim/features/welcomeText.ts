// welcome-flaps.ts
import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type WelcomeFlapsOpts = {
	target?: string;
	fromText?: string;
	toText?: string;
	charset?: string | string[];
	iterations?: number | ((i: number) => number);
	stagger?: number;
	tileClass?: string;
};

const DEFAULTS: Required<WelcomeFlapsOpts> = {
	target: '#welcomeFlaps',
	fromText: 'SCROLL⬇️',
	toText: 'WELCOME',
	charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-⬇️🫰💡',
	iterations: 18,
	stagger: 0.06,
	tileClass:
		'relative grid place-items-center w-full h-full rounded-[10px] bg-slate-50 text-zinc-600 ' +
		'font-mono [transform-style:preserve-3d] [backface-visibility:hidden] ' +
		'ring-1 ring-slate-200 after:content-[""] after:absolute after:left-0 ' +
		'after:right-0 after:top-1/2 after:h-px after:bg-slate-200'
};

const segmentGraphemes = (s: string): string[] => {
	if (Intl?.Segmenter) {
		const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
		return Array.from(seg.segment(s), (x) => x.segment);
	}
	return [...s];
};
const normalizeCharset = (cs: string | string[]) => (Array.isArray(cs) ? cs : segmentGraphemes(cs));
const randFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] ?? ' ';

const buildSequence = (init: string, fin: string, loops: number, charsetArr: string[]) => {
	const n = Math.max(2, loops);
	const seq = new Array<string>(n);
	seq[0] = init;
	for (let i = 1; i < n - 1; i++) seq[i] = randFrom(charsetArr);
	seq[n - 1] = fin;
	return seq;
};

const makeFlipTl = (gsap: GSAP, el: HTMLElement, seq: string[], flipDur = 0.16) => {
	const tl = gsap.timeline();
	const flips = seq.length - 1;
	const half = flipDur / 2;
	const total = flips * flipDur;

	for (let i = 0; i < flips; i++) {
		const base = i * flipDur;
		tl.to(el, { rotationX: -90, duration: half, ease: 'power2.in' }, base).to(
			el,
			{ rotationX: 0, duration: half, ease: 'power2.out' },
			base + half
		);
	}

	const tracker = { t: 0 };
	tl.to(
		tracker,
		{
			t: total,
			duration: total,
			ease: 'linear',
			onUpdate: () => {
				const t = tl.time();
				const idx = Math.max(0, Math.min(seq.length - 1, Math.floor(t / flipDur + 0.5)));
				const ch = seq[idx];
				if (el.textContent !== ch) el.textContent = ch;
			}
		},
		0
	);

	return tl;
};

const makeTile = (faceClass: string) => {
	const wrap = document.createElement('span');
	wrap.className = 'w-full aspect-square rounded-[12px] bg-zinc-600 [perspective:900px]';
	const face = document.createElement('span');
	face.className = faceClass;
	wrap.appendChild(face);
	return { wrap, face };
};

let lastYPercent = 0;

export const moveWelcomeText = (ctx: FeatureCtx, range: Range, toYPercent: number) => {
	const { gsap, tl } = ctx;
	const start = range.start;
	const end = range.end ?? start + 500;
	const span = Math.max(end - start, 0.0001);

	const sub = gsap
		.timeline()
		.fromTo(
			'#welcomeFlaps',
			{ yPercent: lastYPercent },
			{ yPercent: toYPercent, ease: 'power1.inOut', immediateRender: false },
			0
		);

	sub.totalDuration(1);
	const stretched = gsap.timeline().add(sub, 0);
	stretched.totalDuration(span);
	tl.add(stretched, start);

	lastYPercent = toYPercent;
};

export const buildWelcomeText = (ctx: FeatureCtx, range: Range, opts: WelcomeFlapsOpts = {}) => {
	const { gsap, tl } = ctx;
	const { target, fromText, toText, charset, iterations, stagger, tileClass } = {
		...DEFAULTS,
		...opts
	};

	const start = range.start;
	const end = range.end ?? range.start + 500;
	const span = Math.max(end - start, 1);

	const container = document.querySelector<HTMLElement>(target);
	if (!container) {
		console.warn('[welcome] target not found:', target);
		return;
	}

	container.innerHTML = '';

	const fromArr = segmentGraphemes(fromText.toUpperCase());
	const toArr = segmentGraphemes(toText.toUpperCase());
	const len = Math.max(fromArr.length, toArr.length);
	const charsetArr = normalizeCharset(charset);

	const sub = gsap.timeline();
	const faces: HTMLElement[] = [];

	for (let i = 0; i < len; i++) {
		const { wrap, face } = makeTile(tileClass);
		const initCh = fromArr[i] ?? ' ';
		const finCh = toArr[i] ?? ' ';
		face.textContent = initCh;
		container.appendChild(wrap);
		faces.push(face);

		const loops = Math.max(2, typeof iterations === 'function' ? iterations(i) : iterations);
		const seq = buildSequence(initCh, finCh, loops, charsetArr);

		sub.add(makeFlipTl(gsap, face, seq), i * stagger);
	}

	sub.set(faces, { transformPerspective: 900, transformOrigin: '50% 50% -1px', rotationX: 0 }, 0);

	sub.totalDuration(1);
	const stretched = gsap.timeline().add(sub, 0);
	stretched.totalDuration(span);

	tl.add(stretched, start);
	moveWelcomeText(ctx, { start: 1200, end: 1500 }, -15);
	moveWelcomeText(ctx, { start: 1800, end: 2100 }, -100);
};
