import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface Mushak3DInstance {
  root: THREE.Group;
  mixer?: THREE.AnimationMixer;
  update: (delta: number, time: number, isRunning?: boolean) => void;
  isCustomGLB: boolean;
}

export async function loadMushak3DModel(): Promise<Mushak3DInstance> {
  const loader = new GLTFLoader();
  const possiblePaths = [
    '/public/models/mushak.glb',
    '/models/mushak.glb',
    '/assets/mushak.glb',
    '/mushak.glb',
    '/models/mushak.gltf',
  ];

  for (const path of possiblePaths) {
    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(
          path,
          (loaded) => resolve(loaded),
          undefined,
          (err) => reject(err)
        );
      });

      if (gltf && gltf.scene) {
        const root = gltf.scene as THREE.Group;
        root.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetHeight = 1.0;
          const scale = targetHeight / maxDim;
          root.scale.set(scale, scale, scale);
        }

        let mixer: THREE.AnimationMixer | undefined;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(root);
          mixer.clipAction(gltf.animations[0]).play();
        }

        return {
          root,
          mixer,
          isCustomGLB: true,
          update: (delta: number) => {
            if (mixer) mixer.update(delta);
          },
        };
      }
    } catch {
      // Continue to next path or procedural fallback
    }
  }

  // High-fidelity procedural 3D Mushak
  return createProceduralMushak3D();
}

function createProceduralMushak3D(): Mushak3DInstance {
  const root = new THREE.Group();

  // Realistic field mouse materials
  const furMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4f3b, // Rich warm agouti brown
    roughness: 0.75,
    metalness: 0.05,
  });

  const earMaterial = new THREE.MeshStandardMaterial({
    color: 0xfda4af, // Translucent soft pink
    roughness: 0.45,
    metalness: 0.0,
  });

  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: 0x050505, // Glossy jet black
    roughness: 0.1,
    metalness: 0.9,
  });

  const goldTrim = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.85,
    roughness: 0.25,
  });

  // 1. Torso
  const bodyGeom = new THREE.SphereGeometry(0.35, 18, 16);
  bodyGeom.scale(1.2, 0.85, 0.85);
  const body = new THREE.Mesh(bodyGeom, furMaterial);
  body.position.set(0, 0.35, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  root.add(body);

  // 2. Head with Snout
  const headGeom = new THREE.ConeGeometry(0.24, 0.45, 16);
  headGeom.rotateZ(-Math.PI / 2);
  const head = new THREE.Mesh(headGeom, furMaterial);
  head.position.set(0.38, 0.42, 0);
  head.castShadow = true;
  root.add(head);

  // Glossy Eyes
  const eyeGeom = new THREE.SphereGeometry(0.045, 12, 12);
  const leftEye = new THREE.Mesh(eyeGeom, eyeMaterial);
  leftEye.position.set(0.36, 0.48, 0.14);
  root.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeom, eyeMaterial);
  rightEye.position.set(0.36, 0.48, -0.14);
  root.add(rightEye);

  // Delicate Ears
  const earGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
  earGeom.rotateX(Math.PI / 2);
  const leftEar = new THREE.Mesh(earGeom, earMaterial);
  leftEar.position.set(0.24, 0.58, 0.16);
  leftEar.rotation.y = 0.25;
  leftEar.castShadow = true;
  root.add(leftEar);

  const rightEar = new THREE.Mesh(earGeom, earMaterial);
  rightEar.position.set(0.24, 0.58, -0.16);
  rightEar.rotation.y = -0.25;
  rightEar.castShadow = true;
  root.add(rightEar);

  // Sacred Tilak on Mushak Forehead
  const tilakGeom = new THREE.BoxGeometry(0.02, 0.06, 0.02);
  const tilakMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
  const tilak = new THREE.Mesh(tilakGeom, tilakMat);
  tilak.position.set(0.32, 0.52, 0);
  root.add(tilak);

  // 3. Modak in Front Paws
  const modakGeom = new THREE.ConeGeometry(0.08, 0.12, 12);
  const modak = new THREE.Mesh(modakGeom, goldTrim);
  modak.position.set(0.48, 0.32, 0);
  modak.castShadow = true;
  root.add(modak);

  // 4. Flexible Tail
  const tailSegments: THREE.Mesh[] = [];
  const segCount = 7;
  const tailGroup = new THREE.Group();
  tailGroup.position.set(-0.38, 0.32, 0);

  for (let i = 0; i < segCount; i++) {
    const segGeom = new THREE.CylinderGeometry(0.035 - i * 0.004, 0.04 - i * 0.004, 0.12, 8);
    segGeom.rotateZ(Math.PI / 2);
    const seg = new THREE.Mesh(segGeom, earMaterial);
    seg.position.set(-i * 0.1, 0, 0);
    tailGroup.add(seg);
    tailSegments.push(seg);
  }
  root.add(tailGroup);

  // 5. Paws (Pivots)
  const pawGeom = new THREE.SphereGeometry(0.06, 8, 8);
  pawGeom.scale(1.4, 0.7, 0.8);
  const frontLeftLeg = new THREE.Mesh(pawGeom, earMaterial);
  frontLeftLeg.position.set(0.22, 0.08, 0.18);
  root.add(frontLeftLeg);

  const frontRightLeg = new THREE.Mesh(pawGeom, earMaterial);
  frontRightLeg.position.set(0.22, 0.08, -0.18);
  root.add(frontRightLeg);

  const backLeftLeg = new THREE.Mesh(pawGeom, earMaterial);
  backLeftLeg.position.set(-0.25, 0.08, 0.19);
  root.add(backLeftLeg);

  const backRightLeg = new THREE.Mesh(pawGeom, earMaterial);
  backRightLeg.position.set(-0.25, 0.08, -0.19);
  root.add(backRightLeg);

  return {
    root,
    isCustomGLB: false,
    update: (_delta: number, time: number, isRunning: boolean = true) => {
      if (isRunning) {
        // Gallop cycle
        const freq = 12;
        const gallop = Math.sin(time * freq);
        body.position.y = 0.35 + Math.abs(gallop) * 0.08;
        head.position.y = 0.42 + Math.abs(gallop) * 0.06;
        head.rotation.z = gallop * 0.1;

        // Limbs gallop alternation
        frontLeftLeg.position.x = 0.22 + Math.cos(time * freq) * 0.1;
        frontRightLeg.position.x = 0.22 - Math.cos(time * freq) * 0.1;
        backLeftLeg.position.x = -0.25 - Math.cos(time * freq) * 0.1;
        backRightLeg.position.x = -0.25 + Math.cos(time * freq) * 0.1;

        // Tail waving
        tailSegments.forEach((seg, idx) => {
          seg.position.y = Math.sin(time * 8 + idx * 0.6) * 0.04;
          seg.position.z = Math.cos(time * 6 + idx * 0.5) * 0.03;
        });
      } else {
        // Idle breathing
        body.scale.set(1.2 + Math.sin(time * 3) * 0.03, 0.85 + Math.sin(time * 3) * 0.04, 0.85);
        head.rotation.z = Math.sin(time * 1.5) * 0.05;
        tailSegments.forEach((seg, idx) => {
          seg.position.z = Math.sin(time * 2 + idx * 0.4) * 0.02;
        });
      }
    },
  };
}
