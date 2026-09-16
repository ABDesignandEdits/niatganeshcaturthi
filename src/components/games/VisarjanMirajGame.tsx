import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, Heart, Flame } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface VisarjanMirajGameProps {
  onBack: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const VisarjanMirajGame: React.FC<VisarjanMirajGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [joyScore, setJoyScore] = useState(0);
  const [devotionLevel, setDevotionLevel] = useState(30); // 0 to 100
  const [processionDistance, setProcessionDistance] = useState(0); // 0 to 1000m
  const [soundOn, setSoundOn] = useState(true);
  const [activeChant, setActiveChant] = useState('गणपती बाप्पा मोरया! पुढच्या वर्षी लवकर या!');
  const [celebrationMode, setCelebrationMode] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const nextParticleId = useRef(1);

  // Add Gulal powder burst
  const triggerGulalBurst = (color: string) => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playColorSprinkle();

    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        id: nextParticleId.current++,
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height * 0.65 + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color,
        size: 3 + Math.random() * 5,
        alpha: 1,
      });
    }

    setJoyScore((s) => s + 50);
    setDevotionLevel((d) => Math.min(100, d + 6));
  };

  // Trigger Dhol beat
  const triggerDholRhythm = () => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playDholHit(true);

    const canvas = canvasRef.current;
    if (canvas) {
      // Golden ripple wave
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push({
          id: nextParticleId.current++,
          x: canvas.width / 2 + (Math.random() - 0.5) * 100,
          y: canvas.height * 0.8,
          vx: (Math.random() - 0.5) * 4,
          vy: -2 - Math.random() * 3,
          color: '#fbbf24',
          size: 4,
          alpha: 1,
        });
      }
    }

    setJoyScore((s) => s + 35);
    setDevotionLevel((d) => Math.min(100, d + 4));
  };

  // Trigger Flower Confetti
  const triggerFlowerShower = () => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playFlowerCollect();

    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 30; i++) {
      particlesRef.current.push({
        id: nextParticleId.current++,
        x: Math.random() * canvas.width,
        y: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#f97316' : '#e11d48',
        size: 5 + Math.random() * 4,
        alpha: 1,
      });
    }

    setJoyScore((s) => s + 40);
    setDevotionLevel((d) => Math.min(100, d + 5));
  };

  // Trigger Holy Bell Chime
  const triggerTempleBell = () => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playTempleBell();
    setJoyScore((s) => s + 25);
    setDevotionLevel((d) => Math.min(100, d + 3));
  };

  // Chant Shout
  const triggerChant = () => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playChantCheer();
    const chants = [
      'गणपती बाप्पा मोरया! पुढच्या वर्षी लवकर या!',
      'एक दोन तीन चार, गणपतीचा जयजयकार!',
      'मंगलमूर्ती मोरया! बाप्पा मोरया रे!',
      'सुखकर्ता दुःखहर्ता वार्ता विघ्नाची!',
    ];
    setActiveChant(chants[Math.floor(Math.random() * chants.length)]);
    setJoyScore((s) => s + 60);
    setDevotionLevel((d) => Math.min(100, d + 8));
  };

  // Marching procession distance loop
  useEffect(() => {
    const timer = setInterval(() => {
      setProcessionDistance((d) => (d >= 1000 ? 0 : d + 5));
      setDevotionLevel((d) => Math.max(10, d - 0.6));
    }, 400);

    return () => clearInterval(timer);
  }, []);

  // Check for grand celebration threshold
  useEffect(() => {
    if (devotionLevel >= 95 && !celebrationMode) {
      setCelebrationMode(true);
      if (soundOn) soundManager.playShankhCelebration();
      setTimeout(() => setCelebrationMode(false), 5000);
    }
  }, [devotionLevel, celebrationMode, soundOn]);

  // Canvas render animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Night sky with festive illuminations
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#110502');
      skyGrad.addColorStop(0.5, '#280c04');
      skyGrad.addColorStop(1, '#3d1306');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Street lanterns along top
      for (let i = 20; i < canvas.width; i += 45) {
        ctx.fillStyle = '#fde047';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(i, 20 + Math.sin(Date.now() * 0.003 + i) * 3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Illuminated Chariot Platform (Rath)
      const rathX = canvas.width / 2;
      const rathY = canvas.height * 0.68;

      ctx.save();
      // Chariot golden base
      const rathGrad = ctx.createLinearGradient(rathX - 70, rathY, rathX + 70, rathY + 25);
      rathGrad.addColorStop(0, '#d97706');
      rathGrad.addColorStop(0.5, '#fbbf24');
      rathGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = rathGrad;
      ctx.beginPath();
      ctx.roundRect(rathX - 70, rathY, 140, 30, 8);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Wheels
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(rathX - 45, rathY + 30, 12, 0, Math.PI * 2);
      ctx.arc(rathX + 45, rathY + 30, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Flower Garlands hanging from chariot
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(rathX, rathY + 12, 50, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // Update & Draw Particles (Gulal & Confetti)
      const survivingParticles: Particle[] = [];

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // slight gravity
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          survivingParticles.push(p);
        }
      }

      particlesRef.current = survivingParticles;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

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
            <span>🎉</span>
            <span>VISARJAN MIRAJ</span>
            <span>🪘</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Grand Procession & Gulal Utsav</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Procession Stats */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">Joy: {joyScore}</span>
        </div>

        {/* Devotion / Euphoria Gauge */}
        <div className="flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <div className="w-24 sm:w-32 h-3 bg-stone-900 rounded-full border border-amber-500/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-300"
              style={{ width: `${devotionLevel}%` }}
            />
          </div>
          <span className="text-[10px] text-amber-200/90 font-mono">{Math.floor(devotionLevel)}%</span>
        </div>
      </div>

      {/* Interactive Procession Stage */}
      <div className="relative w-full max-w-md rounded-2xl border-2 border-amber-500/50 shadow-2xl overflow-hidden bg-stone-900 flex flex-col items-center">
        <canvas ref={canvasRef} width={360} height={280} className="w-full max-w-[360px] h-[260px] block" />

        {/* Chariot Murti & Mushak Overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="relative">
            <GaneshaImage className="w-32 h-32 sm:w-36 sm:h-36 object-contain drop-shadow-2xl animate-float" />
            <div className="absolute -bottom-2 -right-2 bg-stone-900/90 p-1 rounded-full border border-amber-400/60 shadow">
              <MushakImage className="w-8 h-8 object-contain" />
            </div>
          </div>
        </div>

        {/* Celebration Shaan Alert */}
        {celebrationMode && (
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-xs flex items-center justify-center p-3 animate-in zoom-in pointer-events-none">
            <div className="festival-glass px-4 py-2 rounded-2xl border-2 border-amber-300 text-center shadow-2xl">
              <span className="text-2xl animate-bounce">✨ 🪔 🐚</span>
              <h3 className="font-cinzel text-base font-bold text-amber-300">MAHA AARTI CELEBRATION!</h3>
              <p className="text-[11px] text-amber-100">Devotees dance in blissful ecstasy!</p>
            </div>
          </div>
        )}

        {/* Procession Path Banner */}
        <div className="w-full bg-amber-950/80 px-3 py-1.5 border-t border-amber-500/30 flex items-center justify-between text-[11px]">
          <span className="text-amber-300 font-bold">Procession Progress: {processionDistance}m / 1000m</span>
          <span className="text-amber-200/80">To Sacred Beach (Girgaon Chowpatty)</span>
        </div>
      </div>

      {/* Devotional Chant Display */}
      <div className="w-full max-w-md my-2 px-3 py-2 festival-glass rounded-xl border border-amber-400/40 text-center">
        <p className="font-rozha text-xs sm:text-sm text-amber-200 tracking-wide">{activeChant}</p>
      </div>

      {/* Interactive Festive Celebration Action Buttons Grid */}
      <div className="w-full max-w-md grid grid-cols-3 gap-2 my-1">
        <button
          onClick={() => triggerGulalBurst('#ec4899')}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🌸</span>
          <span className="leading-tight">Gulal Splash</span>
        </button>

        <button
          onClick={() => triggerGulalBurst('#f97316')}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🟠</span>
          <span className="leading-tight">Kesari Splash</span>
        </button>

        <button
          onClick={triggerDholRhythm}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🥁</span>
          <span className="leading-tight">Dhol Beat</span>
        </button>

        <button
          onClick={triggerFlowerShower}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🌼</span>
          <span className="leading-tight">Pushpa Shower</span>
        </button>

        <button
          onClick={triggerTempleBell}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🔔</span>
          <span className="leading-tight">Ghanta Bell</span>
        </button>

        <button
          onClick={triggerChant}
          className="festival-button py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 active:scale-95"
        >
          <span className="text-xl">🗣️</span>
          <span className="leading-tight">Bappa Chant!</span>
        </button>
      </div>
    </div>
  );
};
