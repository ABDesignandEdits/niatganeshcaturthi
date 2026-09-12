import React from 'react';
import { Trophy, Medal, Award, X, Sparkles, Leaf } from 'lucide-react';
import { getLeaderboard } from '../storage/storage';
import { soundManager } from '../audio/soundManager';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const entries = getLeaderboard();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg festival-glass rounded-2xl p-6 border border-amber-500/40 text-amber-50 shadow-2xl">
        {/* Close Button */}
        <button
          id="close-leaderboard-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-900/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 mb-2">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-amber-300">
            Festival Leaderboard
          </h2>
          <p className="text-xs text-amber-200/80 mt-0.5 font-rozha">
            Student Game Design Contest High Scorers
          </p>
        </div>

        {/* Table of Entries */}
        <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
          {entries.map((entry, index) => {
            const isTop3 = index < 3;
            let rankBadge = (
              <span className="w-6 h-6 rounded-full bg-amber-950 flex items-center justify-center text-xs font-bold text-amber-300/80">
                {index + 1}
              </span>
            );

            if (index === 0) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/30">
                  🥇
                </div>
              );
            } else if (index === 1) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-900 flex items-center justify-center font-black text-xs shadow-md">
                  🥈
                </div>
              );
            } else if (index === 2) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black text-xs shadow-md">
                  🥉
                </div>
              );
            }

            return (
              <div
                key={entry.id || index}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isTop3
                    ? 'bg-amber-950/60 border-amber-500/40 shadow-sm'
                    : 'bg-black/30 border-amber-500/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  {rankBadge}
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-amber-100 block">
                      {entry.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-amber-300/60">
                      <span>Stage {entry.stageReached}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emerald-400">
                        <Leaf className="w-2.5 h-2.5" /> {entry.ecoScore}
                      </span>
                      <span>•</span>
                      <span>x{entry.maxCombo} Combo</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-outfit font-black text-sm sm:text-base text-amber-300 block">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-amber-200/50">{entry.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300/70">
          <span>Scores stored locally in browser</span>
          <button
            id="close-leaderboard-bottom-btn"
            onClick={onClose}
            className="font-bold text-amber-300 hover:text-amber-100 underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
