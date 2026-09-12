/**
 * High-fidelity procedural 3D renderer for the End Point Lord Ganesha,
 * modeled directly after the user's reference photograph (Bal Ganesha):
 * - Cute standing toddler Bal Ganesha on lush green festival lawn
 * - Shimmering white silk pleated dhoti with rich gold zari border & golden waistband
 * - Elaborate double-strand fresh garland of white jasmine (mogra) & red roses
 * - Towering ornate golden crown (Mukut) with central teardrop ruby jewel
 * - Four divine arms: lower left holding round golden laddu/modak, lower right in Abhaya Mudra
 * - Chubby baby elephant face, broad pink-lined ears, curved trunk with red & white Chandan tilak
 * - Multi-layered gold necklaces with ornate teardrop padakkam pendant
 * - Background fireworks fountain (anar) shooting white-gold sparks & warm glowing bokeh orbs
 */

export function drawLordGaneshaEndpoint(
  ctx: CanvasRenderingContext2D,
  shrineX: number,
  groundY: number,
  time: number,
  isAtAltar: boolean,
  playerX?: number,
  bannerText = true
) {
  ctx.save();

  // --- 1. FESTIVE BACKGROUND FIREWORKS FOUNTAIN & WARM BOKEH ORBS (From Photo) ---
  drawSparklerFountainAndBokeh(ctx, shrineX, groundY - 140, time);

  // --- 2. LUSH GREEN FESTIVAL LAWN PEDESTAL ---
  drawFestivalLawnPedestal(ctx, shrineX, groundY, time);

  // --- 3. STANDING BAL GANESHA FIGURE ---
  ctx.save();
  ctx.translate(shrineX, groundY - 14); // standing upright at ground level
  drawBalGaneshaStandingFigure(ctx, time);
  ctx.restore();

  // --- 4. TRADITIONAL SAMAI BRASS DIYAS ON LAWN ---
  drawStandingBrassDiya(ctx, shrineX - 85, groundY - 6, time);
  drawStandingBrassDiya(ctx, shrineX + 85, groundY - 6, time + 1.2);

  // --- 5. SILVER THALI WITH HEAPING MODAKS AT HIS FEET ---
  drawModakThaliAtFeet(ctx, shrineX, groundY - 8);

  // --- 6. "HAPPY GANESH CHATURTHI" CELEBRATORY BANNER (Matching Photo top badge) ---
  if (bannerText) {
    drawGaneshChaturthiBanner(ctx, shrineX, groundY - 215, time);
  }

  // --- 7. DIVINE AASHIRWAD BLESSING RAY FLOWING DOWN TO MUSHAK ---
  if (isAtAltar && playerX !== undefined) {
    drawDivineBlessingRay(ctx, shrineX, groundY, playerX, time);
  }

  ctx.restore();
}

/**
 * Draws the fireworks fountain (anar) and warm bokeh orbs seen in the user photo
 */
function drawSparklerFountainAndBokeh(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number
) {
  ctx.save();

  // 1. Warm amber/golden bokeh orbs in background
  const bokehOrbs = [
    { x: -90, y: -40, r: 18, c: 'rgba(251, 191, 36, 0.45)' },
    { x: -120, y: 10, r: 14, c: 'rgba(245, 158, 11, 0.4)' },
    { x: -65, y: -80, r: 22, c: 'rgba(254, 240, 138, 0.5)' },
    { x: 95, y: -30, r: 20, c: 'rgba(251, 191, 36, 0.45)' },
    { x: 130, y: 15, r: 16, c: 'rgba(249, 115, 22, 0.35)' },
    { x: 75, y: -75, r: 24, c: 'rgba(253, 224, 71, 0.55)' },
    { x: -140, y: -10, r: 12, c: 'rgba(239, 68, 68, 0.3)' },
    { x: 145, y: -5, r: 13, c: 'rgba(251, 191, 36, 0.4)' },
  ];

  for (const b of bokehOrbs) {
    const pulse = Math.sin(time * 3 + b.x) * 2;
    ctx.fillStyle = b.c;
    ctx.beginPath();
    ctx.arc(cx + b.x, cy + b.y, Math.max(2, b.r + pulse), 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Fireworks Fountain (Anar) erupting directly behind Bal Ganesha
  // Central column of blinding white-gold fire and luminous sparks
  const fountainGrad = ctx.createLinearGradient(cx, cy + 90, cx, cy - 80);
  fountainGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  fountainGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
  fountainGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.6)');
  fountainGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

  ctx.fillStyle = fountainGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy + 90);
  ctx.quadraticCurveTo(cx - 38, cy + 10, cx - 18, cy - 70);
  ctx.lineTo(cx + 18, cy - 70);
  ctx.quadraticCurveTo(cx + 38, cy + 10, cx + 16, cy + 90);
  ctx.closePath();
  ctx.fill();

  // Sparkling needles & erupting embers
  for (let s = 0; s < 36; s++) {
    const sparkAngle = (s * 0.17 + Math.sin(time * 5 + s) * 0.1) - Math.PI / 2;
    const speed = 40 + ((s * 23 + Math.sin(time * 8 + s) * 25) % 110);
    const sx = cx + Math.cos(sparkAngle) * (speed * 0.55);
    const sy = cy + 40 + Math.sin(sparkAngle) * speed;

    ctx.strokeStyle = s % 3 === 0 ? '#ffffff' : '#fde047';
    ctx.lineWidth = s % 2 === 0 ? 1.5 : 1;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + Math.cos(sparkAngle) * 7, sy + Math.sin(sparkAngle) * 7);
    ctx.stroke();

    // Occasional bright burning star spark
    if (s % 4 === 0) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Draws the lush illuminated green lawn where Bal Ganesha stands
 */
function drawFestivalLawnPedestal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  groundY: number,
  time: number
) {
  ctx.save();

  // Warm golden ground ambient glow under shrine
  const groundGlow = ctx.createRadialGradient(cx, groundY, 10, cx, groundY, 140);
  groundGlow.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
  groundGlow.addColorStop(0.5, 'rgba(217, 119, 6, 0.2)');
  groundGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = groundGlow;
  ctx.beginPath();
  ctx.ellipse(cx, groundY, 140, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // Illuminated Green Grass Lawn Mound (as in Keshav Chaudhary photo)
  const lawnGrad = ctx.createLinearGradient(0, groundY - 20, 0, groundY + 12);
  lawnGrad.addColorStop(0, '#3f6212'); // top illuminated lush moss green
  lawnGrad.addColorStop(0.4, '#2d4a0e');
  lawnGrad.addColorStop(1, '#142707');

  ctx.fillStyle = lawnGrad;
  ctx.beginPath();
  ctx.ellipse(cx, groundY, 110, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Individual grass blade tufts with warm rim light
  ctx.strokeStyle = '#65a30d';
  ctx.lineWidth = 1.4;
  for (let i = -14; i <= 14; i++) {
    const gx = cx + i * 7.5;
    const gy = groundY - 4 + Math.sin(i * 0.4) * 3;
    const sway = Math.sin(time * 3 + i) * 1.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + sway, gy - 6);
    ctx.stroke();
  }

  // Scattered fresh red rose petals on the grass
  const petalColors = ['#dc2626', '#f43f5e', '#b91c1c'];
  for (let p = 0; p < 12; p++) {
    const px = cx + ((p * 29) % 150) - 75;
    const py = groundY - 2 + ((p * 17) % 12);
    ctx.fillStyle = petalColors[p % petalColors.length];
    ctx.beginPath();
    ctx.ellipse(px, py, 3.5, 2, p * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws the standing Bal Ganesha figure in white silk dhoti,
 * thick jasmine & rose garland, ornate jeweled crown, and four arms
 */
function drawBalGaneshaStandingFigure(ctx: CanvasRenderingContext2D, time: number) {
  ctx.save();

  // Subtle breathing / divine life bob
  const divineBob = Math.sin(time * 3) * 1.2;
  ctx.translate(0, divineBob);

  // --- 1. TODDLER FEET (Bare, cute feet standing on grass) ---
  ctx.fillStyle = '#f8d2b8'; // soft rosy-peach toddler skin
  // Left foot
  ctx.beginPath();
  ctx.ellipse(-12, -2, 6, 3.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Right foot
  ctx.beginPath();
  ctx.ellipse(12, -2, 6, 3.5, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Gold anklets (Payal)
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(-12, -4, 4.5, 0, Math.PI);
  ctx.arc(12, -4, 4.5, 0, Math.PI);
  ctx.stroke();

  // --- 2. WHITE SILK DHOTI (Pleated Panche with Gold Zari Border) ---
  // Matches the white silk dhoti worn by Bal Ganesha in the photo
  const dhotiGrad = ctx.createLinearGradient(0, -78, 0, -4);
  dhotiGrad.addColorStop(0, '#ffffff');
  dhotiGrad.addColorStop(0.65, '#f8fafc');
  dhotiGrad.addColorStop(0.9, '#f1f5f9');
  dhotiGrad.addColorStop(1, '#e2e8f0');

  ctx.fillStyle = dhotiGrad;

  // Main dhoti skirt & legs outline
  ctx.beginPath();
  ctx.moveTo(-18, -68);
  ctx.lineTo(-24, -20);
  ctx.quadraticCurveTo(-22, -4, -6, -4);
  ctx.lineTo(-4, -26); // crotch fold
  ctx.lineTo(4, -26);
  ctx.quadraticCurveTo(22, -4, 24, -20);
  ctx.lineTo(18, -68);
  ctx.closePath();
  ctx.fill();

  // Central cascading silk pleats (Kacche)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(-7, -68);
  ctx.lineTo(-9, -8);
  ctx.lineTo(9, -8);
  ctx.lineTo(7, -68);
  ctx.closePath();
  ctx.fill();

  // Vertical pleat shadows
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1.2;
  for (let l = -2; l <= 2; l++) {
    ctx.beginPath();
    ctx.moveTo(l * 3, -66);
    ctx.lineTo(l * 3.5, -8);
    ctx.stroke();
  }

  // Glistening Gold Zari border at hem and pleat edges
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-22, -6);
  ctx.lineTo(22, -6);
  ctx.stroke();

  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-9, -8);
  ctx.lineTo(9, -8);
  ctx.stroke();

  // Golden Waistband (Kamarbandh) with ruby center
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.roundRect(-20, -72, 40, 6, 2);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Central gemstone buckle on waistband
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(0, -69, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1;
  ctx.stroke();

  // --- 3. UPPER BODY & PLUMP CHUBBY TORSO ---
  // Soft golden-radiant toddler skin (matching photo)
  const skinGrad = ctx.createRadialGradient(0, -84, 4, 0, -84, 28);
  skinGrad.addColorStop(0, '#fed7aa'); // warm soft peach
  skinGrad.addColorStop(0.5, '#fba368');
  skinGrad.addColorStop(0.85, '#ea7a40');
  skinGrad.addColorStop(1, '#c25828');

  ctx.fillStyle = skinGrad;
  // Cute rounded toddler belly (Lambodara)
  ctx.beginPath();
  ctx.ellipse(0, -82, 22, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Navel (Cute baby belly button)
  ctx.fillStyle = '#c25828';
  ctx.beginPath();
  ctx.arc(0, -77, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Sacred Thread (Janeu)
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-16, -96);
  ctx.bezierCurveTo(-6, -86, 6, -78, 16, -70);
  ctx.stroke();

  // --- 4. MULTI-LAYERED GOLDEN NECKLACES & TEARDROP PADAKKAM (From Photo) ---
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2;
  // Inner choker
  ctx.beginPath();
  ctx.arc(0, -100, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();
  // Middle necklace
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, -98, 17, 0.25, Math.PI - 0.25);
  ctx.stroke();
  // Outer long chain
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, -96, 23, 0.3, Math.PI - 0.3);
  ctx.stroke();

  // Large Teardrop Padakkam (Pendant) centered on chest
  ctx.fillStyle = '#dc2626'; // glowing ruby center
  ctx.beginPath();
  ctx.moveTo(0, -85);
  ctx.bezierCurveTo(4, -85, 5, -81, 0, -76);
  ctx.bezierCurveTo(-5, -81, -4, -85, 0, -85);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // --- 5. FOUR DIVINE ARMS ---
  // UPPER RIGHT ARM (Raised outwards with gold armlet)
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(26, -98, 7, 18, 0.55, 0, Math.PI * 2);
  ctx.fill();
  // Gold bajuband (armlet)
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(23, -104, 8, 0, Math.PI);
  ctx.stroke();
  // Hand with open mudra & gold kada
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(37, -112, 6, 7, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // UPPER LEFT ARM (Raised outwards with gold armlet)
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(-26, -98, 7, 18, -0.55, 0, Math.PI * 2);
  ctx.fill();
  // Gold bajuband
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(-23, -104, 8, 0, Math.PI);
  ctx.stroke();
  // Hand
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(-37, -112, 6, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // LOWER RIGHT ARM IN ABHAYA MUDRA (Blessing palm facing viewer - photo match!)
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(24, -80, 8, 14, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Gold wrist bangles
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(26, -74, 8, 0, Math.PI);
  ctx.stroke();
  // Blessing palm
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(28, -70, 7, 9, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Rosy red lotus print in blessing palm
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(28, -70, 3, 0, Math.PI * 2);
  ctx.fill();

  // LOWER LEFT ARM DELICATELY HOLDING MODAK / LADDU (Photo match!)
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(-24, -80, 8, 14, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Gold wrist bangles
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(-26, -74, 8, 0, Math.PI);
  ctx.stroke();
  // Hand cupping modak
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.ellipse(-28, -71, 7, 9, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // Big round golden Modak / Laddu in hand (bright yellow as in photo!)
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(-33, -77, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // Modak top golden point
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(-33, -83.5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // --- 6. LUSH WHITE JASMINE & RED ROSE GARLAND (HAAR) ---
  // Thick double-strand garland draped gracefully around neck and down to knees (photo match!)
  drawFloralGarland(ctx);

  // --- 7. BABY ELEPHANT HEAD & CHEEKS ---
  const headGrad = ctx.createRadialGradient(0, -122, 5, 0, -122, 28);
  headGrad.addColorStop(0, '#fed7aa');
  headGrad.addColorStop(0.5, '#fba368');
  headGrad.addColorStop(0.85, '#ea7a40');
  headGrad.addColorStop(1, '#c25828');

  ctx.fillStyle = headGrad;
  // Chubby baby elephant head
  ctx.beginPath();
  ctx.ellipse(0, -122, 24, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cute chubby cheeks
  ctx.fillStyle = 'rgba(254, 215, 170, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-14, -118, 8, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(14, -118, 8, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- 8. LARGE ELEPHANT EARS (SUPAKARNA) WITH PEACH-PINK INTERIOR ---
  // Left Ear
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(-32, -124, 15, 20, -0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fda4af'; // delicate pink inner ear
  ctx.beginPath();
  ctx.ellipse(-31, -124, 9, 14, -0.28, 0, Math.PI * 2);
  ctx.fill();

  // Right Ear
  ctx.fillStyle = '#fba368';
  ctx.beginPath();
  ctx.ellipse(32, -124, 15, 20, 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fda4af'; // delicate pink inner ear
  ctx.beginPath();
  ctx.ellipse(31, -124, 9, 14, 0.28, 0, Math.PI * 2);
  ctx.fill();

  // --- 9. SACRED EKADANTA (WHITE RIGHT TUSK) ---
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(8, -112);
  ctx.lineTo(15, -107);
  ctx.lineTo(8, -104);
  ctx.closePath();
  ctx.fill();
  // Gold band on tusk
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(10, -110);
  ctx.lineTo(10, -105);
  ctx.stroke();

  // --- 10. CURVED TRUNK (VAKRATUNDA) SWEEPING LEFT TOWARDS MODAK ---
  const trunkGrad = ctx.createLinearGradient(0, -116, -20, -82);
  trunkGrad.addColorStop(0, '#fed7aa');
  trunkGrad.addColorStop(0.5, '#fba368');
  trunkGrad.addColorStop(1, '#ea7a40');

  ctx.fillStyle = trunkGrad;
  ctx.beginPath();
  ctx.moveTo(-6, -116);
  ctx.bezierCurveTo(-8, -102, -14, -94, -22, -88); // sweeping left toward modak
  ctx.bezierCurveTo(-26, -85, -24, -80, -19, -82);
  ctx.bezierCurveTo(-11, -85, 2, -98, 5, -116);
  ctx.closePath();
  ctx.fill();

  // Trunk wrinkle lines
  ctx.strokeStyle = 'rgba(194, 88, 40, 0.4)';
  ctx.lineWidth = 1;
  for (let w = 1; w <= 3; w++) {
    const wy = -112 + w * 6;
    ctx.beginPath();
    ctx.arc(-2 - w * 1.5, wy, 4, 0.3, Math.PI - 0.3);
    ctx.stroke();
  }

  // Sacred Chandan & Sindoor Tilak on Trunk
  ctx.fillStyle = '#ef4444'; // vermillion red
  ctx.beginPath();
  ctx.ellipse(-3, -110, 1.8, 5, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff'; // white chandan dots
  ctx.beginPath();
  ctx.arc(-3, -115, 1.2, 0, Math.PI * 2);
  ctx.arc(-3, -105, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // --- 11. GENTLE KOHL-LINED EYES & SWEET SMILE ---
  // Large expressive dark eyes with kohl (kajal)
  ctx.fillStyle = '#0f172a';
  // Left eye
  ctx.beginPath();
  ctx.ellipse(-10, -126, 3.8, 3.2, 0.12, 0, Math.PI * 2);
  ctx.fill();
  // Right eye
  ctx.beginPath();
  ctx.ellipse(10, -126, 3.8, 3.2, -0.12, 0, Math.PI * 2);
  ctx.fill();

  // Bright white eye catchlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-9, -127.5, 1.5, 0, Math.PI * 2);
  ctx.arc(11, -127.5, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-11.5, -124.5, 0.7, 0, Math.PI * 2);
  ctx.arc(8.5, -124.5, 0.7, 0, Math.PI * 2);
  ctx.fill();

  // Forehead Tripundra & Chandan Tilak
  ctx.fillStyle = '#dc2626'; // Sindoor
  ctx.beginPath();
  ctx.ellipse(0, -135, 2.8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Yellow Chandan Crescent
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, -132, 5, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // --- 12. TOWERING ORNATE GOLDEN CROWN (MUKUT) WITH RUBY JEWEL ---
  // Exquisite temple spire crown matching Keshav Chaudhary photograph
  drawGoldenMukut(ctx);

  ctx.restore();
}

/**
 * Draws the thick double-strand garland of white jasmine (mogra) and red roses
 */
function drawFloralGarland(ctx: CanvasRenderingContext2D) {
  ctx.save();

  // Garland hangs from shoulders down past the waist
  const garlandPoints = [
    { x: -22, y: -94, rose: false },
    { x: -20, y: -86, rose: false },
    { x: -17, y: -78, rose: true },
    { x: -14, y: -70, rose: false },
    { x: -10, y: -62, rose: false },
    { x: -5, y: -54, rose: true },
    { x: 0, y: -50, rose: true }, // center hanging loop
    { x: 5, y: -54, rose: true },
    { x: 10, y: -62, rose: false },
    { x: 14, y: -70, rose: false },
    { x: 17, y: -78, rose: true },
    { x: 20, y: -86, rose: false },
    { x: 22, y: -94, rose: false },
  ];

  for (const pt of garlandPoints) {
    if (pt.rose) {
      // Red Rose Cluster
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5.2, 0, Math.PI * 2);
      ctx.fill();

      // Petal highlights
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(pt.x - 1, pt.y - 1, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.arc(pt.x - 1, pt.y - 1.5, 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Clustered White Jasmine Buds (Mogra)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Soft jasmine yellow-green center
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Bottom rose tassel hanging down
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.ellipse(0, -44, 4.5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the towering ornate golden crown (Mukut) with central teardrop ruby
 */
function drawGoldenMukut(ctx: CanvasRenderingContext2D) {
  ctx.save();

  // Multi-tier golden crown
  const crownGrad = ctx.createLinearGradient(0, -178, 0, -136);
  crownGrad.addColorStop(0, '#fef08a');
  crownGrad.addColorStop(0.35, '#fde047');
  crownGrad.addColorStop(0.7, '#eab308');
  crownGrad.addColorStop(1, '#92400e');

  ctx.fillStyle = crownGrad;

  // Base tier
  ctx.beginPath();
  ctx.roundRect(-22, -142, 44, 10, 3);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Main arching spires
  ctx.beginPath();
  ctx.moveTo(-21, -142);
  ctx.lineTo(-17, -158);
  ctx.lineTo(-8, -154);
  ctx.lineTo(0, -174); // central towering spire
  ctx.lineTo(8, -154);
  ctx.lineTo(17, -158);
  ctx.lineTo(21, -142);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Pearl beads along crown base
  ctx.fillStyle = '#ffffff';
  for (let b = -4; b <= 4; b++) {
    ctx.beginPath();
    ctx.arc(b * 4.8, -137, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Exquisite Teardrop Ruby Jewel (Photo match!)
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.ellipse(0, -152, 4.2, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ruby cut highlight
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.ellipse(-1, -153, 2, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-1, -155, 1, 0, Math.PI * 2);
  ctx.fill();

  // Golden bezel around ruby
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(0, -152, 4.8, 7.2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Spire finial kalash top
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -175, 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the traditional brass Samai Diya lamp standing on the festival lawn
 */
function drawStandingBrassDiya(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Brass pedestal
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Stem
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-2, -18, 4, 18);

  // Lamp bowl
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(0, -18, 8, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Flame
  const flicker = Math.sin(time * 14 + x) * 1.5;
  const flameGlow = ctx.createRadialGradient(0, -23, 1, 0, -23, 16);
  flameGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
  flameGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.45)');
  flameGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = flameGlow;
  ctx.beginPath();
  ctx.arc(0, -23, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(-3, -19);
  ctx.quadraticCurveTo(flicker, -32, 0, -32);
  ctx.quadraticCurveTo(3, -24, 3, -19);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draws the silver Thali offering heaped with fresh modaks at Lord Ganesha's feet
 */
function drawModakThaliAtFeet(ctx: CanvasRenderingContext2D, cx: number, groundY: number) {
  ctx.save();
  ctx.translate(cx, groundY);

  // Silver plate
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // Heaped golden modaks in plate
  for (let i = -2; i <= 2; i++) {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(i * 6, -4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  // Peak modak
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws the celebratory "Happy Ganesh Chaturthi" banner directly above the shrine
 */
function drawGaneshChaturthiBanner(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  time: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Gentle float
  const floatY = Math.sin(time * 3) * 2;
  ctx.translate(0, floatY);

  // Banner background plaque
  ctx.fillStyle = 'rgba(24, 10, 6, 0.85)';
  ctx.beginPath();
  ctx.roundRect(-125, -16, 250, 32, 16);
  ctx.fill();
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Golden text
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 13px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.fillText('✨ HAPPY GANESH CHATURTHI ✨', 0, 0);

  ctx.restore();
}

/**
 * Draws the divine golden blessing ray connecting Lord Ganesha's blessing palm to Mushak
 */
function drawDivineBlessingRay(
  ctx: CanvasRenderingContext2D,
  shrineX: number,
  groundY: number,
  playerX: number,
  time: number
) {
  ctx.save();

  // Source: Ganesha's lower right blessing hand
  const srcX = shrineX + 28;
  const srcY = groundY - 84;

  // Target: Mushak's folded prayer paws
  const targetX = playerX + 16;
  const targetY = groundY - 24;

  // Radiant cone of divine light
  const beamGrad = ctx.createLinearGradient(srcX, srcY, targetX, targetY);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
  beamGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.6)');
  beamGrad.addColorStop(1, 'rgba(245, 158, 11, 0.15)');

  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(srcX, srcY);
  ctx.lineTo(targetX - 24, targetY);
  ctx.lineTo(targetX + 24, targetY);
  ctx.closePath();
  ctx.fill();

  // Flowing golden light orbs traveling along the divine ray
  for (let s = 0; s < 8; s++) {
    const t = (time * 1.6 + s * 0.25) % 1;
    const px = srcX + (targetX - srcX) * t + Math.sin(time * 6 + s) * 4;
    const py = srcY + (targetY - srcY) * t;

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(px, py, 2.5 + Math.sin(time * 8 + s) * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
