<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	export let progress: number = 0;
	export let isVisible: boolean = false;

	let container: HTMLDivElement;
	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let animationId: number;
	let isRunning = false;

	// Lights to animate
	let ambientLight: THREE.AmbientLight;
	let pendantLight: THREE.PointLight;
	let fillLight: THREE.PointLight;
	let torusWallLight: THREE.PointLight;
	let neonLight1: THREE.PointLight;
	let neonLight2: THREE.PointLight;

	// Reactive light updates
	$: if (ambientLight) ambientLight.intensity = 0.08 + progress * 0.7;
	$: if (pendantLight) pendantLight.intensity = progress * 15;
	$: if (fillLight) fillLight.intensity = progress * 4;
	$: if (torusWallLight) torusWallLight.intensity = progress * 8;
	$: if (neonLight1) neonLight1.intensity = progress * 6;
	$: if (neonLight2) neonLight2.intensity = progress * 6;
	$: if (renderer) renderer.toneMappingExposure = 0.3 + progress * 1.4;

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

	// --- Toon helpers ---
	function createToonGradient(steps: number = 4): THREE.DataTexture {
		const data = new Uint8Array(steps);
		for (let i = 0; i < steps; i++) {
			data[i] = Math.round((255 * (i + 1)) / steps);
		}
		const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat);
		tex.minFilter = THREE.NearestFilter;
		tex.magFilter = THREE.NearestFilter;
		tex.needsUpdate = true;
		return tex;
	}

	function toon(color: number | string, gradientSteps: number = 4): THREE.MeshToonMaterial {
		return new THREE.MeshToonMaterial({
			color,
			gradientMap: createToonGradient(gradientSteps)
		});
	}

	function toonEmissive(
		color: number | string,
		emissive: number | string,
		emissiveIntensity: number = 0.5
	): THREE.MeshToonMaterial {
		return new THREE.MeshToonMaterial({
			color,
			emissive,
			emissiveIntensity,
			gradientMap: createToonGradient(3)
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
	// The "box" the camera looks into. Camera sits at z=CAM_DIST, box extends from z=0 to z=-DEPTH.
	// The opening at z=0 matches exactly the viewport bounds.
	// CAM_DIST and ROOM_W are computed from the actual canvas aspect in init().
	const FOV = 50;
	const DEPTH = 3;
	const ROOM_H = 3.5;
	const TAN_HALF_FOV = Math.tan((FOV * Math.PI) / 360);
	// Computed in init() from actual container dimensions
	let CAM_DIST = (ROOM_H / 2) / TAN_HALF_FOV;
	let ROOM_W = ROOM_H * (16 / 9); // default, recalculated in init()

	function createRoom() {
		// Back wall
		const backWall = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, ROOM_H),
			toon(0x8faab8, 3)
		);
		backWall.position.set(0, ROOM_H / 2, -DEPTH);
		backWall.receiveShadow = true;
		scene.add(backWall);

		// Floor
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, DEPTH),
			toon(0xc8b89a, 3)
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.set(0, 0, -DEPTH / 2);
		floor.receiveShadow = true;
		scene.add(floor);

		// Ceiling
		const ceiling = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, DEPTH),
			toon(0xe8ddd0, 3)
		);
		ceiling.rotation.x = Math.PI / 2;
		ceiling.position.set(0, ROOM_H, -DEPTH / 2);
		scene.add(ceiling);

		// Left wall
		const leftWall = new THREE.Mesh(
			new THREE.PlaneGeometry(DEPTH, ROOM_H),
			toon(0x9ab8a0, 3)
		);
		leftWall.rotation.y = Math.PI / 2;
		leftWall.position.set(-ROOM_W / 2, ROOM_H / 2, -DEPTH / 2);
		leftWall.receiveShadow = true;
		scene.add(leftWall);

		// Right wall
		const rightWall = new THREE.Mesh(
			new THREE.PlaneGeometry(DEPTH, ROOM_H),
			toon(0xb8a89a, 3)
		);
		rightWall.rotation.y = -Math.PI / 2;
		rightWall.position.set(ROOM_W / 2, ROOM_H / 2, -DEPTH / 2);
		rightWall.receiveShadow = true;
		scene.add(rightWall);

		// Baseboard
		const baseboardMat = toon(0x7a8a9a);
		// Back
		const bbBack = new THREE.Mesh(createRoundedBoxGeometry(ROOM_W, 0.1, 0.04, 0.015), baseboardMat);
		bbBack.position.set(0, 0.05, -DEPTH + 0.02);
		scene.add(bbBack);
		// Left
		const bbLeft = new THREE.Mesh(createRoundedBoxGeometry(0.04, 0.1, DEPTH, 0.015), baseboardMat);
		bbLeft.position.set(-ROOM_W / 2 + 0.02, 0.05, -DEPTH / 2);
		scene.add(bbLeft);
		// Right
		const bbRight = new THREE.Mesh(createRoundedBoxGeometry(0.04, 0.1, DEPTH, 0.015), baseboardMat);
		bbRight.position.set(ROOM_W / 2 - 0.02, 0.05, -DEPTH / 2);
		scene.add(bbRight);
	}

	function createWorkbench() {
		const woodMat = toon(0xd4944a);
		const metalMat = toon(0x7a8a9a);
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

		// Vise
		const viseBody = new THREE.Mesh(createRoundedBoxGeometry(0.2, 0.16, 0.2, 0.03), toon(0x5a6a7a));
		viseBody.position.set(benchX - 0.9, 1.05, backZ + 0.4);
		viseBody.castShadow = true;
		scene.add(viseBody);
		const handle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), toon(0xee6644));
		handle.position.set(benchX - 0.9, 1.05, backZ + 0.6);
		scene.add(handle);
	}

	function createPegboard() {
		const backZ = -DEPTH + 0.03;
		const boardX = -1.2;
		const boardY = 2.2;

		const board = new THREE.Mesh(
			createRoundedBoxGeometry(2.6, 1.3, 0.05, 0.05),
			toon(0xdcc8a0)
		);
		board.position.set(boardX, boardY, backZ);
		board.receiveShadow = true;
		scene.add(board);

		// Peg holes
		const pegMat = toon(0xc4b088);
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 7; col++) {
				const peg = new THREE.Mesh(new THREE.CircleGeometry(0.02, 8), pegMat);
				peg.position.set(boardX - 1.0 + col * 0.33, boardY - 0.4 + row * 0.33, backZ + 0.03);
				scene.add(peg);
			}
		}

		// Tools
		const z = backZ + 0.04;
		createToonWrench(boardX - 0.8, boardY, z);
		createToonHammer(boardX - 0.25, boardY, z);
		createToonScrewdrivers(boardX + 0.35, boardY - 0.1, z);
		createToonPliers(boardX + 0.9, boardY, z);
	}

	function createToonWrench(x: number, y: number, z: number) {
		const mat = toon(0x6a8aaa);
		const h = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.45, 8), mat);
		h.position.set(x, y, z);
		h.rotation.z = 0.1;
		scene.add(h);
		const head = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.016, 8, 12, Math.PI * 1.5), mat);
		head.position.set(x + 0.015, y + 0.24, z);
		head.rotation.z = 0.1;
		scene.add(head);
	}

	function createToonHammer(x: number, y: number, z: number) {
		const h = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.4, 8), toon(0xd4944a));
		h.position.set(x, y, z);
		scene.add(h);
		const head = new THREE.Mesh(createRoundedBoxGeometry(0.13, 0.06, 0.06, 0.015), toon(0x7a7a8a));
		head.position.set(x, y + 0.22, z);
		head.castShadow = true;
		scene.add(head);
	}

	function createToonScrewdrivers(x: number, y: number, z: number) {
		const colors = [0xee6644, 0x44aa88, 0xffcc44];
		for (let i = 0; i < 3; i++) {
			const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.08, 4, 8), toon(colors[i]));
			h.position.set(x + i * 0.15, y + 0.1, z);
			scene.add(h);
			const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2, 6), toon(0x889999));
			s.position.set(x + i * 0.15, y - 0.06, z);
			scene.add(s);
		}
	}

	function createToonPliers(x: number, y: number, z: number) {
		const mat = toon(0x6a8aaa);
		for (const side of [-1, 1]) {
			const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.18, 4, 8), mat);
			arm.position.set(x + side * 0.012, y, z);
			arm.rotation.z = side * 0.06;
			scene.add(arm);
		}
		for (const side of [-1, 1]) {
			const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.1, 4, 8), toon(0xee6644));
			h.position.set(x + side * 0.02, y - 0.16, z);
			h.rotation.z = side * 0.08;
			scene.add(h);
		}
		const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), toon(0x889999));
		pivot.position.set(x, y, z);
		scene.add(pivot);
	}

	function createToolCabinet() {
		const backZ = -DEPTH + 0.05;
		const cabX = 1.8;
		const z = backZ + 0.25;
		const cabinetMat = toon(0xdd4444);
		const handleMat = toon(0xeeeeee);

		const body = new THREE.Mesh(createRoundedBoxGeometry(0.7, 1.0, 0.45, 0.06), cabinetMat);
		body.position.set(cabX, 0.5, z);
		body.castShadow = true;
		body.receiveShadow = true;
		scene.add(body);

		const darkRed = toon(0xbb3333);
		for (let i = 0; i < 4; i++) {
			const line = new THREE.Mesh(createRoundedBoxGeometry(0.6, 0.01, 0.4, 0.003), darkRed);
			line.position.set(cabX, 0.15 + i * 0.22, z + 0.02);
			scene.add(line);
			const handle = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), handleMat);
			handle.position.set(cabX, 0.19 + i * 0.22, z + 0.24);
			scene.add(handle);
		}

		const topSurface = new THREE.Mesh(createRoundedBoxGeometry(0.72, 0.04, 0.47, 0.015), toon(0x444444));
		topSurface.position.set(cabX, 1.02, z);
		scene.add(topSurface);

		createTinyPlant(cabX + 0.15, 1.06, z);
	}

	function createTinyPlant(x: number, y: number, z: number) {
		const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.07, 10), toon(0xdd8855));
		pot.position.set(x, y + 0.035, z);
		scene.add(pot);
		const leafMat = toon(0x55cc66);
		for (const lp of [[0, 0.12, 0], [-0.025, 0.09, 0.01], [0.025, 0.1, -0.01], [0, 0.14, 0.01]]) {
			const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), leafMat);
			leaf.position.set(x + lp[0], y + lp[1], z + lp[2]);
			scene.add(leaf);
		}
	}

	function createShelving() {
		const rightX = ROOM_W / 2 - 0.1;
		const shelfZ = -DEPTH / 2;
		const metalMat = toon(0x7a8a9a);

		// Shelves attached to right wall
		for (let i = 0; i < 3; i++) {
			const s = new THREE.Mesh(createRoundedBoxGeometry(0.08, 0.04, 0.5, 0.015), toon(0x8a9aaa));
			s.position.set(rightX - 0.04, 0.6 + i * 0.7, shelfZ);
			s.receiveShadow = true;
			scene.add(s);

			// Bracket
			const bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), metalMat);
			bracket.position.set(rightX - 0.04, 0.45 + i * 0.7, shelfZ);
			scene.add(bracket);
		}

		// Boxes on shelves
		const boxColors = [0xffaa55, 0x55bbaa, 0xdd7799, 0xaabb55];
		for (let i = 0; i < 3; i++) {
			const box = new THREE.Mesh(
				createRoundedBoxGeometry(0.06, 0.18, 0.18 + Math.random() * 0.08, 0.02),
				toon(boxColors[i])
			);
			box.position.set(rightX - 0.04, 0.7 + i * 0.7, shelfZ - 0.05 + i * 0.05);
			box.castShadow = true;
			scene.add(box);
		}
	}

	function createStorageBins() {
		const backZ = -DEPTH + 0.04;
		const binColors = [0x5588cc, 0xee5555, 0x55cc77, 0xffcc44];

		for (let i = 0; i < 4; i++) {
			const bin = new THREE.Mesh(createRoundedBoxGeometry(0.18, 0.12, 0.12, 0.025), toon(binColors[i]));
			bin.position.set(-1.6 + i * 0.3, 1.05, backZ + 0.08);
			bin.castShadow = true;
			scene.add(bin);
		}
	}

	function createFloorDetails() {
		// Tires against left wall
		const leftX = -ROOM_W / 2 + 0.4;
		const tireMat = toon(0x444455);
		for (let i = 0; i < 3; i++) {
			const tire = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 10, 16), tireMat);
			tire.rotation.z = Math.PI / 2;
			tire.position.set(leftX, 0.22 + i * 0.18, -DEPTH * 0.6);
			tire.castShadow = true;
			scene.add(tire);
		}

		// Bucket
		const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.2, 12), toon(0x5588cc));
		bucket.position.set(ROOM_W / 2 - 0.5, 0.1, -DEPTH * 0.5);
		bucket.castShadow = true;
		scene.add(bucket);
		const bucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.01, 6, 12, Math.PI), toon(0x889999));
		bucketHandle.position.set(ROOM_W / 2 - 0.5, 0.22, -DEPTH * 0.5);
		scene.add(bucketHandle);

		// Oil stain
		const stain = new THREE.Mesh(new THREE.CircleGeometry(0.2, 16), toon(0x9a8a7a, 3));
		stain.rotation.x = -Math.PI / 2;
		stain.position.set(0.3, 0.005, -DEPTH / 2);
		scene.add(stain);
	}

	function createLighting() {
		const backZ = -DEPTH;

		ambientLight = new THREE.AmbientLight(0xfff0dd, 0.08);
		scene.add(ambientLight);

		// Pendant light — center of room
		pendantLight = new THREE.PointLight(0xffbb66, 0, 10);
		pendantLight.position.set(0, ROOM_H - 0.3, -DEPTH / 2);
		pendantLight.castShadow = true;
		pendantLight.shadow.mapSize.width = 1024;
		pendantLight.shadow.mapSize.height = 1024;
		pendantLight.shadow.radius = 4;
		scene.add(pendantLight);

		// Lamp fixture
		const fixtureMat = toon(0x444455);
		const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.4, 6), fixtureMat);
		cord.position.set(0, ROOM_H - 0.2, -DEPTH / 2);
		scene.add(cord);

		const shade = new THREE.Mesh(
			new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
			toon(0xffcc44)
		);
		shade.position.set(0, ROOM_H - 0.4, -DEPTH / 2);
		shade.rotation.x = Math.PI;
		scene.add(shade);

		const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), toonEmissive(0xffeeaa, 0xffcc66, 0.8));
		bulb.position.set(0, ROOM_H - 0.44, -DEPTH / 2);
		scene.add(bulb);

		// Fill light
		fillLight = new THREE.PointLight(0xffddcc, 0, 8);
		fillLight.position.set(0, 1.5, -DEPTH / 3);
		scene.add(fillLight);

		// Neon tubes above workbench
		const neonMat = toonEmissive(0xffffff, 0xddddff, 0.5);
		const neonZ = backZ + 0.8;

		const neon1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.7, 4, 8), neonMat);
		neon1.rotation.z = Math.PI / 2;
		neon1.position.set(-1.5, ROOM_H - 0.15, neonZ);
		scene.add(neon1);
		neonLight1 = new THREE.PointLight(0xeeeeff, 0, 4);
		neonLight1.position.set(-1.5, ROOM_H - 0.3, neonZ + 0.3);
		scene.add(neonLight1);

		const neon2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.7, 4, 8), neonMat);
		neon2.rotation.z = Math.PI / 2;
		neon2.position.set(-0.6, ROOM_H - 0.15, neonZ);
		scene.add(neon2);
		neonLight2 = new THREE.PointLight(0xeeeeff, 0, 4);
		neonLight2.position.set(-0.6, ROOM_H - 0.3, neonZ + 0.3);
		scene.add(neonLight2);

		// Orange torus wall lamp
		const torusLamp = new THREE.Mesh(
			new THREE.TorusGeometry(0.25, 0.04, 12, 32),
			toonEmissive(0xff8833, 0xff6600, 0.3)
		);
		torusLamp.position.set(1.5, 2.2, backZ + 0.06);
		scene.add(torusLamp);

		torusWallLight = new THREE.PointLight(0xff8833, 0, 6);
		torusWallLight.position.set(1.5, 2.2, backZ + 0.4);
		torusWallLight.castShadow = true;
		torusWallLight.shadow.mapSize.width = 512;
		torusWallLight.shadow.mapSize.height = 512;
		scene.add(torusWallLight);
	}

	function init() {
		// Compute room dimensions from actual canvas aspect
		const aspect = container.clientWidth / container.clientHeight;
		ROOM_W = ROOM_H * aspect;
		CAM_DIST = (ROOM_H / 2) / TAN_HALF_FOV;

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x1a1a2e);

		camera = new THREE.PerspectiveCamera(FOV, aspect, 0.1, 50);
		// Camera at the opening, looking straight into the box
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
		stopRenderLoop();
		window.removeEventListener('resize', handleResize);
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
