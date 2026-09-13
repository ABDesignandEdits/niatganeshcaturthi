import React, { useEffect } from 'react';
import { ArrowRight, X, Sparkles, Smartphone, Keyboard, Shield } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface TutorialModalProps {
  onStartGame: () => void;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onStartGame, onClose }) => {
  const handleStart = () => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    onStartGame();
  };

  // Keyboard shortcut: Enter or Space starts game, Esc closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleStart();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-md flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-auto festival-glass rounded-2xl sm:rounded-3xl border border-amber-500/50 text-amber-50 shadow-2xl flex flex-col max-h-[92vh] max-h-[92dvh] overflow-hidden">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-stone-950/90 sm:bg-amber-950/90 backdrop-blur-md px-4 sm:px-6 pt-3 pb-2.5 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              🐭
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-amber-300 leading-tight">
                How to Play Mushak Dash
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/80 font-rozha">
                Help Mushak prepare for Lord Ganesha&apos;s holy festival!
              </p>
            </div>
          </div>

          <button
            id="close-tutorial-x-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto overscroll-contain px-4 sm:px-6 py-3 space-y-3 flex-1 text-xs text-amber-100/90 leading-relaxed">
          {/* 4 Core Steps Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex items-start gap-2.5 bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
              <div className="text-xl p-1 bg-amber-500/10 rounded-lg shrink-0">🥟</div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-300">1. Collect Offerings</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">
                  Gather Modaks (+10), Flowers (+5), Durva (+8), and glowing Diyas (+15).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
              <div className="text-xl p-1 bg-amber-500/10 rounded-lg shrink-0">🧺</div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-300">2. Avoid Obstacles</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">
                  Jump or slide past festive baskets, boxes, and carts. Grab Divine Blessings for a protective shield!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
              <div className="text-xl p-1 bg-amber-500/10 rounded-lg shrink-0">⚡</div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-300">3. Build Combo</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">
                  Collect consecutive items without missing to multiply your score up to x5!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-amber-950/60 p-3 rounded-xl border border-amber-500/20">
              <div className="text-xl p-1 bg-amber-500/10 rounded-lg shrink-0">🪔</div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-amber-300">4. Reach Lord Ganesha</h4>
                <p className="text-[11px] text-amber-100/70 mt-0.5">
                  Run 30m across holy stages to present offerings at Lord Ganesha&apos;s sacred shrine!
                </p>
              </div>
            </div>
          </div>

          {/* Smartphone & Touch Controls Section */}
          <div className="bg-amber-900/40 rounded-xl p-3 border border-amber-400/30">
            <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase tracking-wider font-cinzel">Smartphone & Touch Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-black/40 p-2 rounded-lg border border-amber-500/20 flex flex-col">
                <span className="text-amber-200/80 font-medium">⬆ Swipe Up or Tap</span>
                <span className="text-amber-300 font-bold mt-0.5">JUMP over obstacles</span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-amber-500/20 flex flex-col">
                <span className="text-amber-200/80 font-medium">⬇ Swipe Down</span>
                <span className="text-orange-300 font-bold mt-0.5">SLIDE under barriers</span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-amber-500/20 flex flex-col">
                <span className="text-amber-200/80 font-medium">◀ Swipe Left or ◀ Button</span>
                <span className="text-amber-300 font-bold mt-0.5">STEER to left lane</span>
              </div>
              <div className="bg-black/40 p-2 rounded-lg border border-amber-500/20 flex flex-col">
                <span className="text-amber-200/80 font-medium">▶ Swipe Right or ▶ Button</span>
                <span className="text-amber-300 font-bold mt-0.5">STEER to right lane</span>
              </div>
            </div>
            <p className="text-[10px] text-amber-300/80 mt-2 text-center italic">
              💡 Tip: On-screen buttons (◀ ▶ ⬇ ⬆) are enabled for smartphones! Toggle with the 🎮 button anytime.
            </p>
          </div>

          {/* Keyboard Reference for PC / Laptop */}
          <div className="bg-amber-950/40 rounded-xl p-2.5 border border-amber-500/20 flex items-center justify-between text-[11px] text-amber-200/70">
            <span className="flex items-center gap-1.5 font-medium">
              <Keyboard className="w-3.5 h-3.5 text-amber-400" />
              Keyboard:
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/20 text-amber-300">SPACE/↑ Jump</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/20 text-amber-300">↓ Slide</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded border border-amber-400/20 text-amber-300">← → Steer</span>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer - ALWAYS 100% VISIBLE ON SCREEN */}
        <div className="sticky bottom-0 z-20 w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-stone-950/95 sm:bg-amber-950/95 backdrop-blur-md border-t border-amber-500/40 flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            id="close-tutorial-btn"
            onClick={onClose}
            className="w-1/3 min-h-[44px] py-2.5 rounded-xl border border-amber-500/40 text-amber-200 hover:bg-amber-900/40 text-xs sm:text-sm font-semibold cursor-pointer transition-all active:scale-95"
          >
            Back
          </button>
          <button
            id="start-dash-btn"
            onClick={handleStart}
            className="festival-button w-2/3 min-h-[48px] py-2.5 sm:py-3 rounded-xl font-outfit font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-xl shadow-amber-500/30"
          >
            <span>START DASH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
