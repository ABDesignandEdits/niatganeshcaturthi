import React, { useEffect, useRef } from 'react';
import { Play, Trophy, BookOpen, Settings, Info, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { MousePreviewCanvas } from './MousePreviewCanvas';

interface MainMenuProps {
  onPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  highScore: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenAbout,
  highScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background floating flower petals & glowing diyas animation on menu canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating petals and firefly sparks
    const petals = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 4 + Math.random() * 6,
      vx: (Math.random() - 0.2) * 1.5,
      vy: 1 + Math.random() * 1.8,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      color: Math.random() < 0.6 ? '#f97316' : '#eab308',
    }));

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle warm temple / pandal arches in silhouette
      ctx.fillStyle = 'rgba(69, 10, 10, 0.4)';
      for (let x = -50; x < width + 100; x += 180) {
        ctx.beginPath();
        ctx.arc(x + 90, height - 120, 70, Math.PI, 0);
        ctx.lineTo(x + 160, height);
        ctx.lineTo(x + 20, height);
        ctx.fill();
      }

      // Draw floating marigold petals
      for (const p of petals) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw glowing diyas along the bottom
      for (let x = 60; x < width; x += 160) {
        const flicker = Math.sin(time * 12 + x) * 2;
        // Glow
        const glow = ctx.createRadialGradient(x, height - 20, 2, x, height - 20, 32);
        glow.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, height - 20, 32, 0, Math.PI * 2);
        ctx.fill();

        // Diya base
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.ellipse(x, height - 12, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flame
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(x - 4, height - 12);
        ctx.quadraticCurveTo(x + flicker, height - 28, x, height - 28);
        ctx.quadraticCurveTo(x + 4, height - 18, x + 4, height - 12);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleStartPlay = () => {
    soundManager.userInteracted();
    soundManager.playPowerUp();
    onPlay();
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center bg-gradient-to-b from-amber-950 via-red-950 to-stone-950 text-amber-50">
      {/* Background canvas for ambient festive particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪔</span>
          <span className="font-cinzel text-xs md:text-sm tracking-widest text-amber-300 font-semibold uppercase">
            Vinayaka Chaturthi Special
          </span>
        </div>

        {highScore > 0 && (
          <div className="flex items-center gap-2 festival-glass px-4 py-1.5 rounded-full border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider text-amber-200">High Score:</span>
            <span className="font-outfit font-bold text-amber-400">{highScore.toLocaleString()}</span>
          </div>
        )}
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl my-auto">
        {/* Auspicious Symbol */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 mb-3 shadow-lg shadow-amber-500/20">
          <span className="text-2xl text-amber-300 font-serif">ॐ</span>
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 drop-shadow-md">
          MUSHAK DASH
        </h1>

        {/* Subtitle */}
        <p className="font-rozha text-lg sm:text-2xl text-amber-200/90 mt-2 tracking-wide">
          A Vinayaka Chaturthi Festival Adventure
        </p>

        <p className="text-xs sm:text-sm text-amber-100/70 max-w-md mt-2 leading-relaxed">
          Guide Mushak across illuminated festival streets, collect sacred modaks, celebrate with eco-friendly devotion, and reach the grand Visarjan celebration!
        </p>

        {/* Animated Mushak 3D Preview (Matching user reference photo 1) */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-950/80 via-stone-900/90 to-amber-900/80 border-2 border-amber-400/60 flex items-center justify-center p-1 shadow-2xl shadow-amber-500/20 overflow-hidden animate-diya-glow">
            <MousePreviewCanvas size={135} />
          </div>
          <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-bold tracking-widest text-amber-300 uppercase backdrop-blur-sm">
            3D Mushak
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            id="play-button"
            onClick={handleStartPlay}
            className="festival-button w-full py-3.5 px-6 rounded-xl font-outfit font-bold text-lg flex items-center justify-center gap-2 cursor-pointer transition-transform transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PLAY ADVENTURE</span>
          </button>
        </div>

        {/* Secondary Menu Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-md mt-3">
          <button
            id="leaderboard-button"
            onClick={() => {
              soundManager.userInteracted();
              onOpenLeaderboard();
            }}
            className="festival-glass hover:bg-amber-900/40 p-2.5 rounded-lg border border-amber-500/25 text-amber-200 hover:text-amber-100 flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>LEADERBOARD</span>
          </button>

          <button
            id="how-to-play-button"
            onClick={() => {
              soundManager.userInteracted();
              onOpenHowToPlay();
            }}
            className="festival-glass hover:bg-amber-900/40 p-2.5 rounded-lg border border-amber-500/25 text-amber-200 hover:text-amber-100 flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-all"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            id="settings-button"
            onClick={() => {
              soundManager.userInteracted();
              onOpenSettings();
            }}
            className="festival-glass hover:bg-amber-900/40 p-2.5 rounded-lg border border-amber-500/25 text-amber-200 hover:text-amber-100 flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-all"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>SETTINGS</span>
          </button>

          <button
            id="about-button"
            onClick={() => {
              soundManager.userInteracted();
              onOpenAbout();
            }}
            className="festival-glass hover:bg-amber-900/40 p-2.5 rounded-lg border border-amber-500/25 text-amber-200 hover:text-amber-100 flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-all"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>ABOUT</span>
          </button>
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="relative z-10 w-full px-4 py-3 text-center border-t border-amber-900/40 bg-amber-950/40">
        <div className="flex items-center justify-center gap-2 text-xs text-amber-300/80 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Student Game Design Contest Edition • Ganpati Bappa Morya!</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </footer>
    </div>
  );
};
