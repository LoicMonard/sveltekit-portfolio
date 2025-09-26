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
	easterEgg?: boolean;
	onJackpot?: (char: string) => void;
};

const DEFAULTS: Omit<Required<WelcomeFlapsOpts>, 'onJackpot'> & {
	onJackpot?: (char: string) => void;
} = {
	target: '#welcomeFlaps',
	fromText: 'SCROLL⬇️',
	toText: 'WELCOME',
	charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-⬇️🫰💡🪙',
	iterations: 18,
	stagger: 0.06,
	tileClass:
		'relative grid place-items-center w-full h-full rounded-[10px] bg-slate-50 text-zinc-600 ' +
		'font-mono [transform-style:preserve-3d] [backface-visibility:hidden] ' +
		'ring-1 ring-slate-200 after:content-[""] after:absolute after:left-0 ' +
		'after:right-0 after:top-1/2 after:h-px after:bg-slate-200',
	easterEgg: true,
	onJackpot: undefined
};

const segmentGraphemes = (s: string): string[] => {
	if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
		const seg = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
		return Array.from(seg.segment(s), (x: any) => x.segment);
	}
	return Array.from(s);
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
	wrap.className =
		'relative grid place-items-center w-full aspect-square rounded-[12px] bg-zinc-600 [perspective:900px]';
	const face = document.createElement('span');
	face.className = faceClass + ' cursor-default select-none';
	wrap.appendChild(face);
	return { wrap, face };
};

const countChar = (els: HTMLElement[], target: string): number => {
	let n = 0;
	for (const e of els) if ((e.textContent ?? '') === target) n++;
	return n;
};

const attachEasterEgg = (
	gsap: GSAP,
	faces: HTMLElement[],
	charsetArr: string[],
	onJackpot?: (char: string) => void
) => {
	const flipOnce = (el: HTMLElement) => {
		gsap.killTweensOf(el, 'rotationY,scale,opacity');

		const ch = randFrom(charsetArr);
		const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

		tl.to(el, { rotationY: -90, duration: 0.08, transformOrigin: '50% 50% -1px', force3D: true })
			.call(() => {
				el.textContent = ch;
				gsap.set(el, { rotationY: 90 });

				const coins = countChar(faces, '🪙');
				if (coins >= 3) {
					const j = gsap.timeline();
					j.to(faces, { scale: 1.06, duration: 0.28, stagger: 0.02, yoyo: true, repeat: 1 })
						.to(faces, { color: '#16a34a', duration: 0.15 }, 0)
						.to(faces, { color: '', duration: 0.35 }, 0.25);
					onJackpot?.('🪙');
				}
			})
			.to(el, { rotationY: 0, duration: 0.08 })
			.fromTo(el, { scale: 0.94, opacity: 0.9 }, { scale: 1, opacity: 1, duration: 0.12 }, 0);
	};

	faces.forEach((f) => {
		f.classList.add('cursor-pointer', 'select-none');
		f.tabIndex = 0;
		f.role = 'button';
		f.addEventListener('click', (e) => {
			e.stopPropagation();
			flipOnce(f);
		});
		f.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				flipOnce(f);
			}
		});
	});
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
	const {
		target,
		fromText,
		toText,
		charset,
		iterations,
		stagger,
		tileClass,
		easterEgg,
		onJackpot
	} = {
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

	sub.set(
		faces,
		{
			transformPerspective: 900,
			transformOrigin: '50% 50% -1px',
			rotationX: 0,
			force3D: true,
			z: 0.01
		},
		0
	);

	sub.totalDuration(1);
	const stretched = gsap.timeline().add(sub, 0);
	stretched.totalDuration(span);
	tl.add(stretched, start);

	if (easterEgg) attachEasterEgg(gsap, faces, charsetArr, onJackpot);

	moveWelcomeText(ctx, { start: 1200, end: 1500 }, -15);
	moveWelcomeText(ctx, { start: 1800, end: 2100 }, -100);
};
