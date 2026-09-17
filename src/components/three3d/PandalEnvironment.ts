import * as THREE from 'three';

export const GANESHA_BACKGROUND_IMAGE_URL =
  'https://lh3.googleusercontent.com/pw/AP1GczOCjxxMqi_N6fASX9jjX2R7BtasZSN6G-6HLb81-DMrUrAIgArg3MbhF3zdE2i1u_cZlPKbYUc_RnOPMap1sVyVqDqIuui1k3sNqMS-6Od8ppEfD1BpsImHuYYcSJgGgMB05MTCRlyx_zB6ESJK6wk=w550-h310-s-no-gm?authuser=0';

export interface PandalEnvironmentResult {
  ganeshaMountPoint: THREE.Vector3;
  mushakMountPoint: THREE.Vector3;
  flickerLights: THREE.PointLight[];
  update: (delta: number, time: number) => void;
  dispose: () => void;
}

/**
 * Creates an ornate, procedurally painted high-resolution traditional Rangoli mandala texture.
 */
function createRangoliTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackCanvas = document.createElement('canvas');
    fallbackCanvas.width = 16;
    fallbackCanvas.height = 16;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);

  // Outer circular border with gold ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139, 26, 26, 0.85)';
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();

  // White decorative dots along outer ring
  const numOuterDots = 48;
  for (let i = 0; i < numOuterDots; i++) {
    const angle = (i / numOuterDots) * Math.PI * 2;
    const dx = cx + Math.cos(angle) * (size * 0.44);
    const dy = cy + Math.sin(angle) * (size * 0.44);
    ctx.beginPath();
    ctx.arc(dx, dy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Ring 2: Vibrant Marigold Orange Band
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = '#d97706';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  // 16 Petal Lotus in Ring 2
  const petals = 16;
  ctx.save();
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, size * 0.22);
    ctx.quadraticCurveTo(size * 0.08, size * 0.32, 0, size * 0.38);
    ctx.quadraticCurveTo(-size * 0.08, size * 0.32, 0, size * 0.22);
    ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#eab308';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Ring 3: Turmeric Yellow Circle
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fffbeb';
  ctx.stroke();

  // Inner 8 Petal Sacred Lotus
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, size * 0.08);
    ctx.quadraticCurveTo(size * 0.06, size * 0.16, 0, size * 0.21);
    ctx.quadraticCurveTo(-size * 0.06, size * 0.16, 0, size * 0.08);
    ctx.fillStyle = '#ec4899';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();
    ctx.restore();
  }

  // Central Bindu Chakra
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = '#b91c1c';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.025, 0, Math.PI * 2);
  ctx.fillStyle = '#fde047';
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates an ornate gold-filigree bordered red velvet carpet texture.
 */
function createCarpetTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = document.createElement('canvas');
    return new THREE.CanvasTexture(fallback);
  }

  // Rich Crimson Velvet background
  ctx.fillStyle = '#6b1111';
  ctx.fillRect(0, 0, size, size);

  // Subtle velvet weave noise
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(136, 19, 19, 0.4)' : 'rgba(70, 8, 8, 0.4)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Golden ornate border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 18;
  ctx.strokeRect(16, 16, size - 32, size - 32);

  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, size - 56, size - 56);

  // Corner floral flourishes
  const corners = [
    [32, 32],
    [size - 32, 32],
    [32, size - 32],
    [size - 32, size - 32],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fffbeb';
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Constructs the grand Ganesh Chaturthi Pandal environment.
 */
export function buildGrandPandalEnvironment(scene: THREE.Scene): PandalEnvironmentResult {
  const root = new THREE.Group();
  scene.add(root);

  const flickerLights: THREE.PointLight[] = [];
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // ==========================================
  // 1. MASTER PBR MATERIALS
  // ==========================================
  const polishedMarbleMat = new THREE.MeshStandardMaterial({
    color: 0x120a06,
    roughness: 0.22,
    metalness: 0.15,
  });
  disposables.push(polishedMarbleMat);

  const antiqueGoldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    metalness: 0.85,
    roughness: 0.24,
  });
  disposables.push(antiqueGoldMat);

  const warmTeakMat = new THREE.MeshStandardMaterial({
    color: 0x27140a,
    roughness: 0.55,
    metalness: 0.1,
  });
  disposables.push(warmTeakMat);

  const carpetTex = createCarpetTexture();
  disposables.push(carpetTex);
  const redCarpetMat = new THREE.MeshStandardMaterial({
    map: carpetTex,
    roughness: 0.7,
    metalness: 0.05,
  });
  disposables.push(redCarpetMat);

  const royalVelvetMat = new THREE.MeshStandardMaterial({
    color: 0x881313,
    roughness: 0.65,
    metalness: 0.12,
  });
  disposables.push(royalVelvetMat);

  const silkCanopyMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.6,
    metalness: 0.15,
    side: THREE.DoubleSide,
  });
  disposables.push(silkCanopyMat);

  const saffronSilkMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.5,
    metalness: 0.2,
    side: THREE.DoubleSide,
  });
  disposables.push(saffronSilkMat);

  const marigoldOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.6,
    metalness: 0.05,
  });
  disposables.push(marigoldOrangeMat);

  const marigoldYellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.6,
    metalness: 0.05,
  });
  disposables.push(marigoldYellowMat);

  const brassLampMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.9,
    roughness: 0.18,
  });
  disposables.push(brassLampMat);

  const flameGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffedd5,
  });
  disposables.push(flameGlowMat);

  // ==========================================
  // 2. TEMPLE FLOOR & BASEMENT
  // ==========================================
  const floorGeom = new THREE.PlaneGeometry(28, 28);
  disposables.push(floorGeom);
  const floor = new THREE.Mesh(floorGeom, polishedMarbleMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // ==========================================
  // 3. ELEVATED CEREMONIAL STAGE (VEDI)
  // ==========================================
  // Tier 1: Wide Bottom Platform (Stone/Marble)
  const tier1Geom = new THREE.BoxGeometry(7.2, 0.35, 5.4);
  disposables.push(tier1Geom);
  const tier1 = new THREE.Mesh(tier1Geom, warmTeakMat);
  tier1.position.set(0, 0.175, -0.4);
  tier1.receiveShadow = true;
  tier1.castShadow = true;
  root.add(tier1);

  // Gold Trim on Tier 1
  const trim1Geom = new THREE.BoxGeometry(7.28, 0.06, 5.48);
  disposables.push(trim1Geom);
  const trim1 = new THREE.Mesh(trim1Geom, antiqueGoldMat);
  trim1.position.set(0, 0.35, -0.4);
  root.add(trim1);

  // Tier 2: Red Velvet Carpet Covered Central Podium
  const tier2Geom = new THREE.BoxGeometry(5.2, 0.28, 3.8);
  disposables.push(tier2Geom);
  const tier2 = new THREE.Mesh(tier2Geom, redCarpetMat);
  tier2.position.set(0, 0.48, -0.4);
  tier2.receiveShadow = true;
  tier2.castShadow = true;
  root.add(tier2);

  // Front Ceremonial Steps
  const stepGeom1 = new THREE.BoxGeometry(2.4, 0.16, 0.6);
  const step1 = new THREE.Mesh(stepGeom1, warmTeakMat);
  step1.position.set(0, 0.08, 2.5);
  step1.receiveShadow = true;
  root.add(step1);

  const stepGeom2 = new THREE.BoxGeometry(2.0, 0.16, 0.55);
  const step2 = new THREE.Mesh(stepGeom2, redCarpetMat);
  step2.position.set(0, 0.24, 2.1);
  step2.receiveShadow = true;
  root.add(step2);

  // ==========================================
  // 4. TRADITIONAL RANGOLI IN FRONT OF STAGE
  // ==========================================
  const rangoliTex = createRangoliTexture();
  disposables.push(rangoliTex);
  const rangoliGeom = new THREE.PlaneGeometry(3.2, 3.2);
  disposables.push(rangoliGeom);
  const rangoliMat = new THREE.MeshStandardMaterial({
    map: rangoliTex,
    transparent: true,
    roughness: 0.6,
    metalness: 0.1,
  });
  disposables.push(rangoliMat);

  const rangoliMesh = new THREE.Mesh(rangoliGeom, rangoliMat);
  rangoliMesh.rotation.x = -Math.PI / 2;
  rangoliMesh.position.set(0, 0.015, 3.8);
  rangoliMesh.receiveShadow = true;
  root.add(rangoliMesh);

  // ==========================================
  // 5. ROYAL ORNATE SINGHASAN (THRONE)
  // ==========================================
  const singhasanGroup = new THREE.Group();
  singhasanGroup.position.set(0, 0.62, -0.6);
  root.add(singhasanGroup);

  // Throne Base Platform (Stepped Gold Leaf Pedestal)
  const throneBaseGeom = new THREE.CylinderGeometry(2.2, 2.5, 0.35, 32);
  disposables.push(throneBaseGeom);
  const throneBase = new THREE.Mesh(throneBaseGeom, antiqueGoldMat);
  throneBase.position.y = 0.175;
  throneBase.castShadow = true;
  throneBase.receiveShadow = true;
  singhasanGroup.add(throneBase);

  // Lotus Petal Carvings around throne base
  const thronePetalGeom = new THREE.ConeGeometry(0.32, 0.45, 12);
  disposables.push(thronePetalGeom);
  thronePetalGeom.scale(1, 0.3, 1.4);
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const p = new THREE.Mesh(thronePetalGeom, antiqueGoldMat);
    p.position.set(Math.cos(angle) * 2.3, 0.28, Math.sin(angle) * 2.3);
    p.rotation.y = -angle + Math.PI / 2;
    p.rotation.x = 0.3;
    p.castShadow = true;
    singhasanGroup.add(p);
  }

  // Royal Velvet Seat Cushion
  const seatGeom = new THREE.CylinderGeometry(1.9, 2.0, 0.28, 32);
  disposables.push(seatGeom);
  const seat = new THREE.Mesh(seatGeom, royalVelvetMat);
  seat.position.y = 0.48;
  seat.receiveShadow = true;
  seat.castShadow = true;
  singhasanGroup.add(seat);

  // Golden Pillow Rim around cushion
  const seatRimGeom = new THREE.TorusGeometry(1.95, 0.08, 16, 48);
  disposables.push(seatRimGeom);
  const seatRim = new THREE.Mesh(seatRimGeom, antiqueGoldMat);
  seatRim.rotation.x = Math.PI / 2;
  seatRim.position.y = 0.58;
  singhasanGroup.add(seatRim);

  // Throne Backrest (Ornate Carved Golden Arch with Sunburst Halo)
  const backrestArchGeom = new THREE.CylinderGeometry(2.0, 2.0, 0.22, 32, 1, false, 0, Math.PI);
  disposables.push(backrestArchGeom);
  const backrestArch = new THREE.Mesh(backrestArchGeom, antiqueGoldMat);
  backrestArch.rotation.z = Math.PI / 2;
  backrestArch.position.set(0, 2.4, -0.65);
  backrestArch.castShadow = true;
  singhasanGroup.add(backrestArch);

  // Velvet Backrest Cushion
  const backCushionGeom = new THREE.CylinderGeometry(1.7, 1.7, 0.16, 32, 1, false, 0, Math.PI);
  disposables.push(backCushionGeom);
  const backCushion = new THREE.Mesh(backCushionGeom, royalVelvetMat);
  backCushion.rotation.z = Math.PI / 2;
  backCushion.position.set(0, 2.4, -0.6);
  singhasanGroup.add(backCushion);

  // Sunburst Prabhavali Halo Rays on Backrest
  const haloRaysCount = 18;
  const rayGeom = new THREE.ConeGeometry(0.08, 0.9, 8);
  disposables.push(rayGeom);
  for (let i = 0; i < haloRaysCount; i++) {
    const angle = (i / (haloRaysCount - 1)) * Math.PI;
    const ray = new THREE.Mesh(rayGeom, antiqueGoldMat);
    const radius = 2.05;
    ray.position.set(Math.cos(angle) * radius, 2.4 + Math.sin(angle) * radius, -0.7);
    ray.rotation.z = angle - Math.PI / 2;
    ray.castShadow = true;
    singhasanGroup.add(ray);
  }

  // Golden Kirtimukha / Crest Finial at Arch Top
  const finialGeom = new THREE.SphereGeometry(0.3, 16, 16);
  disposables.push(finialGeom);
  const finial = new THREE.Mesh(finialGeom, antiqueGoldMat);
  finial.position.set(0, 4.6, -0.65);
  finial.castShadow = true;
  singhasanGroup.add(finial);

  const finialSpire = new THREE.ConeGeometry(0.2, 0.6, 16);
  disposables.push(finialSpire);
  const spire = new THREE.Mesh(finialSpire, antiqueGoldMat);
  spire.position.set(0, 5.0, -0.65);
  singhasanGroup.add(spire);

  // Ornate Armrests (Left & Right Makara/Lion Carvings)
  const armrestGeom = new THREE.CylinderGeometry(0.18, 0.22, 1.4, 16);
  disposables.push(armrestGeom);
  armrestGeom.rotateX(Math.PI / 2);

  const leftArm = new THREE.Mesh(armrestGeom, antiqueGoldMat);
  leftArm.position.set(-1.8, 1.1, -0.1);
  leftArm.castShadow = true;
  singhasanGroup.add(leftArm);

  const rightArm = new THREE.Mesh(armrestGeom, antiqueGoldMat);
  rightArm.position.set(1.8, 1.1, -0.1);
  rightArm.castShadow = true;
  singhasanGroup.add(rightArm);

  // Golden Chhatra (Imperial Umbrella Canopy over Singhasaan)
  const chhatraGeom = new THREE.ConeGeometry(2.4, 0.65, 32, 1, true);
  disposables.push(chhatraGeom);
  const chhatra = new THREE.Mesh(chhatraGeom, antiqueGoldMat);
  chhatra.position.set(0, 5.6, -0.6);
  chhatra.castShadow = true;
  singhasanGroup.add(chhatra);

  // Hanging pearls/gold beads along chhatra edge
  const beadGeom = new THREE.SphereGeometry(0.06, 8, 8);
  disposables.push(beadGeom);
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const b = new THREE.Mesh(beadGeom, antiqueGoldMat);
    b.position.set(Math.cos(angle) * 2.38, 5.24, -0.6 + Math.sin(angle) * 2.38);
    singhasanGroup.add(b);
  }

  // ==========================================
  // 6. FOUR GRAND CARVED PANDAL PILLARS
  // ==========================================
  const pillarPositions = [
    [-3.2, 0, 1.8],   // Front Left
    [3.2, 0, 1.8],    // Front Right
    [-3.2, 0, -2.4],  // Back Left
    [3.2, 0, -2.4],   // Back Right
  ];

  const pillarBaseGeom = new THREE.BoxGeometry(0.9, 0.6, 0.9);
  const pillarShaftGeom = new THREE.CylinderGeometry(0.32, 0.38, 5.8, 20);
  const pillarCapitalGeom = new THREE.BoxGeometry(1.0, 0.5, 1.0);
  disposables.push(pillarBaseGeom, pillarShaftGeom, pillarCapitalGeom);

  pillarPositions.forEach(([px, py, pz]) => {
    // Base
    const pBase = new THREE.Mesh(pillarBaseGeom, warmTeakMat);
    pBase.position.set(px, 0.3, pz);
    pBase.castShadow = true;
    pBase.receiveShadow = true;
    root.add(pBase);

    // Gold molding on base
    const pBaseTrim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.08, 0.94), antiqueGoldMat);
    pBaseTrim.position.set(px, 0.6, pz);
    root.add(pBaseTrim);

    // Shaft
    const pShaft = new THREE.Mesh(pillarShaftGeom, warmTeakMat);
    pShaft.position.set(px, 3.5, pz);
    pShaft.castShadow = true;
    pShaft.receiveShadow = true;
    root.add(pShaft);

    // Ornate gold rings on shaft
    for (let r = 0; r < 3; r++) {
      const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 8, 24), antiqueGoldMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(px, 1.8 + r * 1.5, pz);
      root.add(ringMesh);
    }

    // Capital
    const pCap = new THREE.Mesh(pillarCapitalGeom, antiqueGoldMat);
    pCap.position.set(px, 6.4, pz);
    pCap.castShadow = true;
    root.add(pCap);
  });

  // ==========================================
  // 7. INTRICATE TORANA (GRAND FRONT ENTRANCE ARCH)
  // ==========================================
  // Cross beam between front pillars
  const beamGeom = new THREE.BoxGeometry(6.6, 0.45, 0.6);
  disposables.push(beamGeom);
  const frontBeam = new THREE.Mesh(beamGeom, warmTeakMat);
  frontBeam.position.set(0, 6.5, 1.8);
  frontBeam.castShadow = true;
  root.add(frontBeam);

  // Gold sculpted arch under the beam
  const toranaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.0, 5.2, 1.8),
    new THREE.Vector3(-1.8, 6.2, 1.8),
    new THREE.Vector3(0, 6.4, 1.8),
    new THREE.Vector3(1.8, 6.2, 1.8),
    new THREE.Vector3(3.0, 5.2, 1.8),
  ]);
  const toranaGeom = new THREE.TubeGeometry(toranaCurve, 32, 0.15, 12, false);
  disposables.push(toranaGeom);
  const toranaMesh = new THREE.Mesh(toranaGeom, antiqueGoldMat);
  toranaMesh.castShadow = true;
  root.add(toranaMesh);

  // Hanging Brass Temple Bells (Ghanta) from Arch
  const bellGeom = new THREE.CylinderGeometry(0.12, 0.24, 0.35, 16, 1, true);
  disposables.push(bellGeom);
  const bellPositions = [-2.2, -1.1, 0, 1.1, 2.2];
  bellPositions.forEach((bx) => {
    const chainGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8);
    const chain = new THREE.Mesh(chainGeom, antiqueGoldMat);
    chain.position.set(bx, 6.1, 1.8);
    root.add(chain);

    const bell = new THREE.Mesh(bellGeom, brassLampMat);
    bell.position.set(bx, 5.75, 1.8);
    bell.castShadow = true;
    root.add(bell);
  });

  // ==========================================
  // 8. RICH FABRIC CANOPY (CHANDOVA / SHAMIANA)
  // ==========================================
  // Roof Canopy Ceiling
  const canopyGeom = new THREE.PlaneGeometry(6.8, 4.6, 16, 12);
  disposables.push(canopyGeom);
  // Add subtle billow sag to canopy
  const posAttr = canopyGeom.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const distFromCenter = 1 - (Math.abs(vx) / 3.4) * (Math.abs(vy) / 2.3);
    posAttr.setZ(i, -Math.sin(distFromCenter * Math.PI) * 0.25);
  }
  canopyGeom.computeVertexNormals();

  const canopyMesh = new THREE.Mesh(canopyGeom, silkCanopyMat);
  canopyMesh.rotation.x = Math.PI / 2;
  canopyMesh.position.set(0, 6.6, -0.3);
  root.add(canopyMesh);

  // Scalloped Gold Valances hanging along architraves
  const valanceGeom = new THREE.BoxGeometry(6.6, 0.4, 0.08);
  disposables.push(valanceGeom);
  const frontValance = new THREE.Mesh(valanceGeom, saffronSilkMat);
  frontValance.position.set(0, 6.25, 1.76);
  root.add(frontValance);

  // Flanking Draped Silk Curtains (Left & Right tied back with gold ropes)
  const curtainGeom = new THREE.CylinderGeometry(0.4, 0.6, 5.4, 16, 8, true);
  disposables.push(curtainGeom);

  const leftCurtain = new THREE.Mesh(curtainGeom, silkCanopyMat);
  leftCurtain.position.set(-3.3, 3.4, 0);
  leftCurtain.scale.set(0.6, 1, 1.4);
  root.add(leftCurtain);

  const rightCurtain = new THREE.Mesh(curtainGeom, silkCanopyMat);
  rightCurtain.position.set(3.3, 3.4, 0);
  rightCurtain.scale.set(0.6, 1, 1.4);
  root.add(rightCurtain);

  // ==========================================
  // 9. BACKGROUND VISUAL BEHIND LORD GANESHA
  // ==========================================
  // Preserving the exact 550 x 310 aspect ratio (~1.77419) of the provided WebP image
  const bgHeight = 5.4;
  const bgWidth = bgHeight * (550 / 310); // ~9.58, preserving exact aspect ratio
  const backGeom = new THREE.PlaneGeometry(bgWidth, bgHeight);
  disposables.push(backGeom);

  const backMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
  });
  disposables.push(backMat);

  const backMesh = new THREE.Mesh(backGeom, backMat);
  backMesh.position.set(0, 3.2, -2.4);
  root.add(backMesh);

  // Load the user-provided WebP image directly from the public URL at runtime
  const texLoader = new THREE.TextureLoader();
  texLoader.setCrossOrigin('anonymous');
  texLoader.load(
    GANESHA_BACKGROUND_IMAGE_URL,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      backMat.map = texture;
      backMat.needsUpdate = true;
    },
    undefined,
    () => {
      // If WebGL cross-origin texture load is restricted in the container environment,
      // hide the 3D plane so the HTML/CSS background layer displays cleanly through.
      backMesh.visible = false;
    }
  );

  // Soft glowing warm ambient accent behind the background plane
  const backAmbientLight = new THREE.PointLight(0xf59e0b, 1.2, 7);
  backAmbientLight.position.set(0, 3.0, -2.9);
  scene.add(backAmbientLight);

  // ==========================================
  // 10. REALISTIC MARIGOLD FLOWER GARLANDS
  // ==========================================
  // Reusable Instanced Flower Bead for extreme rendering efficiency
  const flowerGeom = new THREE.DodecahedronGeometry(0.09, 1);
  disposables.push(flowerGeom);

  // Garland draped across the Singhasaan backrest
  const throneGarlandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, 4.2, -0.6),
    new THREE.Vector3(-1.0, 3.4, -0.5),
    new THREE.Vector3(0, 3.0, -0.45),
    new THREE.Vector3(1.0, 3.4, -0.5),
    new THREE.Vector3(1.8, 4.2, -0.6),
  ]);

  const garlandPoints = throneGarlandCurve.getPoints(36);
  garlandPoints.forEach((pt, i) => {
    const flower = new THREE.Mesh(flowerGeom, i % 2 === 0 ? marigoldOrangeMat : marigoldYellowMat);
    flower.position.copy(pt);
    singhasanGroup.add(flower);
  });

  // Pillars marigold spirals
  pillarPositions.forEach(([px, py, pz]) => {
    for (let s = 0; s < 28; s++) {
      const angle = s * 0.55;
      const h = 0.8 + s * 0.18;
      const flower = new THREE.Mesh(flowerGeom, s % 2 === 0 ? marigoldOrangeMat : marigoldYellowMat);
      flower.position.set(px + Math.cos(angle) * 0.42, h, pz + Math.sin(angle) * 0.42);
      root.add(flower);
    }
  });

  // Torana front swag garland
  const frontSwagCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.1, 5.8, 1.82),
    new THREE.Vector3(-1.6, 5.0, 1.82),
    new THREE.Vector3(0, 5.2, 1.82),
    new THREE.Vector3(1.6, 5.0, 1.82),
    new THREE.Vector3(3.1, 5.8, 1.82),
  ]);
  const swagPoints = frontSwagCurve.getPoints(42);
  swagPoints.forEach((pt, i) => {
    const flower = new THREE.Mesh(flowerGeom, i % 2 === 0 ? marigoldOrangeMat : marigoldYellowMat);
    flower.position.copy(pt);
    root.add(flower);
  });

  // ==========================================
  // 11. BRASS POOJA SAMAI (TALL TRADITIONAL OIL LAMPS)
  // ==========================================
  const buildPoojaSamai = (x: number, z: number) => {
    const samaiGroup = new THREE.Group();
    samaiGroup.position.set(x, 0.48, z);

    // Multi-tier base
    const sBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.25, 20), brassLampMat);
    sBase.position.y = 0.125;
    sBase.castShadow = true;
    samaiGroup.add(sBase);

    // Slender pillar with decorative rings
    const sStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.8, 16), brassLampMat);
    sStem.position.y = 1.05;
    sStem.castShadow = true;
    samaiGroup.add(sStem);

    // 5-Wick Oil Dish
    const sDish = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.14, 20), brassLampMat);
    sDish.position.y = 1.95;
    sDish.castShadow = true;
    samaiGroup.add(sDish);

    // Brass Peacock / Hamsa Bird Crest
    const sCrest = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 12), brassLampMat);
    sCrest.position.y = 2.2;
    samaiGroup.add(sCrest);

    // Glowing Flame Wicks
    for (let w = 0; w < 5; w++) {
      const angle = (w / 5) * Math.PI * 2;
      const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 8), flameGlowMat);
      flameMesh.position.set(Math.cos(angle) * 0.3, 2.05, Math.sin(angle) * 0.3);
      samaiGroup.add(flameMesh);
    }

    // Dynamic Flickering Point Light
    const samaiLight = new THREE.PointLight(0xf97316, 1.8, 5.5);
    samaiLight.position.set(x, 2.45, z);
    samaiLight.castShadow = true;
    samaiLight.shadow.bias = -0.002;
    samaiLight.shadow.mapSize.width = 512;
    samaiLight.shadow.mapSize.height = 512;
    scene.add(samaiLight);
    flickerLights.push(samaiLight);

    root.add(samaiGroup);
  };

  buildPoojaSamai(-2.1, 1.0); // Left Samai
  buildPoojaSamai(2.1, 1.0);  // Right Samai

  // ==========================================
  // 12. BRASS FLOOR & PLATFORM DIYAS
  // ==========================================
  const diyaGeom = new THREE.CylinderGeometry(0.16, 0.08, 0.1, 16);
  disposables.push(diyaGeom);

  const diyaLocations = [
    [-2.3, 0.48, 1.3],
    [-1.5, 0.48, 1.4],
    [1.5, 0.48, 1.4],
    [2.3, 0.48, 1.3],
    [-1.2, 0.0, 2.7],
    [1.2, 0.0, 2.7],
    [-1.8, 0.0, 3.8],
    [1.8, 0.0, 3.8],
  ];

  diyaLocations.forEach(([dx, dy, dz], idx) => {
    const dMesh = new THREE.Mesh(diyaGeom, brassLampMat);
    dMesh.position.set(dx, dy + 0.05, dz);
    dMesh.castShadow = true;
    root.add(dMesh);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.11, 8), flameGlowMat);
    flame.position.set(dx, dy + 0.13, dz);
    root.add(flame);

    if (idx % 2 === 0) {
      const diyaLight = new THREE.PointLight(0xf59e0b, 1.1, 3.2);
      diyaLight.position.set(dx, dy + 0.22, dz);
      scene.add(diyaLight);
      flickerLights.push(diyaLight);
    }
  });

  // ==========================================
  // 13. DEVOTIONAL OFFERINGS (POOJA THALI, MODAKS, DURVA & KALASH)
  // ==========================================
  // Brass Pooja Thali near stage
  const thaliGeom = new THREE.CylinderGeometry(0.42, 0.38, 0.05, 24);
  const thali = new THREE.Mesh(thaliGeom, brassLampMat);
  thali.position.set(-0.8, 0.5, 0.8);
  thali.castShadow = true;
  root.add(thali);

  // Golden Modaks on Thali
  const modakGeom = new THREE.ConeGeometry(0.08, 0.14, 12);
  disposables.push(modakGeom);
  for (let m = 0; m < 5; m++) {
    const angle = (m / 5) * Math.PI * 2;
    const modak = new THREE.Mesh(modakGeom, antiqueGoldMat);
    modak.position.set(-0.8 + Math.cos(angle) * 0.18, 0.58, 0.8 + Math.sin(angle) * 0.18);
    modak.castShadow = true;
    root.add(modak);
  }
  // Center king modak
  const centerModak = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.18, 12), antiqueGoldMat);
  centerModak.position.set(-0.8, 0.61, 0.8);
  root.add(centerModak);

  // Hibiscus Red Flower in Thali
  const hibiscusMat = new THREE.MeshStandardMaterial({ color: 0xd91e36, roughness: 0.4 });
  disposables.push(hibiscusMat);
  const flowerPetal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), hibiscusMat);
  flowerPetal.scale.set(1, 0.3, 1);
  flowerPetal.position.set(-0.8, 0.54, 0.65);
  root.add(flowerPetal);

  // Sacred Kalash on Right Platform
  const kalashPotGeom = new THREE.SphereGeometry(0.24, 20, 20);
  const kalashPot = new THREE.Mesh(kalashPotGeom, brassLampMat);
  kalashPot.position.set(0.9, 0.68, 0.8);
  kalashPot.castShadow = true;
  root.add(kalashPot);

  // Coconut on Kalash
  const coconutMat = new THREE.MeshStandardMaterial({ color: 0x543217, roughness: 0.8 });
  disposables.push(coconutMat);
  const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), coconutMat);
  coconut.position.set(0.9, 0.94, 0.8);
  coconut.scale.set(1, 1.3, 1);
  root.add(coconut);

  // ==========================================
  // 14. ATMOSPHERIC PARTICLE SYSTEMS (PETALS, INCENSE, DUST)
  // ==========================================
  // Drifting Marigold Petals
  const petalCount = 70;
  const petalGeom = new THREE.PlaneGeometry(0.1, 0.14);
  disposables.push(petalGeom);
  const petalMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  disposables.push(petalMat);

  const petalsGroup = new THREE.Group();
  const petalVelocities: { vx: number; vy: number; vz: number; rx: number; ry: number }[] = [];

  for (let i = 0; i < petalCount; i++) {
    const petal = new THREE.Mesh(petalGeom, petalMat);
    petal.position.set(
      (Math.random() - 0.5) * 8,
      Math.random() * 5 + 0.3,
      (Math.random() - 0.5) * 6
    );
    petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    petalsGroup.add(petal);
    petalVelocities.push({
      vx: (Math.random() - 0.5) * 0.006,
      vy: -0.005 - Math.random() * 0.006,
      vz: (Math.random() - 0.5) * 0.006,
      rx: (Math.random() - 0.5) * 0.03,
      ry: (Math.random() - 0.5) * 0.03,
    });
  }
  root.add(petalsGroup);

  // Floating Divine Gold Dust Sparkles
  const dustCount = 80;
  const dustGeom = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 9;
    dustPositions[i + 1] = Math.random() * 5.5 + 0.2;
    dustPositions[i + 2] = (Math.random() - 0.5) * 7;
  }
  dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  disposables.push(dustGeom);

  const dustMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.06,
    transparent: true,
    opacity: 0.7,
  });
  disposables.push(dustMat);
  const dustPoints = new THREE.Points(dustGeom, dustMat);
  root.add(dustPoints);

  // Warm Halo Light directly behind Singhasaan & Ganesha
  const divineRimLight = new THREE.PointLight(0xf59e0b, 3.2, 8.5);
  divineRimLight.position.set(0, 2.7, -1.5);
  scene.add(divineRimLight);

  // Mount Points for Characters
  // Ganesha sits on the plush royal velvet cushion of the Singhasaan
  const ganeshaMountPoint = new THREE.Vector3(0, 1.25, -0.6);
  // Mushak stands devotedly on the red velvet stage platform to Ganesha's right
  const mushakMountPoint = new THREE.Vector3(1.15, 0.48, 0.4);

  return {
    ganeshaMountPoint,
    mushakMountPoint,
    flickerLights,
    update: (delta: number, time: number) => {
      // 1. Realistic Diya and Samai Flame Flickering
      flickerLights.forEach((light, i) => {
        const f1 = Math.sin(time * 12 + i * 1.7) * 0.18;
        const f2 = Math.cos(time * 21 + i * 2.3) * 0.12;
        light.intensity = 1.4 + f1 + f2;
      });

      // 2. Petals floating down gently
      petalsGroup.children.forEach((p, idx) => {
        const vel = petalVelocities[idx];
        p.position.x += vel.vx + Math.sin(time * 1.5 + idx) * 0.002;
        p.position.y += vel.vy;
        p.position.z += vel.vz;
        p.rotation.x += vel.rx;
        p.rotation.y += vel.ry;

        if (p.position.y < 0.08) {
          p.position.y = 5.6;
          p.position.x = (Math.random() - 0.5) * 8;
          p.position.z = (Math.random() - 0.5) * 6;
        }
      });

      // 3. Floating Gold Dust animation
      const dPos = dustGeom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustCount; i++) {
        let y = dPos.getY(i);
        y += Math.sin(time * 1.2 + i) * 0.002 - 0.001;
        if (y < 0.2) y = 5.4;
        dPos.setY(i, y);
      }
      dPos.needsUpdate = true;
    },
    dispose: () => {
      scene.remove(root);
      scene.remove(divineRimLight);
      scene.remove(backAmbientLight);
      flickerLights.forEach((l) => scene.remove(l));
      disposables.forEach((d) => d.dispose());
    },
  };
}
