import React from 'react';
import { Trophy, Star, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { StageConfig } from '../types';
import { ECO_MESSAGES } from '../game/constants';
import { soundManager } from '../audio/soundManager';
import { ShankhIcon, MantraScrollIcon } from './icons/FestivalIcons';

interface StageClearModalProps {
  stage: StageConfig;
  score: number;
  ecoScore: number;
  maxCombo: number;
  onTakeQuiz: () => void;
  onNextStage: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  stage,
  score,
  ecoScore,
  maxCombo,
  onTakeQuiz,
  onNextStage,
}) => {
  const isEcoStage = stage.isEcoStage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="stage-clear-title"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/40 text-amber-50 shadow-2xl text-center max-h-[92dvh] overflow-y-auto overscroll-contain box-border"
      >
        {/* Auspicious Shankh Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full apple-liquid-glass border-2 border-amber-400/50 mb-3 shadow-lg">
          <ShankhIcon className="w-8 h-8 text-amber-300" />
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-bold px-3 py-1 rounded-full apple-liquid-glass border border-amber-400/30 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage Clear</span>
        </div>

        <h2 id="stage-clear-title" className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-200">
          {stage.title}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-marcellus">
          {stage.subtitle}
        </p>

        {/* 3 Gold Stars Rating */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((star) => (
            <Star key={star} className="w-7 h-7 fill-amber-400 text-amber-400 animate-pulse" />
          ))}
        </div>

        {/* Eco Friendly Message on Stage 4 */}
        {isEcoStage && (
          <div className="my-3 p-3 apple-glass-card border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-left text-xs text-emerald-200">
            <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
            <p>{ECO_MESSAGES[Math.floor(Math.random() * ECO_MESSAGES.length)]}</p>
          </div>
        )}

        {/* Stage Stats Summary */}
        <div className="grid grid-cols-3 gap-2 my-3.5 text-center">
          <div className="apple-glass-card p-2.5 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300/70 uppercase block font-semibold">Total Score</span>
            <span className="font-outfit font-black text-base sm:text-lg text-amber-300">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="apple-glass-card p-2.5 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300/70 uppercase block font-semibold">Max Combo</span>
            <span className="font-outfit font-black text-base sm:text-lg text-amber-300">
              {maxCombo}x
            </span>
          </div>

          <div className="apple-glass-card p-2.5 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-emerald-400/80 uppercase block font-semibold">Eco Score</span>
            <span className="font-outfit font-black text-base sm:text-lg text-emerald-300">
              +{ecoScore}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5">
          <button
            id="stage-clear-quiz-btn"
            onClick={() => {
              soundManager.userInteracted();
              onTakeQuiz();
            }}
            className="glass-button-secondary w-full sm:w-1/2 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MantraScrollIcon className="w-4 h-4 text-amber-400" />
            <span>BONUS TRIVIA (+100)</span>
          </button>

          <button
            id="stage-clear-next-btn"
            onClick={() => {
              soundManager.userInteracted();
              soundManager.playPowerUp();
              onNextStage();
            }}
            className="apple-glass-button w-full sm:w-1/2 py-3 rounded-xl font-cinzel font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 active:scale-[0.98]"
          >
            <span>CONTINUE PILGRIMAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
