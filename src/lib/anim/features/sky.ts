import type { ComponentType, SvelteComponent } from 'svelte';
import type { FeatureCtx } from '$lib/anim/master';
import type { Range } from '$lib/anim/ranges';

export interface CloudConfig {
	minClouds: number;
	maxClouds: number;
	minSpeed: number;
	maxSpeed: number;
	minScale: number;
	maxScale: number;
	minY: number;
	maxY: number;
	spawnInterval: number;
}

export interface Cloud {
	id: string;
	component: ComponentType;
	x: number;
	y: number;
	speed: number;
	scale: number;
	element?: HTMLElement;
	instance?: SvelteComponent;
}

export class SkyFactory {
	private clouds: Map<string, Cloud> = new Map();
	private container: HTMLElement | null = null;
	private animationFrame: number | null = null;
	private lastTime: number = 0;
	private cloudTypes: ComponentType[] = [];
	private config: CloudConfig;
	private spawnTimer: number | null = null;
	private cloudCounter: number = 0;

	constructor(
		container: HTMLElement | string,
		cloudComponents: ComponentType[],
		config: Partial<CloudConfig> = {}
	) {
		this.container = typeof container === 'string' ? document.getElementById(container) : container;

		if (!this.container) {
			throw new Error('Sky container not found');
		}

		this.cloudTypes = cloudComponents;

		this.config = {
			minClouds: 4,
			maxClouds: 5,
			minSpeed: 10,
			maxSpeed: 30,
			minScale: 0.8,
			maxScale: 1.2,
			minY: 10,
			maxY: 60,
			spawnInterval: 3000,
			...config
		};
	}

	init(): void {
		if (!this.container) return;

		this.destroy();

		const initialClouds = this.random(this.config.minClouds, this.config.maxClouds);

		for (let i = 0; i < initialClouds; i++) {
			const x = this.random(0, window.innerWidth);
			this.spawnCloud(x);
		}

		this.startAnimation();

		this.startSpawnTimer();
	}

	private spawnCloud(initialX?: number): void {
		if (!this.container) return;

		const id = `cloud-${++this.cloudCounter}`;

		const CloudComponent = this.cloudTypes[Math.floor(Math.random() * this.cloudTypes.length)];

		const cloud: Cloud = {
			id,
			component: CloudComponent,
			x: initialX ?? window.innerWidth + 100,
			y: this.random(this.config.minY, this.config.maxY),
			speed: this.random(this.config.minSpeed, this.config.maxSpeed),
			scale: this.random(this.config.minScale, this.config.maxScale)
		};

		const element = document.createElement('div');
		element.id = id;
		element.className = 'cloud absolute w-[30%] md:w-[15%]';
		element.style.cssText = `
      position: absolute;
      left: ${cloud.x}px;
      top: ${cloud.y}%;
      transform: scale(${cloud.scale});
      transition: none;
      will-change: transform;
      z-index: ${Math.floor(cloud.scale * 10)};
    `;

		this.container.appendChild(element);

		const instance = new CloudComponent({
			target: element,
			props: {
				id: id,
				className: `cloud-instance`
			}
		});

		cloud.element = element;
		cloud.instance = instance;

		this.clouds.set(id, cloud);
	}

	private startAnimation(): void {
		const animate = (currentTime: number) => {
			if (!this.lastTime) this.lastTime = currentTime;

			const deltaTime = (currentTime - this.lastTime) / 1000;
			this.lastTime = currentTime;

			this.updateClouds(deltaTime);

			this.animationFrame = requestAnimationFrame(animate);
		};

		this.animationFrame = requestAnimationFrame(animate);
	}

	private updateClouds(deltaTime: number): void {
		const cloudsToRemove: string[] = [];

		this.clouds.forEach((cloud, id) => {
			cloud.x -= cloud.speed * deltaTime;

			if (cloud.element) {
				cloud.element.style.left = `${cloud.x}px`;
			}

			const cloudWidth = cloud.element?.offsetWidth ?? 200;
			if (cloud.x < -cloudWidth * cloud.scale) {
				cloudsToRemove.push(id);
			}
		});

		cloudsToRemove.forEach((id) => this.removeCloud(id));
	}

	private removeCloud(id: string): void {
		const cloud = this.clouds.get(id);

		if (cloud) {
			cloud.instance?.$destroy();
			cloud.element?.remove();
			this.clouds.delete(id);
		}
	}

	private startSpawnTimer(): void {
		const spawn = () => {
			if (this.clouds.size < this.config.maxClouds) {
				this.spawnCloud();
			}

			const nextInterval = this.random(
				this.config.spawnInterval * 0.7,
				this.config.spawnInterval * 1.3
			);

			this.spawnTimer = window.setTimeout(spawn, nextInterval);
		};

		this.spawnTimer = window.setTimeout(spawn, this.config.spawnInterval);
	}

	pause(): void {
		if (this.animationFrame) {
			cancelAnimationFrame(this.animationFrame);
			this.animationFrame = null;
		}

		if (this.spawnTimer) {
			clearTimeout(this.spawnTimer);
			this.spawnTimer = null;
		}
	}

	resume(): void {
		if (!this.animationFrame) {
			this.lastTime = 0;
			this.startAnimation();
		}

		if (!this.spawnTimer) {
			this.startSpawnTimer();
		}
	}

	destroy(): void {
		this.pause();

		this.clouds.forEach((_, id) => this.removeCloud(id));
		this.clouds.clear();
	}

	private random(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	getCloudCount(): number {
		return this.clouds.size;
	}

	updateConfig(config: Partial<CloudConfig>): void {
		this.config = { ...this.config, ...config };
	}
}

export let skyFactoryInstance: SkyFactory | null = null;

const animateSkyContainer = (
	ctx: FeatureCtx,
	range: Range,
	options: {
		translateY: string;
		scale: number;
		duration: number;
		offset: number;
		ease?: string;
	}
): void => {
	const { gsap, tl } = ctx;
	const config = {
		container: '#skyContainer',
		ease: 'power2.out',
		...options
	};

	gsap.set(config.container, { transformOrigin: 'bottom center' });

	const skyTl = gsap.timeline().to(config.container, {
		y: config.translateY,
		scale: config.scale,
		ease: config.ease,
		duration: 1
	});

	skyTl.totalDuration(config.duration);

	tl.add(skyTl, range.start + config.offset);
};

export const buildSkyFeature = (ctx: FeatureCtx, range: Range): void => {
	animateSkyContainer(ctx, range, {
		translateY: '-10%',
		scale: 1.1,
		duration: 300,
		offset: 1800
	});

	animateSkyContainer(ctx, range, {
		translateY: '-30%',
		scale: 2,
		duration: 600,
		offset: 2600
	});
};

export const registerSkyFactory = (factory: SkyFactory): void => {
	skyFactoryInstance = factory;
};

export const getSkyFactory = (): SkyFactory | null => {
	return skyFactoryInstance;
};
