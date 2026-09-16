import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, Eye, EyeOff, RefreshCw, Trophy } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface GaneshaPuzzleGameProps {
  onBack: () => void;
}

export const GaneshaPuzzleGame: React.FC<GaneshaPuzzleGameProps> = ({ onBack }) => {
  // 3x3 grid (indices 0 to 8)
  const [tiles, setTiles] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Shuffle puzzle
  const shuffleTiles = useCallback(() => {
    soundManager.userInteracted();
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Fisher-Yates shuffle ensuring it's not already solved
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setTiles(arr);
    setSelectedIdx(null);
    setMoves(0);
    setIsSolved(false);
    if (soundOn) soundManager.playPowerUp();
  }, [soundOn]);

  useEffect(() => {
    shuffleTiles();
  }, [shuffleTiles]);

  // Handle tile click to swap
  const handleTileClick = (index: number) => {
    if (isSolved) return;
    soundManager.userInteracted();

    if (selectedIdx === null) {
      setSelectedIdx(index);
      if (soundOn) soundManager.playCardFlip();
    } else {
      if (selectedIdx === index) {
        setSelectedIdx(null);
        return;
      }

      // Swap tiles
      const nextTiles = [...tiles];
      [nextTiles[selectedIdx], nextTiles[index]] = [nextTiles[index], nextTiles[selectedIdx]];
      setTiles(nextTiles);
      setSelectedIdx(null);
      setMoves((m) => m + 1);
      if (soundOn) soundManager.playCardFlip();

      // Check if solved
      const solved = nextTiles.every((val, idx) => val === idx);
      if (solved) {
        setIsSolved(true);
        if (soundOn) soundManager.playShankhCelebration();
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-stone-950 text-amber-50 flex flex-col items-center py-2 px-3 sm:px-4 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between py-1 border-b border-amber-500/30">
        <button
          onClick={() => {
            soundManager.userInteracted();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl festival-glass border border-amber-500/40 text-amber-300 hover:text-amber-100 active:scale-95 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Hub</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-sm sm:text-base font-bold text-amber-300 flex items-center justify-center gap-1">
            <span>🧩</span>
            <span>DIVYA DARSHAN</span>
            <span>✨</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Lord Ganesha Sacred Jigsaw</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Stats and Preview Toggle */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">Moves: {moves}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold active:scale-95"
          >
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showPreview ? 'Hide Guide' : 'Peek Guide'}</span>
          </button>

          <button
            onClick={shuffleTiles}
            className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Puzzle Container */}
      <div className="relative w-full max-w-md flex flex-col items-center my-1">
        {/* Guide Modal / Overlay if showPreview is active */}
        {showPreview && (
          <div className="w-full festival-glass rounded-2xl p-3 border-2 border-amber-400/60 mb-2 flex flex-col items-center text-center animate-in fade-in">
            <span className="text-[10px] text-amber-300 font-bold mb-1">Target Holy Darshan:</span>
            <div className="w-36 h-36 rounded-xl overflow-hidden border border-amber-400/60 p-2 bg-amber-950/80 flex items-center justify-center">
              <GaneshaImage className="w-full h-full object-contain drop-shadow" />
            </div>
          </div>
        )}

        {/* 3x3 Puzzle Grid */}
        <div className="w-[312px] h-[312px] sm:w-[336px] sm:h-[336px] p-2 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950/90 to-stone-900 shadow-2xl grid grid-cols-3 gap-1.5 relative">
          {tiles.map((tileNumber, gridIndex) => {
            const isSelected = selectedIdx === gridIndex;
            const isCorrect = tileNumber === gridIndex;

            // Calculate background position of the 3x3 slice
            const row = Math.floor(tileNumber / 3);
            const col = tileNumber % 3;

            return (
              <button
                key={gridIndex}
                onClick={() => handleTileClick(gridIndex)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'border-amber-300 ring-2 ring-amber-400 scale-98 shadow-lg'
                    : isCorrect
                    ? 'border-amber-500/50'
                    : 'border-stone-700/80'
                }`}
              >
                {/* Visual Representation of the piece slice */}
                <div
                  className="w-full h-full relative overflow-hidden bg-amber-900/40 flex items-center justify-center"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, rgba(245, 158, 11, 0.25) 0%, rgba(30, 10, 4, 0.9) 100%)`,
                  }}
                >
                  {/* Render scaled Ganesha art offset for this slice */}
                  <div
                    className="absolute w-[290px] h-[290px] pointer-events-none flex items-center justify-center"
                    style={{
                      left: `-${col * 96}px`,
                      top: `-${row * 96}px`,
                    }}
                  >
                    <GaneshaImage className="w-[260px] h-[260px] object-contain drop-shadow" />
                  </div>

                  {/* Corner indicator badge */}
                  <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-black/70 text-[9px] font-bold text-amber-300 flex items-center justify-center border border-amber-500/30">
                    {tileNumber + 1}
                  </span>

                  {isCorrect && (
                    <span className="absolute bottom-1 right-1 text-[8px] text-emerald-400 font-bold">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Mushak Helper Tip */}
        <div className="w-full mt-2 px-3 py-1.5 festival-glass rounded-xl border border-amber-500/30 flex items-center gap-2 text-xs">
          <MushakImage className="w-7 h-7 object-contain shrink-0" />
          <span className="text-[11px] text-amber-200/90 leading-tight">
            {isSolved
              ? 'Morya! Sacred Darshan restored in full splendor!'
              : selectedIdx !== null
              ? 'Tap another tile to swap positions!'
              : 'Tap any tile, then tap another to swap and restore the holy murti!'}
          </span>
        </div>

        {/* Solved Victory Dialog */}
        {isSolved && (
          <div className="w-full mt-3 festival-glass p-4 rounded-2xl border-2 border-amber-300 text-center space-y-2 animate-in zoom-in shadow-2xl">
            <span className="text-3xl">✨ 🕉️ 🪔</span>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-300">
              Divya Darshan Restored!
            </h3>
            <p className="text-xs text-amber-100/90">
              You completed the holy puzzle in <strong className="text-amber-300">{moves} moves</strong>!
            </p>
            <button
              onClick={shuffleTiles}
              className="festival-button w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Solve Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
