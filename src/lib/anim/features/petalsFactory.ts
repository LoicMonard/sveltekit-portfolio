type Petal = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	rot: number;
	vrot: number;
	scale: number;
	seed: number;
	skewAmp: number;
	skewFreq: number;
	flipAmp: number;
	flipFreq: number;
	imgName: string;
};

type PetalsEngine = {
	start: () => void;
	destroy: () => void;
	enableSpawning: (on: boolean) => void;
	isAlive: () => boolean;
};

const images = ['greenPetal.png', 'orangePetal.png', 'brownPetal.png'];
const loadedImgs: Record<string, HTMLImageElement> = {};

const loadImages = async (): Promise<void> => {
	const promises = images.map(
		(name) =>
			new Promise<void>((res) => {
				const im = new Image();
				im.src = `/${name}`;
				im.onload = () => res();
				loadedImgs[name] = im;
			})
	);
	await Promise.all(promises);
};

export const makePetalsEngine = (opts: {
	containerSel: string;
	count?: number;
	size?: number;
	speed?: number;
	driftVw?: number;
}): PetalsEngine => {
	const { containerSel, count = 24, size = 20, speed = 90, driftVw = 10 } = opts;

	const container = document.querySelector<HTMLElement>(containerSel);
	if (!container) throw new Error('petals: container not found');

	const canvas = document.createElement('canvas');
	canvas.className = 'pointer-events-none absolute inset-0 w-full h-full';
	container.style.position = container.style.position || 'relative';
	container.appendChild(canvas);

	const ctx = canvas.getContext('2d')!;
	let petals: Petal[] = [];
	let rafId = 0;
	let last = 0;
	let running = false;
	let canSpawn = false;
	let driftPx = 0;
	let device: 'phone' | 'tablet' | 'desktop' = 'desktop';

	const rand = (min: number, max: number): number => min + Math.random() * (max - min);
	const pickSign = (): number => (Math.random() < 0.5 ? -1 : 1);
	const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
	const getDevice = (w: number) => (w <= 420 ? 'phone' : w <= 900 ? 'tablet' : 'desktop');
	const driftFactor = (d: typeof device): number =>
		d === 'phone' ? 0.45 : d === 'tablet' ? 0.75 : 1.0;

	const setupCanvas = (): void => {
		const dpr = Math.max(1, window.devicePixelRatio || 1);
		const { clientWidth: w, clientHeight: h } = canvas;
		canvas.width = Math.max(1, Math.floor(w * dpr));
		canvas.height = Math.max(1, Math.floor(h * dpr));
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		device = getDevice(w);
		driftPx = ((w * driftVw) / 100) * driftFactor(device);
	};

	const computeRightStart = (w: number): number =>
		device === 'phone' ? 0.95 : device === 'tablet' ? 0.8 : 0.6;

	const spawnOne = (w: number, h: number): Petal => {
		const scale = rand(0.7, 1.2);
		const petalSize = size * scale;
		const vxFactor =
			device === 'phone'
				? rand(0.25, 0.55)
				: device === 'tablet'
					? rand(0.45, 0.85)
					: rand(0.6, 1.0);
		const baseVx = -speed * vxFactor;
		const baseVy = speed * (device === 'phone' ? rand(0.85, 1.25) : rand(0.7, 1.1));
		const rightStart = computeRightStart(w);
		const rightOverflow = device === 'phone' ? w * 0.15 : device === 'tablet' ? w * 0.08 : 40;
		const imgName = images[Math.floor(Math.random() * images.length)];
		return {
			x: rand(w * rightStart, w + rightOverflow),
			y: -rand(petalSize + 20, h * 0.15 + petalSize + 120),
			vx: baseVx,
			vy: baseVy,
			rot: rand(0, Math.PI * 2),
			vrot: pickSign() * rand(0.5, 1.4),
			scale,
			seed: Math.random() * 1000,
			skewAmp: rand(0.05, 0.18),
			skewFreq: rand(0.3, 0.8),
			flipAmp: rand(0.38, 0.52),
			flipFreq: rand(0.25, 0.65),
			imgName
		};
	};

	const initPetals = (): void => {
		petals = [];
	};

	const maybeRespawn = (p: Petal, w: number, h: number): void => {
		const margin = 60;
		if (p.x < -margin || p.y > h + margin) {
			if (canSpawn) Object.assign(p, spawnOne(w, h));
			else {
				p.x = -9999;
				p.y = h + 9999;
				p.vx = 0;
				p.vy = 0;
				p.vrot = 0;
			}
		}
	};

	const draw = (p: Petal, tMs: number): void => {
		const w = size * p.scale;
		const h = w;
		const t = tMs * 0.001;
		const phaseSkew = t * (Math.PI * 2 * p.skewFreq) + p.seed;
		const phaseFlip = t * (Math.PI * 2 * p.flipFreq) + p.seed * 1.37;
		const skewX = Math.sin(phaseSkew) * p.skewAmp;
		const scaleY = 1 - Math.sin(phaseFlip) * p.flipAmp;
		const im = loadedImgs[p.imgName];
		if (!im) return;
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.rot);
		ctx.transform(1, 0, skewX, scaleY, 0, 0);
		ctx.drawImage(im, -w / 2, -h / 2, w, h);
		ctx.restore();
	};

	let spawnPerSec = 2;
	let spawnAcc = 0;

	const trySpawnOverTime = (dt: number): void => {
		if (!canSpawn) return;
		spawnAcc += dt * spawnPerSec;
		while (spawnAcc >= 1 && petals.length < count) {
			petals.push(spawnOne(canvas.clientWidth, canvas.clientHeight));
			spawnAcc -= 1;
		}
	};

	const animate = (t: number): void => {
		if (!running) return;
		const dt = Math.min(0.04, (t - last) / 1000 || 0.016);
		trySpawnOverTime(dt);
		last = t;
		const w = canvas.clientWidth;
		const h = canvas.clientHeight;
		ctx.clearRect(0, 0, w, h);
		const wind = (seed: number): number => Math.sin(t * 0.0015 + seed) * driftPx;
		const maxLeftPerSec = device === 'phone' ? w * 0.2 : device === 'tablet' ? w * 0.3 : w * 0.4;
		for (const p of petals) {
			const windScale = clamp01((p.y + 80) / (h * 0.25));
			let dxPerSec = p.vx + wind(p.seed) * windScale;
			if (dxPerSec < -maxLeftPerSec) dxPerSec = -maxLeftPerSec;
			p.x += dxPerSec * dt;
			p.y += p.vy * dt;
			p.rot += p.vrot * dt;
			draw(p, t);
			maybeRespawn(p, w, h);
		}
		rafId = requestAnimationFrame(animate);
	};

	const onResize = (): void => setupCanvas();

	const start = async (): Promise<void> => {
		if (running) return;
		setupCanvas();
		initPetals();
		await loadImages();
		last = performance.now();
		running = true;
		rafId = requestAnimationFrame(animate);
		window.addEventListener('resize', onResize, { passive: true });
	};

	const destroy = (): void => {
		running = false;
		cancelAnimationFrame(rafId);
		window.removeEventListener('resize', onResize);
		canvas.remove();
	};

	const enableSpawning = (on: boolean): void => {
		canSpawn = on;
	};

	const isAlive = (): boolean => running;

	return { start, destroy, enableSpawning, isAlive };
};
