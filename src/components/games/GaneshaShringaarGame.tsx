import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Play, 
  Pause, 
  Square, 
  Check, 
  Flame, 
  Bell, 
  Flower2, 
  CheckCircle2,
  Heart,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../audio/soundManager';

// User-specified public URL for the sacred Ganesha Aarti Darshan
export const GANESHA_AARTI_IMAGE_URL =
  'https://lh3.googleusercontent.com/pw/AP1GczNUx8Yvnj5sDgNgtRztrA8JvCZNtfIl0BPJXyIy9-Uy4z2uL0wg4icBJgsoo2VHuOkxFeMrsWjubdET24XrlpScqSZRy-qe-Uqy_igTdgHuLQaUSElT_RJ73fMFmQ8ZsRSfIe--MKDORhQYgLJOu48=w550-h550-s-no-gm?authuser=0';

/**
 * Continuous SVG path data for the sacred Devanagari ॐ (Om) symbol.
 * Normalized to 500 x 500 coordinate space for precision mathematical tracing.
 */
const OM_PATH_DATA = `
  M 240 140
  C 170 95, 115 120, 115 180
  C 115 235, 185 240, 230 230
  C 145 265, 100 325, 120 395
  C 140 455, 230 460, 265 410
  C 290 370, 275 315, 235 290
  C 285 295, 350 330, 400 305
  C 435 285, 445 220, 405 170
  C 380 140, 340 160, 355 195
  C 345 130, 320 95, 310 90
  C 335 110, 385 110, 420 85
  C 390 60, 375 40, 365 40
  C 355 40, 345 60, 365 60
  C 320 80, 280 105, 240 140
  Z
`;

/**
 * Pre-sampled normalized (x %, y %) fallback waypoints along the sacred Om symbol
 * to guarantee fluid 60fps trajectory even before SVG DOM path measurement is ready.
 */
const OM_WAYPOINTS: { x: number; y: number }[] = [
  { x: 48, y: 28 }, { x: 41, y: 23 }, { x: 33, y: 21 }, { x: 26, y: 25 }, { x: 23, y: 32 },
  { x: 24, y: 40 }, { x: 30, y: 45 }, { x: 39, y: 47 }, { x: 46, y: 46 }, { x: 38, y: 52 },
  { x: 30, y: 56 }, { x: 24, y: 64 }, { x: 23, y: 74 }, { x: 27, y: 82 }, { x: 35, y: 87 },
  { x: 44, y: 88 }, { x: 52, y: 83 }, { x: 55, y: 74 }, { x: 54, y: 65 }, { x: 48, y: 58 },
  { x: 53, y: 58 }, { x: 61, y: 61 }, { x: 70, y: 63 }, { x: 79, y: 61 }, { x: 84, y: 54 },
  { x: 86, y: 44 }, { x: 83, y: 36 }, { x: 77, y: 33 }, { x: 71, y: 36 }, { x: 68, y: 40 },
  { x: 66, y: 27 }, { x: 69, y: 20 }, { x: 75, y: 19 }, { x: 81, y: 18 }, { x: 76, y: 12 },
  { x: 71, y: 9 },  { x: 73, y: 13 }, { x: 65, y: 17 }, { x: 56, y: 22 }, { x: 48, y: 28 }
];

export interface AartiItem {
  id: string;
  name: string;
  sanskritName: string;
  icon: string;
  category: 'lamps' | 'flowers' | 'prasad' | 'sacred_powders' | 'auspicious';
  description: string;
  defaultSelected: boolean;
  thaliVisual: {
    emoji: string;
    label: string;
    color: string;
  };
}

const AARTI_MATERIALS: AartiItem[] = [
  {
    id: 'pancha_diya',
    name: 'Pancha-Pradeep (5 Brass Diyas)',
    sanskritName: 'पञ्चप्रदीप',
    icon: '🪔',
    category: 'lamps',
    description: 'Five brass oil lamps with pure cow ghee dispelling all ignorance',
    defaultSelected: true,
    thaliVisual: { emoji: '🪔', label: 'Pancha Diya', color: 'text-amber-400' },
  },
  {
    id: 'karpur',
    name: 'Karpur Aarti (Camphor Flame)',
    sanskritName: 'कर्पूर आरती',
    icon: '🔥',
    category: 'lamps',
    description: 'Pure burning camphor flame radiating divine spiritual light',
    defaultSelected: true,
    thaliVisual: { emoji: '🔥', label: 'Camphor', color: 'text-orange-400' },
  },
  {
    id: 'dhoop',
    name: 'Dhoop & Agarbatti',
    sanskritName: 'सुगन्धित धूप',
    icon: '🪵',
    category: 'auspicious',
    description: 'Smoldering aromatic sandalwood and guggul incense purifying the aura',
    defaultSelected: true,
    thaliVisual: { emoji: '💨', label: 'Dhoop', color: 'text-amber-200' },
  },
  {
    id: 'modak',
    name: 'Ukadiche Modak (21 Count)',
    sanskritName: 'मोदक महाप्रसाद',
    icon: '🥟',
    category: 'prasad',
    description: 'Steamed rice flour dumplings filled with fresh coconut and jaggery',
    defaultSelected: true,
    thaliVisual: { emoji: '🥟', label: 'Modak', color: 'text-amber-100' },
  },
  {
    id: 'laddoo',
    name: 'Kesar Motichoor Laddoos',
    sanskritName: 'मोतिचूर लाडू',
    icon: '🟡',
    category: 'prasad',
    description: 'Golden saffron infused sweet laddoos offering royal indulgence',
    defaultSelected: true,
    thaliVisual: { emoji: '🟡', label: 'Laddoo', color: 'text-yellow-400' },
  },
  {
    id: 'hibiscus',
    name: 'Raktapushpa (Red Hibiscus)',
    sanskritName: 'रक्तपुष्प / जास्वंद',
    icon: '🌺',
    category: 'flowers',
    description: 'Crimson hibiscus flower dearest to Lord Ganesha',
    defaultSelected: true,
    thaliVisual: { emoji: '🌺', label: 'Hibiscus', color: 'text-red-500' },
  },
  {
    id: 'marigold',
    name: 'Genda Phool (Orange Marigold)',
    sanskritName: 'झेंडू / गेंदा माला',
    icon: '🌼',
    category: 'flowers',
    description: 'Auspicious sun-kissed marigold blossoms symbolizing purity and celebration',
    defaultSelected: true,
    thaliVisual: { emoji: '🌼', label: 'Marigold', color: 'text-yellow-500' },
  },
  {
    id: 'durva',
    name: '21 Durva Grass Blades',
    sanskritName: 'एकविंशति दूर्वा',
    icon: '🌿',
    category: 'flowers',
    description: '21 sacred three-pronged tender green Durva grass sprouts',
    defaultSelected: true,
    thaliVisual: { emoji: '🌿', label: 'Durva', color: 'text-emerald-400' },
  },
  {
    id: 'chandan',
    name: 'Raktachandan & Chandan Lep',
    sanskritName: 'चन्दन लेप',
    icon: '🟤',
    category: 'sacred_powders',
    description: 'Pure cooling fragrant sandalwood paste for sacred tilak',
    defaultSelected: true,
    thaliVisual: { emoji: '🟤', label: 'Chandan', color: 'text-amber-700' },
  },
  {
    id: 'kumkum',
    name: 'Kumkum & Sindoor',
    sanskritName: 'कुङ्कुम / सिन्दूर',
    icon: '🔴',
    category: 'sacred_powders',
    description: 'Auspicious red vermilion powder invoking divine shakti',
    defaultSelected: true,
    thaliVisual: { emoji: '🔴', label: 'Kumkum', color: 'text-rose-600' },
  },
  {
    id: 'haldi',
    name: 'Mangal Haridra (Turmeric)',
    sanskritName: 'हरिद्रा चूर्ण',
    icon: '🟡',
    category: 'sacred_powders',
    description: 'Sanctified golden turmeric powder signifying health and prosperity',
    defaultSelected: true,
    thaliVisual: { emoji: '🟡', label: 'Haldi', color: 'text-yellow-400' },
  },
  {
    id: 'akshat',
    name: 'Pavitra Akshat (Rice)',
    sanskritName: 'पवित्र अक्षत',
    icon: '🍚',
    category: 'sacred_powders',
    description: 'Unbroken consecrated rice grains invoking boundless abundance',
    defaultSelected: true,
    thaliVisual: { emoji: '🍚', label: 'Akshat', color: 'text-stone-100' },
  },
  {
    id: 'shriphal',
    name: 'Shriphal (Sacred Coconut)',
    sanskritName: 'श्रीफल / नारिकेल',
    icon: '🥥',
    category: 'auspicious',
    description: 'Sacred water-filled coconut marked with vermilion swastika',
    defaultSelected: true,
    thaliVisual: { emoji: '🥥', label: 'Shriphal', color: 'text-amber-800' },
  },
  {
    id: 'tambulam',
    name: 'Tambulam (Paan & Supari)',
    sanskritName: 'ताम्बूलम्',
    icon: '🍃',
    category: 'auspicious',
    description: 'Fresh aromatic betel leaf wrapped with sacred areca nut and clove',
    defaultSelected: true,
    thaliVisual: { emoji: '🍃', label: 'Tambulam', color: 'text-emerald-500' },
  },
  {
    id: 'gangajal',
    name: 'Gangajal & Copper Kalash',
    sanskritName: 'गङ्गाजल कलश',
    icon: '🏺',
    category: 'auspicious',
    description: 'Purifying holy water collected from the sacred Ganges river',
    defaultSelected: true,
    thaliVisual: { emoji: '🏺', label: 'Kalash', color: 'text-orange-300' },
  },
  {
    id: 'ghanti',
    name: 'Pooja Ghanti (Temple Bell)',
    sanskritName: 'पीतल घण्टा',
    icon: '🔔',
    category: 'auspicious',
    description: 'Pure resonant brass bell that drives away negative energies',
    defaultSelected: true,
    thaliVisual: { emoji: '🔔', label: 'Ghanti', color: 'text-amber-300' },
  },
  {
    id: 'shankh',
    name: 'Pavitra Shankha (Conch)',
    sanskritName: 'पवित्र शङ्ख',
    icon: '🐚',
    category: 'auspicious',
    description: 'Sanctified conch shell resonating the primordial Om vibration',
    defaultSelected: true,
    thaliVisual: { emoji: '🐚', label: 'Shankh', color: 'text-stone-200' },
  },
  {
    id: 'janeu',
    name: 'Yajnopavita (Janeu Thread)',
    sanskritName: 'यज्ञोपवीतम्',
    icon: '🧵',
    category: 'auspicious',
    description: 'Sacred three-fold white cotton thread signifying spiritual initiation',
    defaultSelected: true,
    thaliVisual: { emoji: '🧵', label: 'Janeu', color: 'text-amber-100' },
  },
];

interface GaneshaShringaarGameProps {
  onBack: () => void;
}

export const GaneshaShringaarGame: React.FC<GaneshaShringaarGameProps> = ({ onBack }) => {
  // Selected Aarti Items State
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set(AARTI_MATERIALS.filter((m) => m.defaultSelected).map((m) => m.id))
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Aarti Real-time Animation State
  const [isAartiActive, setIsAartiActive] = useState<boolean>(false);
  const [aartiSpeed, setAartiSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [parikramaCount, setParikramaCount] = useState<number>(0);
  const [blessingScore, setBlessingScore] = useState<number>(108);
  const [showeringPetals, setShoweringPetals] = useState<boolean>(false);

  // Floating Aarti Thali Position (% coordinates over the image)
  const [thaliPosition, setThaliPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const omPathRef = useRef<SVGPathElement | null>(null);
  const omProgressRef = useRef<number>(0);
  const bellsCounterRef = useRef<number>(0);

  // Toggle Aarti Item on Thali
  const toggleItem = (id: string) => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id); // Keep at least one item on thali
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    setSelectedItemIds(new Set(AARTI_MATERIALS.map((m) => m.id)));
  };

  const selectEssentials = () => {
    soundManager.userInteracted();
    soundManager.playSlide();
    setSelectedItemIds(new Set(['pancha_diya', 'karpur', 'modak', 'hibiscus', 'durva', 'kumkum', 'ghanti']));
  };

  // Toggle Aarti State (Start / Pause)
  const handleToggleAarti = () => {
    soundManager.userInteracted();
    if (!isAartiActive) {
      soundManager.playTempleBell();
      setIsAartiActive(true);
      setBlessingScore((s) => s + 25);
    } else {
      setIsAartiActive(false);
    }
  };

  // Devotional actions
  const triggerRingBell = () => {
    soundManager.userInteracted();
    soundManager.playTempleBell();
    setBlessingScore((s) => s + 10);
  };

  const triggerBlowShankh = () => {
    soundManager.userInteracted();
    soundManager.playShankhCelebration();
    setBlessingScore((s) => s + 50);
  };

  const triggerFlowerShower = () => {
    soundManager.userInteracted();
    soundManager.playFlowerCollect();
    setShoweringPetals(true);
    setBlessingScore((s) => s + 25);
    setTimeout(() => setShoweringPetals(false), 3000);
  };

  // 60FPS continuous animation loop traversing the sacred OM (ॐ) symbol
  useEffect(() => {
    if (!isAartiActive) return;

    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const pathEl = omPathRef.current;
      const speedPxPerSec = aartiSpeed === 'slow' ? 40 : aartiSpeed === 'fast' ? 100 : 65;

      if (pathEl && typeof pathEl.getTotalLength === 'function') {
        const totalLen = pathEl.getTotalLength();
        omProgressRef.current += delta * speedPxPerSec;

        if (omProgressRef.current >= totalLen) {
          omProgressRef.current = omProgressRef.current % totalLen;
          setParikramaCount((p) => {
            const next = p + 1;
            soundManager.playTempleBell();
            setBlessingScore((s) => s + 21);
            return next;
          });
        }

        const pt = pathEl.getPointAtLength(omProgressRef.current);
        setThaliPosition({
          x: (pt.x / 500) * 100,
          y: (pt.y / 500) * 100,
        });
      } else {
        // Fallback using precomputed mathematical Om waypoints
        const step = aartiSpeed === 'slow' ? 0.3 : aartiSpeed === 'fast' ? 0.8 : 0.5;
        omProgressRef.current = (omProgressRef.current + step) % OM_WAYPOINTS.length;
        const idx = Math.floor(omProgressRef.current);
        const wp = OM_WAYPOINTS[idx] || OM_WAYPOINTS[0];
        setThaliPosition(wp);
      }

      // Rhythmic soft temple bell chime during Aarti darshan
      bellsCounterRef.current += delta;
      if (bellsCounterRef.current > 4.5) {
        bellsCounterRef.current = 0;
        soundManager.playTempleBell();
        setBlessingScore((s) => s + 5);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isAartiActive, aartiSpeed]);

  const filteredMaterials = activeCategory === 'all'
    ? AARTI_MATERIALS
    : AARTI_MATERIALS.filter((m) => m.category === activeCategory);

  const selectedItemsList = AARTI_MATERIALS.filter((m) => selectedItemIds.has(m.id));

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-[#070407] text-amber-50 flex flex-col items-center justify-start py-3 px-3 sm:px-5 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Top Header Navigation */}
      <header className="w-full max-w-xl flex items-center justify-between py-2 border-b border-amber-500/25">
        <button
          onClick={() => {
            soundManager.userInteracted();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 hover:text-amber-100 active:scale-95 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Festival Hub</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-base sm:text-lg font-bold text-amber-300 flex items-center justify-center gap-1.5 tracking-wider">
            <span>🪔</span>
            <span>SHRINGAAR & AARTI</span>
            <span>🪔</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/75 font-rozha">
            Sacred Om (ॐ) Aarti Darshan & Puja Samagri
          </p>
        </div>

        {/* Live Blessings Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-300">{blessingScore}</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. MAIN GANESHA SANCTUM SECTION: ONLY THE DIVINE IMAGE & FLOATING AARTI   */}
      {/* ========================================================================= */}
      <section 
        aria-label="Lord Ganesha Sanctum" 
        className="relative w-full max-w-[420px] aspect-square mx-auto my-3 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] bg-[#090408] flex items-center justify-center select-none"
      >
        {/* Divine Image loaded directly from the user-provided URL */}
        <img
          src={GANESHA_AARTI_IMAGE_URL}
          alt="Lord Ganesha Aarti Darshan"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain rounded-2xl select-none pointer-events-none"
          loading="eager"
        />

        {/* Sacred OM (ॐ) Trajectory Glow Overlay when Aarti is Active */}
        {isAartiActive && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80"
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="omGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.85" />
              </linearGradient>
              <filter id="omGlow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Golden Om path line */}
            <path
              ref={omPathRef}
              d={OM_PATH_DATA}
              fill="none"
              stroke="url(#omGoldGradient)"
              strokeWidth="4"
              strokeDasharray="9 7"
              filter="url(#omGlow)"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Floating Aarti Thali with Candles & Selected Items Moving on Om Symbol */}
        {isAartiActive && (
          <div
            style={{
              left: `${thaliPosition.x}%`,
              top: `${thaliPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 pointer-events-none transition-all duration-75 ease-linear filter drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]"
          >
            {/* The Brass Aarti Thali Plate */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-400 to-amber-600 p-1 border-2 border-yellow-200 shadow-2xl flex items-center justify-center">
              {/* Inner Concentric Brass Plate Ring */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-b from-amber-900 via-amber-950 to-amber-900 border border-amber-400/70 flex items-center justify-center overflow-hidden">
                {/* 5 Brass Candles/Diyas around the rim with dancing flickering flames */}
                {[0, 72, 144, 216, 288].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180;
                  const radius = 38; // px from center
                  const dx = Math.cos(rad) * radius;
                  const dy = Math.sin(rad) * radius;
                  return (
                    <div
                      key={i}
                      style={{
                        transform: `translate(${dx}px, ${dy}px)`,
                      }}
                      className="absolute flex flex-col items-center justify-center"
                    >
                      {/* Burning Diya Flame with Warm Glow */}
                      <span className="text-sm sm:text-base animate-pulse filter drop-shadow-[0_0_8px_#f59e0b]">
                        🪔
                      </span>
                    </div>
                  );
                })}

                {/* Central Pure Karpur (Camphor) Flame */}
                <div className="relative z-20 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl animate-bounce filter drop-shadow-[0_0_12px_#fbbf24]">
                    🔥
                  </span>
                  <span className="text-[7px] text-amber-200 font-cinzel font-bold leading-tight">ॐ</span>
                </div>

                {/* Miniature Visuals of Selected Items on the Plate */}
                <div className="absolute inset-2 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none opacity-90 scale-90">
                  {selectedItemsList.slice(0, 6).map((item) => (
                    <span key={item.id} className="text-[10px] drop-shadow filter" title={item.name}>
                      {item.thaliVisual.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Sacred Flower Shower Petals */}
        {showeringPetals && (
          <div className="absolute inset-0 pointer-events-none z-40 flex flex-wrap justify-around items-start overflow-hidden">
            {['🌺', '🌼', '🌸', '🌹', '🌿', '✨', '🌼', '🌺', '🌹', '✨', '🌸'].map((p, i) => (
              <span
                key={i}
                className="text-2xl animate-spin transition-transform"
                style={{
                  animationDuration: `${2.2 + (i % 4) * 0.4}s`,
                  transform: `translateY(${Math.random() * 20}px)`,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. OPTIMISED AARTI MATERIALS & PUJA SAMAGRI SECTION                       */}
      {/* ========================================================================= */}
      <section className="w-full max-w-xl my-2 bg-stone-900/80 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🪔</span>
            <div>
              <h2 className="font-cinzel text-xs sm:text-sm font-bold text-amber-300">
                AARTI MATERIALS & PUJA SAMAGRI
              </h2>
              <p className="text-[10px] text-amber-200/70">
                Select sacred offerings to place onto your divine Aarti Thali ({selectedItemIds.size} on Thali)
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={selectAll}
              className="px-2 py-1 text-[10px] font-semibold text-amber-300 hover:text-white rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 active:scale-95 cursor-pointer transition-all"
            >
              Select All
            </button>
            <button
              onClick={selectEssentials}
              className="px-2 py-1 text-[10px] font-semibold text-amber-300 hover:text-white rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 active:scale-95 cursor-pointer transition-all"
            >
              Essentials
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 text-[11px] scrollbar-none">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'lamps', label: 'Diyas & Fire' },
            { id: 'prasad', label: 'Bhog Sweets' },
            { id: 'flowers', label: 'Sacred Flowers' },
            { id: 'sacred_powders', label: 'Tilak Powders' },
            { id: 'auspicious', label: 'Auspicious' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.userInteracted();
                setActiveCategory(cat.id);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'bg-black/40 text-amber-200/80 hover:text-white border border-amber-500/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredMaterials.map((item) => {
            const isSelected = selectedItemIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`relative text-left p-2 rounded-xl border transition-all flex items-start gap-2 cursor-pointer active:scale-97 ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-black/35 border-amber-500/20 hover:border-amber-500/40 text-stone-400'
                }`}
              >
                <span className="text-xl sm:text-2xl shrink-0 mt-0.5">{item.icon}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-200' : 'text-stone-300'}`}>
                      {item.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[9px] text-amber-300/80 font-rozha leading-tight">
                    {item.sanskritName}
                  </div>
                  <div className="text-[8px] text-amber-200/60 leading-tight mt-0.5 line-clamp-1">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. "START AARTI" PROMINENT BUTTON & DEVOTIONAL CONTROLS                    */}
      {/* ========================================================================= */}
      <section className="w-full max-w-xl my-2 flex flex-col items-center gap-3">
        {/* Main "START AARTI" Button */}
        <button
          onClick={handleToggleAarti}
          className={`w-full py-3.5 px-6 rounded-2xl font-cinzel font-black text-sm sm:text-base tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xl active:scale-98 border-2 ${
            isAartiActive
              ? 'bg-gradient-to-r from-red-600 via-amber-500 to-orange-600 text-stone-950 border-amber-300 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]'
              : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border-yellow-200 hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.6)]'
          }`}
        >
          {isAartiActive ? (
            <>
              <Pause className="w-5 h-5 fill-stone-950" />
              <span>PAUSE AARTI</span>
              <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full font-sans font-bold text-amber-100">
                ॐ Parikrama #{parikramaCount}
              </span>
            </>
          ) : (
            <>
              <Flame className="w-5 h-5 fill-stone-950 text-stone-950 animate-bounce" />
              <span>START AARTI</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-sans font-semibold text-stone-900">
                Begin Sacred Om Darshan ॐ
              </span>
            </>
          )}
        </button>

        {/* Aarti Speed & Interactive Devotional Controls */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Speed Toggle */}
          <div className="col-span-2 sm:col-span-1 bg-black/40 border border-amber-500/30 rounded-xl p-1.5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-300 ml-1">Speed:</span>
            <div className="flex gap-1">
              {(['slow', 'medium', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    soundManager.userInteracted();
                    setAartiSpeed(s);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    aartiSpeed === s ? 'bg-amber-500 text-stone-950' : 'text-amber-200/70 hover:text-white'
                  }`}
                >
                  {s === 'slow' ? 'Slow' : s === 'medium' ? 'Classic' : 'Utsav'}
                </button>
              ))}
            </div>
          </div>

          {/* Action 1: Ring Bell */}
          <button
            onClick={triggerRingBell}
            className="py-2 px-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md transition-all"
          >
            <span>🔔</span>
            <span>RING BELL (+10)</span>
          </button>

          {/* Action 2: Blow Shankh */}
          <button
            onClick={triggerBlowShankh}
            className="py-2 px-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md transition-all"
          >
            <span>🐚</span>
            <span>SHANKH (+50)</span>
          </button>

          {/* Action 3: Flower Shower */}
          <button
            onClick={triggerFlowerShower}
            className="py-2 px-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md transition-all"
          >
            <span>🌺</span>
            <span>FLOWERS (+25)</span>
          </button>
        </div>
      </section>

      {/* Sacred Mantra Footer */}
      <footer className="w-full max-w-xl text-center py-2 text-[10px] sm:text-xs text-amber-200/80 font-rozha border-t border-amber-500/20 mt-2">
        "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ • निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा"
      </footer>
    </div>
  );
};
