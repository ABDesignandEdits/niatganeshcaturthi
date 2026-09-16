import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, Flame, RefreshCw, Sun } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface DiyaMandalaGameProps {
  onBack: () => void;
}

interface DiyaNode {
  id: number;
  ring: number; // 0: inner (Om), 1: middle, 2: outer
  angle: number; // in radians
  x: number;
  y: number;
  isLit: boolean;
  oilRemaining: number; // 0 to 100
}

export const DiyaMandalaGame: React.FC<DiyaMandalaGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [diyas, setDiyas] = useState<DiyaNode[]>([]);
  const [selectedDiya, setSelectedDiya] = useState<number | null>(null);
  const [litCount, setLitCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeMantra, setActiveMantra] = useState('ॐ गं गणपतये नमः');

  const MANTRAS = [
    'ॐ गं गणपतये नमः',
    'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
    'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा',
    'एकदन्ताय विद्महे वक्रतुण्डाय धीमहि',
    'तन्नो दन्तिः प्रचोदयात्',
  ];

  // Initialize concentric mandala diyas (Total 21 sacred lamps)
  const initMandala = () => {
    const nodes: DiyaNode[] = [];
    const size = 340;
    const center = size / 2;

    // Ring 0: Inner circle (5 diyas)
    const ring0Count = 5;
    const r0 = 48;
    for (let i = 0; i < ring0Count; i++) {
      const angle = (i * 2 * Math.PI) / ring0Count - Math.PI / 2;
      nodes.push({
        id: nodes.length,
        ring: 0,
        angle,
        x: center + Math.cos(angle) * r0,
        y: center + Math.sin(angle) * r0,
        isLit: false,
        oilRemaining: 100,
      });
    }

    // Ring 1: Middle circle (7 diyas)
    const ring1Count = 7;
    const r1 = 92;
    for (let i = 0; i < ring1Count; i++) {
      const angle = (i * 2 * Math.PI) / ring1Count - Math.PI / 2 + 0.2;
      nodes.push({
        id: nodes.length,
        ring: 1,
        angle,
        x: center + Math.cos(angle) * r1,
        y: center + Math.sin(angle) * r1,
        isLit: false,
        oilRemaining: 100,
      });
    }

    // Ring 2: Outer circle (9 diyas) - Total = 5 + 7 + 9 = 21 Sacred Diyas!
    const ring2Count = 9;
    const r2 = 138;
    for (let i = 0; i < ring2Count; i++) {
      const angle = (i * 2 * Math.PI) / ring2Count - Math.PI / 2;
      nodes.push({
        id: nodes.length,
        ring: 2,
        angle,
        x: center + Math.cos(angle) * r2,
        y: center + Math.sin(angle) * r2,
        isLit: false,
        oilRemaining: 100,
      });
    }

    setDiyas(nodes);
    setLitCount(0);
    setCompleted(false);
  };

  useEffect(() => {
    initMandala();
  }, []);

  // Light a diya
  const handleLightDiya = (id: number) => {
    soundManager.userInteracted();
    setDiyas((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, isLit: true } : d));
      const newlyLit = updated.filter((d) => d.isLit).length;
      setLitCount(newlyLit);

      if (newlyLit === updated.length) {
        setCompleted(true);
        if (soundOn) soundManager.playShankhCelebration();
      } else {
        if (soundOn) soundManager.playDiyaCollect();
      }
      return updated;
    });

    // Cycle mantra
    setActiveMantra(MANTRAS[id % MANTRAS.length]);
  };

  // Light all in sequence automatic ritual
  const handleLightAllDevotional = () => {
    soundManager.userInteracted();
    diyas.forEach((d, i) => {
      setTimeout(() => {
        handleLightDiya(d.id);
      }, i * 160);
    });
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const center = canvas.width / 2;

      // Dark temple terracotta stone floor
      const bg = ctx.createRadialGradient(center, center, 20, center, center, center);
      bg.addColorStop(0, '#2d0c03');
      bg.addColorStop(0.7, '#1f0702');
      bg.addColorStop(1, '#0c0201');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sacred Kolam / Mandala Geometry Lines
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 1.5;

      // Concentric circles
      [48, 92, 138].forEach((r) => {
        ctx.beginPath();
        ctx.arc(center, center, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Mandala Petal Curves connecting nodes
      diyas.forEach((d) => {
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.quadraticCurveTo(d.x + 10, d.y - 10, d.x, d.y);
        ctx.stroke();
      });
      ctx.restore();

      // Central Om Glow
      ctx.save();
      const centerGlow = ctx.createRadialGradient(center, center, 5, center, center, 35);
      centerGlow.addColorStop(0, litCount > 0 ? 'rgba(251, 191, 36, 0.8)' : 'rgba(251, 191, 36, 0.2)');
      centerGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(center, center, 35, 0, Math.PI * 2);
      ctx.fill();

      // Golden Om text at center
      ctx.font = 'bold 22px serif';
      ctx.fillStyle = litCount > 0 ? '#fef08a' : '#b45309';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', center, center);
      ctx.restore();

      // Draw each Diya
      diyas.forEach((d) => {
        ctx.save();

        // Diya earthenware body (terracotta brown)
        ctx.fillStyle = '#9a3412';
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 11, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (d.isLit) {
          // Flame glow
          const flicker = Math.sin(Date.now() * 0.008 + d.id * 2) * 2;
          const flameGlow = ctx.createRadialGradient(d.x, d.y - 6, 2, d.x, d.y - 6, 20 + flicker);
          flameGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          flameGlow.addColorStop(0.4, 'rgba(249, 115, 22, 0.6)');
          flameGlow.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = flameGlow;
          ctx.beginPath();
          ctx.arc(d.x, d.y - 6, 20 + flicker, 0, Math.PI * 2);
          ctx.fill();

          // Teardrop Flame Core
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - 12 + flicker);
          ctx.bezierCurveTo(d.x + 4, d.y - 4, d.x + 3, d.y - 2, d.x, d.y - 2);
          ctx.bezierCurveTo(d.x - 3, d.y - 2, d.x - 4, d.y - 4, d.x, d.y - 12 + flicker);
          ctx.fill();
        } else {
          // Unlit wick
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.arc(d.x, d.y - 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [diyas, litCount]);

  // Handle canvas click to light nearest diya
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touchX = (clientX - rect.x) * scaleX;
    const touchY = (clientY - rect.y) * scaleY;

    // Find closest unlit diya
    let closest: DiyaNode | null = null;
    let minDist = 28; // touch radius in canvas px

    for (const d of diyas) {
      const dist = Math.hypot(d.x - touchX, d.y - touchY);
      if (dist < minDist) {
        minDist = dist;
        closest = d;
      }
    }

    if (closest && !closest.isLit) {
      handleLightDiya(closest.id);
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
            <span>🪔</span>
            <span>DIYA MANDALA</span>
            <span>✨</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Deepotsav 21 Sacred Lamps</p>
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
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-amber-300 font-bold">Lamps Lit: {litCount} / 21</span>
        </div>
        <span className="text-[11px] text-amber-200/80 font-mono">{Math.floor((litCount / 21) * 100)}% Illuminated</span>
      </div>

      {/* Main Interactive Mandala Canvas */}
      <div className="relative w-full max-w-md flex flex-col items-center">
        <div className="relative rounded-2xl border-2 border-amber-500/50 shadow-2xl overflow-hidden bg-stone-900 touch-none flex justify-center">
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            onClick={handleCanvasClick}
            onTouchStart={handleCanvasClick}
            className="w-full max-w-[340px] h-[340px] block cursor-pointer touch-none"
          />

          {/* Devotee Bappa Icon Glow */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full border border-amber-500/30">
            <GaneshaImage className="w-5 h-5 object-contain" />
            <span className="text-[9px] text-amber-300 font-bold">Sandhya Aarti</span>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full border border-amber-500/30">
            <MushakImage className="w-5 h-5 object-contain" />
            <span className="text-[9px] text-amber-200">Mushak Lighting Lamps</span>
          </div>
        </div>

        {/* Shloka Banner */}
        <div className="w-full mt-2 festival-glass px-3 py-1.5 rounded-xl border border-amber-400/40 text-center">
          <p className="font-rozha text-xs sm:text-sm text-amber-200 tracking-wide">{activeMantra}</p>
        </div>

        {/* Controls */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={handleLightAllDevotional}
            disabled={completed}
            className="festival-button min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Light In Sequence</span>
          </button>

          <button
            onClick={initMandala}
            className="festival-glass border border-amber-500/40 text-amber-200 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 hover:bg-amber-900/40"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Lamps</span>
          </button>
        </div>

        {/* Completion Dialogue */}
        {completed && (
          <div className="w-full mt-2 festival-glass p-3 rounded-xl border-2 border-amber-300 text-center animate-in zoom-in space-y-1">
            <span className="text-2xl">✨ 🪔 🕉️</span>
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-amber-300">
              Deepotsav Mandala Complete!
            </h3>
            <p className="text-[11px] text-amber-100/90">
              May the divine light of 21 lamps dispel darkness and bring spiritual radiance to your home!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
