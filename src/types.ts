export type StageId = 1 | 2 | 3 | 4 | 5;

export type MiniGameId = 
  | 'mushak_dash'
  | 'rangoli'
  | 'modak_kitchen'
  | 'dhol_tasha'
  | 'shringaar'
  | 'eco_clay'
  | 'memory_match'
  | 'modak_tower'
  | 'laddoo_rush'
  | 'visarjan_miraj'
  | 'ganesha_names'
  | 'diya_mandala'
  | 'durva_puja'
  | 'pandal_builder'
  | 'ganesha_puzzle';

export type GameScreen = 
  | 'menu' 
  | 'tutorial' 
  | 'playing' 
  | 'paused' 
  | 'stage_clear' 
  | 'quiz' 
  | 'game_over' 
  | 'victory'
  | 'leaderboard'
  | 'settings'
  | 'about'
  | 'game_rangoli'
  | 'game_modak'
  | 'game_dhol'
  | 'game_shringaar'
  | 'game_clay'
  | 'game_memory'
  | 'game_tower'
  | 'game_laddoo'
  | 'game_visarjan'
  | 'game_names'
  | 'game_diya'
  | 'game_durva'
  | 'game_pandal'
  | 'game_puzzle';

export type CollectibleType = 
  | 'modak' 
  | 'flower' 
  | 'durva' 
  | 'diya' 
  | 'eco_clay' 
  | 'eco_leaf' 
  | 'eco_flower'
  | 'trash_plastic' 
  | 'trash_cup';

export type PowerUpType = 
  | 'magnet' 
  | 'blessing' 
  | 'boost' 
  | 'trail';

export type ObstacleType = 
  | 'flower_basket' 
  | 'festive_box' 
  | 'pandal_cart' 
  | 'brass_lamp' 
  | 'safe_barrier' 
  | 'rangoli_pot'
  | 'hanging_garland'
  | 'dhol_drum'
  | 'coconut_hurdle'
  | 'dhoop_burner';

export type RangoliColor = 'red' | 'yellow' | 'green' | 'blue';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  isSliding: boolean;
  slideTimer: number;
  animFrame: number;
  animState: 'idle' | 'running' | 'jumping' | 'falling' | 'sliding' | 'celebrating' | 'pranam' | 'hit';
  invincibleTimer: number;
  divineBlessingTimer: number;
  magnetTimer: number;
  boostTimer: number;
  trailTimer: number;
  trailSpawnTimer: number;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: CollectibleType;
  points: number;
  collected: boolean;
  floatOffset: number;
  rangoliColor?: RangoliColor;
  isPowerUp?: boolean;
  powerUpType?: PowerUpType;
}

export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  moving?: boolean;
  speedX?: number;
  hit?: boolean;
  isOverhead?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'petal' | 'spark' | 'leaf' | 'star' | 'confetti';
  rotation?: number;
  vRot?: number;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  size: number;
}

export interface StageConfig {
  id: StageId;
  title: string;
  subtitle: string;
  targetDistance: number;
  description: string;
  hasColorSequence?: boolean;
  isEcoStage?: boolean;
  bgAtmosphere: 'day' | 'evening' | 'pandal' | 'green' | 'twilight';
  speed: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  ecoScore: number;
  maxCombo: number;
  stageReached: number;
  date: string;
}

export interface AudioSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
}
