<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	export let progress: number = 0;
	export let isVisible: boolean = false;

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
	let neonLight1: THREE.RectAreaLight | THREE.PointLight;
	let neonLight2: THREE.RectAreaLight | THREE.PointLight;
	let fillLight: THREE.PointLight;

	// Reactive light updates
	$: if (ambientLight) ambientLight.intensity = 0.05 + progress * 0.4;
	$: if (pendantLight) pendantLight.intensity = progress * 25;
	$: if (neonLight1) neonLight1.intensity = progress * 12;
	$: if (neonLight2) neonLight2.intensity = progress * 12;
	$: if (fillLight) fillLight.intensity = progress * 6;
	$: if (renderer) renderer.toneMappingExposure = 0.3 + progress * 1.2;

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

	// --- Procedural textures ---

	function createConcreteTexture(): THREE.CanvasTexture {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d')!;

		ctx.fillStyle = '#7a7a7a';
		ctx.fillRect(0, 0, 512, 512);

		// Noise for concrete look
		for (let i = 0; i < 15000; i++) {
			const x = Math.random() * 512;
			const y = Math.random() * 512;
			const v = Math.random() * 30 - 15;
			ctx.fillStyle = `rgba(${122 + v}, ${122 + v}, ${122 + v}, 0.4)`;
			ctx.fillRect(x, y, 1 + Math.random(), 1 + Math.random());
		}

		// Cracks
		ctx.strokeStyle = 'rgba(60, 60, 60, 0.15)';
		ctx.lineWidth = 0.5;
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			let cx = Math.random() * 512;
			let cy = Math.random() * 512;
			ctx.moveTo(cx, cy);
			for (let j = 0; j < 8; j++) {
				cx += (Math.random() - 0.5) * 80;
				cy += (Math.random() - 0.5) * 80;
				ctx.lineTo(cx, cy);
			}
			ctx.stroke();
		}

		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		return tex;
	}

	function createWallTexture(): THREE.CanvasTexture {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d')!;

		ctx.fillStyle = '#8a8a88';
		ctx.fillRect(0, 0, 256, 256);

		for (let i = 0; i < 8000; i++) {
			const x = Math.random() * 256;
			const y = Math.random() * 256;
			const v = Math.random() * 12 - 6;
			ctx.fillStyle = `rgba(${138 + v}, ${138 + v}, ${136 + v}, 0.3)`;
			ctx.fillRect(x, y, 1, 1);
		}

		const tex = new THREE.CanvasTexture(canvas);
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		return tex;
	}

	// --- Scene builders ---

	function createRoom() {
		const roomW = 14;
		const roomD = 14;
		const roomH = 4;

		const floorMap = createConcreteTexture();
		floorMap.repeat.set(4, 4);

		const floorMat = new THREE.MeshStandardMaterial({
			map: floorMap,
			roughness: 0.85,
			metalness: 0.05,
			color: 0x666666
		});

		const wallMap = createWallTexture();
		wallMap.repeat.set(3, 1);

		const wallMat = new THREE.MeshStandardMaterial({
			map: wallMap,
			roughness: 0.9,
			metalness: 0,
			color: 0x888886
		});

		const ceilingMat = new THREE.MeshStandardMaterial({
			color: 0x555555,
			roughness: 0.95
		});

		// Floor
		const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), floorMat);
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);

		// Back wall
		const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomH), wallMat);
		backWall.position.set(0, roomH / 2, -roomD / 2);
		backWall.receiveShadow = true;
		scene.add(backWall);

		// Left wall
		const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat.clone());
		leftWall.rotation.y = Math.PI / 2;
		leftWall.position.set(-roomW / 2, roomH / 2, 0);
		leftWall.receiveShadow = true;
		scene.add(leftWall);

		// Right wall
		const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomD, roomH), wallMat.clone());
		rightWall.rotation.y = -Math.PI / 2;
		rightWall.position.set(roomW / 2, roomH / 2, 0);
		rightWall.receiveShadow = true;
		scene.add(rightWall);

		// Ceiling
		const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), ceilingMat);
		ceiling.rotation.x = Math.PI / 2;
		ceiling.position.y = roomH;
		scene.add(ceiling);
	}

	function createWorkbench() {
		const woodMat = new THREE.MeshStandardMaterial({
			color: 0x8b6914,
			roughness: 0.7,
			metalness: 0.02
		});
		const metalMat = new THREE.MeshStandardMaterial({
			color: 0x555555,
			roughness: 0.4,
			metalness: 0.7
		});

		// Workbench top
		const top = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 0.9), woodMat);
		top.position.set(-2, 0.95, -6.5);
		top.castShadow = true;
		top.receiveShadow = true;
		scene.add(top);

		// Legs
		const legGeo = new THREE.BoxGeometry(0.08, 0.95, 0.08);
		const legPositions = [
			[-3.9, 0.475, -6.1],
			[-0.1, 0.475, -6.1],
			[-3.9, 0.475, -6.85],
			[-0.1, 0.475, -6.85]
		];
		for (const p of legPositions) {
			const leg = new THREE.Mesh(legGeo, metalMat);
			leg.position.set(p[0], p[1], p[2]);
			leg.castShadow = true;
			scene.add(leg);
		}

		// Lower shelf
		const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.05, 0.7), woodMat);
		shelf.position.set(-2, 0.3, -6.5);
		scene.add(shelf);

		// Vise
		const viseMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.8 });
		const viseBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.25), viseMat);
		viseBody.position.set(-3.5, 1.08, -6.5);
		viseBody.castShadow = true;
		scene.add(viseBody);

		const viseJaw = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.04), viseMat);
		viseJaw.position.set(-3.5, 1.1, -6.32);
		scene.add(viseJaw);
	}

	function createPegboard() {
		const boardMat = new THREE.MeshStandardMaterial({
			color: 0x9e8c6c,
			roughness: 0.8
		});

		// Pegboard
		const board = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 0.05), boardMat);
		board.position.set(-2, 2.5, -6.95);
		board.receiveShadow = true;
		scene.add(board);

		// Tool silhouettes on pegboard
		const toolMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.6 });

		// Wrench
		const wrench = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.02), toolMat);
		wrench.position.set(-3.2, 2.5, -6.9);
		wrench.rotation.z = 0.1;
		wrench.castShadow = true;
		scene.add(wrench);

		// Hammer
		const hammerHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.03), toolMat);
		hammerHandle.position.set(-2.7, 2.5, -6.9);
		scene.add(hammerHandle);

		const hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.04), toolMat);
		hammerHead.position.set(-2.7, 2.8, -6.9);
		hammerHead.castShadow = true;
		scene.add(hammerHead);

		// Screwdrivers
		for (let i = 0; i < 3; i++) {
			const sd = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.4 + i * 0.05, 0.02), toolMat);
			sd.position.set(-2.1 + i * 0.15, 2.4, -6.9);
			scene.add(sd);
		}

		// Pliers
		const pliers = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 0.02), toolMat);
		pliers.position.set(-1.3, 2.5, -6.9);
		scene.add(pliers);
	}

	function createShelving() {
		const metalMat = new THREE.MeshStandardMaterial({
			color: 0x5a5a5a,
			roughness: 0.4,
			metalness: 0.7
		});
		const shelfMat = new THREE.MeshStandardMaterial({
			color: 0x666666,
			roughness: 0.6,
			metalness: 0.3
		});

		// Right wall shelving unit
		const unitX = 5;
		const unitZ = -4;

		// Uprights
		const uprightGeo = new THREE.BoxGeometry(0.05, 3.5, 0.05);
		const uprightPositions = [
			[unitX, 1.75, unitZ - 0.6],
			[unitX, 1.75, unitZ + 0.6],
			[unitX + 1.5, 1.75, unitZ - 0.6],
			[unitX + 1.5, 1.75, unitZ + 0.6]
		];
		for (const p of uprightPositions) {
			const upright = new THREE.Mesh(uprightGeo, metalMat);
			upright.position.set(p[0], p[1], p[2]);
			scene.add(upright);
		}

		// Shelves
		const shelfGeo = new THREE.BoxGeometry(1.5, 0.04, 1.2);
		for (let i = 0; i < 4; i++) {
			const s = new THREE.Mesh(shelfGeo, shelfMat);
			s.position.set(unitX + 0.75, 0.3 + i * 1, unitZ);
			s.receiveShadow = true;
			scene.add(s);
		}

		// Boxes on shelves
		const boxColors = [0xcc8844, 0x886644, 0xaa7744, 0x997755];
		for (let i = 0; i < 3; i++) {
			const boxMat = new THREE.MeshStandardMaterial({
				color: boxColors[i],
				roughness: 0.85
			});
			const box = new THREE.Mesh(
				new THREE.BoxGeometry(0.4 + Math.random() * 0.2, 0.3 + Math.random() * 0.15, 0.5),
				boxMat
			);
			box.position.set(unitX + 0.4 + i * 0.5, 0.5 + Math.floor(i / 2) * 1, unitZ);
			box.castShadow = true;
			scene.add(box);
		}
	}

	function createStorageBins() {
		const binColors = [0x3366aa, 0xcc4444, 0x44aa55, 0xddaa33];

		// Small bins on workbench back
		for (let i = 0; i < 4; i++) {
			const binMat = new THREE.MeshStandardMaterial({
				color: binColors[i],
				roughness: 0.7
			});
			const bin = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.2), binMat);
			bin.position.set(-3.2 + i * 0.35, 1.1, -6.75);
			bin.castShadow = true;
			scene.add(bin);
		}
	}

	function createToolCabinet() {
		const cabinetMat = new THREE.MeshStandardMaterial({
			color: 0xcc2222,
			roughness: 0.4,
			metalness: 0.5
		});
		const handleMat = new THREE.MeshStandardMaterial({
			color: 0xcccccc,
			roughness: 0.2,
			metalness: 0.8
		});

		// Main body
		const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), cabinetMat);
		body.position.set(4, 0.6, -6.2);
		body.castShadow = true;
		body.receiveShadow = true;
		scene.add(body);

		// Drawers (lines)
		const lineMat = new THREE.MeshStandardMaterial({ color: 0x991111, roughness: 0.5 });
		for (let i = 0; i < 5; i++) {
			const line = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.01, 0.48), lineMat);
			line.position.set(4, 0.15 + i * 0.22, -6.19);
			scene.add(line);

			// Handle
			const handle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.02), handleMat);
			handle.position.set(4, 0.2 + i * 0.22, -5.94);
			scene.add(handle);
		}

		// Top surface
		const topMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.3 });
		const topSurface = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.03, 0.52), topMat);
		topSurface.position.set(4, 1.21, -6.2);
		scene.add(topSurface);
	}

	function createDoorFrame() {
		const frameMat = new THREE.MeshStandardMaterial({
			color: 0x777777,
			roughness: 0.5,
			metalness: 0.4
		});

		// Linteau (top beam)
		const linteau = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 0.15), frameMat);
		linteau.position.set(0, 3.85, 7);
		scene.add(linteau);

		// Left jamb
		const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4, 0.15), frameMat);
		leftJamb.position.set(-7, 2, 7);
		scene.add(leftJamb);

		// Right jamb
		const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4, 0.15), frameMat);
		rightJamb.position.set(7, 2, 7);
		scene.add(rightJamb);

		// Rail tracks (for roller shutter)
		const railMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.3, metalness: 0.6 });
		const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4, 0.06), railMat);
		leftRail.position.set(-6.85, 2, 6.95);
		scene.add(leftRail);

		const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4, 0.06), railMat);
		rightRail.position.set(6.85, 2, 6.95);
		scene.add(rightRail);
	}

	function createLighting() {
		// Dim ambient
		ambientLight = new THREE.AmbientLight(0xffeedd, 0.05);
		scene.add(ambientLight);

		// Pendant light (warm bulb, center of room)
		pendantLight = new THREE.PointLight(0xffaa44, 0, 15);
		pendantLight.position.set(0, 3.5, -2);
		pendantLight.castShadow = true;
		pendantLight.shadow.mapSize.width = 1024;
		pendantLight.shadow.mapSize.height = 1024;
		pendantLight.shadow.radius = 4;
		scene.add(pendantLight);

		// Pendant fixture
		const fixtureMat = new THREE.MeshStandardMaterial({
			color: 0x333333,
			roughness: 0.3,
			metalness: 0.8
		});
		const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 6), fixtureMat);
		cord.position.set(0, 3.75, -2);
		scene.add(cord);

		const shade = new THREE.Mesh(
			new THREE.ConeGeometry(0.3, 0.2, 12, 1, true),
			new THREE.MeshStandardMaterial({
				color: 0x444444,
				roughness: 0.4,
				metalness: 0.6,
				side: THREE.DoubleSide
			})
		);
		shade.position.set(0, 3.55, -2);
		shade.rotation.x = Math.PI;
		scene.add(shade);

		// Bulb glow
		const bulbMat = new THREE.MeshStandardMaterial({
			color: 0xffdd88,
			emissive: 0xffaa44,
			emissiveIntensity: 0.6
		});
		const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), bulbMat);
		bulb.position.set(0, 3.48, -2);
		scene.add(bulb);

		// Neon tube lights above workbench
		const neonMat = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			emissive: 0xeeeeff,
			emissiveIntensity: 0.4
		});

		// Neon 1
		const neon1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.08), neonMat);
		neon1.position.set(-2.5, 3.6, -6);
		scene.add(neon1);

		neonLight1 = new THREE.PointLight(0xeeeeff, 0, 8);
		neonLight1.position.set(-2.5, 3.5, -6);
		scene.add(neonLight1);

		// Neon 2
		const neon2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.08), neonMat.clone());
		neon2.position.set(-1, 3.6, -6);
		scene.add(neon2);

		neonLight2 = new THREE.PointLight(0xeeeeff, 0, 8);
		neonLight2.position.set(-1, 3.5, -6);
		scene.add(neonLight2);

		// Fill light (center of room, subtle)
		fillLight = new THREE.PointLight(0xffddbb, 0, 12);
		fillLight.position.set(0, 2.5, 0);
		scene.add(fillLight);
	}

	function init() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x111111);
		scene.fog = new THREE.FogExp2(0x111111, 0.02);

		camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			0.1,
			50
		);
		camera.position.set(0, 2, 4);
		camera.lookAt(0, 1.5, -3);

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
		controls.target.set(0, 1.5, -3);
		controls.enableDamping = true;
		controls.dampingFactor = 0.08;
		controls.maxPolarAngle = Math.PI * 0.85;
		controls.minDistance = 1;
		controls.maxDistance = 12;

		createRoom();
		createWorkbench();
		createPegboard();
		createShelving();
		createStorageBins();
		createToolCabinet();
		createDoorFrame();
		createLighting();
	}

	onMount(() => {
		init();
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
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
