// welcome-flaps.ts
import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export type WelcomeFlapsOpts = {
  target?: string;
  text?: string;
  charset?: string;
  iterations?: number | ((i: number) => number);
  stagger?: number;
  tileClass?: string;
};

const DEFAULTS: Required<WelcomeFlapsOpts> = {
  target: '#welcomeFlaps',
  text: 'WELCOME',
  charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.- ',
  iterations: 8,
  stagger: 0.06,
  // ⬇️ La face occupe 100% du wrapper
  tileClass:
    'relative grid place-items-center w-full h-full rounded-[10px] bg-slate-50 text-zinc-600 ' +
    'text-7xl font-mono [transform-style:preserve-3d] [backface-visibility:hidden] ' +
    'border border-slate-200 ' +
    'after:content-[""] after:absolute after:left-0 after:right-0 after:top-1/2 ' +
    'after:h-px after:bg-slate-200'
} as const;

const nextChar = (charset: string, current: string) => {
  const i = charset.indexOf(current.toUpperCase());
  return charset[(i + 1 + Math.floor(Math.random() * 3)) % charset.length] || ' ';
};

const makeFlipTl = (
  gsap: GSAP,
  el: HTMLElement,
  finalChar: string,
  charset: string,
  loops: number
) => {
  const tl = gsap.timeline();
  let curr = charset[Math.floor(Math.random() * charset.length)] || ' ';
  el.textContent = curr;

  for (let k = 0; k < loops; k++) {
    tl.to(el, {
      rotationX: -90,
      duration: 0.08,
      ease: 'power2.in',
      onComplete: () => {
        curr = k === loops - 1 ? finalChar.toUpperCase() : nextChar(charset, curr);
        el.textContent = curr;
        gsap.set(el, { rotationX: 90 });
      }
    }).to(el, { rotationX: 0, duration: 0.08, ease: 'power2.out' });
  }
  return tl;
};

// ⬇️ fabrique une tuile: wrapper noir (trou) + face qui flippe
const makeTile = (faceClass: string) => {
  const wrap = document.createElement('span');
  wrap.className =
    // fond noir = “trou”, léger padding pour laisser voir le noir
    'relative grid place-items-center w-24 h-36 rounded-[12px] bg-zinc-600 ' +
    'shadow-inner [perspective:900px]';

  const face = document.createElement('span');
  face.className = faceClass;
  wrap.appendChild(face);
  return { wrap, face };
};

export const buildWelcomeText = (ctx: FeatureCtx, range: Range, opts: WelcomeFlapsOpts = {}) => {
  const { gsap, tl } = ctx;
  const { target, text, charset, iterations, stagger, tileClass } = { ...DEFAULTS, ...opts };

  const start = range.start + 100;
  const end = range.end ?? range.start + 500;
  const span = Math.max(end - start, 1);

  const container = document.querySelector<HTMLElement>(target);
  if (!container) {
    console.warn('[welcome] target not found:', target);
    return;
  }

  container.innerHTML = '';
  container.className = 'flex gap-2'; // pas de perspective globale

  const letters = [...text.toUpperCase()];

  // ⬇️ crée les tiles (on animera uniquement la “face”)
  const faces: HTMLElement[] = [];
  letters.forEach(() => {
    const { wrap, face } = makeTile(tileClass);
    container.appendChild(wrap);
    faces.push(face);
  });

  const getLoops = (i: number) => (typeof iterations === 'function' ? iterations(i) : iterations);

  const sub = gsap.timeline();
  // perspective locale: sur la face via GSAP ou déjà fournie par le wrapper
  sub.set(faces, { transformPerspective: 900, transformOrigin: '50% 50% -1px', rotationX: 0 });

  faces.forEach((el, i) => {
    sub.add(makeFlipTl(gsap, el, letters[i], charset, getLoops(i)), i * stagger);
  });

  sub.totalDuration(1);
  const stretched = gsap.timeline().add(sub, 0);
  stretched.totalDuration(span);

  tl.add(stretched, start);
};
