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
	let hasStarted = false;

	const tileHistory: Tile[] = [];
	const LIGHT_INTENSITIES = [1.3, 0.6, 0.3];

	const gridTiles: Tile[] = [];

	const CUBE_SIZE = 0.8;
	const GRID_SIZE = 100;
	const TILE_HEIGHT = 0.1;
	const CAMERA_OFFSET = new THREE.Vector3(8, 6, 8);
	const ANIMATION_DURATION = 0.3;

	const ROTATION_AXES = {
		x: new THREE.Vector3(1, 0, 0),
		z: new THREE.Vector3(0, 0, 1)
	};

	const CUBE_COLORS = Array(6).fill(0xafc5d0);

	let cameraTarget: THREE.Object3D;
	const cameraWorldTarget = new THREE.Vector3();
	const cameraPositionTarget = new THREE.Vector3();

	let lightSoundUp: HTMLAudioElement;
	let lightSoundRight: HTMLAudioElement;

	onMount(() => {
		lightSoundUp = new Audio('/swoosh1.mp3');
		lightSoundUp.volume = 0.5;
		lightSoundRight = new Audio('/swooshRight.mp3');
		lightSoundRight.volume = 0.5;
	});

	export const start = (): void => {
		hasStarted = true;
		gsap.to(cameraTarget.position, {
			x: 0,
			y: 0,
			z: 0,
			duration: 1,
			ease: 'power2.inOut'
		});
	};

	const createGridTiles = (): void => {
		const geometry = new THREE.BoxGeometry(0.9, TILE_HEIGHT, 0.9);
		const material = new THREE.MeshStandardMaterial({
			color: new THREE.Color(0xffffff),
			emissive: 0xee7a31,
			emissiveIntensity: 0,
			transparent: true,
			opacity: 1
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

	const setTileLight = (tile: Tile, intensity: number): void => {
		gsap.to(tile.material, {
			emissiveIntensity: intensity,
			duration: 1,
			ease: 'power2.out'
		});

		if (intensity > 0) {
			if (!tile.light) {
				const light = new THREE.PointLight(0xee7a31, intensity, 5);
				light.position.set(tile.position.x, 1, tile.position.z);
				scene.add(light);
				tile.light = light;
			} else {
				gsap.to(tile.light, {
					intensity,
					duration: 1,
					ease: 'power2.out'
				});
			}
		} else if (tile.light) {
			gsap.to(tile.light, {
				intensity: 0,
				duration: 1,
				ease: 'power2.out',
				onComplete: () => {
					if (tile.light) {
						scene.remove(tile.light);
						tile.light.dispose();
						tile.light = undefined;
					}
				}
			});
		}
	};

	const updateTileHistory = (tile: Tile): void => {
		if (!tile) return;

		const index = tileHistory.indexOf(tile);
		if (index !== -1) tileHistory.splice(index, 1);

		tileHistory.unshift(tile);

		if (tileHistory.length > 3) {
			const removed = tileHistory.pop();
			if (removed) setTileLight(removed, 0);
		}

		tileHistory.forEach((t, i) => {
			const intensity = LIGHT_INTENSITIES[i] ?? 0;
			if (intensity > 0) {
				lightSoundUp.currentTime = 0;
				lightSoundUp.play();
				// lightSoundRight.currentTime = 0;
				// lightSoundRight.play();
			}
			setTileLight(t, intensity);
		});
	};

	const animateTile = (x: number, z: number): void => {
		const tile = gridTiles.find(
			(t) => Math.abs(t.position.x - (x + 0.5)) < 0.01 && Math.abs(t.position.z - (z + 0.5)) < 0.01
		);

		if (!tile) {
			console.warn(`Tile not found at coordinates: ${x}, ${z}`);
			return;
		}

		const startTileY = TILE_HEIGHT / 2;
		const startCubeY = 0;

		gsap
			.timeline()
			.to(
				[tile.position, cubeContainer.position],
				{
					y: (index) => (index === 0 ? startTileY - 0.2 : startCubeY - 0.2),
					duration: 0.2,
					ease: 'power2.in'
				},
				'+=0.1'
			)
			.to([tile.position, cubeContainer.position], {
				y: (index) => (index === 0 ? startTileY : startCubeY),
				duration: 0.8,
				ease: 'power2.out'
			});
	};

	const animateCameraTarget = (dx: number, dz: number): void => {
		gsap.to(cameraTarget.position, {
			x: cameraTarget.position.x + dx,
			z: cameraTarget.position.z + dz,
			duration: ANIMATION_DURATION,
			ease: 'power2.inOut'
		});
	};

	const getTileAt = (x: number, z: number): Tile | undefined => {
		const tileX = Math.round(x);
		const tileZ = Math.round(z);

		return gridTiles.find(
			(t) =>
				Math.abs(t.position.x - (tileX + 0.5)) < 0.01 &&
				Math.abs(t.position.z - (tileZ + 0.5)) < 0.01
		);
	};

	const moveCube = (direction: Direction): void => {
		isAnimating = true;
		const animationTimeline = gsap.timeline();

		const currentX = Math.round(cubeContainer.position.x);
		const currentZ = Math.round(cubeContainer.position.z);
		let nextX = currentX;
		let nextZ = currentZ;

		switch (direction) {
			case 'up':
				nextZ -= 1;
				break;
			case 'down':
				nextZ += 1;
				break;
			case 'left':
				nextX -= 1;
				break;
			case 'right':
				nextX += 1;
				break;
		}

		const nextTile = getTileAt(nextX, nextZ);

		switch (direction) {
			case 'up':
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					x: `-=${Math.PI / 2}`
				});
				animateTile(currentX, currentZ - 1);
				animateCameraTarget(0, -1);
				animationTimeline.then(() => {
					cubeContainer.position.z -= 1;
					cubeContainer.rotation.x = 0;
					cube.rotateOnWorldAxis(ROTATION_AXES.x, -Math.PI / 2);
					if (nextTile) updateTileHistory(nextTile);

					updateTileVisibility(cubeContainer.position);
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
				animateCameraTarget(0, 1);
				animationTimeline.then(() => {
					cubeContainer.rotation.x = 0;
					cube.position.z += 1;
					cube.rotateOnWorldAxis(ROTATION_AXES.x, Math.PI / 2);
					if (nextTile) updateTileHistory(nextTile);
					updateTileVisibility(cubeContainer.position);
					isAnimating = false;
				});
				break;

			case 'left':
				animationTimeline.to(cubeContainer.rotation, {
					duration: ANIMATION_DURATION,
					z: `+=${Math.PI / 2}`
				});
				animateTile(currentX - 1, currentZ);
				animateCameraTarget(-1, 0);
				animationTimeline.then(() => {
					cubeContainer.position.x -= 1;
					cubeContainer.rotation.z = 0;
					cube.rotateOnWorldAxis(ROTATION_AXES.z, Math.PI / 2);
					if (nextTile) updateTileHistory(nextTile);
					updateTileVisibility(cubeContainer.position);
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
				animateCameraTarget(1, 0);
				animationTimeline.then(() => {
					cubeContainer.rotation.z = 0;
					cube.position.x += 1;
					cube.rotateOnWorldAxis(ROTATION_AXES.z, -Math.PI / 2);
					if (nextTile) updateTileHistory(nextTile);
					updateTileVisibility(cubeContainer.position);
					isAnimating = false;
				});
				break;
		}
	};

	const handleKeyDown = (event: KeyboardEvent): void => {
		if (!hasStarted) {
			start();
			return;
		}

		if (isAnimating) return;
		switch (event.key) {
			case 'ArrowUp':
				moveCube('up');
				break;
			case 'ArrowDown':
				moveCube('down');
				break;
			case 'ArrowLeft':
				moveCube('left');
				break;
			case 'ArrowRight':
				moveCube('right');
				break;
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
		cameraTarget.getWorldPosition(cameraWorldTarget);
		cameraPositionTarget.set(
			cameraWorldTarget.x + CAMERA_OFFSET.x,
			CAMERA_OFFSET.y,
			cameraWorldTarget.z + CAMERA_OFFSET.z
		);
		camera.position.lerp(cameraPositionTarget, 1);
		if (cameraTarget) {
			cameraTarget.getWorldPosition(cameraWorldTarget);
		}
		camera.lookAt(cameraWorldTarget);
		renderer.render(scene, camera);
	};

	const MAX_VISIBILITY_RADIUS = 4;
	const FULL_VISIBILITY_RADIUS = 1;

	const updateTileVisibility = (cubePos: THREE.Vector3): void => {
		const centerX = Math.round(cubePos.x);
		const centerZ = Math.round(cubePos.z);

		gridTiles.forEach((tile) => {
			const dx = Math.abs(tile.position.x - (centerX + 0.5));
			const dz = Math.abs(tile.position.z - (centerZ + 0.5));
			const distance = Math.sqrt(dx * dx + dz * dz);

			let targetOpacity = 0;

			if (distance <= FULL_VISIBILITY_RADIUS) {
				targetOpacity = 1;
			} else if (distance <= MAX_VISIBILITY_RADIUS) {
				const t =
					(distance - FULL_VISIBILITY_RADIUS) / (MAX_VISIBILITY_RADIUS - FULL_VISIBILITY_RADIUS);
				targetOpacity = THREE.MathUtils.lerp(1, 0, t);
			}

			gsap.to(tile.material, {
				opacity: targetOpacity,
				duration: 0.6,
				ease: 'power2.out'
			});
		});
	};

	const init = (): void => {
		scene = new THREE.Scene();
		const width = container.clientWidth;
		const height = container.clientHeight;

		camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
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

		updateTileVisibility(cubeContainer.position);

		cameraTarget = new THREE.Object3D();
		cameraTarget.position.set(-2, 0, 2);

		const materials = CUBE_COLORS.map(
			(color) => new THREE.MeshBasicMaterial({ color, opacity: 0.5, transparent: true })
		);
		const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
		cube = new THREE.Mesh(geometry, materials);
		cube.position.set(0.5, 0.5, 0.5);
		cubeContainer.add(cube);

		orbitControls = new OrbitControls(camera, renderer.domElement);
		orbitControls.update();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);

		const initialTile = getTileAt(0, 0);
		const tileY = TILE_HEIGHT / 2;
		const cubeStartY = 2;
		const cubeEndY = 0;

		cubeContainer.position.set(0, cubeStartY, 0);
		if (initialTile) initialTile.position.y = tileY;

		const tl = gsap.timeline();

		// tl.to(cubeContainer.position, {
		// 	y: cubeEndY,
		// 	duration: 0.6,
		// 	ease: 'expo.in'
		// })
		// 	.to(
		// 		[initialTile?.position, cubeContainer.position],
		// 		{
		// 			y: (i) => (i === 0 ? tileY - 0.4 : cubeEndY - 0.4),
		// 			duration: 0.2,
		// 			ease: 'expo.out'
		// 		},
		// 		'-=0'
		// 	)
		// 	.to([initialTile?.position, cubeContainer.position], {
		// 		y: (i) => (i === 0 ? tileY : cubeEndY),
		// 		duration: 0.5,
		// 		ease: 'power2.out'
		// 	})
		// 	.add(() => {
		// 		updateTileVisibility(cubeContainer.position);
		// 		if (initialTile) updateTileHistory(initialTile);
		// 	}, '+=0');

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

<div bind:this={container} class="flex h-full w-full items-center justify-center" />

<style>
	div {
		width: 100%;
		height: 100%;
	}
</style>
