import React from 'react';
import { ArrowRight, Sparkles, Heart, Shield, Zap } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl festival-glass rounded-2xl p-6 border border-amber-500/40 text-amber-50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 mb-2">
            <span className="text-2xl">🐭</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-300">
            How to Play Mushak Dash
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-rozha">
            Help Mushak prepare for Lord Ganesha&apos;s holy festival!
          </p>
        </div>

        {/* 4 Core Steps Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="flex items-start gap-3 bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="text-2xl p-1.5 bg-amber-500/10 rounded-lg">🥟</div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">1. Collect Festival Offerings</h4>
              <p className="text-xs text-amber-100/70 mt-0.5">
                Gather Modaks (+10), Flowers (+5), Durva (+8), and glowing Diyas (+15).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="text-2xl p-1.5 bg-amber-500/10 rounded-lg">🧺</div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">2. Avoid Obstacles</h4>
              <p className="text-xs text-amber-100/70 mt-0.5">
                Jump or slide past flower baskets, festival boxes, and carts. Watch out — hitting an obstacle triggers Game Over! (Pick up Divine Blessing to shield yourself).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="text-2xl p-1.5 bg-amber-500/10 rounded-lg">⚡</div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">3. Build Your Combo</h4>
              <p className="text-xs text-amber-100/70 mt-0.5">
                Collect consecutive items without misses for x2, x3, up to x5+ score multipliers!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="text-2xl p-1.5 bg-amber-500/10 rounded-lg">🪔</div>
            <div>
              <h4 className="font-bold text-sm text-amber-300">4. Complete 5 Stages</h4>
              <p className="text-xs text-amber-100/70 mt-0.5">
                From morning street to the grand sunset Visarjan procession at the river!
              </p>
            </div>
          </div>
        </div>

        {/* Controls Guide */}
        <div className="bg-amber-900/30 rounded-xl p-3.5 border border-amber-400/20 mb-5">
          <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-2 text-center">
            Controls
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg">
              <span className="text-amber-200/80">Jump</span>
              <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                SPACE / UP / TAP
              </span>
            </div>
            <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg">
              <span className="text-amber-200/80">Slide</span>
              <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                DOWN / SWIPE
              </span>
            </div>
            <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg">
              <span className="text-amber-200/80">Steer</span>
              <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                LEFT / RIGHT
              </span>
            </div>
            <div className="flex items-center justify-between bg-black/30 px-3 py-2 rounded-lg">
              <span className="text-amber-200/80">Pause</span>
              <span className="font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                ESC
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="close-tutorial-btn"
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl border border-amber-500/30 text-amber-200 hover:bg-amber-900/40 text-sm font-semibold cursor-pointer transition-all"
          >
            Back to Menu
          </button>
          <button
            id="start-dash-btn"
            onClick={handleStart}
            className="festival-button w-2/3 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>START DASH</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
