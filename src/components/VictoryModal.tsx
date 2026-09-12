import React, { useState } from 'react';
import { Trophy, RotateCcw, Home, Sparkles, Star, Award, Heart } from 'lucide-react';
import { getHighScore, addLeaderboardEntry } from '../storage/storage';
import { soundManager } from '../audio/soundManager';
import { GaneshaDarshanCanvas } from './GaneshaDarshanCanvas';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg festival-glass rounded-2xl p-6 sm:p-7 border-2 border-amber-400/60 text-amber-50 shadow-2xl text-center my-8">
        {/* Sacred Aarti Kalash & Ganesha Blessing Emblem */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600/40 to-yellow-400/30 border-2 border-amber-300 mb-3 animate-diya-glow">
          <span className="text-4xl animate-float">🪔</span>
          <span className="absolute -top-1 -right-1 text-xl animate-spin" style={{ animationDuration: '6s' }}>✨</span>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-bold px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 mb-2">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>30M REACHED • LORD GANESHA SHRINE!</span>
        </div>

        <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 drop-shadow">
          Ganpati Bappa Morya!
        </h1>
        <p className="font-rozha text-lg sm:text-xl text-amber-200/90 mt-1">
          Mushak has successfully reached Lord Ganesha!
        </p>

        {/* High-Fidelity Bal Ganesha Darshan (Matching user reference photo 2) */}
        <GaneshaDarshanCanvas width={360} height={210} />

        {/* 30m Lord Ganesha Arrival Celebration Lore Card */}
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/80 via-red-950/80 to-amber-950/80 border border-amber-500/30 text-xs text-amber-100/90 leading-relaxed text-left">
          <p className="font-bold text-amber-300 mb-1 flex items-center gap-1">
            <span>🐘</span> Mushak Has Reached Lord Ganesha at 30m!
          </p>
          <p>
            With joyful flower showers and sparkling festival lights, Mushak has safely dashed across 
            <strong> 30 metres</strong> of decorated festival streets to reach Lord Ganesha&apos;s grand lotus shrine. 
            Lord Ganesha warmly blesses Mushak with a golden plate of sweet modaks, fulfilling the festival adventure!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-left">
          <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Final Score</span>
            <span className="font-outfit font-black text-lg text-amber-300">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Best Score</span>
            <span className="font-outfit font-black text-lg text-amber-400">
              {Math.max(score, bestScore).toLocaleString()}
            </span>
          </div>

          <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-emerald-400 block">Eco Score</span>
            <span className="font-outfit font-black text-lg text-emerald-400">
              {ecoScore}
            </span>
          </div>

          <div className="bg-amber-950/70 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase text-amber-300/80 block">Highest Combo</span>
            <span className="font-outfit font-black text-lg text-amber-300">
              x{maxCombo}
            </span>
          </div>
        </div>

        {/* Save to Leaderboard Form */}
        {!hasSaved ? (
          <form onSubmit={handleSaveScore} className="mb-4 bg-amber-900/30 p-3 rounded-xl border border-amber-500/30">
            <label className="block text-xs font-semibold text-amber-200 mb-1.5 text-left">
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
                className="flex-1 bg-black/50 border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-100 placeholder:text-amber-400/40 focus:outline-none focus:border-amber-400"
              />
              <button
                id="victory-submit-btn"
                type="submit"
                disabled={!nickname.trim()}
                className="festival-button px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                SAVE
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4 p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
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
              className="festival-button w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"
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
            className={`${hasNextStage ? 'bg-amber-950/70 border border-amber-500/40 hover:bg-amber-900/60 text-amber-200' : 'festival-button'} w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="victory-leaderboard-btn"
              onClick={onViewLeaderboard}
              className="py-2.5 rounded-xl border border-amber-500/30 text-amber-200/90 hover:bg-amber-900/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>VIEW LEADERBOARD</span>
            </button>

            <button
              id="victory-menu-btn"
              onClick={onMainMenu}
              className="py-2.5 rounded-xl border border-amber-500/30 text-amber-200/90 hover:bg-amber-900/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MAIN MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
