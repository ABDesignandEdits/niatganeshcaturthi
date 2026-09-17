import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Trophy, 
  BookOpen, 
  Settings, 
  Info, 
  Sparkles, 
  Flame, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  ChevronDown,
  Compass,
  Scroll,
  Heart,
  Flower2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../audio/soundManager';
import { GANESHA_BACKGROUND_IMAGE_URL } from './three3d/PandalEnvironment';
import { 
  ModakIcon, 
  DiyaIcon, 
  HibiscusIcon, 
  DurvaIcon, 
  DholIcon, 
  ShankhIcon, 
  PandalIcon, 
  KalashIcon, 
  LaddooIcon, 
  MantraScrollIcon 
} from './icons/FestivalIcons';

interface MainMenuProps {
  onPlay: () => void;
  onPlayRangoli: () => void;
  onPlayModak: () => void;
  onPlayDhol: () => void;
  onPlayShringaar: () => void;
  onPlayEcoClay: () => void;
  onPlayMemory: () => void;
  onPlayModakTower: () => void;
  onPlayLaddooRush: () => void;
  onPlayVisarjanMiraj: () => void;
  onPlayGaneshaNames: () => void;
  onPlayDiyaMandala: () => void;
  onPlayDurvaPuja: () => void;
  onPlayPandalBuilder: () => void;
  onPlayGaneshaPuzzle: () => void;
  onOpenPandalViewer: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  highScore: number;
  isModalOpen?: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onPlayRangoli,
  onPlayModak,
  onPlayDhol,
  onPlayShringaar,
  onPlayEcoClay,
  onPlayMemory,
  onPlayModakTower,
  onPlayLaddooRush,
  onPlayVisarjanMiraj,
  onPlayGaneshaNames,
  onPlayDiyaMandala,
  onPlayDurvaPuja,
  onPlayPandalBuilder,
  onPlayGaneshaPuzzle,
  onOpenPandalViewer,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenAbout,
  highScore,
  isModalOpen = false,
}) => {
  const [activeSection, setActiveSection] = useState<'shrine' | 'games' | 'lore'>('shrine');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMuted, setIsMuted] = useState<boolean>(!soundManager.settings.soundEnabled);
  const [scrollY, setScrollY] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  const loreRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for progressive sticky header & dynamic background blur
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const currentY = scrollContainerRef.current.scrollTop;
    setScrollY(currentY);

    const gamesTop = gamesRef.current ? gamesRef.current.offsetTop - 200 : 600;
    const loreTop = loreRef.current ? loreRef.current.offsetTop - 200 : 1400;

    if (currentY >= loreTop) {
      setActiveSection('lore');
    } else if (currentY >= gamesTop) {
      setActiveSection('games');
    } else {
      setActiveSection('shrine');
    }
  };

  const scrollToSection = (target: 'shrine' | 'games' | 'lore') => {
    soundManager.userInteracted();
    soundManager.playCardFlip();
    if (target === 'shrine' && heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'games' && gamesRef.current) {
      gamesRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (target === 'lore' && loreRef.current) {
      loreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSound = () => {
    soundManager.userInteracted();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundManager.updateSettings({
      soundEnabled: !newMuted,
      musicEnabled: !newMuted,
    });
  };

  const handleStartPlay = () => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    onPlay();
  };

  const FESTIVAL_MINI_GAMES = [
    // 1. Creative Art & Rangoli
    {
      id: 'rangoli',
      title: 'Rangoli Utsav',
      desc: 'Sacred 8-fold symmetry, Kolam & powder art studio',
      icon: <HibiscusIcon className="w-7 h-7" />,
      category: 'art',
      tag: 'Creative Art',
      badgeColor: 'from-rose-600 to-pink-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playColorSprinkle();
        onPlayRangoli();
      },
    },
    // 2. Modak Rasoi
    {
      id: 'modak',
      title: 'Modak Rasoi',
      desc: 'Steaming prasad catch rush & master cooking arcade',
      icon: <ModakIcon className="w-7 h-7" />,
      category: 'sweets',
      tag: 'Fast Arcade',
      badgeColor: 'from-amber-600 to-yellow-600',
      action: () => {
        soundManager.userInteracted();
        soundManager.playModakCollect();
        onPlayModak();
      },
    },
    // 3. Modak Tower Stacker
    {
      id: 'modak_tower',
      title: 'Modak Tower Stacker',
      desc: 'Drop and balance 21 sacred prasad modaks on a golden thali',
      icon: <ModakIcon className="w-7 h-7" />,
      category: 'sweets',
      tag: 'Physics Stacker',
      badgeColor: 'from-yellow-600 to-amber-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playModakCollect();
        onPlayModakTower();
      },
    },
    // 4. Laddoo Rush
    {
      id: 'laddoo_rush',
      title: 'Laddoo Catch Rush',
      desc: 'Guide Mushak with golden basket catching falling motichoor treats',
      icon: <LaddooIcon className="w-7 h-7" />,
      category: 'sweets',
      tag: 'Prasad Catch',
      badgeColor: 'from-orange-600 to-amber-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playModakCollect();
        onPlayLaddooRush();
      },
    },
    // 5. Grand Visarjan Miraj
    {
      id: 'visarjan_miraj',
      title: 'Grand Visarjan Miraj',
      desc: 'Lead the holy procession van through lively Mumbai streets',
      icon: <ShankhIcon className="w-7 h-7" />,
      category: 'procession',
      tag: 'Holy Procession',
      badgeColor: 'from-red-600 to-amber-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playShankhCelebration();
        onPlayVisarjanMiraj();
      },
    },
    // 6. Dhol Tasha Pathak
    {
      id: 'dhol',
      title: 'Dhol Tasha Rhythm',
      desc: 'High-energy festive percussion beat matcher',
      icon: <DholIcon className="w-7 h-7" />,
      category: 'procession',
      tag: 'Rhythm Beats',
      badgeColor: 'from-red-600 to-amber-600',
      action: () => {
        soundManager.userInteracted();
        soundManager.playDholHit();
        onPlayDhol();
      },
    },
    // 7. Shringaar & Aarti
    {
      id: 'shringaar',
      title: 'Shringaar & Aarti',
      desc: 'Crown, pitambar, marigold garland & sacred camphor flame',
      icon: <DiyaIcon className="w-7 h-7" />,
      category: 'aarti',
      tag: 'Sacred Ritual',
      badgeColor: 'from-yellow-500 to-amber-600',
      action: () => {
        soundManager.userInteracted();
        soundManager.playTempleBell();
        onPlayShringaar();
      },
    },
    // 8. Diya Mandala Lighting
    {
      id: 'diya_mandala',
      title: 'Diya Mandala Lighting',
      desc: 'Light 108 oil lamps in sacred geometric yantra patterns',
      icon: <DiyaIcon className="w-7 h-7" />,
      category: 'aarti',
      tag: 'Deepam Yantra',
      badgeColor: 'from-amber-500 to-yellow-600',
      action: () => {
        soundManager.userInteracted();
        soundManager.playTempleBell();
        onPlayDiyaMandala();
      },
    },
    // 9. 21 Durva Patri Puja
    {
      id: 'durva_puja',
      title: '21 Durva Patri Puja',
      desc: 'Collect 21 sacred grass blades, bilva & lotus for the holy puja',
      icon: <DurvaIcon className="w-7 h-7" />,
      category: 'aarti',
      tag: 'Patri Offering',
      badgeColor: 'from-emerald-600 to-green-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playEcoItemCollect();
        onPlayDurvaPuja();
      },
    },
    // 10. Pandal Mandap Decorator
    {
      id: 'pandal_builder',
      title: 'Pandal Decorator',
      desc: 'Craft royal arches, fairy lights, drapes & floral torans',
      icon: <PandalIcon className="w-7 h-7" />,
      category: 'art',
      tag: 'Mandap Design',
      badgeColor: 'from-fuchsia-600 to-pink-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playPowerUp();
        onPlayPandalBuilder();
      },
    },
    // 11. Eco-Clay Murti Sculptor
    {
      id: 'clay',
      title: 'Eco-Clay Murti',
      desc: 'Shadu mati sculptor & sprouting tree seed visarjan',
      icon: <KalashIcon className="w-7 h-7" />,
      category: 'art',
      tag: 'Eco Workshop',
      badgeColor: 'from-emerald-600 to-teal-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playEcoItemCollect();
        onPlayEcoClay();
      },
    },
    // 12. Bhakti Memory Quest
    {
      id: 'memory',
      title: 'Bhakti Memory Quest',
      desc: 'Sacred symbols match & festival trivia lore',
      icon: <MantraScrollIcon className="w-7 h-7" />,
      category: 'wisdom',
      tag: 'Puzzle & Lore',
      badgeColor: 'from-purple-600 to-indigo-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playCardFlip();
        onPlayMemory();
      },
    },
    // 13. 108 Divine Names
    {
      id: 'ganesha_names',
      title: '108 Divine Names',
      desc: 'Discover holy names like Vakratunda, Lambodara & Ekadanta',
      icon: <MantraScrollIcon className="w-7 h-7" />,
      category: 'wisdom',
      tag: 'Divine Wisdom',
      badgeColor: 'from-indigo-600 to-blue-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playTempleBell();
        onPlayGaneshaNames();
      },
    },
    // 14. Divya Darshan Jigsaw
    {
      id: 'ganesha_puzzle',
      title: 'Divya Darshan Jigsaw',
      desc: 'Assemble holy mosaic tiles to reveal divine Ganesha darshan',
      icon: <PandalIcon className="w-7 h-7" />,
      category: 'wisdom',
      tag: 'Jigsaw Puzzle',
      badgeColor: 'from-amber-600 to-orange-700',
      action: () => {
        soundManager.userInteracted();
        soundManager.playCardFlip();
        onPlayGaneshaPuzzle();
      },
    },
  ];

  const categories = [
    { id: 'all', label: 'All Games', count: 14 },
    { id: 'sweets', label: 'Prasad & Sweets', count: 3 },
    { id: 'aarti', label: 'Aarti & Puja', count: 4 },
    { id: 'procession', label: 'Visarjan & Drums', count: 2 },
    { id: 'art', label: 'Art & Mandap', count: 3 },
    { id: 'wisdom', label: 'Wisdom & Puzzles', count: 2 },
  ];

  const filteredGames = selectedCategory === 'all'
    ? FESTIVAL_MINI_GAMES
    : FESTIVAL_MINI_GAMES.filter((g) => g.category === selectedCategory);

  // Dynamic background blur intensity based on scroll position
  const blurProgress = Math.min(scrollY / 500, 1);

  return (
    <div 
      className="relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col bg-[#060308] text-amber-50 select-none bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("${GANESHA_BACKGROUND_IMAGE_URL}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dynamic Defocus Blur Overlay behind options/content when scrolling */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-all duration-300"
        style={{
          backgroundColor: `rgba(6, 3, 8, ${blurProgress * 0.7})`,
          backdropFilter: `blur(${blurProgress * 16}px)`,
          WebkitBackdropFilter: `blur(${blurProgress * 16}px)`,
        }}
      />

      {/* 2. Apple-Style Intelligent Sticky Liquid Glass Header */}
      <header 
        className={`sticky top-0 z-40 w-full px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between safe-top apple-sticky-header ${
          scrollY > 25 ? 'scrolled' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 apple-liquid-glass px-3 py-1.5 rounded-full border border-amber-500/20">
            <DiyaIcon className="w-4 h-4 text-amber-400 animate-diya-glow" />
            <span className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-wider text-amber-200 uppercase">
              {scrollY > 150 ? 'Mushak Dash • Utsav' : 'Vinayaka Chaturthi Festival'}
            </span>
          </div>

          {highScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 apple-liquid-glass px-3 py-1.5 rounded-full border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-medium">Record:</span>
              <span className="font-outfit font-bold text-xs text-amber-300">{highScore.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 3D Pandal Darshan Quick Launcher */}
          <button
            onClick={() => {
              soundManager.userInteracted();
              soundManager.playTempleBell();
              onOpenPandalViewer();
            }}
            aria-label="Open 3D Pandal Walkthrough"
            className="apple-liquid-glass px-2.5 sm:px-3 py-1.5 rounded-full border border-amber-400/40 text-amber-200 hover:text-amber-100 hover:border-amber-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span className="font-cinzel text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200">
              3D Darshan
            </span>
          </button>

          {/* Audio Sound Toggle */}
          <button
            onClick={handleToggleSound}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
            className="w-9 h-9 rounded-full apple-liquid-glass border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-amber-100 hover:border-amber-400 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 3. Primary Smooth Scrollable Content Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain pb-28 sm:pb-32"
      >
        {/* SECTION A: Hero Shrine & Primary Pilgrimage Launch */}
        <section 
          ref={heroRef}
          className="min-h-[82vh] sm:min-h-[85vh] flex flex-col justify-between items-center px-4 sm:px-6 py-4 max-w-4xl mx-auto"
        >
          {/* Top Title Group */}
          <motion.div 
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center pt-3 sm:pt-6 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full apple-liquid-glass border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 liquid-sheen shadow-lg shadow-amber-950/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Divine 3D Pilgrimage & Games</span>
            </div>

            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
              MUSHAK DASH
            </h1>

            <p className="font-marcellus text-sm sm:text-lg md:text-xl text-amber-200/90 tracking-wide mt-1.5">
              A Grand Vinayaka Chaturthi Festival Adventure
            </p>

            <p className="font-outfit text-xs sm:text-sm text-amber-300/85 font-medium tracking-wide mt-2">
              Designed and Developed with ❤️ by AB Developers
            </p>
          </motion.div>

          {/* Bottom Primary Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md flex flex-col items-center gap-3 pt-8 pb-4"
          >
            {/* Primary Action Button with Apple-inspired physics */}
            <button
              id="enter-pilgrimage-btn"
              onClick={handleStartPlay}
              className="apple-glass-button w-full min-h-[52px] sm:min-h-[56px] px-6 py-3.5 rounded-2xl font-cinzel font-bold text-sm sm:text-base tracking-wider flex items-center justify-center gap-2.5 shadow-2xl shadow-amber-600/35 cursor-pointer active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current text-amber-200" />
              <span>ENTER PILGRIMAGE (PLAY RUNNER)</span>
            </button>

            {/* High-End Interactive 3D Pandal Walkthrough & Stage Viewer */}
            <button
              id="open-3d-pandal-btn"
              onClick={() => {
                soundManager.userInteracted();
                soundManager.playTempleBell();
                onOpenPandalViewer();
              }}
              className="apple-liquid-glass w-full min-h-[48px] sm:min-h-[52px] px-5 py-3 rounded-2xl font-cinzel font-bold text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2.5 border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-yellow-500/15 text-amber-100 hover:border-amber-300 hover:bg-amber-500/25 transition-all shadow-xl shadow-amber-950/40 cursor-pointer active:scale-[0.98] group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>EXPLORE 3D PANDAL (STAGE VIEWER)</span>
              <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 font-outfit uppercase tracking-wider text-amber-200">
                3D Walkthrough
              </span>
            </button>

            {/* Secondary Action: Smooth Scroll to 14 Games Pavilion */}
            <button
              id="explore-games-btn"
              onClick={() => scrollToSection('games')}
              className="glass-button-secondary w-full min-h-[46px] px-5 py-2.5 rounded-2xl font-outfit font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <PandalIcon className="w-4 h-4 text-amber-400" />
              <span>EXPLORE 14 FESTIVAL MINI-GAMES</span>
              <ChevronDown className="w-4 h-4 text-amber-400 animate-bounce" />
            </button>
          </motion.div>
        </section>

        {/* SECTION B: Apple-Style Dynamic Blur Zone behind 14 Festival Games Pavilion */}
        <section 
          ref={gamesRef}
          className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 scroll-mt-20"
        >
          {/* Entire Group wrapped inside dedicated Apple Backdrop Zone */}
          <div className="apple-backdrop-zone apple-glass-reflection rounded-3xl p-4 sm:p-7 border border-amber-500/25">
            {/* Pavilion Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-4 border-b border-amber-500/20">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-level-1 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  <PandalIcon className="w-3.5 h-3.5" />
                  <span>Interactive Utsav Pavilion</span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-amber-100">
                  14 Sacred Festival Mini-Games
                </h2>
                <p className="text-xs sm:text-sm text-amber-200/75 mt-0.5">
                  Authentic celebrations crafted with sacred traditions • Tap any game to start
                </p>
              </div>

              {/* Scroll back to shrine button */}
              <button
                onClick={() => scrollToSection('shrine')}
                className="self-start sm:self-auto glass-button-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Top 3D Altar</span>
              </button>
            </div>

            {/* Apple-Style Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.userInteracted();
                      setSelectedCategory(cat.id);
                    }}
                    className={`relative px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                      isActive
                        ? 'glass-active text-amber-950 font-bold scale-[1.02]'
                        : 'glass-tab text-amber-200/80 hover:text-amber-100'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-amber-950/30 text-amber-950' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Liquid Glass Game Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredGames.map((game, idx) => (
                <motion.button
                  key={game.id}
                  onClick={game.action}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (idx % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group apple-glass-card apple-glass-reflection p-3.5 sm:p-4 rounded-2xl text-left flex flex-col justify-between cursor-pointer min-h-[155px] sm:min-h-[170px] box-border relative overflow-hidden"
                >
                  <div>
                    {/* Header: Icon & Category Badge */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="p-1.5 rounded-xl apple-liquid-glass border border-amber-500/30 group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
                        {game.icon}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${game.badgeColor} shadow-md shrink-0`}>
                        {game.tag}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-amber-100 group-hover:text-amber-200 transition-colors leading-snug">
                      {game.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-200/70 mt-1 leading-relaxed line-clamp-2">
                      {game.desc}
                    </p>
                  </div>

                  {/* Action Link Footer */}
                  <div className="mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-400 group-hover:text-amber-200 transition-colors">
                    <span>Play Experience</span>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION C: Apple-Style Festival Lore & Pilgrimage Traditions Showcase */}
        <section 
          ref={loreRef}
          className="max-w-5xl mx-auto px-3.5 sm:px-6 py-6 mb-8 scroll-mt-20"
        >
          <div className="apple-backdrop-zone rounded-3xl p-4 sm:p-7 border border-amber-500/25">
            <div className="mb-5 pb-3 border-b border-amber-500/20">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-level-1 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <Scroll className="w-3.5 h-3.5" />
                <span>Sacred Festival Lore</span>
              </div>
              <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-amber-100">
                Traditions of Vinayaka Chaturthi
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/75 mt-0.5">
                The divine significance behind Lord Ganesha, Mushak Maharaj & the sacred pilgrimage
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Lore Card 1 */}
              <div className="apple-liquid-glass p-4 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-amber-200">Mushak Maharaj (Divine Vahan)</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Mushak signifies humility, sharp intellect, and the ability to conquer obstacles unseen. By riding a tiny mouse, the Lord teaches that no ego or obstacle is insurmountable with faith.
                </p>
              </div>

              {/* Lore Card 2 */}
              <div className="apple-liquid-glass p-4 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Flower2 className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-amber-200">21 Modaks & Durva Grass</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Modak represents supreme joy (ananda) and inner wisdom, while 21 blades of sacred Durva grass symbolize cooling peace and total devotion offered to the Ganapati.
                </p>
              </div>

              {/* Lore Card 3 */}
              <div className="apple-liquid-glass p-4 rounded-2xl border border-amber-500/20 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-amber-200">Eco-Friendly Visarjan</h4>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  Embracing 100% natural Shadu clay murtis embedded with tulsi and flowering seeds ensures that the immersion returns harmoniously to Mother Nature as new life.
                </p>
              </div>
            </div>
          </div>

          {/* Dedicated Developer Attribution in Lore Footer */}
          <div className="text-center pt-8 pb-3">
            <p className="text-xs sm:text-sm text-amber-300/80 font-outfit font-medium">
              Designed and Developed with ❤️ by <span className="text-amber-300 font-bold">AB Developers</span>
            </p>
          </div>
        </section>
      </div>

      {/* 4. Apple-Inspired Floating Liquid Glass Dock (Bottom Navigation - hidden when modal is open) */}
      {!isModalOpen && (
        <nav 
          aria-label="Festival Navigation Dock"
          className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] sm:w-[92%] max-w-xl apple-glass-dock rounded-2xl sm:rounded-3xl px-1 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between safe-bottom box-border shadow-2xl"
        >
          {/* Dock Item 1: 3D Shrine */}
          <button
            id="dock-hero-btn"
            onClick={() => scrollToSection('shrine')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
              activeSection === 'shrine' ? 'text-amber-300 font-bold bg-amber-500/15 ring-1 ring-amber-400/30' : 'text-amber-300/65 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">Shrine</span>
          </button>

          {/* Dock Item 2: 14 Games Pavilion */}
          <button
            id="dock-games-btn"
            onClick={() => scrollToSection('games')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
              activeSection === 'games' ? 'text-amber-300 font-bold bg-amber-500/15 ring-1 ring-amber-400/30' : 'text-amber-300/65 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <PandalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-current" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">
              <span className="hidden sm:inline">14 </span>Games
            </span>
          </button>

          {/* Dock Item 3: Lore */}
          <button
            id="dock-lore-btn"
            onClick={() => scrollToSection('lore')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
              activeSection === 'lore' ? 'text-amber-300 font-bold bg-amber-500/15 ring-1 ring-amber-400/30' : 'text-amber-300/65 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">Lore</span>
          </button>

          {/* Divider */}
          <div className="h-4 sm:h-5 w-[1px] bg-amber-500/30 my-auto shrink-0 mx-0.5 sm:mx-1" />

          {/* Dock Item 4: Leaderboard Scores */}
          <button
            id="dock-leaderboard-btn"
            onClick={() => {
              soundManager.userInteracted();
              onOpenLeaderboard();
            }}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl text-amber-300/65 hover:text-amber-200 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">Scores</span>
          </button>

          {/* Dock Item 5: How to Play Guide */}
          <button
            id="dock-guide-btn"
            onClick={() => {
              soundManager.userInteracted();
              onOpenHowToPlay();
            }}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl text-amber-300/65 hover:text-amber-200 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">Guide</span>
          </button>

          {/* Dock Item 6: Settings */}
          <button
            id="dock-settings-btn"
            onClick={() => {
              soundManager.userInteracted();
              onOpenSettings();
            }}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl text-amber-300/65 hover:text-amber-200 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">Settings</span>
          </button>

          {/* Dock Item 7: About */}
          <button
            id="dock-about-btn"
            onClick={() => {
              soundManager.userInteracted();
              onOpenAbout();
            }}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 px-0.5 sm:px-1.5 py-1 sm:py-1.5 rounded-xl text-amber-300/65 hover:text-amber-200 hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] uppercase font-cinzel font-semibold tracking-tight sm:tracking-wider truncate max-w-full leading-tight select-none text-center">About</span>
          </button>
        </nav>
      )}
    </div>
  );
};
