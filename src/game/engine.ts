import {
  Player,
  Collectible,
  Obstacle,
  Particle,
  FloatingText,
  StageConfig,
  RangoliColor,
  CollectibleType,
  ObstacleType,
  PowerUpType,
} from '../types';
import { STAGES, COLLECTIBLE_VALUES, GOAL_DISTANCE_METRES } from './constants';
import { soundManager } from '../audio/soundManager';
import {
  saveHighScore,
  saveBestEcoScore,
  saveMaxComboRecord,
  saveUnlockedStage,
} from '../storage/storage';

export interface GameCallbacks {
  onScoreUpdate: (score: number, ecoScore: number, combo: number) => void;
  onLivesUpdate: (lives: number) => void;
  onStageProgress: (progress: number, distance: number, targetDistance?: number) => void;
  onPowerUpUpdate: (activePowerUps: { type: PowerUpType; timeLeft: number }[]) => void;
  onColorSequenceUpdate: (target: RangoliColor[], currentIdx: number) => void;
  onStageComplete: (stage: StageConfig, score: number, ecoScore: number, maxCombo: number) => void;
  onGameOver: (
    score: number,
    ecoScore: number,
    maxCombo: number,
    obstacleName?: string,
    offeringsCount?: number
  ) => void;
  onObstacleWarning?: (warning: 'jump' | 'slide' | null) => void;
  onApproachingGanesha?: (metresRemaining: number) => void;
}

export class GameEngine {
  private canvasWidth: number;
  private canvasHeight: number;
  public groundY: number;

  public player: Player;
  public collectibles: Collectible[] = [];
  public obstacles: Obstacle[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];

  public currentStageIndex = 0;
  public score = 0;
  public ecoScore = 0;
  public combo = 0;
  public maxCombo = 0;
  public offeringsCount = 0;
  public lastHitObstacleName = 'Festival Obstacle';
  public lives = 3; // 3 Devotion Hearts for accessible, forgiving gameplay
  public distance = 0; // Distance in real Metres (0m to 200m)
  public cameraX = 0;
  public isRunning = false;
  public isPaused = false;
  public screenShake = 0;

  // 200m Pilgrimage to Lord Ganesha
  public isApproachingGanesha = false;
  public hasReachedGanesha = false;
  public isAtAltar = false;
  public ganeshaArrivalTimer = 0;
  public ganeshaDarshanTimer = 0;
  public darshanText2Shown = false;
  public darshanText3Shown = false;
  public approachingWarning: 'jump' | 'slide' | null = null;
  public coyoteTimer = 0;
  public jumpBufferTimer = 0;
  public easyMode = true;

  // Stage 2 Color Sequence state
  public colorSequence: RangoliColor[] = ['red', 'yellow', 'green', 'blue'];
  public sequenceIndex = 0;

  private nextId = 1;
  private spawnTimer = 0;
  private callbacks: GameCallbacks;

  // Input states
  private keysPressed: Record<string, boolean> = {};

  constructor(
    width: number,
    height: number,
    initialScore = 0,
    initialEcoScore = 0,
    initialMaxCombo = 0,
    callbacks: GameCallbacks
  ) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.groundY = height * 0.8;
    this.score = initialScore;
    this.ecoScore = initialEcoScore;
    this.maxCombo = initialMaxCombo;
    this.callbacks = callbacks;

    this.player = this.createDefaultPlayer();
    this.setupInputs();
  }

  private createDefaultPlayer(): Player {
    return {
      x: 100,
      y: this.groundY - 50,
      width: 48,
      height: 50,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      animFrame: 0,
      animState: 'running',
      invincibleTimer: 0,
      divineBlessingTimer: 0,
      magnetTimer: 0,
      boostTimer: 0,
      trailTimer: 0,
      trailSpawnTimer: 0,
    };
  }

  public resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.groundY = height * 0.8;
    if (this.player.isGrounded) {
      this.player.y = this.groundY - this.player.height;
    }
  }

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.code] = true;

      // Handle direct key triggers for immediate responsiveness
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        this.triggerJump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        this.triggerSlide();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.code] = false;
    });
  }

  public getGaneshaShrineX(): number {
    return Math.max(this.canvasWidth * 0.72, this.canvasWidth - 220);
  }

  public triggerJump() {
    const stage = STAGES[this.currentStageIndex];
    const targetDistance = stage?.targetDistance || GOAL_DISTANCE_METRES;
    if (!this.isRunning || this.isPaused || this.hasReachedGanesha || this.distance >= targetDistance) return;
    this.jumpBufferTimer = 0.18; // buffer for 180ms
    if (this.player.isGrounded || this.coyoteTimer > 0) {
      this.executeJump();
    }
  }

  private executeJump() {
    this.jumpBufferTimer = 0;
    this.coyoteTimer = 0;
    this.player.vy = -13.5; // forgiving, floaty, satisfying jump
    this.player.isGrounded = false;
    this.player.isSliding = false;
    this.player.animState = 'jumping';
    soundManager.playJump();
    this.spawnDustParticles(this.player.x + 20, this.groundY, 6, '#fde047');
  }

  public triggerSlide() {
    const stage = STAGES[this.currentStageIndex];
    const targetDistance = stage?.targetDistance || GOAL_DISTANCE_METRES;
    if (!this.isRunning || this.isPaused || this.hasReachedGanesha || this.distance >= targetDistance) return;
    if (this.player.isGrounded && !this.player.isSliding) {
      this.player.isSliding = true;
      this.player.slideTimer = 0.65; // 650ms slide
      this.player.animState = 'sliding';
      soundManager.playSlide();
      this.spawnDustParticles(this.player.x + 10, this.groundY, 8, '#f59e0b');
    }
  }

  public startStage(stageIndex: number) {
    this.currentStageIndex = stageIndex;
    this.distance = 0;
    this.cameraX = 0;
    this.collectibles = [];
    this.obstacles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.player = this.createDefaultPlayer();
    this.sequenceIndex = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.spawnTimer = 0;
    this.isApproachingGanesha = false;
    this.hasReachedGanesha = false;
    this.isAtAltar = false;
    this.ganeshaArrivalTimer = 0;
    this.ganeshaDarshanTimer = 0;
    this.darshanText2Shown = false;
    this.darshanText3Shown = false;
    this.approachingWarning = null;
    this.lives = 3;

    const stage = STAGES[this.currentStageIndex];
    if (stage.hasColorSequence) {
      this.callbacks.onColorSequenceUpdate(this.colorSequence, this.sequenceIndex);
    }
    this.callbacks.onLivesUpdate(this.lives);

    soundManager.startMusic();
  }

  public resetFullGame() {
    this.score = 0;
    this.ecoScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lives = 3;
    this.startStage(0);
  }

  public update(dt: number) {
    if (!this.isRunning || this.isPaused) return;

    const stage = STAGES[this.currentStageIndex];
    const targetDistance = stage?.targetDistance || GOAL_DISTANCE_METRES;
    const speedMult = this.player.boostTimer > 0 ? 1.25 : 1.0;
    const currentSpeed = stage.speed * speedMult;

    // --- FINALE: WHEN TARGET DISTANCE (30M) IS REACHED OR MUSHAK IS APPROACHING LORD GANESHA'S ALTAR ---
    if (this.distance >= targetDistance || this.hasReachedGanesha) {
      this.hasReachedGanesha = true;
      this.distance = targetDistance;
      this.obstacles = []; // clear remaining obstacles for peaceful shrine entrance

      const shrineX = this.getGaneshaShrineX();
      const targetAltarX = shrineX - 68;

      // Phase 1: Mushak runs all the way across the floor to reach Lord Ganesha's feet!
      if (this.player.x < targetAltarX) {
        this.player.animState = 'celebrating';
        this.player.x = Math.min(targetAltarX, this.player.x + 190 * dt);
        this.player.animFrame += dt * 10;

        // Bring Mushak safely to ground level if he was jumping
        if (!this.player.isGrounded) {
          this.player.vy += 0.58;
          this.player.y += this.player.vy;
          if (this.player.y >= this.groundY - 50) {
            this.player.y = this.groundY - 50;
            this.player.vy = 0;
            this.player.isGrounded = true;
          }
        }

        // Sparkles and flower petals leading the way
        if (Math.random() < 0.6) {
          this.spawnDustParticles(
            this.player.x + 20 + (Math.random() - 0.5) * 80,
            this.groundY - 40 - Math.random() * 80,
            2,
            Math.random() < 0.5 ? '#fde047' : '#f43f5e'
          );
        }

        this.updateParticles(dt);
        this.updateFloatingTexts(dt);
        return;
      }

      // Phase 2: Mushak reaches Lord Ganesha's feet and bows in reverent Pranam!
      if (!this.isAtAltar) {
        this.isAtAltar = true;
        this.player.x = targetAltarX;
        this.player.y = this.groundY - 50;
        this.player.isGrounded = true;
        this.player.isSliding = false;
        this.player.animState = 'pranam'; // Bows down reverently with folded paws in Namaste

        soundManager.playShankhCelebration();
        this.spawnStarburstParticles(targetAltarX + 20, this.groundY - 60, '#fde047', 28);
        this.spawnStarburstParticles(targetAltarX + 20, this.groundY - 60, '#f43f5e', 20);

        this.floatingTexts.push({
          id: this.nextId++,
          x: targetAltarX - 25,
          y: this.groundY - 150,
          text: '🙏 JAI GANESHA! REACHED LORD GANESHA! 🙏',
          color: '#fde047',
          alpha: 1,
          life: 0,
          maxLife: 2.8,
          size: 20,
        });
      }

      // Phase 3: Divine Darshan & Blessings Celebration
      this.ganeshaDarshanTimer += dt;
      this.player.animState = 'pranam';
      this.player.x = targetAltarX;
      this.player.y = this.groundY - 50;

      if (this.ganeshaDarshanTimer >= 1.2 && !this.darshanText2Shown) {
        this.darshanText2Shown = true;
        this.floatingTexts.push({
          id: this.nextId++,
          x: targetAltarX - 20,
          y: this.groundY - 130,
          text: '✨ Fresh Modaks Offered to Lord Ganesha! ✨',
          color: '#fef08a',
          alpha: 1,
          life: 0,
          maxLife: 2.2,
          size: 17,
        });
        soundManager.playPowerUp();
      }

      if (this.ganeshaDarshanTimer >= 2.4 && !this.darshanText3Shown) {
        this.darshanText3Shown = true;
        this.floatingTexts.push({
          id: this.nextId++,
          x: targetAltarX - 20,
          y: this.groundY - 110,
          text: '🌟 Divine Aashirwad & Blessings Received! 🌟',
          color: '#fbbf24',
          alpha: 1,
          life: 0,
          maxLife: 2.2,
          size: 17,
        });
        this.spawnStarburstParticles(targetAltarX + 20, this.groundY - 60, '#fde047', 22);
      }

      // Holy flower petals and golden divine sparks
      if (Math.random() < 0.7) {
        this.spawnDustParticles(
          targetAltarX + (Math.random() - 0.5) * 120,
          this.groundY - 60 - Math.random() * 80,
          2,
          Math.random() < 0.5 ? '#fde047' : '#f43f5e'
        );
      }

      this.updateParticles(dt);
      this.updateFloatingTexts(dt);

      // ONLY complete the stage AFTER he has reached Lord Ganesha and received full Darshan!
      if (this.ganeshaDarshanTimer >= 4.2) {
        this.handleStageComplete();
      }
      return;
    }

    // --- NORMAL STAGE RUNNING (At ~1.6 m/s, 30m takes around 18-20 thrilling seconds) ---
    const metresRate = 1.6 * (currentSpeed / 3.6);
    this.distance = Math.min(targetDistance, this.distance + metresRate * dt);
    this.cameraX += currentSpeed * (dt * 60);

    const progress = Math.min(1, this.distance / targetDistance);
    this.callbacks.onStageProgress(progress, Math.floor(this.distance), targetDistance);

    // Approaching Lord Ganesha (last 10 metres: e.g. 20m - 30m)
    const approachStart = Math.max(15, targetDistance - 10);
    if (this.distance >= approachStart && !this.isApproachingGanesha) {
      this.isApproachingGanesha = true;
      this.callbacks.onApproachingGanesha?.(Math.ceil(targetDistance - this.distance));
      this.floatingTexts.push({
        id: this.nextId++,
        x: this.player.x + 60,
        y: this.groundY - 140,
        text: '✨ LORD GANESHA SHRINE AHEAD! ✨',
        color: '#fef08a',
        alpha: 1,
        life: 0,
        maxLife: 2.0,
        size: 19,
      });
      soundManager.playPowerUp();
    }

    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 20);
    }

    // Update Player
    this.updatePlayer(dt, currentSpeed);

    // Spawn entities (Stop obstacle spawning after 25m so approach to Ganesha is celebratory)
    this.spawnTimer += dt;
    const spawnInterval = 1.1 / (currentSpeed / 3.6);
    if (this.spawnTimer > spawnInterval) {
      this.spawnEntities(stage);
      this.spawnTimer = 0;
    }

    // Update Collectibles
    this.updateCollectibles(dt, currentSpeed);

    // Update Obstacles
    this.updateObstacles(dt, currentSpeed);

    // Update Particles & Floating Text
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    // Update Power-up timers
    this.updatePowerUpTimers(dt);
  }

  private updatePlayer(dt: number, speed: number) {
    const p = this.player;

    // Coyote time tracking
    if (p.isGrounded) {
      this.coyoteTimer = 0.15; // 150ms coyote window
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    // Jump buffering
    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
      if (p.isGrounded || this.coyoteTimer > 0) {
        this.executeJump();
      }
    }

    // Horizontal steering with arrow keys
    if (this.keysPressed['ArrowRight'] || this.keysPressed['KeyD']) {
      p.x = Math.min(280, p.x + 180 * dt);
    } else if (this.keysPressed['ArrowLeft'] || this.keysPressed['KeyA']) {
      p.x = Math.max(60, p.x - 180 * dt);
    }

    // Gravity & Vertical Physics (gentle, floaty gravity)
    if (!p.isGrounded) {
      p.vy += 0.58; // soft, forgiving gravity
      p.y += p.vy;

      if (p.y >= this.groundY - (p.isSliding ? 30 : 50)) {
        p.y = this.groundY - (p.isSliding ? 30 : 50);
        p.vy = 0;
        p.isGrounded = true;
        p.animState = p.isSliding ? 'sliding' : (this.hasReachedGanesha ? 'celebrating' : 'running');
        this.spawnDustParticles(p.x + 20, this.groundY, 4, '#fde047');
      }
    }

    // Sliding timer
    if (p.isSliding) {
      p.slideTimer -= dt;
      p.height = 30;
      if (p.slideTimer <= 0) {
        p.isSliding = false;
        p.height = 50;
        p.animState = this.hasReachedGanesha ? 'celebrating' : 'running';
      }
    } else {
      p.height = 50;
    }

    // Animation frame progression
    p.animFrame += dt * (speed * 2.2);

    // Invincibility flashing timer
    if (p.invincibleTimer > 0) {
      p.invincibleTimer -= dt;
    }

    // Flower Trail power-up active: spawn blooms
    if (p.trailTimer > 0) {
      p.trailSpawnTimer += dt;
      if (p.trailSpawnTimer > 0.18) {
        p.trailSpawnTimer = 0;
        this.addScore(8, '🌸 Trail +8');
        soundManager.playFlowerCollect();
        this.spawnDustParticles(p.x - 10, this.groundY - 5, 5, '#ec4899');
      }
    }
  }

  private updatePowerUpTimers(dt: number) {
    const p = this.player;
    if (p.divineBlessingTimer > 0) p.divineBlessingTimer -= dt;
    if (p.magnetTimer > 0) p.magnetTimer -= dt;
    if (p.boostTimer > 0) p.boostTimer -= dt;
    if (p.trailTimer > 0) p.trailTimer -= dt;

    const activeList: { type: PowerUpType; timeLeft: number }[] = [];
    if (p.divineBlessingTimer > 0) activeList.push({ type: 'blessing', timeLeft: p.divineBlessingTimer });
    if (p.magnetTimer > 0) activeList.push({ type: 'magnet', timeLeft: p.magnetTimer });
    if (p.boostTimer > 0) activeList.push({ type: 'boost', timeLeft: p.boostTimer });
    if (p.trailTimer > 0) activeList.push({ type: 'trail', timeLeft: p.trailTimer });

    this.callbacks.onPowerUpUpdate(activeList);
  }

  private spawnEntities(stage: StageConfig) {
    const targetDistance = stage.targetDistance || GOAL_DISTANCE_METRES;
    const nearShrine = this.distance >= targetDistance - 5;

    // Spawn collectibles in rhythmic trails
    this.spawnCollectiblePattern(stage);

    // Spawn obstacles frequently across the path until reaching Lord Ganesha
    if (!nearShrine) {
      this.spawnObstaclePattern(stage);
    }

    // Occasional Power-Up spawn (every ~15-20 seconds)
    if (Math.random() < 0.10) {
      this.spawnPowerUp();
    }
  }

  private spawnCollectiblePattern(stage: StageConfig) {
    const startX = this.canvasWidth + 60;
    const count = 3 + Math.floor(Math.random() * 3);
    const heightType = Math.random() < 0.4 ? 'high' : 'ground';
    const baseY = heightType === 'high' ? this.groundY - 110 : this.groundY - 35;

    // Determine collectible types based on stage
    let typePool: CollectibleType[] = ['modak', 'flower', 'durva', 'diya'];
    if (stage.isEcoStage) {
      typePool = ['eco_clay', 'eco_leaf', 'eco_flower', 'modak', 'trash_plastic', 'trash_cup'];
    }

    for (let i = 0; i < count; i++) {
      let chosenType = typePool[Math.floor(Math.random() * typePool.length)];
      let rangoliCol: RangoliColor | undefined = undefined;

      if (stage.hasColorSequence) {
        chosenType = 'flower';
        // Spawn sequential rangoli colors
        const colors: RangoliColor[] = ['red', 'yellow', 'green', 'blue'];
        rangoliCol = colors[(this.sequenceIndex + i) % 4];
      }

      const points = COLLECTIBLE_VALUES[chosenType];

      this.collectibles.push({
        id: this.nextId++,
        x: startX + i * 45,
        y: baseY + (Math.sin(i * 0.8) * 15),
        width: 32,
        height: 32,
        type: chosenType,
        points,
        collected: false,
        floatOffset: i * 0.5,
        rangoliColor: rangoliCol,
      });
    }
  }

  private spawnObstaclePattern(stage: StageConfig) {
    const targetDistance = stage.targetDistance || GOAL_DISTANCE_METRES;
    // When approaching Lord Ganesha shrine (past target - 5m), stop spawning obstacles
    if (this.distance >= targetDistance - 5) return;

    // Dynamic obstacle spacing: 240px - 280px ensures rich obstacle density along the street
    if (this.obstacles.length > 0) {
      const lastObs = this.obstacles[this.obstacles.length - 1];
      if (lastObs.x > this.canvasWidth - 250) {
        return;
      }
    }

    const startX = this.canvasWidth + 60;
    
    // Rich variety of obstacles tailored by stage
    let pool: ObstacleType[] = ['flower_basket', 'festive_box', 'hanging_garland', 'coconut_hurdle', 'brass_lamp'];

    if (stage.id === 2) {
      pool = ['rangoli_pot', 'flower_basket', 'hanging_garland', 'dhoop_burner', 'festive_box'];
    } else if (stage.id === 3) {
      pool = ['pandal_cart', 'dhol_drum', 'safe_barrier', 'brass_lamp', 'hanging_garland'];
    } else if (stage.id === 4) {
      pool = ['coconut_hurdle', 'flower_basket', 'safe_barrier', 'hanging_garland', 'dhoop_burner'];
    } else if (stage.id === 5) {
      pool = ['dhol_drum', 'pandal_cart', 'brass_lamp', 'hanging_garland', 'coconut_hurdle'];
    }

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    let width = 44;
    let height = 44;
    let isOverhead = false;
    let y = this.groundY - height;
    let moving = false;
    let speedX = 0;

    switch (chosen) {
      case 'hanging_garland':
        width = 56;
        height = 42;
        isOverhead = true;
        // Hanging from top/mid air: bottom is at groundY - 32.
        // Standing Mushak (height 50) hits it; sliding Mushak (height 26) passes underneath safely!
        y = this.groundY - 74;
        break;
      case 'safe_barrier':
        width = 54;
        height = 42;
        isOverhead = true;
        y = this.groundY - 74;
        break;
      case 'dhol_drum':
        width = 52;
        height = 44;
        y = this.groundY - height;
        break;
      case 'coconut_hurdle':
        width = 46;
        height = 36;
        y = this.groundY - height;
        break;
      case 'dhoop_burner':
        width = 40;
        height = 48;
        y = this.groundY - height;
        break;
      case 'pandal_cart':
        width = 54;
        height = 42;
        moving = true;
        speedX = -0.9;
        y = this.groundY - height;
        break;
      case 'brass_lamp':
        width = 34;
        height = 58;
        y = this.groundY - height;
        break;
      case 'flower_basket':
        width = 44;
        height = 40;
        y = this.groundY - height;
        break;
      case 'rangoli_pot':
        width = 42;
        height = 46;
        y = this.groundY - height;
        break;
      case 'festive_box':
        width = 42;
        height = 42;
        y = this.groundY - height;
        break;
    }

    this.obstacles.push({
      id: this.nextId++,
      x: startX,
      y,
      width,
      height,
      type: chosen,
      moving,
      speedX,
      isOverhead,
    });
  }

  private spawnPowerUp() {
    const powerUps: PowerUpType[] = ['blessing', 'magnet', 'boost', 'trail'];
    const chosen = powerUps[Math.floor(Math.random() * powerUps.length)];

    this.collectibles.push({
      id: this.nextId++,
      x: this.canvasWidth + 80,
      y: this.groundY - 80,
      width: 36,
      height: 36,
      type: 'modak',
      points: 50,
      collected: false,
      floatOffset: 0,
      isPowerUp: true,
      powerUpType: chosen,
    });
  }

  private updateCollectibles(dt: number, speed: number) {
    const p = this.player;

    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.x -= speed * (dt * 60);

      // Modak Magnet Attraction
      if (p.magnetTimer > 0 && !c.isPowerUp) {
        const dx = (p.x + p.width / 2) - (c.x + c.width / 2);
        const dy = (p.y + p.height / 2) - (c.y + c.height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < 260) {
          c.x += (dx / dist) * 12;
          c.y += (dy / dist) * 12;
        }
      }

      // Check Collection Collision with Mushak
      const hit = this.checkAABB(
        p.x,
        p.y,
        p.width,
        p.height,
        c.x,
        c.y,
        c.width,
        c.height
      );

      if (hit && !c.collected) {
        c.collected = true;
        this.handleCollectItem(c);
        this.collectibles.splice(i, 1);
        continue;
      }

      // Despawn offscreen
      if (c.x < -60) {
        this.collectibles.splice(i, 1);
      }
    }
  }

  private handleCollectItem(c: Collectible) {
    const p = this.player;

    // Handle Power-Up Claim
    if (c.isPowerUp && c.powerUpType) {
      soundManager.playPowerUp();
      this.spawnStarburstParticles(c.x, c.y, '#fbbf24', 16);

      if (c.powerUpType === 'blessing') {
        p.divineBlessingTimer = 7;
        this.addScore(50, '✨ Divine Blessing! +50');
      } else if (c.powerUpType === 'magnet') {
        p.magnetTimer = 8;
        this.addScore(50, '🧲 Modak Magnet! +50');
      } else if (c.powerUpType === 'boost') {
        p.boostTimer = 6;
        this.addScore(50, '⚡ Festival Boost! +50');
      } else if (c.powerUpType === 'trail') {
        p.trailTimer = 7;
        this.addScore(50, '🌸 Flower Trail! +50');
      }
      return;
    }

    // Handle Stage 4 Trash Penalty vs Eco Reward
    if (c.type === 'trash_plastic' || c.type === 'trash_cup') {
      soundManager.playObstacleHit();
      this.combo = 0;
      this.ecoScore = Math.max(0, this.ecoScore - 20);
      this.addScore(c.points, '⚠️ Litter avoided! -15', '#ef4444');
      this.callbacks.onScoreUpdate(this.score, this.ecoScore, this.combo);
      return;
    }

    // Handle Stage 2 Rangoli Color Memory Sequence
    const stage = STAGES[this.currentStageIndex];
    if (stage.hasColorSequence && c.rangoliColor) {
      const targetColor = this.colorSequence[this.sequenceIndex];
      if (c.rangoliColor === targetColor) {
        this.sequenceIndex++;
        this.spawnStarburstParticles(c.x, c.y, '#10b981', 10);

        if (this.sequenceIndex >= this.colorSequence.length) {
          // Completed full sequence!
          this.offeringsCount++;
          this.sequenceIndex = 0;
          this.addScore(150, '🌈 Rangoli Harmony! +150', '#10b981');
          soundManager.playPowerUp();
        } else {
          this.offeringsCount++;
          this.addScore(20, `🎨 ${c.rangoliColor.toUpperCase()}! +20`);
          soundManager.playFlowerCollect();
        }

        this.callbacks.onColorSequenceUpdate(this.colorSequence, this.sequenceIndex);
      } else {
        // Wrong color in sequence
        this.sequenceIndex = 0;
        this.callbacks.onColorSequenceUpdate(this.colorSequence, this.sequenceIndex);
        this.addScore(5, '🎨 +5');
        soundManager.playFlowerCollect();
      }
      return;
    }

    // Standard Collectibles
    this.offeringsCount++;
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
      saveMaxComboRecord(this.maxCombo);
    }

    const multiplier = 1 + Math.floor((this.combo - 1) / 3) * 0.5;
    const earnedPoints = Math.round(c.points * multiplier);

    if (c.type.startsWith('eco_')) {
      this.ecoScore += 25;
      saveBestEcoScore(this.ecoScore);
    }

    // Play specific sounds
    if (c.type === 'modak') {
      soundManager.playModakCollect();
      this.spawnStarburstParticles(c.x, c.y, '#f59e0b', 12);
    } else if (c.type === 'flower' || c.type === 'eco_flower') {
      soundManager.playFlowerCollect();
      this.spawnDustParticles(c.x, c.y, 8, '#f97316');
    } else if (c.type === 'durva') {
      soundManager.playDurvaCollect();
      this.spawnDustParticles(c.x, c.y, 8, '#22c55e');
    } else if (c.type === 'diya') {
      soundManager.playDiyaCollect();
      this.spawnStarburstParticles(c.x, c.y, '#fef08a', 14);
    } else if (c.type === 'eco_clay' || c.type === 'eco_leaf') {
      soundManager.playEcoItemCollect();
      this.spawnDustParticles(c.x, c.y, 8, '#84cc16');
    }

    if (this.combo % 3 === 0) {
      soundManager.playCombo(this.combo);
      this.addScore(earnedPoints, `x${this.combo} Combo! +${earnedPoints}`, '#fbbf24');
    } else {
      this.addScore(earnedPoints, `+${earnedPoints}`);
    }
  }

  private addScore(pts: number, text: string, color = '#fef3c7') {
    this.score += pts;
    saveHighScore(this.score);
    this.callbacks.onScoreUpdate(this.score, this.ecoScore, this.combo);

    this.floatingTexts.push({
      id: this.nextId++,
      x: this.player.x + 20,
      y: this.player.y - 12,
      text,
      color,
      alpha: 1,
      life: 0,
      maxLife: 0.85,
      size: text.includes('Combo') || text.includes('Harm') || text.includes('Divine') ? 18 : 15,
    });
  }

  private getObstacleDisplayName(type: ObstacleType): string {
    switch (type) {
      case 'flower_basket':
        return 'Flower Basket';
      case 'festive_box':
        return 'Festival Gift Box';
      case 'pandal_cart':
        return 'Rolling Pandal Cart';
      case 'brass_lamp':
        return 'Brass Samai Diya';
      case 'safe_barrier':
        return 'Pandal Velvet Barrier';
      case 'rangoli_pot':
        return 'Rangoli Kalash Pot';
      case 'hanging_garland':
        return 'Hanging Toran Garland';
      case 'dhol_drum':
        return 'Festival Dhol Drum';
      case 'coconut_hurdle':
        return 'Sacred Coconut Platter';
      case 'dhoop_burner':
        return 'Brass Dhoop Burner';
      default:
        return 'Festival Obstacle';
    }
  }

  private updateObstacles(dt: number, speed: number) {
    const p = this.player;

    // Detect approaching obstacle for player early warning
    let warning: 'jump' | 'slide' | null = null;
    for (const obs of this.obstacles) {
      if (obs.x > p.x + 30 && obs.x < p.x + 380 && !obs.hit) {
        warning = (obs.isOverhead || obs.type === 'hanging_garland' || obs.type === 'safe_barrier') ? 'slide' : 'jump';
        break;
      }
    }
    this.approachingWarning = warning;
    this.callbacks.onObstacleWarning?.(warning);

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= (speed + (obs.speedX || 0)) * (dt * 60);

      // Check collision (only if not in flashing invincibility)
      const hit = this.checkAABB(
        p.x,
        p.y,
        p.width,
        p.height,
        obs.x,
        obs.y,
        obs.width,
        obs.height
      );

      if (hit && !obs.hit && p.invincibleTimer <= 0) {
        obs.hit = true;

        // Divine Blessing Protection
        if (p.divineBlessingTimer > 0) {
          soundManager.playPowerUp();
          this.spawnStarburstParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#fbbf24', 16);
          this.floatingTexts.push({
            id: this.nextId++,
            x: obs.x,
            y: obs.y - 10,
            text: '🛡️ Protected by Bappa!',
            color: '#fbbf24',
            alpha: 1,
            life: 0,
            maxLife: 0.8,
            size: 15,
          });
        } else if (this.lives > 1) {
          // 3-Hearts System: lose 1 heart, gain 1.8s shield
          this.lives--;
          p.invincibleTimer = 1.8;
          this.screenShake = 14;
          this.combo = 0;
          soundManager.playObstacleHit();
          soundManager.playHeartLost();
          this.callbacks.onLivesUpdate(this.lives);
          this.callbacks.onScoreUpdate(this.score, this.ecoScore, this.combo);

          this.spawnDustParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, 16, '#ef4444');
          this.spawnStarburstParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#f97316', 10);
          this.floatingTexts.push({
            id: this.nextId++,
            x: p.x + 10,
            y: p.y - 20,
            text: this.lives === 2 ? '💔 Heart Lost! 2 Hearts Left' : '⚠️ Final Heart! Be careful!',
            color: '#f59e0b',
            alpha: 1,
            life: 0,
            maxLife: 1.2,
            size: 15,
          });
        } else {
          // Lost the 3rd and final heart -> TRIGGER GAME OVER SESSION!
          this.handlePlayerHit(obs);
        }
      }

      if (obs.x < -80) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  private handlePlayerHit(obs: Obstacle) {
    this.lastHitObstacleName = this.getObstacleDisplayName(obs.type);
    this.lives = 0;
    this.combo = 0;
    this.player.animState = 'hit';
    this.player.vy = -7;
    this.player.isGrounded = false;
    this.screenShake = 26;
    soundManager.playObstacleHit();
    soundManager.playHeartLost();
    soundManager.playGameOver();

    this.callbacks.onLivesUpdate(0);
    this.callbacks.onScoreUpdate(this.score, this.ecoScore, this.combo);

    this.spawnDustParticles(this.player.x + 20, this.player.y + 20, 20, '#ef4444');
    this.spawnStarburstParticles(this.player.x + 20, this.player.y + 20, '#f97316', 16);

    this.floatingTexts.push({
      id: this.nextId++,
      x: this.player.x,
      y: this.player.y - 25,
      text: `💥 3 Hearts Lost! GAME OVER`,
      color: '#ef4444',
      alpha: 1,
      life: 0,
      maxLife: 1.4,
      size: 18,
    });

    // Stop runner movement and transition to the Game Over Session Modal
    this.isRunning = false;
    setTimeout(() => {
      this.handleGameOver();
    }, 600);
  }

  private handleStageComplete() {
    this.isRunning = false;
    soundManager.playShankhCelebration();

    const stage = STAGES[this.currentStageIndex];
    saveUnlockedStage(this.currentStageIndex + 2);

    this.callbacks.onStageComplete(stage, this.score, this.ecoScore, this.maxCombo);
  }

  private handleGameOver() {
    this.isRunning = false;
    soundManager.stopMusic();
    this.callbacks.onGameOver(
      this.score,
      this.ecoScore,
      this.maxCombo,
      this.lastHitObstacleName,
      this.offeringsCount
    );
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * (dt * 60);
      p.y += p.vy * (dt * 60);
      p.life += dt;
      p.alpha = 1 - (p.life / p.maxLife);

      if (p.vRot) {
        p.rotation = (p.rotation || 0) + p.vRot * dt;
      }

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.y -= 35 * dt;
      t.life += dt;
      t.alpha = 1 - (t.life / t.maxLife);

      if (t.life >= t.maxLife) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private spawnDustParticles(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.7) * 4,
        vy: (Math.random() - 0.5) * 3,
        color,
        size: 3 + Math.random() * 3,
        alpha: 0.9,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        shape: 'circle',
      });
    }
  }

  private spawnStarburstParticles(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + Math.random() * 0.3;
      const speed = 2.5 + Math.random() * 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
        shape: Math.random() < 0.5 ? 'spark' : 'petal',
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 5,
      });
    }
  }

  private checkAABB(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean {
    // Extra forgiving hitbox margins (shrink by 10px for ultra accessible, fair play)
    const margin = 10;
    return (
      x1 + margin < x2 + w2 - margin &&
      x1 + w1 - margin > x2 + margin &&
      y1 + margin < y2 + h2 - margin &&
      y1 + h1 - margin > y2 + margin
    );
  }
}
