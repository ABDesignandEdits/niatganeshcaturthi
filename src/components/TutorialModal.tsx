import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Smartphone,
  Keyboard,
  Shield,
  Zap,
  Gamepad2,
  Trophy,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../audio/soundManager';
import { MushakImage } from './MushakImage';
import { GaneshaImage } from './GaneshaImage';
import { 
  ModakIcon, 
  DiyaIcon, 
  HibiscusIcon, 
  DurvaIcon, 
  DholIcon, 
  ShankhIcon, 
  PandalIcon, 
  LaddooIcon 
} from './icons/FestivalIcons';

interface TutorialModalProps {
  onStartGame: () => void;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onStartGame, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const TOTAL_PAGES = 3;

  const handleStart = () => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    onStartGame();
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > TOTAL_PAGES || page === currentPage) return;
    soundManager.userInteracted();
    soundManager.playCardFlip();
    setSlideDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < TOTAL_PAGES) {
      goToPage(currentPage + 1);
    } else {
      handleStart();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    } else {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && currentPage < TOTAL_PAGES) {
        handleNext();
      } else if (deltaX > 0 && currentPage > 1) {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (currentPage < TOTAL_PAGES) goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentPage > 1) goToPage(currentPage - 1);
      } else if (e.key === 'Enter') {
        if (currentPage === TOTAL_PAGES) {
          handleStart();
        } else {
          goToPage(currentPage + 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.16, ease: 'easeIn' },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl border border-amber-500/40 text-amber-50 shadow-2xl h-[94dvh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden box-border"
      >
        {/* Modal Header */}
        <header className="sticky top-0 z-20 glass-level-1 px-4 sm:px-6 pt-3.5 pb-2.5 border-b border-amber-500/30 flex flex-col shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-level-2 border border-amber-400/60 p-1 flex items-center justify-center shrink-0">
                <MushakImage className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              </div>
              <div>
                <h2 id="tutorial-modal-title" className="font-cinzel text-sm sm:text-lg font-bold text-amber-300 leading-tight">
                  How to Play Mushak Dash
                </h2>
                <p className="text-[10px] sm:text-xs text-amber-200/80 font-marcellus">
                  Sacred Pilgrimage Guide & Controls
                </p>
              </div>
            </div>

            <button
              id="close-tutorial-x-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full glass-level-2 border border-amber-400/40 text-amber-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Step Interactive Page Tabs Bar */}
          <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2 border-t border-amber-500/20">
            <button
              onClick={() => goToPage(1)}
              className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                currentPage === 1
                  ? 'glass-active shadow-sm'
                  : 'glass-tab'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/30 text-[9px] flex items-center justify-center font-bold">1</span>
              <span className="truncate">Pilgrimage</span>
            </button>

            <button
              onClick={() => goToPage(2)}
              className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                currentPage === 2
                  ? 'glass-active shadow-sm'
                  : 'glass-tab'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/30 text-[9px] flex items-center justify-center font-bold">2</span>
              <span className="truncate">Controls</span>
            </button>

            <button
              onClick={() => goToPage(3)}
              className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border ${
                currentPage === 3
                  ? 'glass-active shadow-sm'
                  : 'glass-tab'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-amber-500/30 text-[9px] flex items-center justify-center font-bold">3</span>
              <span className="truncate">Mini-Games</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Body with Smooth Page Transitions */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 sm:px-6 py-3 text-xs text-amber-100/90 leading-relaxed scrollbar-thin select-none"
        >
          <AnimatePresence mode="wait" custom={slideDirection}>
            {/* PAGE 1: PILGRIMAGE BASICS & OFFERINGS */}
            {currentPage === 1 && (
              <motion.div
                key="page-1"
                custom={slideDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-500/20">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Step 1 of 3: Pilgrimage & Sacred Offerings
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Swipe ➔</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-start gap-2.5 glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                    <div className="p-1.5 glass-level-1 rounded-lg shrink-0">
                      <ModakIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">1. Collect Sacred Offerings</h4>
                      <p className="text-[11px] text-amber-100/70 mt-0.5 leading-snug">
                        Modaks (+10 pts), Red Jaswand (+5 pts), Durva Grass (+8 pts), and Diyas (+15 pts).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                    <div className="p-1.5 glass-level-1 rounded-lg shrink-0">
                      <Shield className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">2. Avoid Street Obstacles</h4>
                      <p className="text-[11px] text-amber-100/70 mt-0.5 leading-snug">
                        Jump over street crates and slide smoothly under overhead decorative floral garlands.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                    <div className="p-1.5 glass-level-1 rounded-lg shrink-0">
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">3. Build Sacred Combos</h4>
                      <p className="text-[11px] text-amber-100/70 mt-0.5 leading-snug">
                        Gather consecutive offerings without missing to multiply your devotional score up to 5x!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                    <div className="p-1.5 glass-level-1 rounded-lg shrink-0 flex items-center justify-center">
                      <GaneshaImage className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">4. Reach Divine Shrine</h4>
                      <p className="text-[11px] text-amber-100/70 mt-0.5 leading-snug">
                        Complete milestones across 5 pilgrimage stages to present your offerings before Lord Ganesha!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pilgrimage Stages Overview */}
                <div className="glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                  <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold mb-1.5 font-cinzel">
                    <span>5 Sacred Pilgrimage Stages</span>
                    <span className="text-[10px] text-amber-400/80">30m Milestones</span>
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10px] text-center">
                    <span className="flex-1 glass-level-1 py-1 rounded border border-amber-500/20 text-amber-200">1. Village</span>
                    <span className="text-amber-500">➔</span>
                    <span className="flex-1 glass-level-1 py-1 rounded border border-amber-500/20 text-amber-200">2. River Ghat</span>
                    <span className="text-amber-500">➔</span>
                    <span className="flex-1 glass-level-1 py-1 rounded border border-amber-500/20 text-amber-200">3. Bazaar</span>
                    <span className="text-amber-500">➔</span>
                    <span className="flex-1 glass-level-1 py-1 rounded border border-amber-500/20 text-amber-200">4. Temple</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAGE 2: CONTROLS & GESTURES */}
            {currentPage === 2 && (
              <motion.div
                key="page-2"
                custom={slideDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-500/20">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    Step 2 of 3: Smartphone & Keyboard Controls
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-mono">Swipe ➔</span>
                </div>

                {/* Smartphone Touch Gestures */}
                <div className="glass-level-2 rounded-xl p-3 border border-amber-400/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      Mobile Touch & Swipe Gestures
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold">
                      Responsive
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-200/80 font-medium">
                        <span>Swipe Up / Tap</span>
                        <MoveUp className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-amber-300 font-bold mt-1 text-xs">JUMP over obstacles</span>
                    </div>

                    <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-200/80 font-medium">
                        <span>Swipe Down</span>
                        <MoveDown className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-orange-300 font-bold mt-1 text-xs">SLIDE under barriers</span>
                    </div>

                    <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-200/80 font-medium">
                        <span>Swipe Left</span>
                        <MoveLeft className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-amber-300 font-bold mt-1 text-xs">STEER to left lane</span>
                    </div>

                    <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-amber-200/80 font-medium">
                        <span>Swipe Right</span>
                        <MoveRight className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-amber-300 font-bold mt-1 text-xs">STEER to right lane</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-200/80 mt-2 text-center glass-level-1 py-1.5 px-2 rounded-lg border border-amber-500/20">
                    <strong>On-Screen D-Pad Buttons:</strong> You can toggle on-screen arrow buttons anytime during the run using the gamepad button.
                  </p>
                </div>

                {/* PC / Laptop Keyboard Shortcuts */}
                <div className="glass-level-2 rounded-xl p-2.5 border border-amber-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                    <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                    <span>PC & Laptop Controls</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-center">
                    <div className="glass-level-1 p-1.5 rounded border border-amber-400/20 text-amber-200">
                      <span className="block font-bold text-amber-400">SPACE / ↑</span>
                      <span>Jump</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-400/20 text-amber-200">
                      <span className="block font-bold text-amber-400">↓ ARROW</span>
                      <span>Slide</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-400/20 text-amber-200">
                      <span className="block font-bold text-amber-400">← / →</span>
                      <span>Switch Lane</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PAGE 3: 14 MINI-GAMES & POWER-UPS */}
            {currentPage === 3 && (
              <motion.div
                key="page-3"
                custom={slideDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-3"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-500/20">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Step 3 of 3: Divine Power-Ups & 14 Mini-Games
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Ready to Play!</span>
                </div>

                {/* Divine Power-Ups */}
                <div className="glass-level-2 p-2.5 rounded-xl border border-amber-500/20">
                  <h4 className="font-bold text-xs text-amber-300 mb-1.5 flex items-center gap-1.5 font-cinzel">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Divine Blessings & Pickups
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                    <div className="glass-level-1 p-2 rounded-lg border border-amber-500/20 text-center">
                      <Shield className="w-5 h-5 text-amber-400 mx-auto mb-0.5" />
                      <strong className="text-amber-300 block">Kavach Shield</strong>
                      <span className="text-amber-200/70 text-[9px]">Absorbs collision</span>
                    </div>
                    <div className="glass-level-1 p-2 rounded-lg border border-amber-500/20 text-center">
                      <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-0.5" />
                      <strong className="text-amber-300 block">Prasad Magnet</strong>
                      <span className="text-amber-200/70 text-[9px]">Attracts modaks</span>
                    </div>
                    <div className="glass-level-1 p-2 rounded-lg border border-amber-500/20 text-center">
                      <Sparkles className="w-5 h-5 text-amber-300 mx-auto mb-0.5" />
                      <strong className="text-amber-300 block">Eco Points</strong>
                      <span className="text-amber-200/70 text-[9px]">Devotional bonus</span>
                    </div>
                  </div>
                </div>

                {/* 14 Festival Games Pavilion Spotlight */}
                <div className="glass-level-2 p-2.5 rounded-xl border border-amber-400/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5 font-cinzel">
                      <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                      14 Authentic Festival Mini-Games
                    </h4>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
                      Pavilion
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-amber-200/90">
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <ModakIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Modak Stacker</strong> (21 prasad modaks)</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <LaddooIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Laddoo Rush</strong> (Rapid tap frenzy)</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <DholIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Visarjan Miraj</strong> (Procession beats)</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <DiyaIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Diya Mandala</strong> (21 sacred lamps)</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <DurvaIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Durva Puja</strong> (Sacred offerings)</span>
                    </div>
                    <div className="glass-level-1 p-1.5 rounded border border-amber-500/20 flex items-center gap-1.5">
                      <PandalIcon className="w-4 h-4 shrink-0" />
                      <span><strong>Pandal Decorator</strong> (Lalbaug darbar)</span>
                    </div>
                  </div>
                </div>

                {/* Cultural Lore & Devotional Note */}
                <div className="glass-level-2 p-2 rounded-xl border border-amber-500/20 text-[10px] text-amber-200/80 flex items-center gap-2">
                  <HibiscusIcon className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>
                    <strong>Lord Ganesha is the Divine Goal:</strong> In accordance with sacred devotion, Lord Ganesha is never an obstacle. Mushak joyfully presents holy offerings at His divine shrine!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky Action Footer */}
        <footer className="sticky bottom-0 z-20 w-full px-3.5 sm:px-6 py-2.5 sm:py-3 glass-level-1 border-t border-amber-500/40 flex flex-col gap-1.5 shrink-0 box-border safe-bottom">
          <div className="flex items-center justify-between gap-2.5">
            {/* Left Button */}
            <button
              id="tutorial-prev-btn"
              onClick={handlePrev}
              className="glass-button-secondary px-3 sm:px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold cursor-pointer flex items-center gap-1 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentPage === 1 ? 'Exit' : 'Prev'}</span>
            </button>

            {/* Center: Page Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                    currentPage === page
                      ? 'w-5 sm:w-6 bg-amber-400 shadow-md shadow-amber-400/50'
                      : 'w-2 sm:w-2.5 bg-amber-500/30 hover:bg-amber-500/60'
                  }`}
                  aria-label={`Go to page ${page}`}
                />
              ))}
            </div>

            {/* Right Button */}
            {currentPage < TOTAL_PAGES ? (
              <button
                id="tutorial-next-page-btn"
                onClick={handleNext}
                className="glass-button flex-1 min-h-[44px] py-2 px-3 sm:px-4 rounded-xl font-cinzel font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/30"
              >
                <span>{currentPage === 1 ? 'Next: Controls' : 'Next: Mini-Games'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="start-dash-btn"
                onClick={handleStart}
                className="glass-button flex-1 min-h-[46px] py-2.5 px-3 sm:px-4 rounded-xl font-cinzel font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-500/40"
              >
                <span>START DASH NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick skip */}
          {currentPage < TOTAL_PAGES && (
            <div className="flex items-center justify-center pt-0.5">
              <button
                id="skip-to-start-btn"
                onClick={handleStart}
                className="text-[11px] text-amber-300/80 hover:text-amber-200 underline font-medium cursor-pointer transition-colors"
              >
                Skip tutorial & Start Dash ➔
              </button>
            </div>
          )}
        </footer>
      </motion.div>
    </div>
  );
};
