import React from 'react';
import { Trophy, Medal, Award, X, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { getLeaderboard } from '../storage/storage';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const entries = getLeaderboard();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="leaderboard-modal-title"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/40 text-amber-50 shadow-2xl h-[92dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden box-border"
      >
        {/* Close Button */}
        <button
          id="close-leaderboard-btn"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-amber-400 hover:text-amber-200 p-1.5 rounded-full apple-liquid-glass border border-amber-500/30 cursor-pointer z-10 transition-all active:scale-95"
          aria-label="Close leaderboard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 shrink-0">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full apple-liquid-glass border border-amber-400/40 mb-1.5 shadow-md">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <h2 id="leaderboard-modal-title" className="font-cinzel text-xl sm:text-2xl font-bold text-amber-300">
            Festival Leaderboard
          </h2>
          <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 font-marcellus">
            Vinayaka Chaturthi High Scorers
          </p>
        </div>

        {/* Table of Entries */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 scrollbar-thin">
          {entries.map((entry, index) => {
            const isTop3 = index < 3;
            let rankBadge = (
              <span className="w-6 h-6 rounded-full glass-level-1 flex items-center justify-center text-xs font-bold text-amber-300/80 border border-amber-500/20">
                {index + 1}
              </span>
            );

            if (index === 0) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/40">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              );
            } else if (index === 1) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-slate-300 text-stone-900 flex items-center justify-center font-black text-xs shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              );
            } else if (index === 2) {
              rankBadge = (
                <div className="w-6 h-6 rounded-full bg-amber-600 text-amber-100 flex items-center justify-center font-black text-xs shadow-md">
                  <Medal className="w-3.5 h-3.5" />
                </div>
              );
            }

            return (
              <div
                key={entry.id || index}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isTop3
                    ? 'apple-glass-card border-amber-500/40 shadow-sm'
                    : 'apple-liquid-glass border-amber-500/15'
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
                      <span>{entry.maxCombo}x Combo</span>
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

        {/* Footer */}
        <footer className="mt-4 pt-3 border-t border-amber-500/20 shrink-0 safe-bottom">
          <button
            id="close-leaderboard-bottom-btn"
            onClick={onClose}
            className="apple-glass-button w-full py-2.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            CLOSE LEADERBOARD
          </button>
        </footer>
      </motion.div>
    </div>
  );
};
