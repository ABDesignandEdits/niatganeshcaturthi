import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildGrandPandalEnvironment, GANESHA_BACKGROUND_IMAGE_URL } from './PandalEnvironment';
import { loadGanesha3DModel } from './GaneshaModel';
import { loadMushak3DModel, Mushak3DInstance } from './MushakModel';

interface FestivalScene3DProps {
  mode?: 'hero' | 'darshan' | 'victory';
  className?: string;
  showMushak?: boolean;
}

export const FestivalScene3D: React.FC<FestivalScene3DProps> = ({
  mode = 'hero',
  className = 'w-full h-full',
  showMushak = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent so the responsive WebP background image shows cleanly
    scene.fog = new THREE.FogExp2(0x0a0508, 0.038);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    if (mode === 'hero') {
      camera.position.set(0.8, 2.4, 5.4);
      camera.lookAt(0, 2.1, -0.4);
    } else if (mode === 'victory') {
      camera.position.set(0, 2.2, 4.4);
      camera.lookAt(0, 1.9, -0.4);
    } else {
      camera.position.set(0, 2.2, 5.0);
      camera.lookAt(0, 2.0, -0.4);
    }

    // 2. High-End Renderer Configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Festival Lighting
    const moonLight = new THREE.DirectionalLight(0x7dd3fc, 0.45);
    moonLight.position.set(-5, 9, 7);
    scene.add(moonLight);

    const divineSpot = new THREE.SpotLight(0xffedd5, 3.2, 22, Math.PI / 4.5, 0.45);
    divineSpot.position.set(0, 8, 3.8);
    divineSpot.target.position.set(0, 2.1, -0.4);
    divineSpot.castShadow = true;
    divineSpot.shadow.bias = -0.001;
    divineSpot.shadow.mapSize.width = 1024;
    divineSpot.shadow.mapSize.height = 1024;
    scene.add(divineSpot);
    scene.add(divineSpot.target);

    const ambientLight = new THREE.AmbientLight(0x27140b, 1.4);
    scene.add(ambientLight);

    // 4. Build Grand Pandal Environment Architecture
    const pandal = buildGrandPandalEnvironment(scene);

    // 5. Load Character Models
    let ganeshaGroup: THREE.Group | null = null;
    let ganeshaMixer: THREE.AnimationMixer | undefined;
    let mushakInstance: Mushak3DInstance | null = null;

    loadGanesha3DModel().then((res) => {
      ganeshaGroup = res.scene;
      ganeshaMixer = res.mixer;
      ganeshaGroup.position.copy(pandal.ganeshaMountPoint);
      scene.add(ganeshaGroup);
    });

    if (showMushak) {
      loadMushak3DModel().then((res) => {
        mushakInstance = res;
        mushakInstance.root.position.copy(pandal.mushakMountPoint);
        mushakInstance.root.rotation.y = -Math.PI / 3.2;
        scene.add(mushakInstance.root);
      });
    }

    // 6. Subtle Parallax Effect on Mouse / Pointer Move
    let targetCameraX = camera.position.x;
    let targetCameraY = camera.position.y;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / width) * 2 - 1;
      const ny = -(e.clientY / height) * 2 + 1;
      targetCameraX = 0.8 + nx * 0.45;
      targetCameraY = 2.4 + ny * 0.25;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // 7. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 2.1, -0.4);

      pandal.update(delta, time);

      if (ganeshaMixer) {
        ganeshaMixer.update(delta);
      }
      if (mushakInstance) {
        mushakInstance.update(delta, time, false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handling
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      pandal.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode, showMushak]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden pointer-events-auto bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url("${GANESHA_BACKGROUND_IMAGE_URL}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};
