import React, { useState } from 'react';
import { RotateCcw, Home, Trophy, Sparkles, Award, Heart } from 'lucide-react';
import { getHighScore, addLeaderboardEntry } from '../storage/storage';
import { soundManager } from '../audio/soundManager';
import { STAGES } from '../game/constants';

interface GameOverModalProps {
  score: number;
  ecoScore: number;
  maxCombo: number;
  stageReached: number;
  obstacleName?: string;
  offeringsCount?: number;
  onTryAgain: () => void;
  onMainMenu: () => void;
  onViewLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  ecoScore,
  maxCombo,
  stageReached,
  obstacleName = 'Festival Obstacle',
  offeringsCount = 0,
  onTryAgain,
  onMainMenu,
  onViewLeaderboard,
}) => {
  const [nickname, setNickname] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const bestScore = getHighScore();
  const isNewHighScore = score > 0 && score >= bestScore;
  const currentStage = STAGES[Math.max(0, Math.min(stageReached - 1, STAGES.length - 1))];

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || hasSaved) return;

    addLeaderboardEntry(nickname, score, ecoScore, maxCombo, stageReached);
    setHasSaved(true);
    soundManager.playPowerUp();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md my-auto festival-glass rounded-3xl p-4 sm:p-6 border-2 border-amber-500/50 text-amber-50 shadow-2xl text-center max-h-[94vh] max-h-[94dvh] overflow-y-auto">
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/25 rounded-full blur-2xl pointer-events-none" />

        {/* Soft Diya Icon & Status Tag */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-amber-500/30 to-amber-700/20 border border-amber-400/50 mb-2 shadow-inner">
          <span className="text-3xl animate-bounce">🪔</span>
        </div>

        {/* Game Over Heading */}
        <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-wider">
          GAME OVER
        </h2>

        {/* 3 Hearts Lost Notice */}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">3 Hearts Depleted:</span>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-stone-800 text-stone-600 opacity-60" />
            <Heart className="w-4 h-4 fill-stone-800 text-stone-600 opacity-60" />
            <Heart className="w-4 h-4 fill-stone-800 text-stone-600 opacity-60" />
          </div>
        </div>

        {/* Obstacle Hit Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-semibold mt-1.5 mb-3">
          <span>💥 Collided with {obstacleName}</span>
        </div>

        {/* PROMINENT USER SCORE HERO CARD */}
        <div className="relative my-2 p-4 rounded-2xl bg-gradient-to-b from-amber-950/90 via-amber-900/60 to-black/80 border border-amber-500/40 shadow-xl text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300/90 mb-0.5">
            YOUR FINAL SCORE
          </div>

          <div className="font-outfit font-black text-4xl sm:text-5xl text-amber-300 tracking-tight flex items-baseline justify-center gap-1.5 drop-shadow-md">
            <span>{score.toLocaleString()}</span>
            <span className="text-lg sm:text-xl text-amber-400 font-bold">PTS</span>
          </div>

          {/* New High Score or Best Record Indicator */}
          {isNewHighScore ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 text-xs font-black shadow-lg animate-pulse">
              <Award className="w-3.5 h-3.5" />
              <span>NEW PERSONAL BEST!</span>
            </div>
          ) : (
            <div className="text-xs text-amber-300/70 mt-1 font-medium">
              Personal Best: <strong className="text-amber-200 font-bold">{bestScore.toLocaleString()} PTS</strong>
            </div>
          )}

          {/* Encouraging devotion note */}
          <p className="text-xs text-amber-200/80 mt-2 font-rozha italic">
            &ldquo;Ganpati Bappa blesses every ounce of effort. Practice brings perfection!&rdquo;
          </p>
        </div>

        {/* Run Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 text-left">
          <div className="bg-black/40 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 block">Offerings Collected</span>
            <span className="font-outfit font-black text-lg text-amber-200 flex items-center gap-1">
              <span>🥟</span> {offeringsCount} items
            </span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 block">Eco Devotion</span>
            <span className="font-outfit font-black text-lg text-emerald-400 flex items-center gap-1">
              <span>🌿</span> +{ecoScore}
            </span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 block">Highest Combo</span>
            <span className="font-outfit font-black text-lg text-amber-300 flex items-center gap-1">
              <span>⚡</span> x{maxCombo}
            </span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-amber-500/20">
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 block">Stage Reached</span>
            <span className="font-outfit font-black text-xs sm:text-sm text-amber-200 truncate block mt-0.5" title={currentStage?.title}>
              📍 Stage {stageReached} of 5
            </span>
          </div>
        </div>

        {/* Save to Leaderboard Form */}
        {!hasSaved ? (
          <form onSubmit={handleSaveScore} className="mb-3.5 bg-amber-900/30 p-3 rounded-2xl border border-amber-500/25">
            <label className="block text-xs font-semibold text-amber-200 mb-1.5 text-left">
              Enter your Name or College for Leaderboard:
            </label>
            <div className="flex gap-2">
              <input
                id="player-nickname-input"
                type="text"
                maxLength={18}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Arjun (VJTI)"
                className="flex-1 bg-black/60 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 placeholder:text-amber-400/40 focus:outline-none focus:border-amber-400"
              />
              <button
                id="submit-leaderboard-btn"
                type="submit"
                disabled={!nickname.trim()}
                className="festival-button px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-all hover:scale-105"
              >
                SAVE
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-3.5 p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Score saved to Campus Leaderboard!</span>
            <button
              type="button"
              onClick={onViewLeaderboard}
              className="underline font-bold ml-1 text-emerald-200 hover:text-white cursor-pointer"
            >
              View
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            id="try-again-btn"
            onClick={() => {
              soundManager.userInteracted();
              soundManager.playPowerUp();
              onTryAgain();
            }}
            className="festival-button w-full py-3.5 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <RotateCcw className="w-5 h-5" />
            <span>TRY AGAIN</span>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <button
              id="gameover-leaderboard-btn"
              onClick={onViewLeaderboard}
              className="py-2.5 rounded-xl border border-amber-500/30 text-amber-200/90 hover:bg-amber-900/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>LEADERBOARD</span>
            </button>

            <button
              id="gameover-menu-btn"
              onClick={onMainMenu}
              className="py-2.5 rounded-xl border border-amber-500/30 text-amber-200/90 hover:bg-amber-900/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>MAIN MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
