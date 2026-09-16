import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, RotateCw, Heart } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface GaneshaShringaarGameProps {
  onBack: () => void;
}

export const GaneshaShringaarGame: React.FC<GaneshaShringaarGameProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<'shringaar' | 'aarti'>('shringaar');
  const [soundOn, setSoundOn] = useState(true);

  // Shringaar Selections
  const [crown, setCrown] = useState<'gold' | 'pheta' | 'kalgi' | 'pearl'>('pheta');
  const [robeColor, setRobeColor] = useState<'saffron' | 'crimson' | 'emerald' | 'purple'>('saffron');
  const [garland, setGarland] = useState<'marigold' | 'hibiscus' | 'jasmine' | 'durva'>('hibiscus');
  const [tilak, setTilak] = useState<'chandan' | 'sindoor' | 'trishul'>('sindoor');
  const [prasad, setPrasad] = useState<'modak' | 'laddu' | 'coconut'>('modak');

  // Aarti State
  const [aartiRotations, setAartiRotations] = useState(0);
  const [blessingScore, setBlessingScore] = useState(108);
  const [isRotating, setIsRotating] = useState(false);
  const [showeringPetals, setShoweringPetals] = useState(false);

  // Aarti Thali Position for circular dragging
  const [thaliAngle, setThaliAngle] = useState(0);
  const aartiCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const triggerShankh = () => {
    soundManager.userInteracted();
    soundManager.playShankhCelebration();
    setBlessingScore((s) => s + 50);
  };

  const triggerFlowerShower = () => {
    soundManager.userInteracted();
    soundManager.playFlowerCollect();
    setShoweringPetals(true);
    setBlessingScore((s) => s + 25);
    setTimeout(() => setShoweringPetals(false), 2500);
  };

  // Clockwise Aarti Rotation Handling
  const handleAartiPointerMove = (clientX: number, clientY: number) => {
    if (!containerRef.current || activeMode !== 'aarti') return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const angleRad = Math.atan2(clientY - cy, clientX - cx);
    const angleDeg = ((angleRad * 180) / Math.PI + 360) % 360;

    // Detect clockwise completion
    const diff = (angleDeg - thaliAngle + 360) % 360;
    if (diff > 0 && diff < 90) {
      setThaliAngle(angleDeg);
      if (Math.abs(angleDeg - 360) < 15 || (thaliAngle > 340 && angleDeg < 30)) {
        setAartiRotations((r) => {
          const next = r + 1;
          soundManager.playTempleBell();
          setBlessingScore((s) => s + 10);
          return next;
        });
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-stone-950 text-amber-50 flex flex-col items-center justify-start py-2 px-3 sm:px-4 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Top Header Navigation */}
      <header className="w-full max-w-2xl flex items-center justify-between py-1 sm:py-2 border-b border-amber-500/30">
        <button
          onClick={() => {
            soundManager.userInteracted();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl festival-glass border border-amber-500/40 text-amber-300 hover:text-amber-100 active:scale-95 text-xs sm:text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Festival Hub</span>
        </button>

        <div className="text-center">
          <h1 className="font-cinzel text-base sm:text-xl font-bold text-amber-300 flex items-center justify-center gap-1.5">
            <span>🪔</span>
            <span>SHRINGAAR & AARTI</span>
            <span>🪔</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Divine Murti Decoration & Clockwise Aarti Darshan
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20 text-xs">
          <button
            onClick={() => setActiveMode('shringaar')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeMode === 'shringaar' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
            }`}
          >
            Shringaar
          </button>
          <button
            onClick={() => {
              setActiveMode('aarti');
              soundManager.playTempleBell();
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeMode === 'aarti' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
            }`}
          >
            Aarti Darshan
          </button>
        </div>
      </header>

      {/* Main Idol Sanctum */}
      <div
        ref={containerRef}
        onMouseMove={(e) => handleAartiPointerMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          if (e.touches.length > 0) handleAartiPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        className="relative w-full max-w-md h-[380px] sm:h-[420px] my-2 rounded-3xl bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 border-2 border-amber-400/50 shadow-2xl flex flex-col items-center justify-center overflow-hidden touch-none"
      >
        {/* Sacred Golden Temple Arch (Prabhavali) */}
        <div className="absolute inset-x-6 top-4 h-64 border-t-4 border-x-4 border-amber-400/60 rounded-t-full pointer-events-none shadow-inner" />

        {/* Floating marigold & rose petals during shower */}
        {showeringPetals && (
          <div className="absolute inset-0 pointer-events-none z-30 flex flex-wrap justify-around items-start animate-bounce">
            {['🌺', '🌼', '🌸', '🌹', '✨', '🌼', '🌺', '🌹', '✨'].map((p, i) => (
              <span key={i} className="text-2xl animate-spin" style={{ animationDuration: `${2 + i * 0.3}s` }}>
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Lord Ganesha Murti Representation with Authentic Uploaded Image */}
        <div className="relative flex flex-col items-center justify-center mt-2 scale-105">
          {/* Aura / Divine Halo */}
          <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-400/30 to-orange-500/10 filter blur-xl animate-pulse pointer-events-none" />

          {/* Primary Divine Murti Image */}
          <div className="relative z-10 flex flex-col items-center">
            <GaneshaImage className="w-56 h-56 sm:w-64 sm:h-64 object-contain filter drop-shadow-2xl" />

            {/* Dynamic Garland Overlay at chest */}
            <div className="absolute top-28 z-20 flex items-center justify-center gap-1 drop-shadow-lg px-2 py-0.5 rounded-full bg-black/20 backdrop-blur-xs">
              {garland === 'hibiscus' && <span className="text-xl">🌺 🌺 🌺</span>}
              {garland === 'marigold' && <span className="text-xl">🌼 🌼 🌼</span>}
              {garland === 'jasmine' && <span className="text-xl">🌸 🌸 🌸</span>}
              {garland === 'durva' && <span className="text-xl">🌿 🌿 🌿</span>}
            </div>

            {/* Dynamic Tilak Badge Glow */}
            <div className="absolute top-14 z-20 flex flex-col items-center">
              {tilak === 'sindoor' && <span className="text-xs text-red-500 drop-shadow font-bold">🔴 Sindoor</span>}
              {tilak === 'chandan' && <span className="text-xs text-amber-200 drop-shadow font-bold">||| Chandan</span>}
              {tilak === 'trishul' && <span className="text-xs text-orange-400 drop-shadow font-bold">🔱 Trishul</span>}
            </div>

            {/* Prasad Plate at Base */}
            <div className="absolute bottom-2 left-6 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 shadow-md">
              <span className="text-base">{prasad === 'modak' ? '🥟' : prasad === 'laddu' ? '🟡' : '🥥'}</span>
              <span className="text-[10px] text-amber-200 font-bold uppercase">{prasad}</span>
            </div>
          </div>

          {/* Sacred Mushak (Mouse Devotee) sitting faithfully at feet from User Image */}
          <div className="absolute -bottom-2 -right-4 z-20 flex items-center gap-1.5 bg-stone-950/85 px-2.5 py-1 rounded-2xl border border-amber-400/60 shadow-xl">
            <MushakImage className="w-9 h-9 object-contain drop-shadow" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-amber-300 font-bold leading-tight">Mushak</span>
              <span className="text-[8px] text-amber-200/70 leading-none">Devotee</span>
            </div>
          </div>
        </div>

        {/* Interactive Clockwise Aarti Diya Thali (Visible in Aarti mode) */}
        {activeMode === 'aarti' && (
          <div
            style={{
              left: `calc(50% + ${Math.cos((thaliAngle * Math.PI) / 180) * 110}px - 28px)`,
              top: `calc(50% + ${Math.sin((thaliAngle * Math.PI) / 180) * 110}px - 28px)`,
            }}
            className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-2 border-amber-200 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing z-30 transition-transform hover:scale-110"
          >
            <span className="text-2xl animate-pulse">🪔</span>
          </div>
        )}

        {/* Aarti Rotating Instructions Overlay */}
        {activeMode === 'aarti' && (
          <div className="absolute bottom-2 inset-x-4 bg-black/60 backdrop-blur-sm p-2 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-amber-200 text-[11px]">Rotate Diya Clockwise</span>
            </div>
            <div className="text-amber-300 font-bold">Rotations: {aartiRotations} 🪔</div>
          </div>
        )}
      </div>

      {/* Mode Controls Panel */}
      {activeMode === 'shringaar' ? (
        <div className="w-full max-w-md bg-amber-950/70 festival-glass rounded-2xl p-3 border border-amber-500/40 space-y-2.5">
          {/* Row 1: Crown & Pagdi */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-300">Headgear:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'pheta', label: 'Puneri Pheta 👳' },
                { id: 'gold', label: 'Gold Crown 👑' },
                { id: 'kalgi', label: 'Kalgi Mukut ✨' },
                { id: 'pearl', label: 'Pearl Sehra 🪱' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCrown(c.id as any);
                    soundManager.playPowerUp();
                  }}
                  className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                    crown === c.id ? 'bg-amber-500 text-stone-950 shadow' : 'bg-black/40 text-amber-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Silken Robe (Pitambar) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-300">Silk Robe:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'saffron', label: 'Kesari 🟠' },
                { id: 'crimson', label: 'Raktambari 🔴' },
                { id: 'emerald', label: 'Emerald 🟢' },
                { id: 'purple', label: 'Royal 🟣' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setRobeColor(r.id as any);
                    soundManager.playSlide();
                  }}
                  className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                    robeColor === r.id ? 'bg-amber-500 text-stone-950 shadow' : 'bg-black/40 text-amber-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Sacred Garlands */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-300">Garland:</span>
            <div className="flex gap-1.5">
              {[
                { id: 'hibiscus', label: 'Hibiscus 🌺' },
                { id: 'marigold', label: 'Marigold 🌼' },
                { id: 'jasmine', label: 'Mogra 🌸' },
                { id: 'durva', label: '21 Durva 🌿' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGarland(g.id as any);
                    soundManager.playFlowerCollect();
                  }}
                  className={`px-2 py-1 rounded-lg font-semibold text-[11px] ${
                    garland === g.id ? 'bg-amber-500 text-stone-950 shadow' : 'bg-black/40 text-amber-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Aarti Special Devotion Actions */
        <div className="w-full max-w-md bg-amber-950/70 festival-glass rounded-2xl p-3 border border-amber-500/40 flex items-center justify-between gap-2">
          <button
            onClick={triggerShankh}
            className="flex-1 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md"
          >
            <span>🐚</span>
            <span>BLOW SHANKH (+50)</span>
          </button>
          <button
            onClick={triggerFlowerShower}
            className="flex-1 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md"
          >
            <span>🌺</span>
            <span>FLOWER SHOWER (+25)</span>
          </button>
          <div className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-center">
            <div className="text-[9px] text-amber-300 font-bold uppercase">Blessings</div>
            <div className="font-cinzel text-base font-black text-amber-400">{blessingScore}</div>
          </div>
        </div>
      )}

      {/* Sacred Mantra Footer */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-amber-200/80 font-rozha">
        "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ • निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा"
      </footer>
    </div>
  );
};
