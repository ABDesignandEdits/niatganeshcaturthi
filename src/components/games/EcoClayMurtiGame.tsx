import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Leaf, Droplets, CheckCircle, RefreshCw, Heart } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface EcoClayMurtiGameProps {
  onBack: () => void;
}

export const EcoClayMurtiGame: React.FC<EcoClayMurtiGameProps> = ({ onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [clayProgress, setClayProgress] = useState(0);
  const [seedsPlanted, setSeedsPlanted] = useState(false);
  const [selectedPigment, setSelectedPigment] = useState<'haldi' | 'geru' | 'multani' | 'chandan'>('haldi');
  const [paintedParts, setPaintedParts] = useState<{ [key: string]: string }>({});
  const [immersionProgress, setImmersionProgress] = useState(0);
  const [plantGrown, setPlantGrown] = useState(false);
  const [ecoPoints, setEcoPoints] = useState(0);

  const PIGMENTS = [
    { id: 'haldi', name: 'Haldi Yellow', hex: '#eab308', desc: 'Pure Organic Turmeric' },
    { id: 'geru', name: 'Geru Red', hex: '#b91c1c', desc: 'Natural Earth Iron Oxide' },
    { id: 'multani', name: 'Multani Ochre', hex: '#d97706', desc: 'Fullers Earth Clay' },
    { id: 'chandan', name: 'White Chandan', hex: '#fef3c7', desc: 'Sandalwood Paste' },
  ];

  const handleKneadClay = () => {
    soundManager.playSlide();
    setClayProgress((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        soundManager.playEcoItemCollect();
        setEcoPoints((p) => p + 100);
        setTimeout(() => setStep(2), 700);
      }
      return Math.min(100, next);
    });
  };

  const handlePlantSeeds = () => {
    soundManager.playDurvaCollect();
    setSeedsPlanted(true);
    setEcoPoints((p) => p + 150);
    setTimeout(() => {
      soundManager.playPowerUp();
      setStep(3);
    }, 1000);
  };

  const handlePaintPart = (part: string) => {
    soundManager.playColorSprinkle();
    setPaintedParts((prev) => ({
      ...prev,
      [part]: PIGMENTS.find((p) => p.id === selectedPigment)?.hex || '#eab308',
    }));
  };

  const handleHomeVisarjan = () => {
    soundManager.playWaterSplash();
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setImmersionProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        soundManager.playShankhCelebration();
        setPlantGrown(true);
        setEcoPoints((p) => p + 250);
      }
    }, 450);
  };

  const handleRestart = () => {
    setStep(1);
    setClayProgress(0);
    setSeedsPlanted(false);
    setPaintedParts({});
    setImmersionProgress(0);
    setPlantGrown(false);
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
            <span>🌱</span>
            <span>ECO-CLAY MURTI WORKSHOP</span>
            <span>🌱</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Shadu Mati Sculpting & Sprouting Tree Visarjan
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-emerald-300">{ecoPoints} Eco Pts</span>
        </div>
      </header>

      {/* Main Workshop Area */}
      <div className="w-full max-w-md my-auto flex flex-col items-center p-4 festival-glass rounded-3xl border-2 border-emerald-500/40 text-center space-y-4 shadow-2xl">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Step {step} of 4:
          </span>
          <span className="text-xs text-amber-200 font-semibold">
            {step === 1 && 'Shape Pure River Clay (Shadu Mati)'}
            {step === 2 && 'Embed Living Seeds (Tulsi & Marigold)'}
            {step === 3 && 'Paint with Natural Plant Pigments'}
            {step === 4 && 'Eco Home Visarjan & Sprouting Miracle'}
          </span>
        </div>

        {/* Dynamic Interactive Stage Viewer */}
        <div className="relative w-64 h-64 mx-auto rounded-2xl bg-stone-900/80 border-2 border-emerald-500/30 flex flex-col items-center justify-center p-4 shadow-inner">
          {/* Step 1: Knead & Shape River Clay */}
          {step === 1 && (
            <div className="space-y-3">
              <div
                style={{ transform: `scale(${0.8 + clayProgress * 0.003})` }}
                className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-stone-700 via-amber-900/60 to-stone-600 border-4 border-stone-500 shadow-2xl flex flex-col items-center justify-center text-3xl transition-transform"
              >
                <span>🗿</span>
                <span className="text-[10px] text-amber-200 font-mono">Shadu Clay</span>
              </div>
              <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-emerald-500/30">
                <div
                  className="bg-emerald-400 h-2.5 rounded-full transition-all"
                  style={{ width: `${clayProgress}%` }}
                />
              </div>
              <button
                onClick={handleKneadClay}
                className="festival-button px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 cursor-pointer shadow-md"
              >
                KNEAD NATURAL CLAY ({clayProgress}%)
              </button>
            </div>
          )}

          {/* Step 2: Plant Seeds Inside Clay Heart */}
          {step === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="relative w-28 h-28 mx-auto rounded-full bg-stone-700 border-4 border-stone-500 flex items-center justify-center shadow-xl">
                <span className="text-4xl">🌱</span>
                {seedsPlanted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/70 rounded-full text-xs text-emerald-200 font-bold animate-pulse">
                    Seeds Blessed!
                  </div>
                )}
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed px-2">
                Traditional eco-friendly idols contain flowering seeds. When immersed in a flowerpot, Bappa blossoms into a holy Tulsi or Marigold tree!
              </p>
              <button
                onClick={handlePlantSeeds}
                disabled={seedsPlanted}
                className="festival-button px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 cursor-pointer shadow-md"
              >
                {seedsPlanted ? 'SEEDS EMBEDDED ✨' : 'PLANT TULSI & MARIGOLD SEEDS'}
              </button>
            </div>
          )}

          {/* Step 3: Paint with Organic Pigments */}
          {step === 3 && (
            <div className="space-y-2 animate-in fade-in">
              <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center">
                {/* Clickable Murti Parts to Paint */}
                <button
                  onClick={() => handlePaintPart('crown')}
                  style={{ backgroundColor: paintedParts['crown'] || '#57534e' }}
                  className="w-14 h-8 rounded-t-xl border border-amber-400 text-[10px] font-bold text-stone-900 cursor-pointer transition-colors"
                >
                  Crown
                </button>
                <button
                  onClick={() => handlePaintPart('face')}
                  style={{ backgroundColor: paintedParts['face'] || '#78716c' }}
                  className="w-20 h-14 rounded-full border border-amber-400 text-[10px] font-bold text-stone-900 cursor-pointer flex items-center justify-center transition-colors"
                >
                  Trunk
                </button>
                <button
                  onClick={() => handlePaintPart('body')}
                  style={{ backgroundColor: paintedParts['body'] || '#44403c' }}
                  className="w-24 h-14 rounded-b-2xl border border-amber-400 text-[10px] font-bold text-stone-900 cursor-pointer transition-colors"
                >
                  Robe
                </button>
              </div>

              <div className="text-[11px] text-emerald-300 font-bold">
                Tap parts to paint with 100% natural, chemical-free dyes!
              </div>

              <button
                onClick={() => {
                  soundManager.playPowerUp();
                  setStep(4);
                }}
                className="festival-button px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                READY FOR ECO-VISARJAN ➔
              </button>
            </div>
          )}

          {/* Step 4: Home Eco-Visarjan in Earthen Pot */}
          {step === 4 && (
            <div className="space-y-3 animate-in fade-in">
              {!plantGrown ? (
                <>
                  <div className="text-5xl animate-pulse">
                    {immersionProgress > 50 ? '🪴💧' : '🏺🗿'}
                  </div>
                  <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-emerald-500/30">
                    <div
                      className="bg-emerald-400 h-2.5 rounded-full transition-all"
                      style={{ width: `${immersionProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-amber-200">
                    Pouring pure water into the earthen planter... Bappa is giving life back to Mother Earth!
                  </p>
                  <button
                    onClick={handleHomeVisarjan}
                    disabled={immersionProgress > 0}
                    className="festival-button px-5 py-2.5 rounded-xl text-xs font-bold active:scale-95 cursor-pointer shadow-md"
                  >
                    {immersionProgress > 0 ? `IMMERSED ${immersionProgress}%` : 'POUR WATER IN PLANTER 💧'}
                  </button>
                </>
              ) : (
                <div className="space-y-2 animate-in zoom-in">
                  <div className="text-5xl animate-bounce">🪴🌺🦋</div>
                  <h4 className="font-cinzel font-bold text-emerald-300 text-base">
                    Bappa has Blossomed!
                  </h4>
                  <p className="text-[11px] text-amber-100/90 leading-tight">
                    Your eco-friendly murti dissolved safely into nutrient-rich soil. A blessed flowering tree is now growing in your home garden!
                  </p>
                  <button
                    onClick={handleRestart}
                    className="festival-glass px-4 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-950/60"
                  >
                    Sculpt Another Murti
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3 Pigment Selector (visible only in step 3) */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-2 w-full text-left">
            {PIGMENTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPigment(p.id as any)}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  selectedPigment === p.id
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50'
                    : 'bg-black/40 border-stone-800 hover:border-emerald-500/30'
                }`}
              >
                <div style={{ backgroundColor: p.hex }} className="w-5 h-5 rounded-full shrink-0 border" />
                <div>
                  <div className="text-xs font-bold text-amber-200">{p.name}</div>
                  <div className="text-[9px] text-amber-300/60">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-emerald-300/80 border-t border-emerald-900/30">
        Say NO to Plaster of Paris (PoP) & toxic dyes • Embrace Tree Ganesha & pure river Shadu clay!
      </footer>
    </div>
  );
};
