import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Trophy, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface ModakTowerGameProps {
  onBack: () => void;
}

interface StackedModak {
  x: number;
  width: number;
  type: 'steamed' | 'kesari' | 'pista' | 'gold';
  label: string;
}

const MODAK_TYPES = [
  { type: 'steamed' as const, label: 'Ukadiche Modak', color: '#fef3c7', stroke: '#d97706', points: 10 },
  { type: 'kesari' as const, label: 'Kesari Saffron', color: '#fbbf24', stroke: '#b45309', points: 20 },
  { type: 'pista' as const, label: 'Pistachio Green', color: '#86efac', stroke: '#15803d', points: 25 },
  { type: 'gold' as const, label: 'Divya Suvarna', color: '#f59e0b', stroke: '#78350f', points: 50 },
];

export const ModakTowerGame: React.FC<ModakTowerGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [towerHeight, setTowerHeight] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('mushak_modak_tower_high') || '0');
    } catch {
      return 0;
    }
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  // Tower physics state
  const stackRef = useRef<StackedModak[]>([]);
  const currentModakRef = useRef<{
    x: number;
    width: number;
    speed: number;
    direction: 1 | -1;
    typeIndex: number;
  }>({
    x: 100,
    width: 90,
    speed: 3.5,
    direction: 1,
    typeIndex: 0,
  });

  const animFrameRef = useRef<number | null>(null);

  // Initialize base thali
  const initGame = useCallback(() => {
    stackRef.current = [
      {
        x: 110,
        width: 140,
        type: 'steamed',
        label: 'Puja Base Plate',
      },
    ];
    currentModakRef.current = {
      x: 50,
      width: 110,
      speed: 3.2,
      direction: 1,
      typeIndex: 0,
    };
    setScore(0);
    setTowerHeight(0);
    setGameOver(false);
    setIsPlaying(true);
    setFeedback('Tap to drop sacred Modak!');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Drop Modak Action
  const handleDrop = useCallback(() => {
    if (gameOver || !isPlaying) return;

    const stack = stackRef.current;
    const top = stack[stack.length - 1];
    const current = currentModakRef.current;

    const leftDiff = current.x - top.x;
    const tolerance = 4; // Perfect placement margin

    if (Math.abs(leftDiff) <= tolerance) {
      // PERFECT DROP
      if (soundOn) {
        soundManager.playCombo(Math.min(5, Math.floor(stack.length / 3) + 1));
      }
      setFeedback('PERFECT PRASAD! 🌟');
      stack.push({
        x: top.x,
        width: current.width,
        type: MODAK_TYPES[current.typeIndex].type,
        label: MODAK_TYPES[current.typeIndex].label,
      });
      setScore((s) => {
        const next = s + MODAK_TYPES[current.typeIndex].points * 2;
        if (next > highScore) {
          setHighScore(next);
          try {
            localStorage.setItem('mushak_modak_tower_high', String(next));
          } catch {
            // Ignore
          }
        }
        return next;
      });
    } else {
      // Calculate overlapping slice
      const newWidth = current.width - Math.abs(leftDiff);

      if (newWidth <= 12) {
        // Tower toppled
        if (soundOn) soundManager.playObstacleHit();
        setGameOver(true);
        setIsPlaying(false);
        setFeedback('Tower toppled! Offering accepted with love.');
        return;
      }

      // Slice modak and continue
      if (soundOn) soundManager.playModakCollect();
      const newX = leftDiff > 0 ? current.x : top.x;
      stack.push({
        x: newX,
        width: newWidth,
        type: MODAK_TYPES[current.typeIndex].type,
        label: MODAK_TYPES[current.typeIndex].label,
      });

      setFeedback(stack.length === 11 ? '11 SACRED MODAKS! 🪔' : stack.length === 21 ? '21 PRASAD MAHA-BHOG! 🕉️' : 'Nice Drop! ✨');
      setScore((s) => {
        const next = s + MODAK_TYPES[current.typeIndex].points;
        if (next > highScore) {
          setHighScore(next);
          try {
            localStorage.setItem('mushak_modak_tower_high', String(next));
          } catch {
            // Ignore
          }
        }
        return next;
      });
    }

    setTowerHeight(stack.length - 1);

    // Prepare next modak
    const nextWidth = Math.max(28, stack[stack.length - 1].width);
    const nextSpeed = Math.min(6.5, 3.2 + stack.length * 0.18);
    const nextType = (current.typeIndex + 1) % MODAK_TYPES.length;

    currentModakRef.current = {
      x: 20,
      width: nextWidth,
      speed: nextSpeed,
      direction: Math.random() > 0.5 ? 1 : -1,
      typeIndex: nextType,
    };
  }, [gameOver, isPlaying, soundOn, highScore]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background festive gradient
      const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bg.addColorStop(0, '#1c0b05');
      bg.addColorStop(0.6, '#2d1207');
      bg.addColorStop(1, '#451a03');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Temple Sanctum Arch in background
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height + 40, canvas.width * 0.7, Math.PI, 0);
      ctx.stroke();
      ctx.restore();

      const stack = stackRef.current;
      const modakHeight = 24;
      const basePlateY = canvas.height - 40;

      // Calculate camera scroll offset to keep current stack top visible
      const totalTowerPixelHeight = stack.length * modakHeight;
      const maxVisibleHeight = canvas.height - 130;
      const cameraY = totalTowerPixelHeight > maxVisibleHeight ? totalTowerPixelHeight - maxVisibleHeight : 0;

      // Draw Base Puja Thali
      const thaliY = basePlateY + cameraY;
      ctx.save();
      const thaliGrad = ctx.createLinearGradient(0, thaliY - 10, 0, thaliY + 15);
      thaliGrad.addColorStop(0, '#fde047');
      thaliGrad.addColorStop(0.5, '#d97706');
      thaliGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = thaliGrad;
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, thaliY, 120, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Draw stacked modaks
      stack.forEach((item, idx) => {
        if (idx === 0) return; // base plate
        const y = basePlateY - idx * modakHeight + cameraY;

        ctx.save();
        // Modak shape: pleated droplet
        ctx.fillStyle = item.type === 'gold' ? '#f59e0b' : item.type === 'kesari' ? '#fbbf24' : item.type === 'pista' ? '#86efac' : '#fef3c7';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;

        // Draw modak body
        ctx.beginPath();
        const mx = item.x + item.width / 2;
        ctx.moveTo(mx, y - modakHeight);
        ctx.bezierCurveTo(item.x + item.width + 6, y, item.x + item.width, y + 4, mx, y + 4);
        ctx.bezierCurveTo(item.x, y + 4, item.x - 6, y, mx, y - modakHeight);
        ctx.fill();
        ctx.stroke();

        // Pleats lines
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
        ctx.beginPath();
        ctx.moveTo(mx, y - modakHeight);
        ctx.lineTo(mx - item.width * 0.25, y + 2);
        ctx.moveTo(mx, y - modakHeight);
        ctx.lineTo(mx + item.width * 0.25, y + 2);
        ctx.stroke();

        ctx.restore();
      });

      // Update and draw current sliding modak (if game active)
      if (isPlaying && !gameOver) {
        const current = currentModakRef.current;
        current.x += current.speed * current.direction;

        // Bounce on boundaries
        if (current.x <= 15) {
          current.x = 15;
          current.direction = 1;
        } else if (current.x + current.width >= canvas.width - 15) {
          current.x = canvas.width - 15 - current.width;
          current.direction = -1;
        }

        const currentY = 70;

        ctx.save();
        ctx.fillStyle = MODAK_TYPES[current.typeIndex].color;
        ctx.strokeStyle = MODAK_TYPES[current.typeIndex].stroke;
        ctx.lineWidth = 2;

        const mx = current.x + current.width / 2;
        ctx.beginPath();
        ctx.moveTo(mx, currentY - modakHeight);
        ctx.bezierCurveTo(current.x + current.width + 6, currentY, current.x + current.width, currentY + 4, mx, currentY + 4);
        ctx.bezierCurveTo(current.x, currentY + 4, current.x - 6, currentY, mx, currentY - modakHeight);
        ctx.fill();
        ctx.stroke();

        // Drop guide line
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
        ctx.beginPath();
        ctx.moveTo(mx, currentY + 4);
        ctx.lineTo(mx, canvas.height);
        ctx.stroke();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, gameOver]);

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-stone-950 text-amber-50 flex flex-col items-center py-2 px-3 sm:px-4 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Header Bar */}
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
            <span>🥟</span>
            <span>MODAK TOWER</span>
            <span>🪔</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Stack 21 Sacred Prasad Modaks</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Stats Bar */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-bold">Height:</span>
          <span className="font-cinzel text-amber-400 font-bold text-sm">{towerHeight} / 21</span>
          {towerHeight >= 21 && <span className="text-xs">🏆 Blessed!</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{score}</span>
          </div>
          <span className="text-[10px] text-amber-200/70">Best: {highScore}</span>
        </div>
      </div>

      {/* Canvas Area with Mushak and Ganesha Presence */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div
          onClick={handleDrop}
          className="relative w-full rounded-2xl border-2 border-amber-500/50 shadow-2xl overflow-hidden touch-none cursor-pointer bg-stone-900 flex justify-center"
        >
          <canvas ref={canvasRef} width={360} height={420} className="w-full max-w-[360px] h-[400px] block touch-none" />

          {/* Devotee Bappa Presence Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full border border-amber-500/30 pointer-events-none">
            <GaneshaImage className="w-5 h-5 object-contain" />
            <span className="text-[10px] text-amber-300 font-bold">Blessing Tower</span>
          </div>

          {/* Faithful Mushak cheering */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full border border-amber-500/30 pointer-events-none">
            <MushakImage className="w-5 h-5 object-contain" />
            <span className="text-[9px] text-amber-200 font-semibold">Bappa Loves Modaks!</span>
          </div>

          {/* On-screen Tap Prompt */}
          {!gameOver && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 text-[11px] text-amber-200 pointer-events-none animate-pulse">
              {feedback || 'Tap screen to drop modak!'}
            </div>
          )}
        </div>

        {/* Large Mobile Tap Button */}
        {!gameOver ? (
          <button
            onClick={handleDrop}
            className="w-full max-w-md mt-3 festival-button min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>DROP MODAK NOW!</span>
          </button>
        ) : (
          <div className="w-full max-w-md mt-2 festival-glass p-4 rounded-2xl border-2 border-amber-400 text-center space-y-2">
            <h3 className="font-cinzel text-lg font-bold text-amber-300">Prasad Offering Complete!</h3>
            <p className="text-xs text-amber-100/80">You stacked {towerHeight} holy modaks for Lord Ganesha!</p>
            <div className="flex gap-2 justify-center pt-1">
              <button
                onClick={initGame}
                className="festival-button min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Stack Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
