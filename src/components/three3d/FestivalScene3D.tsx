import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
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
    scene.background = new THREE.Color(0x060309);
    scene.fog = new THREE.FogExp2(0x0a0508, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    if (mode === 'hero') {
      camera.position.set(0, 2.2, 5.8);
      camera.lookAt(0, 1.8, 0);
    } else if (mode === 'victory') {
      camera.position.set(0, 2.0, 5.0);
      camera.lookAt(0, 1.6, 0);
    } else {
      camera.position.set(0, 2.0, 5.2);
      camera.lookAt(0, 1.7, 0);
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
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Night Festival Lighting
    // Cool Moonlight Fill
    const moonLight = new THREE.DirectionalLight(0x7dd3fc, 0.65);
    moonLight.position.set(5, 10, -5);
    scene.add(moonLight);

    // Warm Altar Spotlight
    const divineSpot = new THREE.SpotLight(0xfef08a, 2.8, 20, Math.PI / 5, 0.45);
    divineSpot.position.set(0, 7, 3);
    divineSpot.target.position.set(0, 1.6, 0);
    divineSpot.castShadow = true;
    divineSpot.shadow.bias = -0.001;
    divineSpot.shadow.mapSize.width = 1024;
    divineSpot.shadow.mapSize.height = 1024;
    scene.add(divineSpot);
    scene.add(divineSpot.target);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0x1a0e08, 1.2);
    scene.add(ambientLight);

    // Golden Rim Light behind Ganesha
    const rimLight = new THREE.PointLight(0xf59e0b, 1.8, 8);
    rimLight.position.set(0, 2.5, -1.8);
    scene.add(rimLight);

    // Left Diya Point Light with Flickering
    const diyaLightLeft = new THREE.PointLight(0xf97316, 1.5, 6);
    diyaLightLeft.position.set(-1.8, 0.6, 1.5);
    diyaLightLeft.castShadow = true;
    scene.add(diyaLightLeft);

    // Right Diya Point Light with Flickering
    const diyaLightRight = new THREE.PointLight(0xf97316, 1.5, 6);
    diyaLightRight.position.set(1.8, 0.6, 1.5);
    diyaLightRight.castShadow = true;
    scene.add(diyaLightRight);

    // 4. Temple Architecture & Altar Environment
    // Polished Altar Floor
    const floorGeom = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x140a06,
      roughness: 0.35,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Sacred Altar Platform
    const altarGeom = new THREE.BoxGeometry(4.8, 0.4, 3.2);
    const altarMat = new THREE.MeshStandardMaterial({
      color: 0x27130a,
      roughness: 0.4,
      metalness: 0.3,
    });
    const altar = new THREE.Mesh(altarGeom, altarMat);
    altar.position.set(0, 0.2, -0.4);
    altar.receiveShadow = true;
    altar.castShadow = true;
    scene.add(altar);

    // Temple Pillars
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.35, 7, 20);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x221109,
      roughness: 0.6,
      metalness: 0.1,
    });

    const leftPillar = new THREE.Mesh(pillarGeom, pillarMat);
    leftPillar.position.set(-2.8, 3.5, -0.8);
    leftPillar.castShadow = true;
    scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeom, pillarMat);
    rightPillar.position.set(2.8, 3.5, -0.8);
    rightPillar.castShadow = true;
    scene.add(rightPillar);

    // Carved Brass Diyas on Floor
    const diyaGeom = new THREE.CylinderGeometry(0.2, 0.12, 0.15, 16);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.25,
      metalness: 0.85,
    });

    const diyaMeshLeft = new THREE.Mesh(diyaGeom, brassMat);
    diyaMeshLeft.position.set(-1.8, 0.08, 1.5);
    diyaMeshLeft.castShadow = true;
    scene.add(diyaMeshLeft);

    const diyaMeshRight = new THREE.Mesh(diyaGeom, brassMat);
    diyaMeshRight.position.set(1.8, 0.08, 1.5);
    diyaMeshRight.castShadow = true;
    scene.add(diyaMeshRight);

    // 5. Floating Flower Petals Particle System
    const petalCount = 80;
    const petalGeom = new THREE.PlaneGeometry(0.12, 0.16);
    const petalMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const petalsGroup = new THREE.Group();
    const petalVelocities: { vx: number; vy: number; vz: number; rotX: number; rotY: number }[] = [];

    for (let i = 0; i < petalCount; i++) {
      const petal = new THREE.Mesh(petalGeom, petalMat);
      petal.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 5 + 0.2,
        (Math.random() - 0.5) * 6
      );
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      petalsGroup.add(petal);
      petalVelocities.push({
        vx: (Math.random() - 0.5) * 0.008,
        vy: -0.006 - Math.random() * 0.008,
        vz: (Math.random() - 0.5) * 0.008,
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.04,
      });
    }
    scene.add(petalsGroup);

    // 6. Load Models
    let ganeshaGroup: THREE.Group | null = null;
    let ganeshaMixer: THREE.AnimationMixer | undefined;
    let mushakInstance: Mushak3DInstance | null = null;

    loadGanesha3DModel().then((res) => {
      ganeshaGroup = res.scene;
      ganeshaMixer = res.mixer;
      ganeshaGroup.position.set(0, 0.4, -0.4);
      scene.add(ganeshaGroup);
    });

    if (showMushak) {
      loadMushak3DModel().then((res) => {
        mushakInstance = res;
        mushakInstance.root.position.set(1.2, 0.4, 0.8);
        mushakInstance.root.rotation.y = -Math.PI / 4;
        scene.add(mushakInstance.root);
      });
    }

    // 7. Touch & Mouse Parallax
    let targetCameraX = 0;
    let targetCameraY = camera.position.y;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / width) * 2 - 1;
      const ny = -(e.clientY / height) * 2 + 1;
      targetCameraX = nx * 0.55;
      targetCameraY = 2.2 + ny * 0.35;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // 8. Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera smooth interpolation
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 1.8, 0);

      // Diya light flickering
      const flicker1 = Math.sin(time * 14) * 0.25 + Math.cos(time * 23) * 0.15;
      const flicker2 = Math.cos(time * 16) * 0.25 + Math.sin(time * 27) * 0.15;
      diyaLightLeft.intensity = 1.5 + flicker1;
      diyaLightRight.intensity = 1.5 + flicker2;

      // Petal drifting
      petalsGroup.children.forEach((p, idx) => {
        const vel = petalVelocities[idx];
        p.position.x += vel.vx + Math.sin(time * 2 + idx) * 0.003;
        p.position.y += vel.vy;
        p.position.z += vel.vz;
        p.rotation.x += vel.rotX;
        p.rotation.y += vel.rotY;

        if (p.position.y < 0.1) {
          p.position.y = 5.2;
          p.position.x = (Math.random() - 0.5) * 8;
          p.position.z = (Math.random() - 0.5) * 6;
        }
      });

      // Update Ganesha Mixer
      if (ganeshaMixer) {
        ganeshaMixer.update(delta);
      }

      // Update Mushak
      if (mushakInstance) {
        mushakInstance.update(delta, time, false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
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
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode, showMushak]);

  return <div ref={containerRef} className={`relative overflow-hidden pointer-events-auto ${className}`} />;
};
