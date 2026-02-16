<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { theme } from '$lib/stores/theme';

	export let progress: number = 0;
	export let isVisible: boolean = false;

	let isDark = false;
	const unsubTheme = theme.subscribe((t) => (isDark = t === 'dark'));

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let animationId: number;
	let isRunning = false;

	// Lights to animate
	let ambientLight: THREE.AmbientLight;
	let pendantLight: THREE.PointLight;
	let fillLight: THREE.PointLight;
	let torusWallLight: THREE.PointLight;
	let neonLight1: THREE.PointLight;
	let neonLight2: THREE.PointLight;

	// Reactive light updates — warm ambient mood
	// In dark mode, lower exposure to dim the scene
	$: darkDim = isDark ? 0.55 : 1.0;
	$: if (ambientLight) ambientLight.intensity = (0.3 + progress * 2.2) * darkDim;
	$: if (pendantLight) pendantLight.intensity = progress * 4 * darkDim;
	$: if (fillLight) fillLight.intensity = progress * 3 * darkDim;
	$: if (torusWallLight) torusWallLight.intensity = progress * 3 * darkDim;
	$: if (neonLight1) neonLight1.intensity = progress * 1.5 * darkDim;
	$: if (neonLight2) neonLight2.intensity = progress * 1.5 * darkDim;
	$: if (renderer) renderer.toneMappingExposure = (0.6 + progress * 1.1) * darkDim;

	$: if (isVisible && renderer && !isRunning) {
		startRenderLoop();
	} else if (!isVisible && isRunning) {
		stopRenderLoop();
	}

	function startRenderLoop() {
		isRunning = true;
		animate();
	}

	function stopRenderLoop() {
		isRunning = false;
		if (animationId) cancelAnimationFrame(animationId);
	}

	function animate() {
		if (!isRunning) return;
		animationId = requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}

	function handleResize() {
		if (!container || !renderer || !camera) return;
		const w = container.clientWidth;
		const h = container.clientHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	}

	// --- Material palette ---
	const CLAY = 0xf2ebe0;
	const CLAY_DARK = 0xe4dacb;
	const CLAY_LIGHT = 0xf9f4ec;
	const METAL = 0xd8d4ce;

	function mat(color: number | string = CLAY, roughness = 0.85): THREE.MeshStandardMaterial {
		return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
	}

	function matAccent(color: number | string, roughness = 0.6): THREE.MeshStandardMaterial {
		return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
	}

	function matEmissive(
		color: number | string,
		emissive: number | string,
		emissiveIntensity: number = 0.5
	): THREE.MeshStandardMaterial {
		return new THREE.MeshStandardMaterial({
			color,
			emissive,
			emissiveIntensity,
			roughness: 0.4,
			metalness: 0
		});
	}

	function createRoundedBoxGeometry(
		w: number,
		h: number,
		d: number,
		r: number = 0.05
	): THREE.BufferGeometry {
		const shape = new THREE.Shape();
		const hw = w / 2 - r;
		const hh = h / 2 - r;
		shape.moveTo(-hw, -hh - r);
		shape.lineTo(hw, -hh - r);
		shape.quadraticCurveTo(hw + r, -hh - r, hw + r, -hh);
		shape.lineTo(hw + r, hh);
		shape.quadraticCurveTo(hw + r, hh + r, hw, hh + r);
		shape.lineTo(-hw, hh + r);
		shape.quadraticCurveTo(-hw - r, hh + r, -hw - r, hh);
		shape.lineTo(-hw - r, -hh);
		shape.quadraticCurveTo(-hw - r, -hh - r, -hw, -hh - r);
		const geo = new THREE.ExtrudeGeometry(shape, {
			depth: d,
			bevelEnabled: true,
			bevelThickness: r * 0.5,
			bevelSize: r * 0.5,
			bevelSegments: 3
		});
		geo.center();
		return geo;
	}

	// --- Room geometry ---
	const FOV = 50;
	const DEPTH = 3;
	const ROOM_H = 3.5;
	const TAN_HALF_FOV = Math.tan((FOV * Math.PI) / 360);
	let CAM_DIST = (ROOM_H / 2) / TAN_HALF_FOV;
	let ROOM_W = ROOM_H * (16 / 9);

	function createRoom() {
		const loader = new GLTFLoader();
		loader.load('/models/3D Room.glb', (gltf) => {
			const model = gltf.scene;

			// Rotate 180° on Y axis (face the camera)
			model.rotation.y = Math.PI;

			// Scale to match room dimensions
			const box = new THREE.Box3().setFromObject(model);
			const size = box.getSize(new THREE.Vector3());
			const scaleX = ROOM_W / size.x;
			const scaleY = ROOM_H / size.y;
			const scaleZ = DEPTH / size.z;
			model.scale.set(scaleX, scaleY, scaleZ);

			// Recompute bounding box after scaling
			box.setFromObject(model);
			const center = box.getCenter(new THREE.Vector3());

			// Position: centered horizontally, bottom at y=0, back wall at z=-DEPTH
			model.position.set(
				-center.x,
				-box.min.y,
				-DEPTH - box.min.z
			);

			// Enable shadows on all meshes
			model.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});

			scene.add(model);
		});
	}

	function createWorkbench() {
		const woodMat = mat(CLAY_DARK);
		const metalMat = mat(METAL, 0.7);
		const backZ = -DEPTH + 0.05;
		const benchX = -1.2;

		// Workbench top
		const top = new THREE.Mesh(createRoundedBoxGeometry(2.8, 0.12, 0.7, 0.05), woodMat);
		top.position.set(benchX, 0.9, backZ + 0.35);
		top.castShadow = true;
		top.receiveShadow = true;
		scene.add(top);

		// Legs
		const legGeo = new THREE.CylinderGeometry(0.05, 0.065, 0.9, 12);
		for (const lx of [benchX - 1.2, benchX + 1.2]) {
			const leg = new THREE.Mesh(legGeo, metalMat);
			leg.position.set(lx, 0.45, backZ + 0.5);
			leg.castShadow = true;
			scene.add(leg);
			const foot = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), metalMat);
			foot.position.set(lx, 0.02, backZ + 0.5);
			scene.add(foot);
		}

		// Lower shelf
		const shelf = new THREE.Mesh(createRoundedBoxGeometry(2.4, 0.06, 0.5, 0.02), woodMat);
		shelf.position.set(benchX, 0.3, backZ + 0.35);
		scene.add(shelf);

		// Vise — accent color
		const viseBody = new THREE.Mesh(createRoundedBoxGeometry(0.2, 0.16, 0.2, 0.03), mat(METAL, 0.7));
		viseBody.position.set(benchX - 0.9, 1.05, backZ + 0.4);
		viseBody.castShadow = true;
		scene.add(viseBody);
		const handle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), matAccent(0xe85d3a));
		handle.position.set(benchX - 0.9, 1.05, backZ + 0.6);
		scene.add(handle);
	}

	function createPegboard() {
		const backZ = -DEPTH + 0.03;
		const boardX = -1.2;
		const boardY = 2.2;

		const board = new THREE.Mesh(
			createRoundedBoxGeometry(2.6, 1.3, 0.05, 0.05),
			mat(CLAY)
		);
		board.position.set(boardX, boardY, backZ);
		board.receiveShadow = true;
		scene.add(board);

		// Peg holes
		const pegMat = mat(CLAY_DARK);
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 7; col++) {
				const peg = new THREE.Mesh(new THREE.CircleGeometry(0.02, 8), pegMat);
				peg.position.set(boardX - 1.0 + col * 0.33, boardY - 0.4 + row * 0.33, backZ + 0.03);
				scene.add(peg);
			}
		}

		// Tools
		const z = backZ + 0.04;
		createWrench(boardX - 0.8, boardY, z);
		createHammer(boardX - 0.25, boardY, z);
		createScrewdrivers(boardX + 0.35, boardY - 0.1, z);
		createPliers(boardX + 0.9, boardY, z);
	}

	function createWrench(x: number, y: number, z: number) {
		const m = mat(METAL, 0.7);
		const h = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.45, 8), m);
		h.position.set(x, y, z);
		h.rotation.z = 0.1;
		scene.add(h);
		const head = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.016, 8, 12, Math.PI * 1.5), m);
		head.position.set(x + 0.015, y + 0.24, z);
		head.rotation.z = 0.1;
		scene.add(head);
	}

	function createHammer(x: number, y: number, z: number) {
		const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.4, 8), mat(CLAY_DARK));
		h.position.set(x, y, z);
		scene.add(h);
		const head = new THREE.Mesh(createRoundedBoxGeometry(0.13, 0.06, 0.06, 0.015), mat(METAL, 0.7));
		head.position.set(x, y + 0.22, z);
		head.castShadow = true;
		scene.add(head);
	}

	function createScrewdrivers(x: number, y: number, z: number) {
		// Accent colors on the handles
		const colors = [0xe85d3a, 0x3a9e7e, 0xf0b429];
		for (let i = 0; i < 3; i++) {
			const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 4, 8), matAccent(colors[i]));
			h.position.set(x + i * 0.15, y + 0.1, z);
			scene.add(h);
			const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6), mat(METAL, 0.7));
			s.position.set(x + i * 0.15, y - 0.06, z);
			scene.add(s);
		}
	}

	function createPliers(x: number, y: number, z: number) {
		const m = mat(METAL, 0.7);
		for (const side of [-1, 1]) {
			const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.18, 4, 8), m);
			arm.position.set(x + side * 0.012, y, z);
			arm.rotation.z = side * 0.06;
			scene.add(arm);
		}
		for (const side of [-1, 1]) {
			const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.1, 4, 8), matAccent(0xe85d3a));
			h.position.set(x + side * 0.02, y - 0.16, z);
			h.rotation.z = side * 0.08;
			scene.add(h);
		}
		const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), m);
		pivot.position.set(x, y, z);
		scene.add(pivot);
	}

	function createToolCabinet() {
		const backZ = -DEPTH + 0.05;
		const cabX = 1.8;
		const z = backZ + 0.25;

		// Cabinet — accent red
		const body = new THREE.Mesh(createRoundedBoxGeometry(0.7, 1.0, 0.45, 0.06), matAccent(0xd44040));
		body.position.set(cabX, 0.5, z);
		body.castShadow = true;
		body.receiveShadow = true;
		scene.add(body);

		const darkRed = matAccent(0xb33030);
		for (let i = 0; i < 4; i++) {
			const line = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.01, 0.4, 0.003), darkRed);
			line.position.set(cabX, 0.15 + i * 0.22, z + 0.02);
			scene.add(line);
			const handle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), mat(CLAY_LIGHT, 0.5));
			handle.position.set(cabX, 0.19 + i * 0.22, z + 0.24);
			scene.add(handle);
		}

		const topSurface = new THREE.Mesh(createRoundedBoxGeometry(0.72, 0.04, 0.47, 0.015), mat(CLAY_DARK));
		topSurface.position.set(cabX, 1.02, z);
		scene.add(topSurface);

		createTinyPlant(cabX + 0.15, 1.06, z);
	}

	function createTinyPlant(x: number, y: number, z: number) {
		const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.07, 10), matAccent(0xd4855a));
		pot.position.set(x, y + 0.035, z);
		scene.add(pot);
		// Accent green
		const leafMat = matAccent(0x4aba6a);
		for (const lp of [[0, 0.12, 0], [-0.025, 0.09, 0.01], [0.025, 0.1, -0.01], [0, 0.14, 0.01]]) {
			const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), leafMat);
			leaf.position.set(x + lp[0], y + lp[1], z + lp[2]);
			scene.add(leaf);
		}
	}

	function createShelving() {
		const rightX = ROOM_W / 2 - 0.1;
		const shelfZ = -DEPTH / 2;
		const metalMat = mat(METAL, 0.7);

		for (let i = 0; i < 3; i++) {
			const s = new THREE.Mesh(createRoundedBoxGeometry(0.08, 0.04, 0.5, 0.015), mat(CLAY_DARK));
			s.position.set(rightX - 0.04, 0.6 + i * 0.7, shelfZ);
			s.receiveShadow = true;
			scene.add(s);

			const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), metalMat);
			bracket.position.set(rightX - 0.04, 0.45 + i * 0.7, shelfZ);
			scene.add(bracket);
		}

		// Colored boxes — accent touches
		const boxColors = [0xf0b429, 0x3a9e7e, 0xd46080, 0x5a8abf];
		for (let i = 0; i < 3; i++) {
			const box = new THREE.Mesh(
				createRoundedBoxGeometry(0.06, 0.18, 0.18 + Math.random() * 0.08, 0.02),
				matAccent(boxColors[i])
			);
			box.position.set(rightX - 0.04, 0.7 + i * 0.7, shelfZ - 0.05 + i * 0.05);
			box.castShadow = true;
			scene.add(box);
		}
	}

	function createStorageBins() {
		const backZ = -DEPTH + 0.04;
		// Accent colored bins
		const binColors = [0x5a8abf, 0xe85d3a, 0x4aba6a, 0xf0b429];

		for (let i = 0; i < 4; i++) {
			const bin = new THREE.Mesh(createRoundedBoxGeometry(0.18, 0.12, 0.12, 0.025), matAccent(binColors[i]));
			bin.position.set(-1.6 + i * 0.3, 1.05, backZ + 0.08);
			bin.castShadow = true;
			scene.add(bin);
		}
	}

	function createFloorDetails() {
		// Tires — dark clay
		const leftX = -ROOM_W / 2 + 0.4;
		const tireMat = mat(0x8a8580, 0.95);
		for (let i = 0; i < 3; i++) {
			const tire = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 10, 16), tireMat);
			tire.rotation.z = Math.PI / 2;
			tire.position.set(leftX, 0.22 + i * 0.18, -DEPTH * 0.6);
			tire.castShadow = true;
			scene.add(tire);
		}

		// Bucket — accent blue
		const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.2, 12), matAccent(0x5a8abf));
		bucket.position.set(ROOM_W / 2 - 0.5, 0.1, -DEPTH * 0.5);
		bucket.castShadow = true;
		scene.add(bucket);
		const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.01, 6, 12, Math.PI), mat(METAL, 0.7));
		bucketHandle.position.set(ROOM_W / 2 - 0.5, 0.22, -DEPTH * 0.5);
		scene.add(bucketHandle);

		// Oil stain — subtle
		const stain = new THREE.Mesh(
			new THREE.CircleGeometry(0.2, 16),
			new THREE.MeshStandardMaterial({ color: 0xc8c0b8, roughness: 0.95, metalness: 0, transparent: true, opacity: 0.4 })
		);
		stain.rotation.x = -Math.PI / 2;
		stain.position.set(0.3, 0.005, -DEPTH / 2);
		scene.add(stain);
	}

	function createLighting() {
		const backZ = -DEPTH;

		ambientLight = new THREE.AmbientLight(0xffe8cc, 0.1);
		scene.add(ambientLight);

		// Pendant light — warm amber
		pendantLight = new THREE.PointLight(0xffddaa, 0, 10);
		pendantLight.position.set(0, ROOM_H - 0.3, -DEPTH / 2);
		pendantLight.castShadow = true;
		pendantLight.shadow.mapSize.width = 1024;
		pendantLight.shadow.mapSize.height = 1024;
		pendantLight.shadow.radius = 4;
		scene.add(pendantLight);

		// Lamp fixture — clay with yellow accent shade
		const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6), mat(CLAY_DARK));
		cord.position.set(0, ROOM_H - 0.2, -DEPTH / 2);
		scene.add(cord);

		const shade = new THREE.Mesh(
			new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
			matAccent(0xf0b429)
		);
		shade.position.set(0, ROOM_H - 0.4, -DEPTH / 2);
		shade.rotation.x = Math.PI;
		scene.add(shade);

		const bulb = new THREE.Mesh(
			new THREE.SphereGeometry(0.06, 10, 10),
			matEmissive(0xfff8ee, 0xffeecc, 0.8)
		);
		bulb.position.set(0, ROOM_H - 0.44, -DEPTH / 2);
		scene.add(bulb);

		// Fill light — warm
		fillLight = new THREE.PointLight(0xffe0b0, 0, 8);
		fillLight.position.set(0, 1.5, -DEPTH / 3);
		scene.add(fillLight);

		// Neon tubes — warm amber
		const neonMat = matEmissive(0xffd9a0, 0xffbb66, 0.5);
		const neonZ = backZ + 0.8;

		const neon1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.7, 4, 8), neonMat);
		neon1.rotation.z = Math.PI / 2;
		neon1.position.set(-1.5, ROOM_H - 0.15, neonZ);
		scene.add(neon1);
		neonLight1 = new THREE.PointLight(0xffcc88, 0, 4);
		neonLight1.position.set(-1.5, ROOM_H - 0.3, neonZ + 0.3);
		scene.add(neonLight1);

		const neon2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.7, 4, 8), neonMat);
		neon2.rotation.z = Math.PI / 2;
		neon2.position.set(-0.6, ROOM_H - 0.15, neonZ);
		scene.add(neon2);
		neonLight2 = new THREE.PointLight(0xffcc88, 0, 4);
		neonLight2.position.set(-0.6, ROOM_H - 0.3, neonZ + 0.3);
		scene.add(neonLight2);

		// Orange torus wall lamp — accent
		const torusLamp = new THREE.Mesh(
			new THREE.TorusGeometry(0.25, 0.04, 12, 32),
			matEmissive(0xff8833, 0xff6600, 0.3)
		);
		torusLamp.position.set(1.5, 2.2, backZ + 0.06);
		scene.add(torusLamp);

		torusWallLight = new THREE.PointLight(0xff8833, 0, 6);
		torusWallLight.position.set(1.5, 2.2, backZ + 0.4);
		scene.add(torusWallLight);
	}

	function init() {
		const aspect = container.clientWidth / container.clientHeight;
		ROOM_W = ROOM_H * aspect;
		CAM_DIST = (ROOM_H / 2) / TAN_HALF_FOV;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf5f1ec);

		camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 50);
		camera.position.set(0, ROOM_H / 2, CAM_DIST);
		camera.lookAt(0, ROOM_H / 2, 0);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.3;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, ROOM_H / 2, -DEPTH / 2);
		controls.enableDamping = true;
		controls.dampingFactor = 0.08;

		createRoom();
		createWorkbench();
		createPegboard();
		createStorageBins();
		createToolCabinet();
		createShelving();
		createFloorDetails();
		createLighting();
	}

	onMount(() => {
		init();
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		unsubTheme();
		stopRenderLoop();
		window.removeEventListener('resize', handleResize);
		if (controls) controls.dispose();
		if (renderer) {
			renderer.dispose();
			scene?.traverse((obj) => {
				if (obj instanceof THREE.Mesh) {
					obj.geometry.dispose();
					if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
					else obj.material.dispose();
				}
			});
		}
	});
</script>

<div bind:this={container} class="h-full w-full" />
