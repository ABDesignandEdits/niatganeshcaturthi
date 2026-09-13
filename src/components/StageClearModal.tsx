import React from 'react';
import { Trophy, Star, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import { StageConfig } from '../types';
import { ECO_MESSAGES } from '../game/constants';
import { soundManager } from '../audio/soundManager';

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
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg my-auto festival-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/40 text-amber-50 shadow-2xl text-center max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        {/* Auspicious Shankh & Garland Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/50 mb-3 animate-bounce">
          <span className="text-3xl">🐚</span>
        </div>

        <div className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-amber-300 font-bold px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage Clear</span>
        </div>

        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-200">
          {stage.title}
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 mt-1 font-rozha">
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
          <div className="my-3 bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-xl flex items-center gap-2.5 text-left">
            <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-100">
              <p className="font-bold text-emerald-300">Eco-Friendly Celebration Blessing</p>
              <p className="italic">{ECO_MESSAGES[1]}</p>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">{ECO_MESSAGES[0]}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Current Score</span>
            <span className="font-outfit font-black text-base sm:text-lg text-amber-300">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Max Combo</span>
            <span className="font-outfit font-black text-base sm:text-lg text-amber-300">
              x{maxCombo}
            </span>
          </div>

          <div className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-emerald-400 block">Eco Score</span>
            <span className="font-outfit font-black text-base sm:text-lg text-emerald-400">
              {ecoScore}
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
            className="w-full sm:w-1/2 py-3 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-900/40 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span>📜 BONUS TRIVIA (+100)</span>
          </button>

          <button
            id="stage-clear-next-btn"
            onClick={() => {
              soundManager.userInteracted();
              soundManager.playPowerUp();
              onNextStage();
            }}
            className="festival-button w-full sm:w-1/2 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>NEXT STAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
