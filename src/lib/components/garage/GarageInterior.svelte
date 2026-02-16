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
	let fillLight: THREE.PointLight;
	let neonLight1: THREE.PointLight;
	let neonLight2: THREE.PointLight;
	let torusWallLight: THREE.PointLight;

	// Reactive light updates
	$: if (ambientLight) ambientLight.intensity = 0.15 + progress * 0.85;
	$: if (pendantLight) pendantLight.intensity = progress * 18;
	$: if (neonLight1) neonLight1.intensity = progress * 8;
	$: if (neonLight2) neonLight2.intensity = progress * 8;
	$: if (fillLight) fillLight.intensity = progress * 5;
	$: if (torusWallLight) torusWallLight.intensity = progress * 10;
	$: if (renderer) renderer.toneMappingExposure = 0.4 + progress * 1.4;

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

	// --- Toon gradient texture ---
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

	// --- Toon material helper ---
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

	// --- Rounded box helper (using extruded rounded rectangle) ---
	function createRoundedBoxGeometry(
		w: number,
		h: number,
		d: number,
		r: number = 0.05
	): THREE.BufferGeometry {
		// Use a standard box but with bevel for softness
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

		const extrudeSettings = {
			depth: d,
			bevelEnabled: true,
			bevelThickness: r * 0.5,
			bevelSize: r * 0.5,
			bevelSegments: 3
		};
		const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		geo.center();
		return geo;
	}

	// --- Scene builders ---

	// Room dimensions — wide format to fill 16/9 viewport
	const ROOM_W = 10;
	const ROOM_D = 10;
	const ROOM_H = 3.5;

	function createRoom() {
		// Floor — warm pastel
		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, ROOM_D),
			toon(0xc8b89a, 3)
		);
		floor.rotation.x = -Math.PI / 2;
		floor.receiveShadow = true;
		scene.add(floor);

		// Checkerboard pattern on floor for toony look
		const tileSize = 1.2;
		const tileA = toon(0xbcad8f, 3);
		const tileB = toon(0xd4c6a8, 3);
		for (let x = -Math.floor(ROOM_W / 2 / tileSize); x < ROOM_W / 2 / tileSize; x++) {
			for (let z = -Math.floor(ROOM_D / 2 / tileSize); z < ROOM_D / 2 / tileSize; z++) {
				const tile = new THREE.Mesh(
					new THREE.PlaneGeometry(tileSize * 0.95, tileSize * 0.95),
					(x + z) % 2 === 0 ? tileA : tileB
				);
				tile.rotation.x = -Math.PI / 2;
				tile.position.set(x * tileSize + tileSize / 2, 0.005, z * tileSize + tileSize / 2);
				scene.add(tile);
			}
		}

		// Back wall — soft blue-grey
		const backWall = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, ROOM_H),
			toon(0x8faab8, 3)
		);
		backWall.position.set(0, ROOM_H / 2, -ROOM_D / 2);
		backWall.receiveShadow = true;
		scene.add(backWall);

		// Left wall — soft green-grey
		const leftWall = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_D, ROOM_H),
			toon(0x9ab8a0, 3)
		);
		leftWall.rotation.y = Math.PI / 2;
		leftWall.position.set(-ROOM_W / 2, ROOM_H / 2, 0);
		leftWall.receiveShadow = true;
		scene.add(leftWall);

		// Right wall — soft warm grey
		const rightWall = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_D, ROOM_H),
			toon(0xb8a89a, 3)
		);
		rightWall.rotation.y = -Math.PI / 2;
		rightWall.position.set(ROOM_W / 2, ROOM_H / 2, 0);
		rightWall.receiveShadow = true;
		scene.add(rightWall);

		// Ceiling — light cream
		const ceiling = new THREE.Mesh(
			new THREE.PlaneGeometry(ROOM_W, ROOM_D),
			toon(0xe8ddd0, 3)
		);
		ceiling.rotation.x = Math.PI / 2;
		ceiling.position.y = ROOM_H;
		scene.add(ceiling);
	}

	function createWorkbench() {
		const woodMat = toon(0xd4944a);
		const metalMat = toon(0x7a8a9a);
		const backZ = -ROOM_D / 2;

		// Workbench top — rounded
		const top = new THREE.Mesh(createRoundedBoxGeometry(3.5, 0.15, 0.9, 0.06), woodMat);
		top.position.set(-1.5, 0.95, backZ + 0.5);
		top.castShadow = true;
		top.receiveShadow = true;
		scene.add(top);

		// Puffy cylindrical legs
		const legGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.95, 12);
		const legPositions = [
			[-3.1, 0.475, backZ + 0.9],
			[0.1, 0.475, backZ + 0.9],
			[-3.1, 0.475, backZ + 0.15],
			[0.1, 0.475, backZ + 0.15]
		];
		for (const p of legPositions) {
			const leg = new THREE.Mesh(legGeo, metalMat);
			leg.position.set(p[0], p[1], p[2]);
			leg.castShadow = true;
			scene.add(leg);

			// Little foot sphere
			const foot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), metalMat);
			foot.position.set(p[0], 0.02, p[2]);
			scene.add(foot);
		}

		// Lower shelf — rounded
		const shelf = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.08, 0.7, 0.03), woodMat);
		shelf.position.set(-1.5, 0.35, backZ + 0.5);
		scene.add(shelf);

		// Vise — rounded and chunky
		const viseMat = toon(0x5a6a7a);
		const viseBody = new THREE.Mesh(
			createRoundedBoxGeometry(0.25, 0.2, 0.3, 0.04),
			viseMat
		);
		viseBody.position.set(-2.8, 1.12, backZ + 0.5);
		viseBody.castShadow = true;
		scene.add(viseBody);

		// Vise screw — cute cylinder
		const screw = new THREE.Mesh(
			new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8),
			toon(0x889999)
		);
		screw.rotation.x = Math.PI / 2;
		screw.position.set(-2.8, 1.12, backZ + 0.7);
		scene.add(screw);

		// Vise handle — little sphere
		const handle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), toon(0xee6644));
		handle.position.set(-2.8, 1.12, backZ + 0.85);
		scene.add(handle);
	}

	function createPegboard() {
		const backZ = -ROOM_D / 2;
		// Pegboard — rounded rectangle, pastel cork color
		const board = new THREE.Mesh(
			createRoundedBoxGeometry(3.2, 1.6, 0.08, 0.08),
			toon(0xdcc8a0)
		);
		board.position.set(-1.5, 2.3, backZ + 0.05);
		board.receiveShadow = true;
		scene.add(board);

		// Cute peg holes
		const pegMat = toon(0xc4b088);
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 9; col++) {
				const peg = new THREE.Mesh(
					new THREE.CircleGeometry(0.03, 8),
					pegMat
				);
				peg.position.set(-2.8 + col * 0.35, 1.7 + row * 0.35, backZ + 0.1);
				scene.add(peg);
			}
		}

		// Toony tools — big, round, colorful
		createToonWrench(-2.6, 2.3, backZ + 0.11);
		createToonHammer(-2.0, 2.3, backZ + 0.11);
		createToonScrewdrivers(-1.3, 2.1, backZ + 0.11);
		createToonPliers(-0.6, 2.3, backZ + 0.11);
	}

	function createToonWrench(x: number, y: number, z: number) {
		const mat = toon(0x6a8aaa);
		// Handle
		const handle = new THREE.Mesh(
			new THREE.CylinderGeometry(0.035, 0.03, 0.6, 8),
			mat
		);
		handle.position.set(x, y, z);
		handle.rotation.z = 0.15;
		scene.add(handle);
		// Head — torus-like
		const head = new THREE.Mesh(
			new THREE.TorusGeometry(0.06, 0.025, 8, 12, Math.PI * 1.5),
			mat
		);
		head.position.set(x + 0.03, y + 0.32, z);
		head.rotation.z = 0.15;
		scene.add(head);
	}

	function createToonHammer(x: number, y: number, z: number) {
		// Handle — warm wood
		const handleMat = toon(0xd4944a);
		const handle = new THREE.Mesh(
			new THREE.CylinderGeometry(0.025, 0.03, 0.55, 8),
			handleMat
		);
		handle.position.set(x, y, z);
		scene.add(handle);
		// Head — chunky rounded
		const headMat = toon(0x7a7a8a);
		const head = new THREE.Mesh(
			createRoundedBoxGeometry(0.18, 0.08, 0.08, 0.02),
			headMat
		);
		head.position.set(x, y + 0.3, z);
		head.castShadow = true;
		scene.add(head);
	}

	function createToonScrewdrivers(x: number, y: number, z: number) {
		const colors = [0xee6644, 0x44aa88, 0xffcc44];
		for (let i = 0; i < 3; i++) {
			// Handle — colorful capsule shape
			const handleGeo = new THREE.CapsuleGeometry(0.035, 0.12, 4, 8);
			const handle = new THREE.Mesh(handleGeo, toon(colors[i]));
			handle.position.set(x + i * 0.2, y + 0.15, z);
			scene.add(handle);
			// Shaft
			const shaft = new THREE.Mesh(
				new THREE.CylinderGeometry(0.012, 0.012, 0.3 + i * 0.04, 6),
				toon(0x889999)
			);
			shaft.position.set(x + i * 0.2, y - 0.1, z);
			scene.add(shaft);
		}
	}

	function createToonPliers(x: number, y: number, z: number) {
		const mat = toon(0x6a8aaa);
		// Two arms
		for (const side of [-1, 1]) {
			const arm = new THREE.Mesh(
				new THREE.CapsuleGeometry(0.025, 0.25, 4, 8),
				mat
			);
			arm.position.set(x + side * 0.02, y, z);
			arm.rotation.z = side * 0.08;
			scene.add(arm);
		}
		// Handles — colorful
		const handleMat = toon(0xee6644);
		for (const side of [-1, 1]) {
			const handle = new THREE.Mesh(
				new THREE.CapsuleGeometry(0.03, 0.15, 4, 8),
				handleMat
			);
			handle.position.set(x + side * 0.03, y - 0.22, z);
			handle.rotation.z = side * 0.12;
			scene.add(handle);
		}
		// Pivot — sphere
		const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), toon(0x889999));
		pivot.position.set(x, y, z);
		scene.add(pivot);
	}

	function createShelving() {
		const metalMat = toon(0x7a8a9a);
		const rightX = ROOM_W / 2 - 1.8;
		const unitZ = -2.5;

		// Rounded uprights — cylinders
		const uprightGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 10);
		const uprightPositions = [
			[rightX, 1.6, unitZ - 0.5],
			[rightX, 1.6, unitZ + 0.5],
			[rightX + 1.3, 1.6, unitZ - 0.5],
			[rightX + 1.3, 1.6, unitZ + 0.5]
		];
		for (const p of uprightPositions) {
			const upright = new THREE.Mesh(uprightGeo, metalMat);
			upright.position.set(p[0], p[1], p[2]);
			scene.add(upright);
		}

		// Shelves — rounded
		for (let i = 0; i < 4; i++) {
			const s = new THREE.Mesh(
				createRoundedBoxGeometry(1.3, 0.06, 1.0, 0.03),
				toon(0x8a9aaa)
			);
			s.position.set(rightX + 0.65, 0.3 + i * 0.85, unitZ);
			s.receiveShadow = true;
			scene.add(s);
		}

		// Cute boxes on shelves — rounded with playful colors
		const boxColors = [0xffaa55, 0x55bbaa, 0xdd7799, 0xaabb55, 0x7799dd];
		for (let i = 0; i < 4; i++) {
			const box = new THREE.Mesh(
				createRoundedBoxGeometry(
					0.3 + Math.random() * 0.12,
					0.25 + Math.random() * 0.08,
					0.35,
					0.04
				),
				toon(boxColors[i % boxColors.length])
			);
			box.position.set(
				rightX + 0.3 + (i % 2) * 0.5,
				0.48 + Math.floor(i / 2) * 0.85,
				unitZ
			);
			box.rotation.y = (Math.random() - 0.5) * 0.2;
			box.castShadow = true;
			scene.add(box);
		}
	}

	function createStorageBins() {
		const backZ = -ROOM_D / 2;
		const binColors = [0x5588cc, 0xee5555, 0x55cc77, 0xffcc44];

		for (let i = 0; i < 4; i++) {
			// Cute rounded bin
			const bin = new THREE.Mesh(
				createRoundedBoxGeometry(0.25, 0.18, 0.2, 0.04),
				toon(binColors[i])
			);
			bin.position.set(-2.6 + i * 0.38, 1.12, backZ + 0.28);
			bin.castShadow = true;
			scene.add(bin);

			// Little label dot
			const dot = new THREE.Mesh(
				new THREE.CircleGeometry(0.03, 8),
				toon(0xffffff)
			);
			dot.position.set(-2.6 + i * 0.38, 1.15, backZ + 0.39);
			scene.add(dot);
		}
	}

	function createToolCabinet() {
		const backZ = -ROOM_D / 2;
		const cabinetMat = toon(0xdd4444);
		const handleMat = toon(0xeeeeee);
		const cabX = 2.8;
		const cabZ = backZ + 0.3;

		// Main body — big rounded box
		const body = new THREE.Mesh(
			createRoundedBoxGeometry(0.85, 1.25, 0.55, 0.08),
			cabinetMat
		);
		body.position.set(cabX, 0.63, cabZ);
		body.castShadow = true;
		body.receiveShadow = true;
		scene.add(body);

		// Drawers — rounded grooves with cute handles
		const darkRed = toon(0xbb3333);
		for (let i = 0; i < 5; i++) {
			const line = new THREE.Mesh(
				createRoundedBoxGeometry(0.75, 0.015, 0.5, 0.005),
				darkRed
			);
			line.position.set(cabX, 0.18 + i * 0.22, cabZ + 0.02);
			scene.add(line);

			const handle = new THREE.Mesh(
				new THREE.SphereGeometry(0.03, 8, 8),
				handleMat
			);
			handle.position.set(cabX, 0.22 + i * 0.22, cabZ + 0.29);
			scene.add(handle);
		}

		// Top surface
		const topSurface = new THREE.Mesh(
			createRoundedBoxGeometry(0.87, 0.05, 0.57, 0.02),
			toon(0x444444)
		);
		topSurface.position.set(cabX, 1.27, cabZ);
		scene.add(topSurface);

		// Little plant on top!
		createTinyPlant(cabX + 0.2, 1.32, cabZ);
	}

	function createTinyPlant(x: number, y: number, z: number) {
		// Pot — rounded
		const potMat = toon(0xdd8855);
		const pot = new THREE.Mesh(
			new THREE.CylinderGeometry(0.08, 0.06, 0.1, 10),
			potMat
		);
		pot.position.set(x, y + 0.05, z);
		scene.add(pot);

		// Dirt
		const dirt = new THREE.Mesh(
			new THREE.CircleGeometry(0.075, 10),
			toon(0x664422)
		);
		dirt.rotation.x = -Math.PI / 2;
		dirt.position.set(x, y + 0.1, z);
		scene.add(dirt);

		// Leaves — little spheres
		const leafMat = toon(0x55cc66);
		const leafPositions = [
			[0, 0.18, 0],
			[-0.04, 0.14, 0.02],
			[0.04, 0.15, -0.02],
			[0, 0.22, 0.02],
			[-0.03, 0.2, -0.03]
		];
		for (const lp of leafPositions) {
			const leaf = new THREE.Mesh(
				new THREE.SphereGeometry(0.035, 8, 8),
				leafMat
			);
			leaf.position.set(x + lp[0], y + lp[1], z + lp[2]);
			scene.add(leaf);
		}
	}

	function createDoorFrame() {
		const frontZ = ROOM_D / 2;
		const halfW = ROOM_W / 2;
		const frameMat = toon(0x8899aa);

		// Linteau — rounded
		const linteau = new THREE.Mesh(
			createRoundedBoxGeometry(ROOM_W, 0.35, 0.18, 0.06),
			frameMat
		);
		linteau.position.set(0, ROOM_H - 0.15, frontZ);
		scene.add(linteau);

		// Left jamb — rounded cylinder
		const jambGeo = new THREE.CylinderGeometry(0.08, 0.08, ROOM_H, 10);
		const leftJamb = new THREE.Mesh(jambGeo, frameMat);
		leftJamb.position.set(-halfW, ROOM_H / 2, frontZ);
		scene.add(leftJamb);

		// Right jamb
		const rightJamb = new THREE.Mesh(jambGeo, frameMat);
		rightJamb.position.set(halfW, ROOM_H / 2, frontZ);
		scene.add(rightJamb);

		// Rail tracks — thin rounded
		const railMat = toon(0x778899);
		const railGeo = new THREE.CylinderGeometry(0.04, 0.04, ROOM_H, 8);
		const leftRail = new THREE.Mesh(railGeo, railMat);
		leftRail.position.set(-halfW + 0.15, ROOM_H / 2, frontZ - 0.05);
		scene.add(leftRail);

		const rightRail = new THREE.Mesh(railGeo, railMat);
		rightRail.position.set(halfW - 0.15, ROOM_H / 2, frontZ - 0.05);
		scene.add(rightRail);
	}

	function createFloorDetails() {
		const leftX = -ROOM_W / 2;

		// Cute oil stain — flat dark circle
		const stain = new THREE.Mesh(
			new THREE.CircleGeometry(0.5, 16),
			toon(0x8a7a6a, 3)
		);
		stain.rotation.x = -Math.PI / 2;
		stain.position.set(1, 0.01, -0.5);
		scene.add(stain);

		// Tires stacked in corner — torii/donuts!
		const tireMat = toon(0x444455);
		for (let i = 0; i < 3; i++) {
			const tire = new THREE.Mesh(
				new THREE.TorusGeometry(0.3, 0.12, 10, 16),
				tireMat
			);
			tire.rotation.x = Math.PI / 2;
			tire.position.set(leftX + 0.8, 0.12 + i * 0.25, -3.5);
			tire.castShadow = true;
			scene.add(tire);
		}
		// Top tire slightly tilted for playfulness
		const topTire = new THREE.Mesh(
			new THREE.TorusGeometry(0.3, 0.12, 10, 16),
			tireMat
		);
		topTire.rotation.x = Math.PI / 2 + 0.3;
		topTire.rotation.z = 0.2;
		topTire.position.set(leftX + 0.8, 0.12 + 3 * 0.25, -3.5);
		topTire.castShadow = true;
		scene.add(topTire);

		// Cute bucket
		const bucketMat = toon(0x5588cc);
		const bucket = new THREE.Mesh(
			new THREE.CylinderGeometry(0.18, 0.14, 0.3, 12),
			bucketMat
		);
		bucket.position.set(2, 0.15, -0.5);
		bucket.castShadow = true;
		scene.add(bucket);

		// Bucket handle — torus arc
		const handleMat = toon(0x889999);
		const bucketHandle = new THREE.Mesh(
			new THREE.TorusGeometry(0.15, 0.015, 6, 12, Math.PI),
			handleMat
		);
		bucketHandle.position.set(2, 0.32, -0.5);
		scene.add(bucketHandle);
	}

	function createLighting() {
		const backZ = -ROOM_D / 2;

		// Warmer ambient for toony feel
		ambientLight = new THREE.AmbientLight(0xfff0dd, 0.15);
		scene.add(ambientLight);

		// Pendant light
		pendantLight = new THREE.PointLight(0xffbb66, 0, 12);
		pendantLight.position.set(0, ROOM_H - 0.3, -1.5);
		pendantLight.castShadow = true;
		pendantLight.shadow.mapSize.width = 1024;
		pendantLight.shadow.mapSize.height = 1024;
		pendantLight.shadow.radius = 4;
		scene.add(pendantLight);

		// Cute lamp fixture
		const fixtureMat = toon(0x444455);

		// Cord
		const cord = new THREE.Mesh(
			new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6),
			fixtureMat
		);
		cord.position.set(0, ROOM_H - 0.2, -1.5);
		scene.add(cord);

		// Shade — round dome (half sphere)
		const shade = new THREE.Mesh(
			new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
			toon(0xffcc44)
		);
		shade.position.set(0, ROOM_H - 0.4, -1.5);
		shade.rotation.x = Math.PI;
		scene.add(shade);

		// Bulb — glowing sphere
		const bulb = new THREE.Mesh(
			new THREE.SphereGeometry(0.08, 10, 10),
			toonEmissive(0xffeeaa, 0xffcc66, 0.8)
		);
		bulb.position.set(0, ROOM_H - 0.45, -1.5);
		scene.add(bulb);

		// Neon tube lights above workbench
		const neonMat = toonEmissive(0xffffff, 0xddddff, 0.5);
		const neonZ = backZ + 1;

		const neon1 = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.03, 1.0, 4, 8),
			neonMat
		);
		neon1.rotation.z = Math.PI / 2;
		neon1.position.set(-2, ROOM_H - 0.15, neonZ);
		scene.add(neon1);

		neonLight1 = new THREE.PointLight(0xeeeeff, 0, 6);
		neonLight1.position.set(-2, ROOM_H - 0.25, neonZ);
		scene.add(neonLight1);

		const neon2 = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.03, 1.0, 4, 8),
			neonMat
		);
		neon2.rotation.z = Math.PI / 2;
		neon2.position.set(-0.5, ROOM_H - 0.15, neonZ);
		scene.add(neon2);

		neonLight2 = new THREE.PointLight(0xeeeeff, 0, 6);
		neonLight2.position.set(-0.5, ROOM_H - 0.25, neonZ);
		scene.add(neonLight2);

		// Fill light
		fillLight = new THREE.PointLight(0xffddcc, 0, 10);
		fillLight.position.set(0, 2, 0);
		scene.add(fillLight);

		// Orange torus wall lamp on back wall
		const torusLamp = new THREE.Mesh(
			new THREE.TorusGeometry(0.35, 0.06, 12, 32),
			toonEmissive(0xff8833, 0xff6600, 0.2)
		);
		torusLamp.position.set(2.2, 2.5, backZ + 0.08);
		torusLamp.castShadow = true;
		scene.add(torusLamp);

		torusWallLight = new THREE.PointLight(0xff8833, 0, 8);
		torusWallLight.position.set(2.2, 2.5, backZ + 0.5);
		torusWallLight.castShadow = true;
		torusWallLight.shadow.mapSize.width = 512;
		torusWallLight.shadow.mapSize.height = 512;
		scene.add(torusWallLight);
	}

	function init() {
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x1a1a2e);
		scene.fog = new THREE.FogExp2(0x1a1a2e, 0.018);

		camera = new THREE.PerspectiveCamera(
			40,
			container.clientWidth / container.clientHeight,
			0.1,
			50
		);
		camera.position.set(0, 2.2, 3.5);
		camera.lookAt(0, 1.4, -2);

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.4;
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		container.appendChild(renderer.domElement);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 1.4, -2);
		controls.enableDamping = true;
		controls.dampingFactor = 0.08;
		controls.maxPolarAngle = Math.PI * 0.85;
		controls.minDistance = 1;
		controls.maxDistance = 10;

		createRoom();
		createWorkbench();
		createPegboard();
		createShelving();
		createStorageBins();
		createToolCabinet();
		createDoorFrame();
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
