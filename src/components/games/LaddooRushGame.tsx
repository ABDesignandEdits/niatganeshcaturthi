import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Trophy, Heart, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface LaddooRushGameProps {
  onBack: () => void;
}

interface SweetItem {
  id: number;
  name: string;
  symbol: string;
  points: number;
  isOfferable: boolean;
  color: string;
}

const FESTIVAL_SWEETS: SweetItem[] = [
  { id: 1, name: 'Motichoor Laddoo', symbol: '🟡', points: 15, isOfferable: true, color: 'from-amber-400 to-orange-500' },
  { id: 2, name: 'Besan Laddoo', symbol: '🟠', points: 15, isOfferable: true, color: 'from-yellow-500 to-amber-600' },
  { id: 3, name: 'Kaju Katli Diamond', symbol: '💎', points: 25, isOfferable: true, color: 'from-slate-200 to-amber-100' },
  { id: 4, name: 'Ukadiche Modak', symbol: '🥟', points: 30, isOfferable: true, color: 'from-amber-100 to-amber-200' },
  { id: 5, name: 'Mewa Peda', symbol: '🟤', points: 20, isOfferable: true, color: 'from-amber-600 to-yellow-700' },
  { id: 6, name: 'Sneaky Crow', symbol: '🦅', points: -20, isOfferable: false, color: 'from-stone-700 to-stone-900' },
  { id: 7, name: 'Salty Chilli Snack', symbol: '🌶️', points: -15, isOfferable: false, color: 'from-red-600 to-red-800' },
];

export const LaddooRushGame: React.FC<LaddooRushGameProps> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activeItems, setActiveItems] = useState<(SweetItem & { keyId: number })[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [blessingMessage, setBlessingMessage] = useState<string>('Offer sacred sweets to Lord Ganesha!');
  const [plateSweets, setPlateSweets] = useState<string[]>([]);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('mushak_laddoo_rush_high') || '0');
    } catch {
      return 0;
    }
  });

  const nextKeyId = useRef(1);

  const startGame = useCallback(() => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(45);
    setPlateSweets([]);
    setGameOver(false);
    setIsPlaying(true);
    setBlessingMessage('Ganpati Bappa Morya! Offer holy sweets!');
    soundManager.userInteracted();
    if (soundOn) soundManager.playPowerUp();
  }, [soundOn]);

  // Spawn sweets
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const spawnInterval = setInterval(() => {
      setActiveItems((prev) => {
        if (prev.length >= 6) return prev;
        const randomSweet = FESTIVAL_SWEETS[Math.floor(Math.random() * FESTIVAL_SWEETS.length)];
        return [...prev, { ...randomSweet, keyId: nextKeyId.current++ }];
      });
    }, 650);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver]);

  // Game countdown timer
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          if (soundOn) soundManager.playShankhCelebration();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, soundOn]);

  const handleTapItem = (item: SweetItem & { keyId: number }) => {
    if (!isPlaying || gameOver) return;

    // Remove from active list
    setActiveItems((prev) => prev.filter((i) => i.keyId !== item.keyId));

    if (item.isOfferable) {
      if (soundOn) soundManager.playModakCollect();
      const points = item.points * (1 + Math.min(3, Math.floor(combo / 4) * 0.5));
      const nextScore = score + Math.floor(points);
      setScore(nextScore);
      setCombo((c) => c + 1);
      setPlateSweets((p) => [...p.slice(-8), item.symbol]);
      setBlessingMessage(`Offered ${item.name}! +${Math.floor(points)} pts`);

      if (nextScore > highScore) {
        setHighScore(nextScore);
        try {
          localStorage.setItem('mushak_laddoo_rush_high', String(nextScore));
        } catch {
          // Ignore
        }
      }
    } else {
      // Imposter item
      if (soundOn) soundManager.playObstacleHit();
      setCombo(0);
      setBlessingMessage(`Avoid ${item.name}! Not for puja!`);
      setLives((l) => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
        }
        return nextLives;
      });
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
            <span>🟡</span>
            <span>LADDOO FEAST RUSH</span>
            <span>🥟</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Sweet Offerings for Lord Ganesha</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* HUD Bar */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-bold">Score:</span>
          <span className="font-cinzel text-amber-400 font-bold text-sm">{score}</span>
          {combo > 2 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold text-[10px]">
              {combo}x STREAK!
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-3.5 h-3.5 ${h <= lives ? 'text-red-500 fill-red-500' : 'text-stone-700'}`}
              />
            ))}
          </div>
          <span className="font-mono text-amber-300 font-bold">⏳ {timeLeft}s</span>
        </div>
      </div>

      {/* Ganesha Darshan & Prasad Plate */}
      <div className="w-full max-w-md festival-glass rounded-2xl p-3 border-2 border-amber-500/40 my-1 flex items-center justify-between bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-400/60 p-1 flex items-center justify-center shadow-md animate-diya-glow">
            <GaneshaImage className="w-14 h-14 object-contain drop-shadow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-cinzel font-bold text-amber-300">Lord Ganesha</span>
            <span className="text-[10px] text-amber-200/70 italic max-w-[170px] truncate">{blessingMessage}</span>
            {/* Offerings on Plate */}
            <div className="flex items-center gap-1 mt-1 text-sm overflow-hidden h-5">
              {plateSweets.length === 0 ? (
                <span className="text-[9px] text-amber-400/60">Golden Thali is awaiting sweets...</span>
              ) : (
                plateSweets.map((s, i) => (
                  <span key={i} className="animate-in zoom-in duration-200">
                    {s}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-stone-900 border border-amber-400/50 p-1 flex items-center justify-center shadow">
          <MushakImage className="w-8 h-8 object-contain" />
        </div>
      </div>

      {/* Active Sweet Items Tap Grid */}
      <div className="w-full max-w-md flex-1 my-2 flex flex-col justify-center">
        {!isPlaying && !gameOver ? (
          <div className="festival-glass p-5 rounded-2xl border-2 border-amber-400/60 text-center space-y-3">
            <span className="text-4xl">🥟 🟡 💎</span>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-300">Fast Prasad Rush!</h3>
            <p className="text-xs text-amber-100/80 leading-relaxed">
              Tap the holy Laddoos, Modaks & Kaju Katlis quickly to offer them on Bappa's divine plate. Beware of sneaky crows and salty snacks!
            </p>
            <button
              onClick={startGame}
              className="festival-button w-full py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95"
            >
              START SWEET FEAST
            </button>
          </div>
        ) : gameOver ? (
          <div className="festival-glass p-5 rounded-2xl border-2 border-amber-400/60 text-center space-y-3">
            <h3 className="font-cinzel text-lg font-bold text-amber-300">Divine Feast Concluded!</h3>
            <p className="text-xs text-amber-100/90">
              Lord Ganesha is delighted by your sweet offerings! Total Score: <strong className="text-amber-300 font-bold">{score}</strong>
            </p>
            <div className="text-xs text-amber-300/80 font-mono">Personal Best: {highScore}</div>
            <button
              onClick={startGame}
              className="festival-button w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Offer Again</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {activeItems.map((item) => (
              <button
                key={item.keyId}
                onClick={() => handleTapItem(item)}
                className={`min-h-[85px] p-2 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b ${item.color} shadow-lg active:scale-90 transition-transform flex flex-col items-center justify-center text-center cursor-pointer animate-in zoom-in-75 duration-150`}
              >
                <span className="text-3xl filter drop-shadow">{item.symbol}</span>
                <span className="text-[10px] font-bold text-stone-900 mt-1 leading-tight">{item.name}</span>
                <span className="text-[8px] font-mono text-stone-900/80 font-bold">
                  {item.isOfferable ? `+${item.points} pts` : 'DODGE!'}
                </span>
              </button>
            ))}
            {activeItems.length === 0 && (
              <div className="col-span-3 py-10 text-center text-amber-300/70 animate-pulse text-xs">
                Preparing fresh hot laddoos from the royal kitchen...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
