import { Player } from '../types';

/**
 * High-fidelity 3D procedural renderer for the mouse character,
 * modeled directly after the user's reference image (realistic brown field mouse):
 * - Agouti brown-grey textured fur with volumetric 3D studio lighting & specular sheen
 * - Delicate translucent pink rounded ears with natural rim lighting
 * - Glossy jet-black spherical eye with pinpoint white highlight & ambient reflection
 * - Long delicate radiating whiskers (mystacial vibrissae) with physics vibration
 * - Slender pink forelegs and muscular hind haunches with articulated clawed digits
 * - Elongated, segmented pinkish-brown tail with natural waving curve
 * - Authentic 3D quadruped locomotion (gallop cycle, jump extension, slide crawl, and reverent Pranam at the altar)
 */

export function drawMouse3D(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  ctx.save();

  // Scale, orientation and pose adjustments based on action state
  let scaleX = 1;
  let scaleY = 1;
  let bodyRot = 0;
  let headRot = 0;
  let earAngle = 0;
  let gallopPhase = (player.animFrame || 0) * 0.85;

  // Specific state transformations
  if (player.animState === 'hit') {
    scaleX = 1.08;
    scaleY = 0.88;
    bodyRot = -0.25;
    headRot = -0.15;
    earAngle = -0.4;
  } else if (player.animState === 'pranam') {
    // Sits upright on haunches, reverently folding front paws in Namaste
    scaleX = 0.94;
    scaleY = 1.05;
    bodyRot = -0.32; // rears up towards Lord Ganesha
    headRot = 0.25;
    earAngle = -0.05;
  } else if (player.animState === 'celebrating') {
    scaleX = 0.98;
    scaleY = 1.02;
    bodyRot = Math.sin(time * 6) * 0.08;
    headRot = Math.sin(time * 6) * 0.05;
    earAngle = 0.15;
  } else if (player.isSliding) {
    // Scurrying low to the ground
    scaleX = 1.35;
    scaleY = 0.62;
    bodyRot = 0.05;
    headRot = 0.08;
    earAngle = -0.35;
  } else if (!player.isGrounded) {
    if (player.vy < 0) {
      // Ascending jump: streamlined stretch
      scaleX = 1.15;
      scaleY = 0.88;
      bodyRot = -0.18;
      headRot = -0.1;
      earAngle = -0.3;
    } else {
      // Falling: landing preparation
      scaleX = 1.05;
      scaleY = 0.95;
      bodyRot = 0.08;
      headRot = 0.05;
      earAngle = 0.1;
    }
  } else {
    // Ground running gallop: spine flexing and breathing
    const gallop = Math.sin(gallopPhase);
    scaleX = 1 + gallop * 0.07;
    scaleY = 1 - gallop * 0.06;
    bodyRot = gallop * 0.05;
    headRot = -gallop * 0.03;
    earAngle = Math.sin(time * 12) * 0.08;
  }

  // Apply overall model scale & rotation
  ctx.scale(scaleX, scaleY);
  ctx.rotate(bodyRot);

  // --- 1. NATURAL DROP SHADOW ON GROUND ---
  if (player.isGrounded) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(2, -2, 28, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- 2. TAIL (Long, slender, tapering, pinkish-brown with segmented rings & physics curve) ---
  drawRealisticTail(ctx, player, time);

  // --- 3. BACKGROUND (FAR-SIDE) LEGS ---
  drawFarLegs(ctx, player, gallopPhase, time);

  // --- 4. MAIN TORSO & HAUNCHES (3D Volumetric Agouti Fur Shading) ---
  drawTorsoAndHaunch(ctx, player, time);

  // --- 5. FOREGROUND (NEAR-SIDE) LEGS & ARTICULATED PAWS ---
  drawNearLegs(ctx, player, gallopPhase, time);

  // --- 6. HEAD, SNOUT & FACIAL FEATURES (Snout, Whiskers, 3D Glass Eye, Translucent Ears) ---
  drawHeadAndFace(ctx, player, headRot, earAngle, time);

  // --- 7. SACRED AUSPICIOUS FESTIVE ACCENTS (Subtle golden scarf / holy tilak for Mushak the Vahana) ---
  drawAuspiciousVahanaAccents(ctx, player, time);

  // --- 8. HIT DAZED STARS ---
  if (player.animState === 'hit') {
    for (let i = 0; i < 3; i++) {
      const starAngle = time * 7 + (i * Math.PI * 2) / 3;
      const starX = 8 + Math.cos(starAngle) * 18;
      const starY = -52 + Math.sin(starAngle) * 7;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(starX, starY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws the realistic segmented tail trailing naturally behind the mouse
 */
function drawRealisticTail(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  ctx.save();

  let tailBaseX = -20;
  let tailBaseY = -14;
  let tailSway = Math.sin(time * 9) * 6;

  if (player.animState === 'pranam') {
    // Tail rests gracefully curled on the ground beside hind paws
    tailBaseX = -16;
    tailBaseY = -6;
    ctx.strokeStyle = '#c69586';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailBaseX, tailBaseY);
    ctx.bezierCurveTo(-26, -4, -36, -2, -42, -5);
    ctx.bezierCurveTo(-46, -7, -48, -12, -44, -14);
    ctx.stroke();

    // Subtle skin rings along the tail
    ctx.strokeStyle = 'rgba(140, 85, 75, 0.4)';
    ctx.lineWidth = 1;
    for (let r = 0; r < 7; r++) {
      const tx = tailBaseX - r * 3.8;
      const ty = tailBaseY + Math.sin(r * 0.4) * 2;
      ctx.beginPath();
      ctx.moveTo(tx, ty - 2);
      ctx.lineTo(tx, ty + 2);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  if (player.isSliding) {
    tailSway = Math.sin(time * 18) * 3;
    tailBaseY = -10;
  } else if (!player.isGrounded) {
    tailSway = -8 + Math.sin(time * 8) * 4;
  }

  // Tail Path: curves from base downwards and hooks gently (matching photo)
  const tipX = -54;
  const tipY = -22 + tailSway;
  const cp1x = -30;
  const cp1y = -22 + tailSway * 0.4;
  const cp2x = -44;
  const cp2y = -34 - tailSway * 0.6;

  // Base thick tail shadow
  ctx.strokeStyle = '#8d5d50';
  ctx.lineWidth = 4.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tailBaseX, tailBaseY);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
  ctx.stroke();

  // Primary fleshy pinkish-brown tail core
  ctx.strokeStyle = '#cb9888';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(tailBaseX, tailBaseY);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, tipX, tipY);
  ctx.stroke();

  // Upper subtle light sheen on tail
  ctx.strokeStyle = '#e6b9ac';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(tailBaseX + 1, tailBaseY - 1);
  ctx.bezierCurveTo(cp1x + 1, cp1y - 1, cp2x, cp2y - 1, tipX + 3, tipY);
  ctx.stroke();

  // Segmented annuli lines along the tail (characteristic of real mice)
  ctx.strokeStyle = 'rgba(115, 68, 58, 0.45)';
  ctx.lineWidth = 0.9;
  for (let i = 1; i <= 9; i++) {
    const t = i / 10;
    // Cubic bezier point evaluation
    const omt = 1 - t;
    const px = omt * omt * omt * tailBaseX + 3 * omt * omt * t * cp1x + 3 * omt * t * t * cp2x + t * t * t * tipX;
    const py = omt * omt * omt * tailBaseY + 3 * omt * omt * t * cp1y + 3 * omt * t * t * cp2y + t * t * t * tipY;

    ctx.beginPath();
    ctx.arc(px, py, 1.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws the legs on the far side (darker for 3D depth perception)
 */
function drawFarLegs(
  ctx: CanvasRenderingContext2D,
  player: Player,
  gallopPhase: number,
  _time: number
) {
  ctx.save();
  // Deep shadow shade for far-side limbs
  ctx.fillStyle = '#4a3325';

  if (player.animState === 'pranam') {
    // Folded far hind leg
    ctx.beginPath();
    ctx.ellipse(-14, -6, 7, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const farLegCycleOffset = Math.PI; // 180 deg out of phase with near legs
  const hindStep = Math.sin(gallopPhase + farLegCycleOffset) * 7;
  const foreStep = Math.sin(gallopPhase + farLegCycleOffset + 0.5) * 6;

  // Far Hind Thigh & Foot
  ctx.beginPath();
  ctx.ellipse(-12 + hindStep * 0.6, -7, 6.5, 4.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Far hind paw with digits
  ctx.fillStyle = '#ad7769';
  ctx.beginPath();
  ctx.ellipse(-11 + hindStep, -3, 4, 2.5, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Far Foreleg & Paw
  ctx.fillStyle = '#4a3325';
  ctx.beginPath();
  ctx.ellipse(14 + foreStep * 0.6, -11, 4.5, 6, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ad7769';
  ctx.beginPath();
  ctx.ellipse(16 + foreStep, -4, 3.5, 2.2, 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the 3D muscular body, arched back, agouti fur texturing, and realistic flank shading
 */
function drawTorsoAndHaunch(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  ctx.save();

  // 1. Muscular Hind Haunch (Thigh) - Large rounded brown mass
  const haunchGrad = ctx.createRadialGradient(-11, -16, 2, -10, -16, 17);
  haunchGrad.addColorStop(0, '#785b46'); // midtone warm brown
  haunchGrad.addColorStop(0.5, '#563e2e'); // deep agouti shadow
  haunchGrad.addColorStop(1, '#352419');

  ctx.fillStyle = haunchGrad;
  ctx.beginPath();
  ctx.ellipse(-11, -17, 13, 11, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // 2. Main Torso (Arched spine with naturalistic rodent hump and cream belly)
  const bodyGrad = ctx.createLinearGradient(-18, -32, 10, -2);
  bodyGrad.addColorStop(0, '#382519'); // dark dorsal ridge
  bodyGrad.addColorStop(0.22, '#5e4331'); // agouti coat
  bodyGrad.addColorStop(0.5, '#7e5d45'); // warm fur midtone
  bodyGrad.addColorStop(0.8, '#af8d72'); // soft flank
  bodyGrad.addColorStop(1, '#e8dccf'); // creamy buff underbelly

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  // Precision contour of real mouse silhouette
  ctx.moveTo(15, -19); // base of neck
  ctx.bezierCurveTo(18, -13, 14, -4, 3, -4); // chest and belly line
  ctx.bezierCurveTo(-10, -4, -18, -9, -19, -18); // lower rear
  ctx.bezierCurveTo(-20, -29, -10, -33, 2, -31); // arched dorsal spine
  ctx.bezierCurveTo(9, -29, 13, -25, 15, -19); // shoulder ridge
  ctx.closePath();
  ctx.fill();

  // 3. Realistic 3D Rim Lighting / Specular Sheen on the arched back
  // Matches the bright studio top-lighting seen on the back fur in the reference photo
  ctx.save();
  const sheenGrad = ctx.createLinearGradient(-12, -32, 6, -26);
  sheenGrad.addColorStop(0, 'rgba(235, 218, 198, 0.65)'); // bright silvery-cream highlight
  sheenGrad.addColorStop(0.6, 'rgba(195, 168, 142, 0.4)');
  sheenGrad.addColorStop(1, 'rgba(195, 168, 142, 0)');

  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.moveTo(-16, -27);
  ctx.bezierCurveTo(-8, -33, 2, -32, 8, -26);
  ctx.bezierCurveTo(4, -28, -6, -29, -14, -25);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Subtle Individual Fur Texture Strokes on the dorsal surface
  ctx.strokeStyle = 'rgba(235, 215, 195, 0.35)';
  ctx.lineWidth = 0.8;
  for (let f = 0; f < 8; f++) {
    const fx = -12 + f * 2.5;
    const fy = -29 + Math.sin(f * 0.7) * 2;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(fx + 2, fy - 1.5);
    ctx.stroke();
  }

  // 5. Pale Underbelly / Chest Fur patch
  ctx.fillStyle = 'rgba(242, 233, 222, 0.85)';
  ctx.beginPath();
  ctx.ellipse(3, -11, 7, 5.5, 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the foreground (near-side) legs with articulated pink toes and claws
 */
function drawNearLegs(
  ctx: CanvasRenderingContext2D,
  player: Player,
  gallopPhase: number,
  time: number
) {
  ctx.save();

  if (player.animState === 'pranam') {
    // Sitting on hind haunches, front paws folded reverently in Namaste (Pranam Mudra)
    // Hind foot resting flat on ground
    ctx.fillStyle = '#6b4f3b';
    ctx.beginPath();
    ctx.ellipse(-10, -7, 8, 5, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Articulated pink hind toes gripping floor
    ctx.fillStyle = '#f5beb4';
    ctx.beginPath();
    ctx.ellipse(-7, -3, 6, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Little claws
    ctx.strokeStyle = '#fffcf7';
    ctx.lineWidth = 1;
    for (let c = 0; c < 4; c++) {
      ctx.beginPath();
      ctx.moveTo(-9 + c * 2, -2.5);
      ctx.lineTo(-8 + c * 2, -1);
      ctx.stroke();
    }

    // Forepaws: Held up in front of chest in reverent Namaste!
    const prayerBreathe = Math.sin(time * 4) * 0.8;
    ctx.save();
    ctx.translate(14, -20 + prayerBreathe);

    // Divine golden prayer aura around palms
    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();

    // Slender pink forearms
    ctx.fillStyle = '#624633';
    ctx.beginPath();
    ctx.ellipse(-4, 3, 3.5, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Left and right paws joined together in prayer
    ctx.fillStyle = '#f8c5bb';
    ctx.beginPath();
    ctx.ellipse(-1.5, -1, 3, 6.5, 0.2, 0, Math.PI * 2);
    ctx.ellipse(2, -1, 3, 6.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Tiny pink digits
    ctx.strokeStyle = '#e2978a';
    ctx.lineWidth = 0.8;
    for (let d = -2; d <= 2; d++) {
      ctx.beginPath();
      ctx.moveTo(d * 1.2, -6);
      ctx.lineTo(d * 1.2, -3);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
    return;
  }

  // Running Gait Cycle
  const nearHindStep = Math.sin(gallopPhase) * 8;
  const nearForeStep = Math.sin(gallopPhase + 0.5) * 7;

  // 1. Near Hind Leg & Paw
  ctx.fillStyle = '#73543f';
  ctx.beginPath();
  ctx.ellipse(-12 + nearHindStep * 0.5, -10, 6, 8, -0.25, 0, Math.PI * 2);
  ctx.fill();

  // Lower leg & pink elongated hind foot
  ctx.fillStyle = '#f5beb4';
  ctx.beginPath();
  ctx.ellipse(-10 + nearHindStep, -3, 5, 2.6, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // 4 clawed toes
  ctx.strokeStyle = '#fefcf8';
  ctx.lineWidth = 0.8;
  for (let c = 0; c < 3; c++) {
    ctx.beginPath();
    ctx.moveTo(-11 + nearHindStep + c * 2, -2.5);
    ctx.lineTo(-10 + nearHindStep + c * 2.2, -1);
    ctx.stroke();
  }

  // 2. Near Foreleg & Articulated Paw
  ctx.fillStyle = '#6b4c37';
  ctx.beginPath();
  ctx.ellipse(10 + nearForeStep * 0.4, -13, 4, 7, 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Pink forepaw
  ctx.fillStyle = '#f8c5bb';
  ctx.beginPath();
  ctx.ellipse(12 + nearForeStep, -4, 4, 2.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Delicate tiny claws on forepaw
  ctx.strokeStyle = '#fefcf8';
  ctx.lineWidth = 0.8;
  for (let c = 0; c < 3; c++) {
    ctx.beginPath();
    ctx.moveTo(11 + nearForeStep + c * 1.8, -3.5);
    ctx.lineTo(13 + nearForeStep + c * 1.8, -2);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws the realistic 3D head, tapering muzzle, moist nose, translucent ear,
 * the deep glass eye, and the signature delicate long fan of whiskers
 */
function drawHeadAndFace(
  ctx: CanvasRenderingContext2D,
  player: Player,
  headRot: number,
  earAngle: number,
  time: number
) {
  ctx.save();
  ctx.translate(11, -26);
  ctx.rotate(headRot);

  // 1. Far Ear (Partially occluded on the other side of head)
  ctx.save();
  ctx.translate(-2, -10);
  ctx.rotate(earAngle * 0.8 - 0.15);
  ctx.fillStyle = '#7a5144'; // shadowy ear back
  ctx.beginPath();
  ctx.ellipse(0, 0, 7.5, 9, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c78d81';
  ctx.beginPath();
  ctx.ellipse(1, 0, 5, 6.5, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. 3D Head Geometry (Elliptical cranium tapering into sleek muzzle)
  const headGrad = ctx.createRadialGradient(2, -4, 2, 0, -2, 16);
  headGrad.addColorStop(0, '#85644d'); // midtone warm brown
  headGrad.addColorStop(0.45, '#6a4d3a');
  headGrad.addColorStop(0.85, '#4f3627'); // deep shadow
  headGrad.addColorStop(1, '#342116');

  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(0, -3, 12, 10.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Tapering Snout / Muzzle
  ctx.beginPath();
  ctx.moveTo(7, -8);
  ctx.bezierCurveTo(14, -6, 18, -4, 21, -2); // top bridge of nose
  ctx.lineTo(21, 0.5); // nose tip
  ctx.bezierCurveTo(16, 2, 9, 3, 5, 2.5); // jaw line
  ctx.closePath();
  ctx.fill();

  // Creamy cheek / throat patch
  ctx.fillStyle = 'rgba(235, 222, 208, 0.65)';
  ctx.beginPath();
  ctx.ellipse(4, 1.5, 6, 3.5, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // 3. Moist Dark Nose Leather (with nostril highlight)
  ctx.fillStyle = '#24140d';
  ctx.beginPath();
  ctx.ellipse(21, -0.8, 2.2, 2.8, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // Nose tip moist sheen
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.arc(21.2, -1.8, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // 4. Near Ear (Translucent, cup-shaped, pinkish-tan skin with fine edge rim)
  ctx.save();
  ctx.translate(-4, -11);
  ctx.rotate(earAngle);

  // Outer ear cartilage & skin
  const earGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 10);
  earGrad.addColorStop(0, '#f7c8be'); // warm translucent pink center
  earGrad.addColorStop(0.65, '#e49f93');
  earGrad.addColorStop(1, '#9b6456'); // velvety furred rim

  ctx.fillStyle = earGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 11, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Inner ear shell hollow & delicate vascular shading
  ctx.fillStyle = '#f9d2c9';
  ctx.beginPath();
  ctx.ellipse(1, 0.5, 6, 8, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Delicate ear skin folds
  ctx.strokeStyle = 'rgba(180, 100, 90, 0.45)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(0, 1, 4.5, -1, 1.4);
  ctx.stroke();

  ctx.restore();

  // 5. Realistic 3D Glass Eye (Jet black, glossy spherical cornea with white highlight)
  if (player.animState === 'pranam') {
    // Eyes closed peacefully in prayer and devotion at Lord Ganesha's feet
    ctx.strokeStyle = '#23140e';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(8, -5, 4.5, 0.25, Math.PI - 0.25);
    ctx.stroke();

    // Gentle eyelid highlight
    ctx.strokeStyle = '#bfa289';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(8, -6, 4.8, 0.3, Math.PI - 0.3);
    ctx.stroke();
  } else {
    // Wide open, expressive, lifelike shiny rodent eye (matches Auscape photo!)
    // Deep black base
    ctx.fillStyle = '#0a0808';
    ctx.beginPath();
    ctx.ellipse(8, -5, 4.2, 4.8, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Subtle lower corneal ambient blue-grey reflection
    const eyeReflect = ctx.createRadialGradient(8, -3, 0.5, 8, -4, 4);
    eyeReflect.addColorStop(0, 'rgba(148, 163, 184, 0.45)');
    eyeReflect.addColorStop(1, 'rgba(10, 8, 8, 0)');
    ctx.fillStyle = eyeReflect;
    ctx.beginPath();
    ctx.ellipse(8, -4, 3.8, 4.2, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white primary pinpoint specular catchlight (from studio light)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(9.5, -6.8, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Secondary tiny specular bounce
    ctx.beginPath();
    ctx.arc(7.2, -3.4, 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // 6. Whiskers (Mystacial Vibrissae) - Stunning long delicate fan
  // Matches the prominent spray of long whiskers clearly visible in the reference photo
  drawRealisticWhiskers(ctx, time);

  ctx.restore();
}

/**
 * Draws the fan of authentic delicate whiskers with physics flutter
 */
function drawRealisticWhiskers(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save();
  const flutter = Math.sin(time * 22) * 1.5;

  // Multiple whisker strands fanning out from the whisker pad
  const whiskers = [
    { startX: 18, startY: -2.5, endX: 38, endY: -9 + flutter, dark: false },
    { startX: 19, startY: -1.8, endX: 42, endY: -5 + flutter * 0.8, dark: false },
    { startX: 19.5, startY: -1, endX: 43, endY: -1 + flutter * 0.5, dark: false },
    { startX: 19.2, startY: -0.2, endX: 41, endY: 4 - flutter * 0.5, dark: false },
    { startX: 18.5, startY: 0.6, endX: 37, endY: 8 - flutter * 0.8, dark: false },
    { startX: 17.5, startY: 1.2, endX: 33, endY: 12 - flutter, dark: true },
    // Subtle downward droop whiskers (characteristic of rodents)
    { startX: 16.5, startY: 1.5, endX: 28, endY: 14 - flutter * 0.4, dark: true },
  ];

  for (const w of whiskers) {
    ctx.strokeStyle = w.dark ? 'rgba(50, 35, 25, 0.6)' : 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(w.startX, w.startY);
    // Graceful downward parabolic curve
    ctx.quadraticCurveTo(
      (w.startX + w.endX) * 0.5,
      (w.startY + w.endY) * 0.5 + 1.2,
      w.endX,
      w.endY
    );
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws auspicious festival accents for Mushak as Lord Ganesha's sacred vahana:
 * A delicate sacred vermillion (Sindoor) Tilak and a festive saffron dupatta
 */
function drawAuspiciousVahanaAccents(ctx: CanvasRenderingContext2D, player: Player, time: number) {
  ctx.save();

  // 1. Auspicious Sindoor & Chandan Tilak on forehead
  ctx.fillStyle = '#dc2626'; // sacred red
  ctx.beginPath();
  ctx.ellipse(14, -34, 1.6, 3.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbbf24'; // chandan yellow dot
  ctx.beginPath();
  ctx.arc(14, -30.5, 1.1, 0, Math.PI * 2);
  ctx.fill();

  // 2. Festive Saffron / Golden Sash (Dupatta) draped around Mushak's neck
  const sashFlutter = Math.sin(time * 16) * 4;
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.ellipse(4, -22, 8, 4, 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Trailing festival silk end streaming behind
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(-3, -22);
  ctx.quadraticCurveTo(-14, -25 + sashFlutter, -24, -20 + sashFlutter);
  ctx.lineTo(-22, -17 + sashFlutter);
  ctx.quadraticCurveTo(-12, -20 + sashFlutter, -1, -20);
  ctx.closePath();
  ctx.fill();

  // Gold zari border on sash
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 3. Mini sacred modak clutched when running
  if (player.animState !== 'pranam') {
    const pawSway = Math.sin((player.animFrame || 0) * 0.85) * 3;
    drawClutchedModak(ctx, 16 + pawSway, -14);
  }

  ctx.restore();
}

/**
 * Draws the sacred sweet modak Mushak carries to offer Lord Ganesha
 */
function drawClutchedModak(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.translate(x, y);

  // Golden glow
  ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();

  // Modak body
  const modakGrad = ctx.createLinearGradient(0, -8, 0, 4);
  modakGrad.addColorStop(0, '#fef08a');
  modakGrad.addColorStop(0.5, '#fde047');
  modakGrad.addColorStop(1, '#d97706');

  ctx.fillStyle = modakGrad;
  ctx.beginPath();
  ctx.moveTo(0, -7); // pointed spire tip
  ctx.bezierCurveTo(4, -4, 6, 0, 4, 4);
  ctx.bezierCurveTo(2, 6, -2, 6, -4, 4);
  ctx.bezierCurveTo(-6, 0, -4, -4, 0, -7);
  ctx.closePath();
  ctx.fill();

  // Delicate fold lines (flutes) of traditional steamed modak
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(0, 4.5);
  ctx.moveTo(0, -6);
  ctx.lineTo(-2.5, 3.5);
  ctx.moveTo(0, -6);
  ctx.lineTo(2.5, 3.5);
  ctx.stroke();

  ctx.restore();
}
