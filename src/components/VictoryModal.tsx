import React, { useState } from 'react';
import { Trophy, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { getHighScore, addLeaderboardEntry } from '../storage/storage';
import { soundManager } from '../audio/soundManager';
import { GaneshaDarshanCanvas } from './GaneshaDarshanCanvas';
import { GaneshaImage } from './GaneshaImage';
import { MushakImage } from './MushakImage';
import { ModakIcon } from './icons/FestivalIcons';

interface VictoryModalProps {
  score: number;
  ecoScore: number;
  maxCombo: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  onViewLeaderboard: () => void;
  onNextStage?: () => void;
  hasNextStage?: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  ecoScore,
  maxCombo,
  onPlayAgain,
  onMainMenu,
  onViewLeaderboard,
  onNextStage,
  hasNextStage,
}) => {
  const [nickname, setNickname] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const bestScore = getHighScore();

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || hasSaved) return;

    addLeaderboardEntry(nickname, score, ecoScore, maxCombo, 5);
    setHasSaved(true);
    soundManager.playPowerUp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="victory-title"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-400/60 text-amber-50 shadow-2xl text-center max-h-[92dvh] overflow-y-auto overscroll-contain box-border"
      >
        {/* Sacred Aarti Kalash & Ganesha Blessing Emblem */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full glass-level-2 border-2 border-amber-300/80 mb-2 p-1 shadow-xl">
          <GaneshaImage className="w-20 h-20 object-contain drop-shadow-xl" />
          <span className="absolute -top-1 -right-1 text-amber-300 animate-spin" style={{ animationDuration: '6s' }}>
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-bold px-3.5 py-1 rounded-full glass-level-1 border border-amber-400/30 mb-2 font-cinzel">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>30M REACHED • LORD GANESHA SHRINE!</span>
        </div>

        <h1 id="victory-title" className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 drop-shadow">
          Ganpati Bappa Morya!
        </h1>
        <p className="font-marcellus text-base sm:text-lg text-amber-200/90 mt-1">
          Mushak has successfully reached Lord Ganesha!
        </p>

        {/* High-Fidelity Bal Ganesha Darshan */}
        <GaneshaDarshanCanvas width={360} height={210} />

        {/* 30m Lord Ganesha Arrival Celebration Lore Card */}
        <div className="my-4 p-4 rounded-2xl glass-level-2 border border-amber-500/30 text-xs text-amber-100/90 leading-relaxed text-left">
          <p className="font-bold text-amber-300 mb-1 flex items-center gap-2 font-cinzel">
            <MushakImage className="w-6 h-6 object-contain" />
            <GaneshaImage className="w-6 h-6 object-contain" />
            <span>Mushak Has Reached Lord Ganesha at 30m!</span>
          </p>
          <p>
            With joyful flower showers and sacred festival lights, Mushak has safely dashed across 
            <strong> 30 metres</strong> of decorated festival streets to reach Lord Ganesha&apos;s grand lotus shrine. 
            Lord Ganesha warmly blesses Mushak with a golden plate of sweet modaks, fulfilling the festival pilgrimage!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-left">
          <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Final Score</span>
            <span className="font-outfit font-black text-lg text-amber-300">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Best Score</span>
            <span className="font-outfit font-black text-lg text-amber-400">
              {Math.max(score, bestScore).toLocaleString()}
            </span>
          </div>

          <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-emerald-400 block">Eco Score</span>
            <span className="font-outfit font-black text-lg text-emerald-400">
              +{ecoScore}
            </span>
          </div>

          <div className="glass-level-1 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Highest Combo</span>
            <span className="font-outfit font-black text-lg text-amber-300">
              {maxCombo}x
            </span>
          </div>
        </div>

        {/* Save to Leaderboard Form */}
        {!hasSaved ? (
          <form onSubmit={handleSaveScore} className="mb-4 glass-level-2 p-3 rounded-2xl border border-amber-500/30">
            <label htmlFor="victory-nickname-input" className="block text-xs font-semibold text-amber-200 mb-1.5 text-left">
              Record your Champion Score on the Contest Leaderboard:
            </label>
            <div className="flex gap-2">
              <input
                id="victory-nickname-input"
                type="text"
                maxLength={18}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your Name / Campus (e.g. Diya - IITB)"
                className="flex-1 bg-black/50 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 placeholder:text-amber-400/40 focus:outline-none focus:border-amber-400"
              />
              <button
                id="victory-submit-btn"
                type="submit"
                disabled={!nickname.trim()}
                className="glass-button px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                SAVE
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4 p-2.5 glass-level-2 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Grand Champion score recorded!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {hasNextStage && onNextStage && (
            <button
              id="victory-next-stage-btn"
              onClick={() => {
                soundManager.userInteracted();
                soundManager.playPowerUp();
                onNextStage();
              }}
              className="glass-button w-full py-3.5 rounded-xl font-cinzel font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>NEXT FESTIVAL PATH</span>
            </button>
          )}

          <button
            id="victory-play-again-btn"
            onClick={() => {
              soundManager.userInteracted();
              soundManager.playPowerUp();
              onPlayAgain();
            }}
            className={`${hasNextStage ? 'glass-button-secondary' : 'glass-button'} w-full py-3.5 rounded-xl font-cinzel font-bold text-base flex items-center justify-center gap-2 cursor-pointer`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="victory-leaderboard-btn"
              onClick={onViewLeaderboard}
              className="glass-button-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>VIEW LEADERBOARD</span>
            </button>

            <button
              id="victory-menu-btn"
              onClick={onMainMenu}
              className="glass-button-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MAIN MENU</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
