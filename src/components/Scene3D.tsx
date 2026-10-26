import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { buildAllModules, ModuleInfo } from '../utils/moduleBuilder';

interface Scene3DProps {
  explodeProgress: number;
  selectedModule: number | null;
  hoveredModule: number | null;
  onModuleHover: (index: number | null) => void;
  onModuleClick: (index: number | null) => void;
  autoRotate: boolean;
}

export default function Scene3D({
  explodeProgress,
  selectedModule,
  hoveredModule,
  onModuleHover,
  onModuleClick,
  autoRotate,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    modules: ModuleInfo[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    animationId: number;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    cameraAngle: { theta: number; phi: number };
    cameraDistance: number;
    targetAngle: { theta: number; phi: number };
    targetDistance: number;
  } | null>(null);

  const explodeRef = useRef(explodeProgress);
  const selectedRef = useRef(selectedModule);
  const hoveredRef = useRef(hoveredModule);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    explodeRef.current = explodeProgress;
  }, [explodeProgress]);

  useEffect(() => {
    selectedRef.current = selectedModule;
  }, [selectedModule]);

  useEffect(() => {
    hoveredRef.current = hoveredModule;
  }, [hoveredModule]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0a0a0f, 15, 30);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 3, 7);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff8844, 0.3);
    rimLight.position.set(0, -3, 5);
    scene.add(rimLight);

    // Ground plane (subtle grid)
    const gridHelper = new THREE.GridHelper(20, 40, 0x222233, 0x111122);
    gridHelper.position.y = -3;
    scene.add(gridHelper);

    // Build modules
    const modules = buildAllModules();
    modules.forEach((mod) => {
      mod.group.position.copy(mod.basePosition);
      scene.add(mod.group);
    });

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const state = {
      scene,
      camera,
      renderer,
      modules,
      raycaster,
      mouse,
      animationId: 0,
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      cameraAngle: { theta: 0.6, phi: 0.4 },
      cameraDistance: 10,
      targetAngle: { theta: 0.6, phi: 0.4 },
      targetDistance: 10,
    };

    sceneRef.current = state;

    // Animation loop
    const animate = () => {
      state.animationId = requestAnimationFrame(animate);

      const progress = explodeRef.current;
      const selected = selectedRef.current;
      const hovered = hoveredRef.current;
      const activeModule = selected !== null ? selected : hovered;

      // Auto rotate
      if (autoRotateRef.current && !state.isDragging) {
        state.targetAngle.theta += 0.003;
      }

      // Smooth camera interpolation
      state.cameraAngle.theta += (state.targetAngle.theta - state.cameraAngle.theta) * 0.05;
      state.cameraAngle.phi += (state.targetAngle.phi - state.cameraAngle.phi) * 0.05;
      state.cameraDistance += (state.targetDistance - state.cameraDistance) * 0.05;

      // Update camera position from spherical coordinates
      const theta = state.cameraAngle.theta;
      const phi = state.cameraAngle.phi;
      const dist = state.cameraDistance;
      camera.position.x = dist * Math.sin(phi) * Math.cos(theta);
      camera.position.y = dist * Math.cos(phi);
      camera.position.z = dist * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 0, 0);

      // Update module positions based on explode progress
      modules.forEach((mod, index) => {
        const target = new THREE.Vector3().lerpVectors(
          mod.basePosition,
          mod.explodedPosition,
          progress
        );
        mod.group.position.lerp(target, 0.08);

        // Highlight active module (selected or hovered)
        if (activeModule !== null) {
          const isActive = index === activeModule;
          mod.group.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              if (isActive) {
                child.material.emissiveIntensity = 0.3;
                child.material.emissive = new THREE.Color(mod.color);
                child.material.opacity = 1.0;
                child.material.transparent = false;
              } else {
                child.material.opacity = 0.35;
                child.material.transparent = true;
                child.material.emissiveIntensity = 0;
              }
            }
          });
        } else {
          mod.group.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.opacity = 1.0;
              child.material.transparent = false;
              child.material.emissiveIntensity = 0;
            }
          });
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(state.animationId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const cleanup = initScene();
    return cleanup;
  }, [initScene]);

  // Mouse/touch handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      sceneRef.current.isDragging = true;
      sceneRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const state = sceneRef.current;
      const rect = container.getBoundingClientRect();

      if (state.isDragging) {
        const deltaX = e.clientX - state.previousMousePosition.x;
        const deltaY = e.clientY - state.previousMousePosition.y;
        state.targetAngle.theta -= deltaX * 0.005;
        state.targetAngle.phi = Math.max(0.2, Math.min(Math.PI - 0.2, state.targetAngle.phi + deltaY * 0.005));
        state.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Raycasting for hover
      state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      state.raycaster.setFromCamera(state.mouse, state.camera);

      let hoveredModule: number | null = null;
      for (let i = 0; i < state.modules.length; i++) {
        const intersects = state.raycaster.intersectObjects(state.modules[i].group.children, true);
        if (intersects.length > 0) {
          hoveredModule = i;
          break;
        }
      }
      onModuleHover(hoveredModule);
    };

    const handleMouseUp = () => {
      if (!sceneRef.current) return;
      sceneRef.current.isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const state = sceneRef.current;
      const rect = container.getBoundingClientRect();
      state.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      state.raycaster.setFromCamera(state.mouse, state.camera);

      let clickedModule: number | null = null;
      for (let i = 0; i < state.modules.length; i++) {
        const intersects = state.raycaster.intersectObjects(state.modules[i].group.children, true);
        if (intersects.length > 0) {
          clickedModule = i;
          break;
        }
      }
      onModuleClick(clickedModule);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!sceneRef.current) return;
      e.preventDefault();
      sceneRef.current.targetDistance = Math.max(5, Math.min(20, sceneRef.current.targetDistance + e.deltaY * 0.01));
    };

    // Touch handlers
    let touchStartDistance = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (!sceneRef.current) return;
      if (e.touches.length === 1) {
        sceneRef.current.isDragging = true;
        sceneRef.current.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sceneRef.current) return;
      e.preventDefault();
      if (e.touches.length === 1 && sceneRef.current.isDragging) {
        const deltaX = e.touches[0].clientX - sceneRef.current.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - sceneRef.current.previousMousePosition.y;
        sceneRef.current.targetAngle.theta -= deltaX * 0.005;
        sceneRef.current.targetAngle.phi = Math.max(0.2, Math.min(Math.PI - 0.2, sceneRef.current.targetAngle.phi + deltaY * 0.005));
        sceneRef.current.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = touchStartDistance - dist;
        sceneRef.current.targetDistance = Math.max(5, Math.min(20, sceneRef.current.targetDistance + delta * 0.02));
        touchStartDistance = dist;
      }
    };

    const handleTouchEnd = () => {
      if (!sceneRef.current) return;
      sceneRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onModuleHover, onModuleClick]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    />
  );
}
