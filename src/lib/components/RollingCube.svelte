<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import gsap from 'gsap';

	type Direction = 'up' | 'down' | 'left' | 'right';

	interface Tile extends THREE.Mesh {
		light?: THREE.PointLight;
	}

	let container: HTMLDivElement;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let cube: THREE.Mesh;
	let cubeContainer: THREE.Group;
	let orbitControls: OrbitControls;
	let isAnimating = false;

	const gridTiles: Tile[] = [];
	let currentTile: Tile | null = null;

	const CUBE_SIZE = 0.8;
	const GRID_SIZE = 10;
	const TILE_HEIGHT = 0.1;
	const CAMERA_OFFSET = new THREE.Vector3(10, 10, 10);
	const ANIMATION_DURATION = 0.3;

	const ROTATION_AXES = {
		x: new THREE.Vector3(1, 0, 0),
		z: new THREE.Vector3(0, 0, 1)
	};

	const CUBE_COLORS = Array(6).fill(0xafc5d0);

	const createGridTiles = (): void => {
		const geometry = new THREE.BoxGeometry(0.9, TILE_HEIGHT, 0.9);
		const material = new THREE.MeshStandardMaterial({
			color: 0xafc5d0,
			emissive: 0x88ccff,
			emissiveIntensity: 0,
			transparent: true,
			opacity: 0.5
		});

		for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
			for (let z = -GRID_SIZE / 2; z < GRID_SIZE / 2; z++) {
				const tile = new THREE.Mesh(geometry, material.clone()) as Tile;
				tile.position.set(x + 0.5, TILE_HEIGHT / 2, z + 0.5);
				scene.add(tile);
				gridTiles.push(tile);
			}
		}
	};

	const setTileLight = (tile: Tile, on: boolean): void => {
		gsap.to(tile.material, {
			emissiveIntensity: on ? 1 : 0,
			duration: 0.3,
			ease: 'power2.out'
		});

		if (on && !tile.light) {
			const light = new THREE.PointLight(0x88ccff, 3, 5);
			light.position.set(tile.position.x, 1, tile.position.z);
			scene.add(light);
			tile.light = light;
		} else if (!on && tile.light) {
			scene.remove(tile.light);
			tile.light.dispose();
			tile.light = undefined;
		}
	};

	const animateTile = (x: number, z: number): void => {
		const tile = gridTiles.find(
			t => Math.abs(t.position.x - (x + 0.5)) < 0.01 && Math.abs(t.position.z - (z + 0.5)) < 0.01
		);

		if (!tile) {
			console.warn(`Tile not found at coordinates: ${x}, ${z}`);
			return;
		}

		const startTileY = TILE_HEIGHT / 2;
		const startCubeY = 0;

		gsap.timeline()
			.to([tile.position, cubeContainer.position], {
				y: (index) => index === 0 ? startTileY - 0.2 : startCubeY - 0.2,
				duration: 0.2,
				ease: 'power2.in'
			}, '+=0.1')
			.to([tile.position, cubeContainer.position], {
				y: (index) => index === 0 ? startTileY : startCubeY,
				duration: 0.8,
				ease: 'power2.out'
			});
	};

	const moveCube = (direction: Direction): void => {
		isAnimating = true;
		const animationTimeline = gsap.timeline();

		const currentX = Math.round(cubeContainer.position.x);
		const currentZ = Math.round(cubeContainer.position.z);
		let nextX = currentX;
		let nextZ = currentZ;

		switch (direction) {
			case 'up': nextZ -= 1; break;
			case 'down': nextZ += 1; break;
			case 'left': nextX -= 1; break;
			case 'right': nextX += 1; break;
		}

		const nextTile = gridTiles.find(
			t =>
				Math.abs(t.position.x - (nextX + 0.5)) < 0.01 &&
				Math.abs(t.position.z - (nextZ + 0.5)) < 0.01
		);

		switch (direction) {
			case 'up':
				console.time('up');
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					x: `-=${Math.PI / 2}`
				});
				animateTile(currentX, currentZ - 1);
				animationTimeline.then(() => {
					console.timeEnd('up');
					cubeContainer.position.z -= 1;
					cubeContainer.rotation.x = 0;
					cube.rotateOnWorldAxis(ROTATION_AXES.x, -Math.PI / 2);

					if (currentTile) setTileLight(currentTile, false);
					if (nextTile) setTileLight(nextTile, true);
					currentTile = nextTile || null;

					isAnimating = false;
				});
				break;

			case 'down':
				animationTimeline.set(cube.position, { z: '-=1' });
				animationTimeline.set(cubeContainer.position, { z: '+=1' });
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					x: `+=${Math.PI / 2}`
				});
				animateTile(currentX, currentZ + 1);
				animationTimeline.then(() => {
					cubeContainer.rotation.x = 0;
					cube.position.z += 1;
					cube.rotateOnWorldAxis(ROTATION_AXES.x, Math.PI / 2);

					if (currentTile) setTileLight(currentTile, false);
					if (nextTile) setTileLight(nextTile, true);
					currentTile = nextTile || null;

					isAnimating = false;
				});
				break;

			case 'left':
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					z: `+=${Math.PI / 2}`
				});
				animateTile(currentX - 1, currentZ);
				animationTimeline.then(() => {
					cubeContainer.position.x -= 1;
					cubeContainer.rotation.z = 0;
					cube.rotateOnWorldAxis(ROTATION_AXES.z, Math.PI / 2);

					if (currentTile) setTileLight(currentTile, false);
					if (nextTile) setTileLight(nextTile, true);
					currentTile = nextTile || null;

					isAnimating = false;
				});
				break;

			case 'right':
				animationTimeline.set(cube.position, { x: '-=1' });
				animationTimeline.set(cubeContainer.position, { x: '+=1' });
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					z: `-=${Math.PI / 2}`
				});
				animateTile(currentX + 1, currentZ);
				animationTimeline.then(() => {
					cubeContainer.rotation.z = 0;
					cube.position.x += 1;
					cube.rotateOnWorldAxis(ROTATION_AXES.z, -Math.PI / 2);

					if (currentTile) setTileLight(currentTile, false);
					if (nextTile) setTileLight(nextTile, true);
					currentTile = nextTile || null;

					isAnimating = false;
				});
				break;
		}
	};

	const handleKeyDown = (event: KeyboardEvent): void => {
		if (isAnimating) return;

		switch (event.key) {
			case 'ArrowUp': moveCube('up'); break;
			case 'ArrowDown': moveCube('down'); break;
			case 'ArrowLeft': moveCube('left'); break;
			case 'ArrowRight': moveCube('right'); break;
		}
	};

	const handleResize = (): void => {
		const width = container.clientWidth;
		const height = container.clientHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	};

	const animate = (): void => {
		requestAnimationFrame(animate);
		orbitControls.update();
		renderer.render(scene, camera);
	};

	const init = (): void => {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);

		const width = container.clientWidth;
		const height = container.clientHeight;

		camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
		camera.position.copy(CAMERA_OFFSET);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(width, height);
		container.appendChild(renderer.domElement);

		scene.add(new THREE.AmbientLight(0xffffff, 0.5));

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);

		createGridTiles();

		cubeContainer = new THREE.Group();
		scene.add(cubeContainer);

		const materials = CUBE_COLORS.map(
			(color) => new THREE.MeshBasicMaterial({ color, opacity: 0.5, transparent: true })
		);
		const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
		cube = new THREE.Mesh(geometry, materials);
		cube.position.set(0.5, 0.5, 0.5);
		cubeContainer.add(cube);

		const axesHelper = new THREE.AxesHelper(5);
		cubeContainer.add(axesHelper);

		orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.update();
		orbitControls.keys = {
			LEFT: 'ArrowLeft',
			UP: 'ArrowUp',
			RIGHT: 'ArrowRight',
			BOTTOM: 'ArrowDown'
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);

		animate();
	};

	onMount(() => {
		init();
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('resize', handleResize);
			renderer.dispose();
		};
	});
</script>

<div bind:this={container} class="w-full h-full" />

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>