import {
  Player,
  Collectible,
  Obstacle,
  Particle,
  FloatingText,
  StageConfig,
  RangoliColor,
} from '../types';
import { drawMouse3D } from './mouse3D';
import { drawLordGaneshaEndpoint } from './ganeshaEndpoint';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private cloudOffsets = [40, 240, 520, 800];
  private kandeelOffsets = [120, 360, 600, 840, 1080];

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // --- Background Drawing based on Stage Atmosphere ---
  public drawBackground(stage: StageConfig, cameraX: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Sky & Atmosphere Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (stage.bgAtmosphere === 'day') {
      // Stage 1: Bright golden morning in festival street
      skyGrad.addColorStop(0, '#fef08a'); // soft morning gold
      skyGrad.addColorStop(0.4, '#fed7aa'); // peach
      skyGrad.addColorStop(0.75, '#fb923c'); // warm saffron
      skyGrad.addColorStop(1, '#9a3412');
    } else if (stage.bgAtmosphere === 'evening') {
      // Stage 2: Rich twilight with Rangoli glow
      skyGrad.addColorStop(0, '#312e81'); // deep indigo
      skyGrad.addColorStop(0.35, '#581c87'); // royal purple
      skyGrad.addColorStop(0.7, '#9d174d'); // magenta
      skyGrad.addColorStop(1, '#7c2d12'); // warm glow
    } else if (stage.bgAtmosphere === 'pandal') {
      // Stage 3: Inside Grand Pandal - crimson fabrics & chandeliers
      skyGrad.addColorStop(0, '#450a0a'); // deep crimson
      skyGrad.addColorStop(0.3, '#7f1d1d');
      skyGrad.addColorStop(0.7, '#b45309'); // rich golden amber
      skyGrad.addColorStop(1, '#78350f');
    } else if (stage.bgAtmosphere === 'green') {
      // Stage 4: Eco-Friendly - clean lush green & morning sunlight
      skyGrad.addColorStop(0, '#bae6fd'); // fresh clear sky
      skyGrad.addColorStop(0.4, '#bbf7d0'); // fresh pale mint
      skyGrad.addColorStop(0.75, '#86efac'); // soft green
      skyGrad.addColorStop(1, '#15803d'); // deep forest
    } else {
      // Stage 5: Visarjan Twilight - holy river reflection & starry night
      skyGrad.addColorStop(0, '#0f172a'); // midnight blue
      skyGrad.addColorStop(0.4, '#1e1b4b'); // deep twilight
      skyGrad.addColorStop(0.7, '#4c1d95'); // royal violet
      skyGrad.addColorStop(1, '#831843'); // sunset river glow
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Distant Celestial & Architectural Silhouette (Parallax Layer 0: 0.1x speed)
    const p0 = (cameraX * 0.1) % w;
    this.drawDistantCityscape(stage, p0, time);

    // 3. Midground Decorated Buildings & Pandals (Parallax Layer 1: 0.35x speed)
    const p1 = (cameraX * 0.35) % 400;
    this.drawMidgroundStreet(stage, p1, time);

    // 4. Street Ground & Pavement (Ground level at 82% of screen height)
    this.drawStreetGround(stage, cameraX);

    // 5. Overhead Torans & Marigold Garland Swags
    this.drawOverheadGarlands(cameraX, time);
  }

  private drawDistantCityscape(stage: StageConfig, pX: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const horizon = h * 0.65;

    // Distant soft sun or moon
    if (stage.bgAtmosphere === 'day' || stage.bgAtmosphere === 'green') {
      const sunGrad = ctx.createRadialGradient(w * 0.75, h * 0.22, 10, w * 0.75, h * 0.22, 90);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
      sunGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.35)');
      sunGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.22, 90, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Moon and twinkling stars
      ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.18, 22, 0, Math.PI * 2);
      ctx.fill();

      // Soft moon halo
      const moonHalo = ctx.createRadialGradient(w * 0.82, h * 0.18, 15, w * 0.82, h * 0.18, 70);
      moonHalo.addColorStop(0, 'rgba(254, 243, 199, 0.4)');
      moonHalo.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = moonHalo;
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.18, 70, 0, Math.PI * 2);
      ctx.fill();

      // Twinkling stars
      for (let i = 0; i < 24; i++) {
        const sx = (i * 73 + time * 2) % w;
        const sy = (i * 37) % (h * 0.45);
        const sSize = 1 + (Math.sin(time * 3 + i) + 1) * 1.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(sx, sy, sSize, sSize);
      }
    }

    // Temple Shikhara & Haveli Silhouettes in distance
    ctx.save();
    ctx.fillStyle = stage.bgAtmosphere === 'day' 
      ? 'rgba(180, 83, 9, 0.25)' 
      : stage.bgAtmosphere === 'green'
      ? 'rgba(22, 101, 52, 0.25)'
      : 'rgba(55, 19, 9, 0.45)';

    for (let x = -pX - 100; x < w + 200; x += 160) {
      // Temple dome / Shikhara spire
      ctx.beginPath();
      ctx.moveTo(x, horizon);
      ctx.lineTo(x, horizon - 90);
      ctx.quadraticCurveTo(x + 20, horizon - 150, x + 35, horizon - 160); // Spire peak
      ctx.quadraticCurveTo(x + 50, horizon - 150, x + 70, horizon - 90);
      ctx.lineTo(x + 70, horizon);
      ctx.fill();

      // Small saffron Kalash flag on top
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(x + 35, horizon - 160);
      ctx.lineTo(x + 48, horizon - 168);
      ctx.lineTo(x + 35, horizon - 176);
      ctx.fill();

      // Return silhouette color
      ctx.fillStyle = stage.bgAtmosphere === 'day' 
        ? 'rgba(180, 83, 9, 0.25)' 
        : stage.bgAtmosphere === 'green'
        ? 'rgba(22, 101, 52, 0.25)'
        : 'rgba(55, 19, 9, 0.45)';

      // Traditional arched haveli roof
      ctx.fillRect(x + 75, horizon - 75, 75, 75);
      ctx.beginPath();
      ctx.arc(x + 112, horizon - 75, 25, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawMidgroundStreet(stage: StageConfig, p1: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const groundY = h * 0.8;

    ctx.save();
    for (let x = -p1 - 200; x < w + 300; x += 320) {
      if (stage.bgAtmosphere === 'pandal') {
        // Grand Pandal Fabric Pillars & Drapery
        const pillarGrad = ctx.createLinearGradient(x, 0, x + 40, 0);
        pillarGrad.addColorStop(0, '#b91c1c');
        pillarGrad.addColorStop(0.5, '#f59e0b');
        pillarGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(x, groundY - 240, 42, 240);

        // Golden chandelier hanging
        const chanY = groundY - 220 + Math.sin(time * 2 + x) * 4;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 21, groundY - 260);
        ctx.lineTo(x + 21, chanY);
        ctx.stroke();

        // Chandelier lights
        const chanGlow = ctx.createRadialGradient(x + 21, chanY + 15, 2, x + 21, chanY + 15, 35);
        chanGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        chanGlow.addColorStop(0.6, 'rgba(245, 158, 11, 0.3)');
        chanGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = chanGlow;
        ctx.beginPath();
        ctx.arc(x + 21, chanY + 15, 35, 0, Math.PI * 2);
        ctx.fill();

        // Decorative arch fabric
        ctx.fillStyle = 'rgba(185, 28, 28, 0.65)';
        ctx.beginPath();
        ctx.moveTo(x + 42, groundY - 220);
        ctx.quadraticCurveTo(x + 160, groundY - 170, x + 280, groundY - 220);
        ctx.lineTo(x + 280, groundY - 240);
        ctx.quadraticCurveTo(x + 160, groundY - 190, x + 42, groundY - 240);
        ctx.fill();
      } else {
        // Traditional Indian Haveli townhouse
        // Warm terracotta / pastel facades
        const houseWidth = 240;
        const houseHeight = 180 + (Math.abs(x) % 50);

        ctx.fillStyle = stage.bgAtmosphere === 'green' ? '#3f6212' : '#78350f';
        ctx.fillRect(x, groundY - houseHeight, houseWidth, houseHeight);

        // Ornate Jharokha (traditional Rajasthani/Maharashtrian balcony)
        ctx.fillStyle = stage.bgAtmosphere === 'green' ? '#4d7c0f' : '#92400e';
        ctx.fillRect(x + 30, groundY - houseHeight + 40, 70, 60);

        // Window arch
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(x + 65, groundY - houseHeight + 58, 18, Math.PI, 0);
        ctx.rect(x + 47, groundY - houseHeight + 58, 36, 30);
        ctx.fill();

        // Warm light in window
        ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.fillRect(x + 52, groundY - houseHeight + 62, 26, 20);

        // Diya on the balcony ledge
        this.drawMiniDiya(x + 65, groundY - houseHeight + 98, time);

        // Traditional Hanging Lantern (Akash Kandil) swaying in the breeze
        const kandeelX = x + houseWidth - 45;
        const kandeelY = groundY - houseHeight + 25;
        const sway = Math.sin(time * 2.5 + x) * 6;
        this.drawAkashKandil(kandeelX + sway, kandeelY, time);
      }
    }
    ctx.restore();
  }

  private drawAkashKandil(x: number, y: number, time: number) {
    const ctx = this.ctx;
    // Lantern cord
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Lantern central diamond body
    ctx.fillStyle = '#ef4444'; // festival red
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 12, y + 14);
    ctx.lineTo(x, y + 28);
    ctx.lineTo(x - 12, y + 14);
    ctx.closePath();
    ctx.fill();

    // Golden trim
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Floating streamers/tassels below
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    for (let i = -8; i <= 8; i += 4) {
      const tasselSway = Math.sin(time * 4 + i) * 3;
      ctx.beginPath();
      ctx.moveTo(x + i, y + 28);
      ctx.lineTo(x + i + tasselSway, y + 42);
      ctx.stroke();
    }

    // Warm glow
    const glow = ctx.createRadialGradient(x, y + 14, 2, x, y + 14, 22);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y + 14, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawMiniDiya(x: number, y: number, time: number) {
    const ctx = this.ctx;
    // Terracotta base
    ctx.fillStyle = '#9a3412';
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flickering flame
    const flicker = Math.sin(time * 12 + x) * 1.5;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(x - 3, y - 1);
    ctx.quadraticCurveTo(x + flicker, y - 9, x, y - 10);
    ctx.quadraticCurveTo(x + 3, y - 3, x + 3, y - 1);
    ctx.fill();

    // Flame glow
    const glow = ctx.createRadialGradient(x, y - 5, 1, x, y - 5, 14);
    glow.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y - 5, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawStreetGround(stage: StageConfig, cameraX: number) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const groundY = h * 0.8;

    // Ground base gradient
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
    if (stage.bgAtmosphere === 'pandal') {
      groundGrad.addColorStop(0, '#991b1b'); // Royal crimson festival carpet
      groundGrad.addColorStop(0.15, '#b91c1c');
      groundGrad.addColorStop(1, '#450a0a');
    } else if (stage.bgAtmosphere === 'twilight') {
      groundGrad.addColorStop(0, '#1e293b'); // Dark stone ghat with wet river reflections
      groundGrad.addColorStop(0.2, '#334155');
      groundGrad.addColorStop(1, '#0f172a');
    } else {
      groundGrad.addColorStop(0, '#7c2d12'); // Rich warm terracotta street
      groundGrad.addColorStop(0.2, '#9a3412');
      groundGrad.addColorStop(1, '#451a03');
    }

    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Decorative festival pavement border / curb
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, groundY, w, 5);

    // Subtle paving stones texture moving with camera
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.15)';
    ctx.lineWidth = 1;
    const offsetX = cameraX % 60;
    for (let x = -offsetX; x < w + 60; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 5);
      ctx.lineTo(x - 30, h);
      ctx.stroke();
    }

    // Intricate Rangoli Art Patterns along the pavement!
    const rangoliPeriod = 240;
    const rangoliOffset = (cameraX * 0.9) % rangoliPeriod;
    for (let rx = -rangoliOffset; rx < w + rangoliPeriod; rx += rangoliPeriod) {
      this.drawPavementRangoli(rx + 80, groundY + 32, stage.hasColorSequence);
    }
  }

  // Beautiful geometric flower/mandala Rangoli on street
  private drawPavementRangoli(x: number, y: number, colorful = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Center circular medallion
    ctx.fillStyle = colorful ? '#ef4444' : 'rgba(254, 243, 199, 0.75)';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();

    // 8 Petals radiating
    const petalColors = colorful ? ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'] : ['rgba(254, 243, 199, 0.6)'];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.fillStyle = petalColors[i % petalColors.length];
      ctx.beginPath();
      ctx.ellipse(Math.cos(angle) * 14, Math.sin(angle) * 8, 6, 3, angle, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer decorative dots
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * 22, Math.sin(angle) * 12, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Overhead Toran / Marigold Garland swags swinging overhead
  private drawOverheadGarlands(cameraX: number, time: number) {
    const ctx = this.ctx;
    const w = this.width;
    const sway = Math.sin(time * 2) * 3;
    const swagWidth = 140;
    const offset = (cameraX * 0.4) % swagWidth;

    ctx.save();
    for (let x = -offset; x < w + swagWidth; x += swagWidth) {
      // Curve of the garland
      ctx.strokeStyle = '#15803d'; // green string
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.quadraticCurveTo(x + swagWidth / 2, 42 + sway, x + swagWidth, 15);
      ctx.stroke();

      // Alternating Marigolds (Orange & Yellow) and Mango Leaves
      for (let j = 0; j <= 6; j++) {
        const t = j / 6;
        const gx = x * (1 - t) + (x + swagWidth) * t;
        const gy = Math.pow(1 - t, 2) * 15 + 2 * (1 - t) * t * (42 + sway) + Math.pow(t, 2) * 15;

        // Marigold flower pompom
        ctx.fillStyle = j % 2 === 0 ? '#f97316' : '#eab308';
        ctx.beginPath();
        ctx.arc(gx, gy, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Center dot
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --- DRAW MUSHAK (The Playable Character) ---
  public drawPlayer(player: Player, time: number) {
    const ctx = this.ctx;
    ctx.save();

    // Position origin at center bottom of Mushak
    ctx.translate(player.x + player.width / 2, player.y + player.height);

    // Invincible / Hit Flashing
    if (player.invincibleTimer > 0 && Math.floor(time * 20) % 2 === 0) {
      ctx.globalAlpha = 0.55;
    }

    // Power-Up Aura Effects
    if (player.divineBlessingTimer > 0) {
      this.drawDivineBlessingAura(time);
    }
    if (player.magnetTimer > 0) {
      this.drawMagnetAura(time);
    }
    if (player.boostTimer > 0) {
      this.drawBoostTrails(time);
    }

    // High-Fidelity 3D Mouse Model (Matching user reference photo 1)
    drawMouse3D(ctx, player, time);

    ctx.restore();
    return;

    // Animation States & Transforms
    let bodyScaleX = 1;
    let bodyScaleY = 1;
    let rotation = 0;
    let earAngle = 0;
    let pawOffset = 0;
    let scarfFlutter = Math.sin(time * 16) * 4;

    if (player.animState === 'hit') {
      // Obstacle collision impact: knocked back and dizzy
      bodyScaleX = 1.18;
      bodyScaleY = 0.82;
      rotation = -0.32;
      earAngle = -0.45;
      pawOffset = -4;
      scarfFlutter = Math.sin(time * 26) * 6;
    } else if (player.animState === 'pranam') {
      // Reverently bowing in Namaste at Lord Ganesha's feet
      bodyScaleX = 0.96;
      bodyScaleY = 1.02;
      rotation = 0.12;
      earAngle = -0.15;
      pawOffset = 0;
      scarfFlutter = Math.sin(time * 6) * 2;
    } else if (player.animState === 'celebrating') {
      // Reaching Lord Ganesha: overjoyed, running forward and cheering
      bodyScaleX = 0.95;
      bodyScaleY = 1.05;
      rotation = Math.sin(time * 8) * 0.06;
      earAngle = 0.2;
      pawOffset = Math.sin(time * 10) * 4;
      scarfFlutter = Math.sin(time * 16) * 4;
    } else if (player.isSliding) {
      // Sliding / Ducking: squashed low, leaning forward
      bodyScaleX = 1.35;
      bodyScaleY = 0.65;
      rotation = 0.08;
      earAngle = -0.3;
      scarfFlutter = Math.sin(time * 24) * 8;
    } else if (!player.isGrounded) {
      if (player.vy < 0) {
        // Jumping upwards: stretched vertically, ears tucked back
        bodyScaleX = 0.88;
        bodyScaleY = 1.15;
        rotation = -0.12;
        earAngle = -0.25;
      } else {
        // Falling downwards: preparing for landing
        bodyScaleX = 1.1;
        bodyScaleY = 0.92;
        rotation = 0.06;
      }
    } else {
      // Running cycle: energetic 4-frame bobbing & paw patter
      const runCycle = Math.sin(player.animFrame * 0.8);
      bodyScaleX = 1 + runCycle * 0.06;
      bodyScaleY = 1 - runCycle * 0.06;
      pawOffset = Math.sin(player.animFrame * 0.8) * 6;
      earAngle = Math.sin(player.animFrame * 0.8) * 0.15;
    }

    ctx.scale(bodyScaleX, bodyScaleY);
    ctx.rotate(rotation);

    // 1. Tail (Long, elegant, s-curved, swaying joyfully)
    ctx.save();
    ctx.strokeStyle = '#d4b996';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    const tailSway = Math.sin(time * 10) * 8;
    ctx.beginPath();
    ctx.moveTo(-18, -12);
    ctx.bezierCurveTo(-28, -20 + tailSway, -38, -32 - tailSway, -44, -18 + tailSway);
    ctx.stroke();
    ctx.restore();

    // 2. Back Paws
    ctx.fillStyle = '#fbcfe8'; // soft pink paw pads
    ctx.beginPath();
    ctx.ellipse(-14 - pawOffset * 0.4, -4, 6, 4, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Main Mouse Body (Plump, adorable pear-shaped mouse body)
    const bodyGrad = ctx.createRadialGradient(-2, -22, 4, -2, -20, 26);
    bodyGrad.addColorStop(0, '#f5f0eb'); // soft warm cream underbelly
    bodyGrad.addColorStop(0.55, '#d4c7b8'); // soft warm mouse grey
    bodyGrad.addColorStop(1, '#a89a88');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    // Pear-shaped rounded torso
    ctx.moveTo(12, -18);
    ctx.bezierCurveTo(16, -10, 10, -2, 0, -2); // belly bottom
    ctx.bezierCurveTo(-12, -2, -18, -10, -16, -20); // rear
    ctx.bezierCurveTo(-14, -32, 2, -34, 12, -18); // back to chest
    ctx.fill();

    // 4. White / Cream Chest patch
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(3, -16, 7, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Festive Saffron / Golden Shawl (Dupatta) around Mushak's neck!
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(2, -26, 9, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Floating ends of the festive sash streaming behind
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-5, -26);
    ctx.quadraticCurveTo(-16, -28 + scarfFlutter, -28, -24 + scarfFlutter);
    ctx.lineTo(-26, -20 + scarfFlutter);
    ctx.quadraticCurveTo(-14, -22 + scarfFlutter, -3, -24);
    ctx.fill();

    // Golden border on sash
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 6. Cute Mouse Head
    const headGrad = ctx.createRadialGradient(10, -32, 2, 8, -32, 16);
    headGrad.addColorStop(0, '#f5f0eb');
    headGrad.addColorStop(0.7, '#d4c7b8');
    headGrad.addColorStop(1, '#a89a88');

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(9, -32, 13, 11, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Cute pointed mouse snout
    ctx.beginPath();
    ctx.moveTo(16, -37);
    ctx.lineTo(26, -31);
    ctx.lineTo(16, -25);
    ctx.closePath();
    ctx.fill();

    // 7. Little Pink Nose
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(26, -31, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Animated cute whiskers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    const whiskerWiggle = Math.sin(time * 18) * 1.5;
    // Top whisker
    ctx.beginPath();
    ctx.moveTo(23, -33);
    ctx.lineTo(34, -36 + whiskerWiggle);
    ctx.stroke();
    // Bottom whisker
    ctx.beginPath();
    ctx.moveTo(23, -29);
    ctx.lineTo(34, -26 - whiskerWiggle);
    ctx.stroke();

    // 8. Sacred Auspicious Tilak on Mushak's forehead (Red Chandan & Yellow)
    ctx.fillStyle = '#dc2626'; // Sindoor red
    ctx.beginPath();
    ctx.ellipse(12, -37, 2, 4, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fbbf24'; // Chandan yellow dot
    ctx.beginPath();
    ctx.arc(12, -33, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 9. Mouse Ears (Large, rounded, friendly)
    ctx.save();
    ctx.translate(3, -40);
    ctx.rotate(earAngle);

    // Outer ear
    ctx.fillStyle = '#d4c7b8';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    // Inner pink ear
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 10. Large expressive eye (closed peacefully in prayer if pranam, otherwise wide & bright)
    if (player.animState === 'pranam') {
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(15, -34, 4.5, 0.2, Math.PI - 0.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#1e1b4b'; // deep shiny dark eye
      ctx.beginPath();
      ctx.ellipse(15, -34, 4, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye catchlights (sparkle of enthusiasm!)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(16.5, -36, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(13.8, -32.5, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 11. Front Paws (Reverently folded in Namaste if pranam, else running & clutching mini Modak!)
    if (player.animState === 'pranam') {
      // Golden divine aura around prayer paws
      ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
      ctx.beginPath();
      ctx.arc(17, -20, 13, 0, Math.PI * 2);
      ctx.fill();

      // Little paws folded in reverent Namaste / Pranam
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(15, -20, 4, 7.5, 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(19, -20, 4, 7.5, -0.25, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.ellipse(12 + pawOffset, -14, 5, 3.5, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Mushak joyfully holding a mini sacred modak in his little paws!
      this.drawMiniModak(18 + pawOffset * 0.5, -19);
    }

    // 12. Dizzy stars circling head when hitting obstacle
    if (player.animState === 'hit') {
      for (let i = 0; i < 3; i++) {
        const starAngle = time * 7 + (i * Math.PI * 2) / 3;
        const starX = 8 + Math.cos(starAngle) * 16;
        const starY = -48 + Math.sin(starAngle) * 6;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(starX, starY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawMiniModak(x: number, y: number) {
    const ctx = this.ctx;
    // Teardrop steamed dumpling
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.moveTo(x, y - 6); // pointed crest
    ctx.quadraticCurveTo(x + 5, y - 1, x + 4, y + 3);
    ctx.quadraticCurveTo(x, y + 4, x - 4, y + 3);
    ctx.quadraticCurveTo(x - 5, y - 1, x, y - 6);
    ctx.fill();

    // Saffron strand tip
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, y - 6, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Divine Blessing golden shield
  private drawDivineBlessingAura(time: number) {
    const ctx = this.ctx;
    const radius = 42 + Math.sin(time * 8) * 3;
    const aura = ctx.createRadialGradient(0, -22, 15, 0, -22, radius);
    aura.addColorStop(0, 'rgba(254, 240, 138, 0.2)');
    aura.addColorStop(0.7, 'rgba(245, 158, 11, 0.45)');
    aura.addColorStop(1, 'rgba(251, 191, 36, 0)');

    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -22, radius, 0, Math.PI * 2);
    ctx.fill();

    // Golden rotating sacred mandala ring
    ctx.save();
    ctx.translate(0, -22);
    ctx.rotate(time * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Modak Magnet Attraction Rays
  private drawMagnetAura(time: number) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 2;

    for (let i = 0; i < 3; i++) {
      const r = 24 + ((time * 40 + i * 20) % 50);
      const alpha = 1 - r / 74;
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.beginPath();
      ctx.arc(10, -20, r, -0.6, 0.6);
      ctx.stroke();
    }
  }

  // Speed Boost Lines
  private drawBoostTrails(time: number) {
    const ctx = this.ctx;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = -10 - i * 6;
      const len = 30 + Math.sin(time * 30 + i) * 15;
      ctx.beginPath();
      ctx.moveTo(-15, y);
      ctx.lineTo(-15 - len, y);
      ctx.stroke();
    }
  }

  // --- DRAW COLLECTIBLES ---
  public drawCollectible(c: Collectible, time: number) {
    const ctx = this.ctx;
    const x = c.x + c.width / 2;
    const y = c.y + c.height / 2 + Math.sin(time * 4 + c.floatOffset) * 5;

    ctx.save();
    ctx.translate(x, y);

    // Power-up orb container
    if (c.isPowerUp) {
      this.drawPowerUpOrb(c.powerUpType, time);
      ctx.restore();
      return;
    }

    switch (c.type) {
      case 'modak':
        this.drawFullModak(time);
        break;
      case 'flower':
        this.drawMarigoldFlower(time, c.rangoliColor);
        break;
      case 'durva':
        this.drawDurvaGrass(time);
        break;
      case 'diya':
        this.drawFestiveDiya(time);
        break;
      case 'eco_clay':
        this.drawEcoClayPot(time);
        break;
      case 'eco_leaf':
        this.drawEcoLeaf(time);
        break;
      case 'eco_flower':
        this.drawEcoFlower(time);
        break;
      case 'trash_plastic':
        this.drawTrashPlastic(time);
        break;
      case 'trash_cup':
        this.drawTrashCup(time);
        break;
    }

    ctx.restore();
  }

  // Grand Steamed Modak (Sacred delicacy)
  private drawFullModak(time: number) {
    const ctx = this.ctx;

    // Golden divine halo glow
    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    halo.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
    halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    // Steamed white/cream dumpling with 3D shaded folds
    const modakGrad = ctx.createLinearGradient(-10, -12, 10, 12);
    modakGrad.addColorStop(0, '#ffffff');
    modakGrad.addColorStop(0.6, '#fef3c7');
    modakGrad.addColorStop(1, '#fde68a');

    ctx.fillStyle = modakGrad;
    ctx.beginPath();
    ctx.moveTo(0, -14); // Crest
    ctx.bezierCurveTo(12, -4, 13, 8, 0, 12); // Right belly to bottom
    ctx.bezierCurveTo(-13, 8, -12, -4, 0, -14); // Left belly to crest
    ctx.fill();

    // Traditional pleated folds on the modak
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1.2;
    for (let angle = -0.6; angle <= 0.6; angle += 0.3) {
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.quadraticCurveTo(Math.sin(angle) * 11, 0, Math.sin(angle) * 8, 11);
      ctx.stroke();
    }

    // Auspicious Saffron Tip (Kesar)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -14, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Sparkling dew drops
    const sparkle = (Math.sin(time * 8) + 1) * 0.5;
    ctx.fillStyle = `rgba(255, 255, 255, ${sparkle})`;
    ctx.beginPath();
    ctx.arc(-4, -4, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Traditional Marigold / Rangoli Color Flower
  private drawMarigoldFlower(time: number, color?: RangoliColor) {
    const ctx = this.ctx;
    ctx.rotate(time * 1.5);

    let baseColor = '#f97316'; // orange default
    let centerColor = '#eab308'; // yellow default

    if (color === 'red') {
      baseColor = '#ef4444';
      centerColor = '#f87171';
    } else if (color === 'yellow') {
      baseColor = '#eab308';
      centerColor = '#fde047';
    } else if (color === 'green') {
      baseColor = '#10b981';
      centerColor = '#6ee7b7';
    } else if (color === 'blue') {
      baseColor = '#3b82f6';
      centerColor = '#93c5fd';
    }

    // Outer Petals
    ctx.fillStyle = baseColor;
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 11, Math.sin(a) * 11, 6, 3.5, a, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner Petals
    ctx.fillStyle = centerColor;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + 0.3;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 4, 2.5, a, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flower Center
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sacred Durva Grass Bundle (21 sacred shoots)
  private drawDurvaGrass(time: number) {
    const ctx = this.ctx;
    const sway = Math.sin(time * 6) * 2;

    // Golden aura
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
    halo.addColorStop(0, 'rgba(187, 247, 208, 0.8)');
    halo.addColorStop(1, 'rgba(187, 247, 208, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    // 3 Sacred Blades of Bermuda Grass radiating upwards
    ctx.fillStyle = '#16a34a';
    // Center blade
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.quadraticCurveTo(sway, -6, sway * 1.5, -16);
    ctx.quadraticCurveTo(sway + 3, -6, 2, 8);
    ctx.fill();

    // Left blade
    ctx.beginPath();
    ctx.moveTo(-1, 8);
    ctx.quadraticCurveTo(-8, -4, -13 + sway, -12);
    ctx.quadraticCurveTo(-6, -2, 0, 8);
    ctx.fill();

    // Right blade
    ctx.beginPath();
    ctx.moveTo(1, 8);
    ctx.quadraticCurveTo(8, -4, 13 + sway, -12);
    ctx.quadraticCurveTo(6, -2, 0, 8);
    ctx.fill();

    // Sacred Red Ribbon tying the bundle
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-4, 4, 8, 4);
  }

  // Illuminated Brass Diya (Lamp)
  private drawFestiveDiya(time: number) {
    const ctx = this.ctx;

    // Glowing radiance
    const glow = ctx.createRadialGradient(0, -6, 2, 0, -6, 28);
    glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    glow.addColorStop(0.45, 'rgba(245, 158, 11, 0.4)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, -6, 28, 0, Math.PI * 2);
    ctx.fill();

    // Clay / Brass lamp body
    const lampGrad = ctx.createLinearGradient(-12, 0, 12, 10);
    lampGrad.addColorStop(0, '#f59e0b');
    lampGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = lampGrad;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.quadraticCurveTo(-14, 10, 0, 10);
    ctx.quadraticCurveTo(14, 10, 12, 0);
    ctx.lineTo(15, -2); // Beak
    ctx.lineTo(-12, 0);
    ctx.fill();

    // Flickering oil flame
    const flicker = Math.sin(time * 15) * 2;
    ctx.fillStyle = '#ef4444'; // Flame base red
    ctx.beginPath();
    ctx.arc(6, -3, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047'; // Flame body yellow
    ctx.beginPath();
    ctx.moveTo(3, -3);
    ctx.quadraticCurveTo(7 + flicker, -16, 6, -18);
    ctx.quadraticCurveTo(9, -8, 9, -3);
    ctx.fill();
  }

  // Eco-Friendly Sacred Clay Pot (Shadu Mati)
  private drawEcoClayPot(time: number) {
    const ctx = this.ctx;
    // Clean green nature halo
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, 22);
    halo.addColorStop(0, 'rgba(134, 239, 172, 0.8)');
    halo.addColorStop(1, 'rgba(134, 239, 172, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    // Earthen pot
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(0, 4, 11, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pot rim
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.ellipse(0, -4, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprouting green eco leaf from the clay
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(3, -9, 4, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fresh green banana / mango leaf
  private drawEcoLeaf(time: number) {
    const ctx = this.ctx;
    ctx.rotate(Math.sin(time * 3) * 0.15);

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 14, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Leaf vein
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(0, -14);
    ctx.stroke();
  }

  // Pure lotus/hibiscus eco flower
  private drawEcoFlower(time: number) {
    const ctx = this.ctx;
    // Sacred pink lotus
    ctx.fillStyle = '#ec4899';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 7, Math.sin(a) * 7, 5, 8, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Trash: Plastic bag (to be avoided in Stage 4)
  private drawTrashPlastic(time: number) {
    const ctx = this.ctx;
    ctx.rotate(Math.sin(time * 5) * 0.1);

    // Crinkled grey-blue plastic bag
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-10, -6);
    ctx.lineTo(-6, -12);
    ctx.lineTo(6, -12);
    ctx.lineTo(10, -6);
    ctx.lineTo(12, 10);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();

    // Handles
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-4, -16, 8, 6);

    // Red warning slash
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Trash: Plastic cup / litter
  private drawTrashCup(time: number) {
    const ctx = this.ctx;
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(7, -8);
    ctx.lineTo(5, 8);
    ctx.lineTo(-5, 8);
    ctx.closePath();
    ctx.fill();

    // Warning ring
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Power-Up Celestial Glowing Orb
  private drawPowerUpOrb(type: string | undefined, time: number) {
    const ctx = this.ctx;
    // Radiant pulsing shield orb
    const pulse = 1 + Math.sin(time * 8) * 0.1;
    ctx.scale(pulse, pulse);

    let orbColor = '#f59e0b';
    if (type === 'blessing') orbColor = '#eab308'; // Divine golden
    if (type === 'magnet') orbColor = '#ec4899'; // Modak magnet pink
    if (type === 'boost') orbColor = '#3b82f6'; // Speed boost blue
    if (type === 'trail') orbColor = '#10b981'; // Flower trail green

    // Outer glow
    const orbGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
    orbGlow.addColorStop(0, '#ffffff');
    orbGlow.addColorStop(0.6, orbColor);
    orbGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 24, 0, Math.PI * 2);
    ctx.fill();

    // Inner icon symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let iconText = '★';
    if (type === 'blessing') iconText = 'ॐ'; // Divine blessing Om
    if (type === 'magnet') iconText = '🧲';
    if (type === 'boost') iconText = '⚡';
    if (type === 'trail') iconText = '🌸';

    ctx.fillText(iconText, 0, 1);
  }

  // --- DRAW OBSTACLES (Harmless, respectful festival equipment) ---
  public drawObstacle(obs: Obstacle, time: number) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(obs.x + obs.width / 2, obs.y + obs.height);

    switch (obs.type) {
      case 'flower_basket':
        this.drawFlowerBasket(obs.width, obs.height);
        break;
      case 'festive_box':
        this.drawFestiveBox(obs.width, obs.height);
        break;
      case 'pandal_cart':
        this.drawPandalCart(obs.width, obs.height, time);
        break;
      case 'brass_lamp':
        this.drawBrassLamp(obs.width, obs.height, time);
        break;
      case 'safe_barrier':
        this.drawSafeBarrier(obs.width, obs.height);
        break;
      case 'rangoli_pot':
        this.drawRangoliPot(obs.width, obs.height);
        break;
      case 'hanging_garland':
        this.drawHangingGarland(obs.width, obs.height, time);
        break;
      case 'dhol_drum':
        this.drawDholDrum(obs.width, obs.height, time);
        break;
      case 'coconut_hurdle':
        this.drawCoconutHurdle(obs.width, obs.height);
        break;
      case 'dhoop_burner':
        this.drawDhoopBurner(obs.width, obs.height, time);
        break;
    }

    ctx.restore();
  }

  // Flower Basket (woven cane basket overflowing with marigolds)
  private drawFlowerBasket(w: number, h: number) {
    const ctx = this.ctx;
    // Basket body
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h * 0.7);
    ctx.lineTo(w / 2, -h * 0.7);
    ctx.lineTo(w / 2 - 4, 0);
    ctx.lineTo(-w / 2 + 4, 0);
    ctx.closePath();
    ctx.fill();

    // Woven crosshatch texture
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    for (let x = -w / 2 + 4; x <= w / 2 - 4; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, -h * 0.7);
      ctx.lineTo(x + 4, 0);
      ctx.stroke();
    }

    // Overflowing vibrant marigolds
    const colors = ['#f97316', '#eab308', '#ea580c'];
    for (let i = -w / 2 + 4; i <= w / 2 - 4; i += 7) {
      ctx.fillStyle = colors[Math.abs(Math.floor(i)) % colors.length];
      ctx.beginPath();
      ctx.arc(i, -h * 0.7 - 3, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Decorated festival gift box
  private drawFestiveBox(w: number, h: number) {
    const ctx = this.ctx;
    // Box body (Crimson festival red)
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-w / 2, -h, w, h);

    // Box lid
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-w / 2 - 2, -h - 4, w + 4, 7);

    // Golden silk ribbon wrap
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-4, -h - 4, 8, h + 4);
    ctx.fillRect(-w / 2, -h / 2 - 2, w, 6);

    // Ribbon bow
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-6, -h - 7, 5, 3, -0.3, 0, Math.PI * 2);
    ctx.ellipse(6, -h - 7, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moving Pandal Pushcart with flowers
  private drawPandalCart(w: number, h: number, time: number) {
    const ctx = this.ctx;
    // Wooden cart bed
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-w / 2, -h * 0.75, w, h * 0.45);

    // Wheels rotating
    const wheelY = -h * 0.25;
    const wheelRot = time * 8;

    [-w / 3, w / 3].forEach((wx) => {
      ctx.save();
      ctx.translate(wx, wheelY);
      ctx.rotate(wheelRot);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Spokes
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * -9, Math.sin(a) * -9);
        ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
        ctx.stroke();
      }
      ctx.restore();
    });

    // Decorative festival dhol drum resting on the cart
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.75 - 6, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.75 - 6, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tall Traditional Brass Samai (Standing oil lamp)
  private drawBrassLamp(w: number, h: number, time: number) {
    const ctx = this.ctx;
    // Brass stem
    const brassGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    brassGrad.addColorStop(0, '#d97706');
    brassGrad.addColorStop(0.5, '#fde047');
    brassGrad.addColorStop(1, '#b45309');

    // Base pedestal
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Central pillar
    ctx.fillRect(-3, -h + 12, 6, h - 12);

    // Oil dish at top
    ctx.beginPath();
    ctx.ellipse(0, -h + 12, w / 2 - 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Peacock / Kalash finial
    ctx.beginPath();
    ctx.arc(0, -h + 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Warm glowing flame
    this.drawMiniDiya(0, -h + 9, time);
  }

  // Safe Pandal Crowd Barrier / Ribbon
  private drawSafeBarrier(w: number, h: number) {
    const ctx = this.ctx;
    // Brass stanchions
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-w / 2 + 2, -h, 5, h);
    ctx.fillRect(w / 2 - 7, -h, 5, h);

    // Stanchion ball tops
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-w / 2 + 4.5, -h, 5, 0, Math.PI * 2);
    ctx.arc(w / 2 - 4.5, -h, 5, 0, Math.PI * 2);
    ctx.fill();

    // Red velvet festival rope swagged between posts
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 4.5, -h + 10);
    ctx.quadraticCurveTo(0, -h + 22, w / 2 - 4.5, -h + 10);
    ctx.stroke();
  }

  // Traditional Terracotta Kalash / Rangoli Color Pot
  private drawRangoliPot(w: number, h: number) {
    const ctx = this.ctx;
    // Terracotta kalash
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.45, w / 2, h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mango leaves crown
    ctx.fillStyle = '#15803d';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 5, -h * 0.8, 3, 8, i * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Coconut on top
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, -h * 0.9, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Overhead Toran / Marigold Garland Barrier (Requires SLIDE under)
  private drawHangingGarland(w: number, h: number, time: number) {
    const ctx = this.ctx;
    const sway = Math.sin(time * 4) * 2.5;

    // Top wooden festival arch beam / lintel
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-w / 2, -h, w, 7);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-w / 2, -h + 6, w, 2);

    // Decorative toran swags hanging down
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 4, -h + 7);
    ctx.quadraticCurveTo(0, -h + 20 + sway * 0.5, w / 2 - 4, -h + 7);
    ctx.stroke();

    // Dense marigold flowers (orange & yellow)
    const flowerCount = 5;
    for (let i = 0; i < flowerCount; i++) {
      const fx = -w / 2 + 8 + i * ((w - 16) / (flowerCount - 1));
      const t = i / (flowerCount - 1);
      const fy = -h + 7 + Math.sin(t * Math.PI) * 14 + sway * 0.5;

      ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#eab308';
      ctx.beginPath();
      ctx.arc(fx, fy, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Flower center
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.arc(fx, fy, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Auspicious mango leaves hanging between flowers
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < flowerCount - 1; i++) {
      const lx = -w / 2 + 14 + i * ((w - 16) / (flowerCount - 1));
      ctx.beginPath();
      ctx.ellipse(lx, -h + 22 + sway, 3.5, 9, sway * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // Two hanging brass temple bells at the ends swinging gently
    [-w / 2 + 8, w / 2 - 8].forEach((bx, idx) => {
      const bellSway = Math.sin(time * 5 + idx * Math.PI) * 3;
      // String
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, -h + 7);
      ctx.lineTo(bx + bellSway, -6);
      ctx.stroke();

      // Bell body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(bx + bellSway, -6, 5.5, Math.PI, 0);
      ctx.lineTo(bx + bellSway + 7, 0);
      ctx.lineTo(bx + bellSway - 7, 0);
      ctx.closePath();
      ctx.fill();

      // Bell rim & clapper
      ctx.fillStyle = '#d97706';
      ctx.fillRect(bx + bellSway - 7.5, 0, 15, 2.5);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(bx + bellSway, 3, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Subtle slide indicator chevron glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(-6, -2);
    ctx.lineTo(6, -2);
    ctx.closePath();
    ctx.fill();
  }

  // Festival Dhol Drum (Ground obstacle to jump over)
  private drawDholDrum(w: number, h: number, time: number) {
    const ctx = this.ctx;
    // Wooden drum barrel
    const drumGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    drumGrad.addColorStop(0, '#78350f');
    drumGrad.addColorStop(0.3, '#9a3412');
    drumGrad.addColorStop(0.7, '#78350f');
    drumGrad.addColorStop(1, '#451a03');

    ctx.fillStyle = drumGrad;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h * 0.85, w, h * 0.8, 6);
    ctx.fill();

    // Crimson festive silk cloth sash draped across middle
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-w / 2 + 10, -h * 0.85, w - 20, h * 0.8);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-w / 2 + 10, -h * 0.5, w - 20, 3);

    // Zig-zag tension ropes
    ctx.strokeStyle = '#fef3c7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const segments = 6;
    for (let i = 0; i <= segments; i++) {
      const rx = -w / 2 + (w / segments) * i;
      const ry = i % 2 === 0 ? -h * 0.85 : -h * 0.05;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.stroke();

    // Drum heads / leather rings on the sides
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-w / 2 - 2, -h * 0.85, 4, h * 0.8);
    ctx.fillRect(w / 2 - 2, -h * 0.85, 4, h * 0.8);

    // Crossed wooden dhol sticks resting in front
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-14, -h * 0.6);
    ctx.lineTo(14, 0);
    ctx.moveTo(14, -h * 0.6);
    ctx.lineTo(-14, 0);
    ctx.stroke();
  }

  // Auspicious Consecrated Coconut Platter (Jump over)
  private drawCoconutHurdle(w: number, h: number) {
    const ctx = this.ctx;
    // Brass Pooja Thali Base
    const thaliGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    thaliGrad.addColorStop(0, '#d97706');
    thaliGrad.addColorStop(0.5, '#fde047');
    thaliGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = thaliGrad;
    ctx.beginPath();
    ctx.ellipse(0, -2, w / 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fresh Green Betel / Banana Leaves spreading outward
    ctx.fillStyle = '#16a34a';
    [-w / 3, 0, w / 3].forEach((lx) => {
      ctx.beginPath();
      ctx.ellipse(lx, -4, 9, 4, 0.1, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3 Sacred Coconuts piled (2 base, 1 top)
    const coconuts = [
      { x: -9, y: -h * 0.38, r: 10 },
      { x: 9, y: -h * 0.38, r: 10 },
      { x: 0, y: -h * 0.72, r: 11 },
    ];

    coconuts.forEach((c) => {
      // Brown coconut shell with fibrous texture
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Husk fiber streaks
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      for (let j = -2; j <= 2; j++) {
        ctx.beginPath();
        ctx.moveTo(c.x + j * 2, c.y - c.r + 2);
        ctx.lineTo(c.x + j * 2.5, c.y + c.r - 2);
        ctx.stroke();
      }

      // Sacred red Kumkum (Sindoor) tilak mark
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Yellow Chandan dot
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(c.x, c.y - 3.5, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Sacred Brass Dhoop Burner / Dhunachi (Jump over)
  private drawDhoopBurner(w: number, h: number, time: number) {
    const ctx = this.ctx;
    // Brass pedestal base
    const brassGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    brassGrad.addColorStop(0, '#d97706');
    brassGrad.addColorStop(0.5, '#fde047');
    brassGrad.addColorStop(1, '#b45309');

    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2 - 4, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Central stemmed neck
    ctx.fillRect(-4, -h * 0.45, 8, h * 0.45);

    // Large burner chalice bowl
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 2, -h * 0.85);
    ctx.lineTo(w / 2 - 2, -h * 0.85);
    ctx.quadraticCurveTo(w / 2 - 5, -h * 0.45, 0, -h * 0.45);
    ctx.quadraticCurveTo(-w / 2 + 5, -h * 0.45, -w / 2 + 2, -h * 0.85);
    ctx.closePath();
    ctx.fill();

    // Carved long wooden/brass handle pointing to one side
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-w / 2 - 10, -h * 0.55, 12, 4);

    // Glowing charcoal / camphor embers inside bowl
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.84, w / 2 - 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, -h * 0.84, w / 2 - 12, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sacred aromatic white/silver smoke curling upwards
    const smokeDrift = Math.sin(time * 5) * 4;
    ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
    ctx.beginPath();
    ctx.arc(smokeDrift, -h * 0.95, 5, 0, Math.PI * 2);
    ctx.arc(smokeDrift * 1.5 - 3, -h * 1.12, 7, 0, Math.PI * 2);
    ctx.arc(-smokeDrift * 1.2 + 2, -h * 1.3, 8.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- DRAW LORD GANESHA SHRINE & CELEBRATORY SPARKLERS (Reached at 30m) ---
  public drawLordGaneshaShrine(
    distance: number,
    groundY: number,
    time: number,
    isAtAltar = false,
    playerX?: number
  ) {
    const approachStart = 18;
    const arrivalDist = 30;
    if (distance < approachStart) return;
    const ctx = this.ctx;
    const w = this.width;

    // Smooth entrance from the right as player approaches 30m
    const targetX = Math.max(w * 0.72, w - 220);
    const enterProgress = Math.min(1, (distance - approachStart) / (arrivalDist - approachStart));
    const shrineX = w + 360 - enterProgress * (w + 360 - targetX);
    const shrineY = groundY;

    // High-Fidelity Standing Bal Ganesha Endpoint (Matching user reference photo 2)
    drawLordGaneshaEndpoint(
      this.ctx,
      shrineX,
      shrineY,
      time,
      isAtAltar,
      playerX,
      distance >= arrivalDist - 1
    );
    return;

    // 1. Festive Fireworks / Sparklers in Background (inspired by user image 2!)
    this.drawFestiveSparklers(shrineX, shrineY - 140, time, enterProgress);

    // 2. Ornate Shrine Pedestal & Lotus Altar
    ctx.save();
    ctx.translate(shrineX, shrineY);

    // Marble & Gold Step Platform
    const platformGrad = ctx.createLinearGradient(0, 0, 0, -22);
    platformGrad.addColorStop(0, '#78350f');
    platformGrad.addColorStop(0.5, '#d97706');
    platformGrad.addColorStop(1, '#fde047');
    ctx.fillStyle = platformGrad;
    ctx.beginPath();
    ctx.roundRect(-90, -16, 180, 18, 6);
    ctx.fill();

    // Red Velvet Carpet runner
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-70, -16, 140, 4);

    // Pink Sacred Lotus Pedestal (Padmasana)
    ctx.fillStyle = '#f43f5e';
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.ellipse(i * 16, -18, 12, 7, i * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Sacred Rotating Sunburst Halo (Prabhavali)
    ctx.save();
    ctx.translate(0, -90);
    const haloGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, 72);
    haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    haloGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.6)');
    haloGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 72, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Golden Light Rays
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16 + time * 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 32, Math.sin(angle) * 32);
      ctx.lineTo(Math.cos(angle) * 62, Math.sin(angle) * 62);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Lord Bal Ganesha Figure (adorned with Mukut, Garland, and Modak)
    this.drawBalGaneshaFigure(ctx, time);

    // 4. Brass Samai Lamps on both sides with flickering flame
    this.drawSamaiDiya(ctx, -72, -4, time);
    this.drawSamaiDiya(ctx, 72, -4, time + 1.2);

    // 5. Silver Thali of fresh Modaks presented at Ganesha's feet
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(0, -14, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Modak pyramid in the Thali
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(i * 7, -20, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Top modak
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -26, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Celebration Banner when 200m is reached
    if (distance >= 198) {
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 8;
      ctx.fillText('🙏 SHRI GANESHAYA NAMAH 🙏', 0, -160);
      ctx.shadowBlur = 0;
    }

    // 6. Divine Golden Blessing Ray flowing from Lord Ganesha down to Mushak!
    if (isAtAltar && playerX !== undefined) {
      const relMushakX = playerX - shrineX;
      ctx.save();
      const blessingGrad = ctx.createLinearGradient(20, -55, relMushakX, -20);
      blessingGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      blessingGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.55)');
      blessingGrad.addColorStop(1, 'rgba(245, 158, 11, 0.1)');
      ctx.fillStyle = blessingGrad;
      ctx.beginPath();
      ctx.moveTo(20, -55);
      ctx.lineTo(relMushakX - 22, -10);
      ctx.lineTo(relMushakX + 22, -10);
      ctx.closePath();
      ctx.fill();

      // Flowing golden light particles along the blessing beam
      for (let s = 0; s < 7; s++) {
        const t = (time * 1.8 + s * 0.28) % 1;
        const px = 20 + (relMushakX - 20) * t + Math.sin(time * 6 + s) * 5;
        const py = -55 + (-20 - (-55)) * t;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(px, py, 2.5 + Math.sin(time * 10 + s) * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Background Festive Sparklers & Bokeh Lights (User Image 2) ---
  private drawFestiveSparklers(centerX: number, centerY: number, time: number, intensity: number) {
    const ctx = this.ctx;
    ctx.save();

    // Bokeh light spheres
    const bokehColors = [
      'rgba(251, 191, 36, 0.4)',
      'rgba(249, 115, 22, 0.35)',
      'rgba(239, 68, 68, 0.3)',
      'rgba(254, 240, 138, 0.5)',
    ];

    for (let i = 0; i < 18; i++) {
      const angle = i * 0.35 + time * 0.2;
      const dist = 50 + ((i * 37) % 130);
      const bx = centerX + Math.cos(angle) * dist;
      const by = centerY + Math.sin(angle) * (dist * 0.65);
      const radius = 6 + ((i * 13) % 18);

      ctx.fillStyle = bokehColors[i % bokehColors.length];
      ctx.beginPath();
      ctx.arc(bx, by, radius * intensity, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sparkler burst needles
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 1.2;
    for (let s = 0; s < 28; s++) {
      const sparkAngle = s * 0.22 + Math.sin(time * 6 + s) * 0.1;
      const sparkDist = 40 + ((s * 29 + Math.sin(time * 8 + s) * 20) % 95);
      const sx = centerX + Math.cos(sparkAngle) * sparkDist;
      const sy = centerY + Math.sin(sparkAngle) * (sparkDist * 0.6);

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(sparkAngle) * 8, sy + Math.sin(sparkAngle) * 8);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Draw Lord Bal Ganesha Figure (Based on user image 2) ---
  private drawBalGaneshaFigure(ctx: CanvasRenderingContext2D, _time: number) {
    // Soft, benevolent Bal Ganesha seated gracefully
    ctx.save();
    ctx.translate(0, -20);

    // 1. White Silk Dhoti with Golden Zari Border (matching user photo)
    const dhotiGrad = ctx.createLinearGradient(0, -35, 0, 0);
    dhotiGrad.addColorStop(0, '#ffffff');
    dhotiGrad.addColorStop(0.7, '#f8fafc');
    dhotiGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = dhotiGrad;

    // Cross-legged dhoti folds
    ctx.beginPath();
    ctx.ellipse(0, -10, 36, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Zari hem
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Plump Golden-Terracotta Torso
    const torsoGrad = ctx.createRadialGradient(0, -34, 4, 0, -32, 24);
    torsoGrad.addColorStop(0, '#fef08a');
    torsoGrad.addColorStop(0.4, '#fde047');
    torsoGrad.addColorStop(0.85, '#f59e0b');
    torsoGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = torsoGrad;

    // Cute rounded belly (Lambodara)
    ctx.beginPath();
    ctx.ellipse(0, -32, 22, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Thread (Janeu) across the chest
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, -42);
    ctx.bezierCurveTo(-6, -32, 4, -26, 16, -20);
    ctx.stroke();

    // 3. Four Divine Arms
    // Upper Right Arm (Holding sacred axe/ankusha)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(24, -46, 7, 16, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Upper Left Arm (Holding divine lotus)
    ctx.beginPath();
    ctx.ellipse(-24, -46, 7, 16, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // Pink lotus flower in hand
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(-28, -58, 6, 0, Math.PI * 2);
    ctx.fill();

    // Lower Right Arm in Abhaya Mudra (blessing palm)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(22, -30, 8, 11, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Golden palm center with holy lotus imprint
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(22, -30, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower Left Arm holding delicious golden Modak (as in image 2!)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(-20, -28, 8, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Yellow Modak / Laddu in left hand
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-24, -34, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Bal Ganesha Elephant Head
    const headGrad = ctx.createRadialGradient(0, -66, 4, 0, -64, 22);
    headGrad.addColorStop(0, '#fef08a');
    headGrad.addColorStop(0.5, '#fde047');
    headGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = headGrad;

    // Rounded head
    ctx.beginPath();
    ctx.ellipse(0, -64, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Broad Cute Elephant Ears (Supakarna)
    // Left ear
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-26, -66, 12, 16, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8'; // inner ear pink
    ctx.beginPath();
    ctx.ellipse(-25, -66, 7, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Right ear
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(26, -66, 12, 16, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbcfe8'; // inner ear pink
    ctx.beginPath();
    ctx.ellipse(25, -66, 7, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Gently Curved Elephant Trunk (Vakratunda)
    const trunkGrad = ctx.createLinearGradient(0, -60, 0, -36);
    trunkGrad.addColorStop(0, '#fde047');
    trunkGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = trunkGrad;

    ctx.beginPath();
    ctx.moveTo(-6, -60);
    ctx.bezierCurveTo(-8, -48, -12, -40, -18, -36); // curving towards left hand holding modak
    ctx.bezierCurveTo(-22, -34, -20, -30, -16, -32);
    ctx.bezierCurveTo(-8, -34, 2, -44, 4, -60);
    ctx.closePath();
    ctx.fill();

    // 6. Gentle Benevolent Eyes
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(-8, -68, 3, 2, 0.1, 0, Math.PI * 2);
    ctx.ellipse(8, -68, 3, 2, -0.1, 0, Math.PI * 2);
    ctx.fill();
    // Eye shines
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-7, -69, 1, 0, Math.PI * 2);
    ctx.arc(9, -69, 1, 0, Math.PI * 2);
    ctx.fill();

    // 7. Sacred Red Tilak & Tripundra on Forehead
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.ellipse(0, -74, 2.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Yellow Chandan crescent
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -71, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 8. Fragrant Garland (White Jasmine & Red Roses - User Image 2 match!)
    for (let g = -6; g <= 6; g++) {
      const gAngle = (g / 6) * Math.PI * 0.75 + Math.PI / 2;
      const gx = Math.cos(gAngle) * 23;
      const gy = -48 + Math.sin(gAngle) * 16;
      const isRose = Math.abs(g) % 2 === 0;

      ctx.fillStyle = isRose ? '#dc2626' : '#ffffff';
      ctx.beginPath();
      ctx.arc(gx, gy, isRose ? 4 : 3.2, 0, Math.PI * 2);
      ctx.fill();
      if (isRose) {
        ctx.fillStyle = '#fb7185';
        ctx.beginPath();
        ctx.arc(gx - 1, gy - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 9. Ornate Golden Mukut (Crown with jewels - User Image 2 match!)
    const crownGrad = ctx.createLinearGradient(0, -108, 0, -76);
    crownGrad.addColorStop(0, '#fef08a');
    crownGrad.addColorStop(0.5, '#fde047');
    crownGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = crownGrad;

    ctx.beginPath();
    ctx.moveTo(-18, -76);
    ctx.lineTo(-14, -92);
    ctx.lineTo(-6, -88);
    ctx.lineTo(0, -106); // top central spire
    ctx.lineTo(6, -88);
    ctx.lineTo(14, -92);
    ctx.lineTo(18, -76);
    ctx.closePath();
    ctx.fill();

    // Crown Golden Borders & Ruby Jewel
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Center Ruby on Mukut
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -88, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Emeralds on sides
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(-8, -82, 2.2, 0, Math.PI * 2);
    ctx.arc(8, -82, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- Brass Samai Diya with animated flickering flame ---
  private drawSamaiDiya(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    ctx.translate(x, y);

    // Brass base
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Slender brass pillar
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2.5, -34, 5, 34);

    // Diya oil bowl
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, -34, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flickering Holy Flame
    const flicker = Math.sin(time * 14) * 2;
    const flameGrad = ctx.createRadialGradient(0, -42, 1, 0, -42, 8);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.3, '#fef08a');
    flameGrad.addColorStop(0.7, '#f97316');
    flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.moveTo(-4, -36);
    ctx.quadraticCurveTo(-5, -44 + flicker, 0, -50 + flicker);
    ctx.quadraticCurveTo(5, -44 + flicker, 4, -36);
    ctx.closePath();
    ctx.fill();

    // Diya warm glow aura
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.beginPath();
    ctx.arc(0, -42, 16 + flicker, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- DRAW PARTICLES (Petals, Sparks, Confetti) ---
  public drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);

      if (p.rotation) {
        ctx.rotate(p.rotation);
      }

      ctx.fillStyle = p.color;

      if (p.shape === 'petal') {
        // Delicate marigold/lotus petal
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'leaf') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.7, 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'spark') {
        // 4-point star sparkle
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.3, -p.size * 0.3);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(p.size * 0.3, p.size * 0.3);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.3, p.size * 0.3);
        ctx.lineTo(-p.size, 0);
        ctx.lineTo(-p.size * 0.3, -p.size * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (p.shape === 'confetti') {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      } else {
        // Circle / glow dot
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // --- DRAW FLOATING TEXT (+10, COMBO x3, etc) ---
  public drawFloatingTexts(texts: FloatingText[]) {
    const ctx = this.ctx;
    for (const t of texts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillStyle = t.color;
      ctx.font = `800 ${t.size}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Subtle shadow for legibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;

      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    }
  }
}
