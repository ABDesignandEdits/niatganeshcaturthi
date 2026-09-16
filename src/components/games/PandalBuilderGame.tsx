import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, Camera, RefreshCw, Layers } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface PandalBuilderGameProps {
  onBack: () => void;
}

export const PandalBuilderGame: React.FC<PandalBuilderGameProps> = ({ onBack }) => {
  const [theme, setTheme] = useState<'darbar' | 'eco' | 'suvarna' | 'vrindavan'>('darbar');
  const [drapeColor, setDrapeColor] = useState<'crimson' | 'saffron' | 'peacock' | 'emerald'>('crimson');
  const [toran, setToran] = useState<'marigold' | 'lotus' | 'mango'>('marigold');
  const [lighting, setLighting] = useState<'fairy' | 'chandelier' | 'samai'>('samai');
  const [prasadTray, setPrasadTray] = useState<'modak' | 'laddoo' | 'fruits'>('modak');
  const [bananaStalks, setBananaStalks] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [darshanPhotoCard, setDarshanPhotoCard] = useState(false);

  const handleSelectOption = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, val: T) => {
    soundManager.userInteracted();
    if (soundOn) soundManager.playFlowerCollect();
    setter(val);
  };

  const getThemeBg = () => {
    switch (theme) {
      case 'darbar':
        return 'from-amber-950 via-red-950 to-stone-950';
      case 'eco':
        return 'from-emerald-950 via-stone-900 to-amber-950';
      case 'suvarna':
        return 'from-yellow-950 via-amber-900 to-stone-950';
      case 'vrindavan':
        return 'from-purple-950 via-rose-950 to-stone-950';
      default:
        return 'from-amber-950 via-stone-900 to-amber-950';
    }
  };

  const getDrapeBg = () => {
    switch (drapeColor) {
      case 'crimson':
        return 'bg-red-800/80 border-red-600';
      case 'saffron':
        return 'bg-amber-600/80 border-amber-400';
      case 'peacock':
        return 'bg-cyan-800/80 border-cyan-500';
      case 'emerald':
        return 'bg-emerald-800/80 border-emerald-500';
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
            <span>🏛️</span>
            <span>PANDAL BUILDER</span>
            <span>✨</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Festival Mandap Decorator</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Pandal Live Preview Stage */}
      <div className="relative w-full max-w-md my-2 rounded-2xl border-2 border-amber-400/60 shadow-2xl overflow-hidden bg-gradient-to-b flex flex-col items-center p-3 sm:p-4 min-h-[300px]">
        {/* Pandal Backdrop Layer */}
        <div className={`absolute inset-0 bg-gradient-to-b ${getThemeBg()}`} />

        {/* Velvet Drapes */}
        <div className="absolute top-0 inset-x-0 h-16 flex justify-between px-2 pointer-events-none">
          <div className={`w-14 sm:w-16 h-full rounded-b-3xl border-b-2 shadow-lg ${getDrapeBg()}`} />
          <div className={`w-28 sm:w-36 h-10 rounded-b-full border-b-2 shadow-lg ${getDrapeBg()}`} />
          <div className={`w-14 sm:w-16 h-full rounded-b-3xl border-b-2 shadow-lg ${getDrapeBg()}`} />
        </div>

        {/* Toran Garland along ceiling */}
        <div className="absolute top-12 inset-x-3 flex justify-around text-base sm:text-lg pointer-events-none z-10">
          {toran === 'marigold' && <span>🌼 🏵️ 🌼 🏵️ 🌼 🏵️ 🌼</span>}
          {toran === 'lotus' && <span>🪷 🌺 🪷 🌺 🪷 🌺 🪷</span>}
          {toran === 'mango' && <span>🍃 🥭 🍃 🥭 🍃 🥭 🍃</span>}
        </div>

        {/* Lighting Elements */}
        {lighting === 'fairy' && (
          <div className="absolute top-4 inset-x-4 flex justify-between text-yellow-300 animate-pulse pointer-events-none">
            <span>✨</span>
            <span>⭐</span>
            <span>✨</span>
            <span>⭐</span>
            <span>✨</span>
          </div>
        )}
        {lighting === 'chandelier' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl text-amber-200 pointer-events-none animate-diya-glow">
            💎 👑 💎
          </div>
        )}

        {/* Banana Stalks on flanks */}
        {bananaStalks && (
          <>
            <div className="absolute bottom-6 left-2 text-2xl pointer-events-none">🌴</div>
            <div className="absolute bottom-6 right-2 text-2xl pointer-events-none">🌴</div>
          </>
        )}

        {/* Central Murti Throne & Lord Ganesha */}
        <div className="relative z-10 flex flex-col items-center mt-12 sm:mt-14">
          <div className="w-24 h-24 rounded-full bg-amber-400/20 blur-xl absolute top-6 pointer-events-none" />
          <GaneshaImage className="w-36 h-36 sm:w-40 sm:h-40 object-contain drop-shadow-2xl animate-float" />

          {/* Faithful Mushak Guard */}
          <div className="absolute bottom-0 right-4 bg-stone-900/90 p-1 rounded-full border border-amber-400/60 shadow">
            <MushakImage className="w-7 h-7 object-contain" />
          </div>

          {/* Brass Samai Lamps on bottom left */}
          {lighting === 'samai' && (
            <div className="absolute bottom-1 left-4 text-xl pointer-events-none animate-diya-glow">
              🪔
            </div>
          )}

          {/* Prasad Thali in front */}
          <div className="mt-1 px-3 py-1 bg-amber-950/90 rounded-full border border-amber-400/50 flex items-center gap-1 text-xs shadow-md">
            {prasadTray === 'modak' && <span>🥟 21 Modak Maha-Thali</span>}
            {prasadTray === 'laddoo' && <span>🟡 Motichoor Laddoo Plate</span>}
            {prasadTray === 'fruits' && <span>🥥 🍌 Coconut & Panchamrit</span>}
          </div>
        </div>

        {/* Photo Mode Snapshot Overlay */}
        {darshanPhotoCard && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-30 text-center animate-in zoom-in">
            <div className="festival-glass p-4 rounded-2xl border-2 border-amber-300 max-w-xs space-y-2">
              <span className="text-2xl">📸 🕉️ 🪔</span>
              <h3 className="font-cinzel text-base font-bold text-amber-300">Pandal Darshan Card</h3>
              <p className="text-xs text-amber-100/90">
                "{theme.toUpperCase()} UTSAV MANDAP"
              </p>
              <div className="text-[10px] text-amber-200/70 font-rozha">
                Ganpati Bappa Morya! Blessed Festival Wishes!
              </div>
              <button
                onClick={() => setDarshanPhotoCard(false)}
                className="festival-button w-full py-2 rounded-xl text-xs font-bold mt-2"
              >
                Close Photo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customization Toolset Tabs */}
      <div className="w-full max-w-md my-1 space-y-2">
        {/* Themes */}
        <div className="festival-glass p-2 rounded-xl border border-amber-500/30 text-xs">
          <div className="text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Pandal Theme:</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'darbar', label: 'Maratha' },
              { id: 'eco', label: 'Eco Lotus' },
              { id: 'suvarna', label: 'Suvarna' },
              { id: 'vrindavan', label: 'Vrindavan' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectOption(setTheme, t.id as any)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold border text-center transition-all ${
                  theme === t.id
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-300'
                    : 'bg-stone-900/60 border-amber-500/20 text-amber-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toran & Lighting */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="festival-glass p-2 rounded-xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 font-bold mb-1">Floral Toran:</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'marigold', sym: '🌼' },
                { id: 'lotus', sym: '🪷' },
                { id: 'mango', sym: '🍃' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectOption(setToran, item.id as any)}
                  className={`py-1 rounded border text-sm ${
                    toran === item.id ? 'bg-amber-500 border-amber-300 text-stone-900' : 'border-amber-500/20 bg-stone-900/60'
                  }`}
                >
                  {item.sym}
                </button>
              ))}
            </div>
          </div>

          <div className="festival-glass p-2 rounded-xl border border-amber-500/30">
            <div className="text-[10px] text-amber-300 font-bold mb-1">Lighting Setup:</div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'samai', sym: '🪔' },
                { id: 'chandelier', sym: '💎' },
                { id: 'fairy', sym: '✨' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectOption(setLighting, item.id as any)}
                  className={`py-1 rounded border text-sm ${
                    lighting === item.id ? 'bg-amber-500 border-amber-300 text-stone-900' : 'border-amber-500/20 bg-stone-900/60'
                  }`}
                >
                  {item.sym}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prasad Offering Type */}
        <div className="festival-glass p-2 rounded-xl border border-amber-500/30 text-xs">
          <div className="text-[10px] text-amber-300 font-bold mb-1">Divine Prasad Thali:</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'modak', label: '🥟 21 Modak' },
              { id: 'laddoo', label: '🟡 Laddoos' },
              { id: 'fruits', label: '🥥 Coconut' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectOption(setPrasadTray, p.id as any)}
                className={`py-1 px-1 rounded text-[10px] font-semibold border ${
                  prasadTray === p.id ? 'bg-amber-500 text-stone-950 font-bold border-amber-300' : 'border-amber-500/20 bg-stone-900/60 text-amber-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Snapshot / Darshan Photo Button */}
        <button
          onClick={() => {
            soundManager.userInteracted();
            if (soundOn) soundManager.playShankhCelebration();
            setDarshanPhotoCard(true);
          }}
          className="festival-button w-full min-h-[44px] py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-500/20"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Pandal Darshan Photo</span>
        </button>
      </div>
    </div>
  );
};
