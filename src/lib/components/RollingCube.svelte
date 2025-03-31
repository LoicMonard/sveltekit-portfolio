<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import gsap from 'gsap';

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let cube: THREE.Mesh;
  let cubeContainer: THREE.Group;
  let grid: THREE.GridHelper;
  let axesHelper: THREE.AxesHelper;
  let orbitControls: OrbitControls;
  let isAnimating = false;

  const CUBE_SIZE = 1;
  const GRID_SIZE = 10;
  const CAMERA_OFFSET = new THREE.Vector3(10, 10, 10);
  const ANIMATION_DURATION = 0.3;
  const ROTATION_AXES = {
    x: new THREE.Vector3(1, 0, 0),
    z: new THREE.Vector3(0, 0, 1)
  };
  const CUBE_COLORS = [
    0xff0000,
    0xff00ff,
    0x00ff00,
    0xffff00,
    0x0000ff,
    0x00ffff
  ];

  const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 0.1, 100);
    camera.position.copy(CAMERA_OFFSET);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerWidth, containerHeight);
    container.appendChild(renderer.domElement);

    grid = new THREE.GridHelper(GRID_SIZE, GRID_SIZE);
    scene.add(grid);

    cubeContainer = new THREE.Group();
    scene.add(cubeContainer);

    const materials = CUBE_COLORS.map(color => new THREE.MeshBasicMaterial({ color }));
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    cube = new THREE.Mesh(geometry, materials);
    cube.position.set(0.5, 0.5, 0.5);
    cubeContainer.add(cube);

    axesHelper = new THREE.AxesHelper(5);
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

  const handleKeyDown = (event: KeyboardEvent) => {
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

  type Direction = 'up' | 'down' | 'left' | 'right';

  const moveCube = (direction: Direction) => {
    isAnimating = true;
    const animationTimeline = gsap.timeline();

    switch (direction) {
      case 'up':
        animationTimeline.to(cubeContainer.rotation, { duration: ANIMATION_DURATION, x: `-=${Math.PI / 2}` });
        animationTimeline.then(() => {
          cubeContainer.position.z -= 1;
          cubeContainer.rotation.x = 0;
          cube.rotateOnWorldAxis(ROTATION_AXES.x, -Math.PI / 2);
          isAnimating = false;
        });
        break;

      case 'down':
        animationTimeline.set(cube.position, { z: "-=1" });
        animationTimeline.set(cubeContainer.position, { z: "+=1" });
        animationTimeline.to(cubeContainer.rotation, { duration: ANIMATION_DURATION, x: `+=${Math.PI / 2}` });
        animationTimeline.then(() => {
          cubeContainer.rotation.x = 0;
          cube.position.z += 1;
          cube.rotateOnWorldAxis(ROTATION_AXES.x, Math.PI / 2);
          isAnimating = false;
        });
        break;

      case 'left':
        animationTimeline.to(cubeContainer.rotation, { duration: ANIMATION_DURATION, z: `+=${Math.PI / 2}` });
        animationTimeline.then(() => {
          cubeContainer.position.x -= 1;
          cubeContainer.rotation.z = 0;
          cube.rotateOnWorldAxis(ROTATION_AXES.z, Math.PI / 2);
          isAnimating = false;
        });
        break;

      case 'right':
        animationTimeline.set(cube.position, { x: "-=1" });
        animationTimeline.set(cubeContainer.position, { x: "+=1" });
        animationTimeline.to(cubeContainer.rotation, { duration: ANIMATION_DURATION, z: `-=${Math.PI / 2}` });
        animationTimeline.then(() => {
          cubeContainer.rotation.z = 0;
          cube.position.x += 1;
          cube.rotateOnWorldAxis(ROTATION_AXES.z, -Math.PI / 2);
          isAnimating = false;
        });
        break;
    }
  };

  const handleResize = () => {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const animate = () => {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
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