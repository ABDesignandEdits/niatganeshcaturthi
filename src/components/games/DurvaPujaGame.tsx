import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, CheckCircle, RefreshCw } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface DurvaPujaGameProps {
  onBack: () => void;
}

interface PujaStep {
  name: string;
  mantra: string;
  item: 'durva' | 'hibiscus' | 'marigold' | 'chandan' | 'akshat';
  symbol: string;
  targetArea: 'feet' | 'heart' | 'forehead' | 'crown' | 'thali';
}

const PUJA_STEPS: PujaStep[] = [
  { name: '1st Durva Offering', mantra: 'ॐ गणाधिपाय नमः दुर्वाङ्कुरान् समर्पयामि', item: 'durva', symbol: '🌱', targetArea: 'feet' },
  { name: '2nd Durva Offering', mantra: 'ॐ उमापुत्राय नमः दुर्वाङ्कुरान् समर्पयामि', item: 'durva', symbol: '🌱', targetArea: 'feet' },
  { name: '3rd Durva Offering', mantra: 'ॐ विघ्ननाशनाय नमः दुर्वाङ्कुरान् समर्पयामि', item: 'durva', symbol: '🌱', targetArea: 'feet' },
  { name: 'Red Hibiscus (Jaswand)', mantra: 'ॐ विनायकाय नमः रक्तपुष्पं समर्पयामि', item: 'hibiscus', symbol: '🌺', targetArea: 'heart' },
  { name: 'Sacred Chandan Tilak', mantra: 'ॐ ईशपुत्राय नमः चन्दनं समर्पयामि', item: 'chandan', symbol: '✨', targetArea: 'forehead' },
  { name: 'Golden Marigold Garland', mantra: 'ॐ सर्वसिद्धिप्रदाय नमः पुष्पमालां समर्पयामि', item: 'marigold', symbol: '🌼', targetArea: 'crown' },
  { name: 'Akshat & Sacred Rice', mantra: 'ॐ कुमारगुरवे नमः अक्षतान् समर्पयामि', item: 'akshat', symbol: '🍚', targetArea: 'thali' },
  { name: '21st Maha Durva Bundle', mantra: 'ॐ सिद्धिविनायकाय नमः एकविंशति दुर्वाङ्कुरान् समर्पयामि', item: 'durva', symbol: '🌿', targetArea: 'feet' },
];

export const DurvaPujaGame: React.FC<DurvaPujaGameProps> = ({ onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [offeredItems, setOfferedItems] = useState<string[]>([]);
  const [durvaCount, setDurvaCount] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [pujaCompleted, setPujaCompleted] = useState(false);

  const currentStep = PUJA_STEPS[currentStepIndex];

  const handlePerformStep = () => {
    soundManager.userInteracted();

    if (currentStep.item === 'durva') {
      if (soundOn) soundManager.playFlowerCollect();
      setDurvaCount((c) => Math.min(21, c + 3));
    } else if (currentStep.item === 'hibiscus' || currentStep.item === 'marigold') {
      if (soundOn) soundManager.playFlowerCollect();
    } else {
      if (soundOn) soundManager.playTempleBell();
    }

    setOfferedItems((prev) => [...prev, currentStep.symbol]);

    if (currentStepIndex < PUJA_STEPS.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    } else {
      setPujaCompleted(true);
      if (soundOn) soundManager.playShankhCelebration();
    }
  };

  const resetPuja = () => {
    setCurrentStepIndex(0);
    setOfferedItems([]);
    setDurvaCount(0);
    setPujaCompleted(false);
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
            <span>🌱</span>
            <span>DURVA & PUSHPA PUJA</span>
            <span>🌺</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">21 Sacred Grass & Hibiscus Offering</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Progress Tracker */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <span className="text-amber-300 font-bold">
          Offering {currentStepIndex + 1} / {PUJA_STEPS.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">🌱 Durva: {durvaCount} / 21</span>
        </div>
      </div>

      {/* Sanctum Shrine with Ganesha and Offerings */}
      <div className="w-full max-w-md festival-glass rounded-2xl p-4 border-2 border-amber-400/60 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 shadow-2xl my-1">
        {/* Divine Aura Glow */}
        <div className="w-40 h-40 rounded-full bg-amber-500/15 blur-2xl absolute top-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <GaneshaImage className="w-40 h-40 sm:w-44 sm:h-44 object-contain drop-shadow-2xl animate-float" />

          {/* Mushak Devotee Assistant */}
          <div className="absolute -bottom-2 -left-3 bg-stone-900/90 p-1.5 rounded-full border border-amber-400/50 shadow flex items-center gap-1">
            <MushakImage className="w-8 h-8 object-contain" />
            <span className="text-[9px] text-amber-200 font-semibold pr-1">Offering Seva</span>
          </div>

          {/* Display offered items around feet */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center mt-2 px-3 py-1 bg-black/40 rounded-full border border-amber-500/30">
            {offeredItems.length === 0 ? (
              <span className="text-[10px] text-amber-300/60">Lotus feet awaiting sacred flowers...</span>
            ) : (
              offeredItems.map((sym, idx) => (
                <span key={idx} className="text-base animate-in zoom-in">
                  {sym}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Ritual Step Banner */}
      {!pujaCompleted ? (
        <div className="w-full max-w-md my-2 flex flex-col gap-2">
          <div className="festival-glass p-3 rounded-xl border border-amber-400/50 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{currentStep.symbol}</span>
              <h3 className="font-cinzel text-sm font-bold text-amber-300">{currentStep.name}</h3>
            </div>
            <p className="font-rozha text-xs sm:text-sm text-amber-200 tracking-wide">{currentStep.mantra}</p>
          </div>

          <button
            onClick={handlePerformStep}
            className="festival-button w-full min-h-[48px] py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-amber-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Chant Mantra & Offer {currentStep.symbol}</span>
          </button>
        </div>
      ) : (
        /* Completed Victory Screen */
        <div className="w-full max-w-md my-2 festival-glass p-4 rounded-2xl border-2 border-amber-300 text-center space-y-3 animate-in zoom-in">
          <div className="flex justify-center items-center gap-2">
            <span className="text-3xl">🌺 🌱 🪔</span>
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-300">
            21 Durva Maha-Puja Completed!
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            Lord Ganesha is profoundly pleased by the offering of 21 tender Durva grass blades and fragrant Hibiscus. May all obstacles vanish from your life!
          </p>
          <button
            onClick={resetPuja}
            className="festival-button w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Perform Puja Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
