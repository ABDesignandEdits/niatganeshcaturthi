import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sparkles, RotateCcw, Download, Check, Volume2, VolumeX, Eye } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface RangoliGameProps {
  onBack: () => void;
}

type SymmetryMode = '8-fold' | '4-fold' | 'freehand';

interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
}

const RANGOLI_PALETTE = [
  { name: 'Sindoor Red', hex: '#e11d48', label: '🔴' },
  { name: 'Haldi Yellow', hex: '#facc15', label: '🟡' },
  { name: 'Gulal Pink', hex: '#ec4899', label: '🌸' },
  { name: 'Emerald Green', hex: '#10b981', label: '🟢' },
  { name: 'Peacock Blue', hex: '#0284c7', label: '🦚' },
  { name: 'Kesari Orange', hex: '#f97316', label: '🟠' },
  { name: 'Rice White', hex: '#ffffff', label: '⚪' },
  { name: 'Golden Glitter', hex: '#f59e0b', label: '✨' },
];

export const RangoliGame: React.FC<RangoliGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeColor, setActiveColor] = useState('#facc15');
  const [brushSize, setBrushSize] = useState(8);
  const [symmetry, setSymmetry] = useState<SymmetryMode>('8-fold');
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'free' | 'ganesha' | 'lotus' | 'diya'>('free');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [petals, setPetals] = useState<Array<{ x: number; y: number; type: 'marigold' | 'rose'; rot: number }>>([]);
  const [diyas, setDiyas] = useState<Array<{ x: number; y: number }>>([]);
  const [toolMode, setToolMode] = useState<'brush' | 'petal' | 'diya'>('brush');
  const [savedNotice, setSavedNotice] = useState(false);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark terracotta temple stone floor background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      20,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.7
    );
    gradient.addColorStop(0, '#2d0c03');
    gradient.addColorStop(1, '#130401');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle stone ring
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.42, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.28, 0, Math.PI * 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.14, 0, Math.PI * 2);
    ctx.stroke();

    // Save blank state
    const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory([blank]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set internal resolution safely fitting mobile screens without clipping borders
    const size = Math.min(window.innerWidth - 44, 480);
    canvas.width = size;
    canvas.height = size;
    initCanvas();
  }, [initCanvas]);

  // Save undo state
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev.slice(-15), data]);
  };

  const handleUndo = () => {
    if (strokeHistory.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokeHistory];
    newHistory.pop(); // remove current
    const prev = newHistory[newHistory.length - 1];
    ctx.putImageData(prev, 0, 0);
    setStrokeHistory(newHistory);
    soundManager.playSlide();
  };

  const handleClear = () => {
    initCanvas();
    setPetals([]);
    setDiyas([]);
    soundManager.playSlide();
  };

  // Draw symmetric powder dots & strokes
  const drawSymmetricLine = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const numSymmetries = symmetry === '8-fold' ? 8 : symmetry === '4-fold' ? 4 : 1;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = activeColor;
    ctx.shadowBlur = activeColor === '#f59e0b' ? 8 : 2;
    ctx.shadowColor = activeColor;

    for (let i = 0; i < numSymmetries; i++) {
      const angle = (i * 2 * Math.PI) / numSymmetries;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Normal ray
      const rx1 = x1 - cx;
      const ry1 = y1 - cy;
      const rx2 = x2 - cx;
      const ry2 = y2 - cy;

      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();

      // Mirror reflection for radial mandala look
      if (symmetry !== 'freehand') {
        ctx.beginPath();
        ctx.moveTo(-rx1, ry1);
        ctx.lineTo(-rx2, ry2);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  };

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getCanvasPos(e);
    if (!pos) return;

    if (toolMode === 'petal') {
      soundManager.playFlowerCollect();
      setPetals((prev) => [
        ...prev,
        {
          x: pos.x,
          y: pos.y,
          type: Math.random() > 0.5 ? 'marigold' : 'rose',
          rot: Math.random() * Math.PI * 2,
        },
      ]);
      return;
    }

    if (toolMode === 'diya') {
      soundManager.playDiyaCollect();
      setDiyas((prev) => [...prev, { x: pos.x, y: pos.y }]);
      return;
    }

    setIsDrawing(true);
    setLastPoint(pos);
    if (soundOn) soundManager.playColorSprinkle();
    drawSymmetricLine(pos.x, pos.y, pos.x + 0.1, pos.y + 0.1);
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !lastPoint || toolMode !== 'brush') return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    if (!pos) return;

    drawSymmetricLine(lastPoint.x, lastPoint.y, pos.x, pos.y);
    setLastPoint(pos);
  };

  const stopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPoint(null);
      saveState();
    }
  };

  // Pre-drawn template outlines to guide devotion
  const drawTemplateGuide = (template: 'ganesha' | 'lotus' | 'diya') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    ctx.save();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = canvas.width * 0.35;

    if (template === 'lotus') {
      // Draw 8 lotus petals
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(r * 0.4, -r * 0.6, 0, -r);
        ctx.quadraticCurveTo(-r * 0.4, -r * 0.6, 0, 0);
        ctx.stroke();
        ctx.restore();
      }
    } else if (template === 'ganesha') {
      // Sacred Ganesha face / ॐ motif outline
      ctx.beginPath();
      // Trunk curve
      ctx.arc(cx, cy - 20, 50, 0, Math.PI * 1.5, false);
      ctx.bezierCurveTo(cx - 30, cy + 40, cx - 10, cy + 90, cx - 40, cy + 110);
      ctx.stroke();

      // Ears
      ctx.beginPath();
      ctx.arc(cx - 70, cy - 30, 35, 0, Math.PI * 2);
      ctx.arc(cx + 70, cy - 30, 35, 0, Math.PI * 2);
      ctx.stroke();

      // Crown / Tilak
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 80);
      ctx.lineTo(cx, cy - 130);
      ctx.lineTo(cx + 30, cy - 80);
      ctx.closePath();
      ctx.stroke();
    } else if (template === 'diya') {
      // Central Diya guide
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 80, 35, 0, 0, Math.PI);
      ctx.lineTo(cx + 80, cy + 30);
      ctx.stroke();
      // Flame
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy + 30);
      ctx.quadraticCurveTo(cx + 25, cy - 70, cx, cy - 100);
      ctx.quadraticCurveTo(cx - 25, cy - 70, cx + 20, cy + 30);
      ctx.stroke();
    }

    ctx.restore();
    soundManager.playPowerUp();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = 'bappa_sacred_rangoli.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
      soundManager.playPowerUp();
    } catch {
      // Ignore
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
            <span>🌸</span>
            <span>RANGOLI UTSAV</span>
            <span>🌸</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Sacred Festive Symmetry & Powder Art
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
            title="Toggle Sound"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl festival-glass border border-amber-400/50 bg-amber-500/20 text-amber-200 hover:text-white text-xs font-bold active:scale-95"
            title="Save Rangoli"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {/* Main Canvas Workspace */}
      <div className="relative my-2 flex items-center justify-center">
        <div className="relative rounded-2xl sm:rounded-3xl border-4 border-amber-500/60 shadow-2xl shadow-amber-600/30 overflow-hidden bg-stone-950 touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={drawMove}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={drawMove}
            onTouchEnd={stopDraw}
            className="block cursor-crosshair touch-none"
          />

          {/* Render scattered flower petals */}
          {petals.map((petal, idx) => (
            <div
              key={`petal-${idx}`}
              style={{
                left: petal.x - 8,
                top: petal.y - 8,
                transform: `rotate(${petal.rot}rad)`,
              }}
              className="absolute pointer-events-none text-base sm:text-lg animate-fade-in select-none"
            >
              {petal.type === 'marigold' ? '🌼' : '🌹'}
            </div>
          ))}

          {/* Render glowing placed diyas */}
          {diyas.map((diya, idx) => (
            <div
              key={`diya-${idx}`}
              style={{
                left: diya.x - 14,
                top: diya.y - 14,
              }}
              className="absolute pointer-events-none text-xl sm:text-2xl animate-pulse select-none"
            >
              🪔
            </div>
          ))}
        </div>

        {savedNotice && (
          <div className="absolute top-4 bg-emerald-950/90 text-emerald-200 border border-emerald-500/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Blessed Rangoli Saved to Gallery!</span>
          </div>
        )}
      </div>

      {/* Tool & Palette Controls Panel */}
      <div className="w-full max-w-2xl bg-amber-950/70 festival-glass rounded-2xl p-2.5 sm:p-3 border border-amber-500/40 space-y-2">
        {/* Row 1: Mode Selectors (Brush, Flower Petals, Glowing Diya) */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-amber-500/20">
            <button
              onClick={() => setToolMode('brush')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                toolMode === 'brush' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
              }`}
            >
              🎨 Powder
            </button>
            <button
              onClick={() => setToolMode('petal')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                toolMode === 'petal' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
              }`}
            >
              🌼 Petals
            </button>
            <button
              onClick={() => setToolMode('diya')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                toolMode === 'diya' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
              }`}
            >
              🪔 Diya
            </button>
          </div>

          {/* Symmetry Mode */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20">
            <span className="text-[10px] text-amber-300 font-semibold px-1">Symmetry:</span>
            {(['8-fold', '4-fold', 'freehand'] as SymmetryMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSymmetry(mode)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                  symmetry === mode ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50' : 'text-amber-200/60'
                }`}
              >
                {mode === '8-fold' ? '8x Mandala' : mode === '4-fold' ? '4x Kolam' : 'Free'}
              </button>
            ))}
          </div>

          {/* Undo & Clear */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              className="p-1.5 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 text-xs flex items-center gap-1"
              title="Undo Stroke"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1 rounded-lg bg-stone-900 border border-red-500/30 text-red-300 hover:bg-red-950/50 text-xs font-bold"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Row 2: Color Palette Swatches */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
          {RANGOLI_PALETTE.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setActiveColor(c.hex);
                setToolMode('brush');
                if (soundOn) soundManager.playColorSprinkle();
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                activeColor === c.hex && toolMode === 'brush'
                  ? 'border-white scale-115 shadow-lg shadow-amber-400/50 ring-2 ring-amber-400'
                  : 'border-stone-900/60 hover:scale-105 opacity-90'
              }`}
              title={c.name}
            >
              {activeColor === c.hex && toolMode === 'brush' && (
                <span className="text-stone-950 font-black text-xs">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Row 3: Brush Thickness & Auspicious Guide Templates */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-amber-300 font-bold">Brush:</span>
            {[4, 8, 14, 22].map((sz) => (
              <button
                key={sz}
                onClick={() => setBrushSize(sz)}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                  brushSize === sz
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-black/40 text-amber-200 border-amber-500/20'
                }`}
              >
                {sz < 10 ? '•' : '●'}
              </button>
            ))}
          </div>

          {/* Guide Outlines */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase text-amber-300 font-bold">Guides:</span>
            <button
              onClick={() => drawTemplateGuide('ganesha')}
              className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-800/60 border border-amber-500/30 text-amber-200 text-[11px] font-semibold"
            >
              ॐ Ganesha
            </button>
            <button
              onClick={() => drawTemplateGuide('lotus')}
              className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-800/60 border border-amber-500/30 text-amber-200 text-[11px] font-semibold"
            >
              🪷 Lotus
            </button>
            <button
              onClick={() => drawTemplateGuide('diya')}
              className="px-2 py-0.5 rounded bg-amber-900/50 hover:bg-amber-800/60 border border-amber-500/30 text-amber-200 text-[11px] font-semibold"
            >
              🪔 Diya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
