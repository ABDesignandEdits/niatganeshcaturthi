import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Volume2, VolumeX, CheckCircle, RefreshCw, BookOpen, Star } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface GaneshaNamesGameProps {
  onBack: () => void;
}

interface SacredName {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  symbol: string;
  lore: string;
}

const SACRED_NAMES: SacredName[] = [
  {
    sanskrit: 'विघ्नहर्ता',
    transliteration: 'Vighnaharta',
    meaning: 'Remover of all obstacles & troubles',
    symbol: '🛡️',
    lore: 'Lord Ganesha is worshipped before embarking on any auspicious new venture to eliminate impediments.',
  },
  {
    sanskrit: 'लम्बोदर',
    transliteration: 'Lambodara',
    meaning: 'The One with the Cosmic Belly',
    symbol: '🌌',
    lore: 'His vast belly holds the entire cosmic universe, gently digesting all experiences with equanimity.',
  },
  {
    sanskrit: 'एकदन्त',
    transliteration: 'Ekadanta',
    meaning: 'Single-tusked Master of Sacrifice',
    symbol: '🪶',
    lore: 'He broke His own holy tusk to continue writing the great epic Mahabharata dictated by Sage Vyasa without pause.',
  },
  {
    sanskrit: 'वक्रतुण्ड',
    transliteration: 'Vakratunda',
    meaning: 'Curved Trunk of Primal Sound (Om)',
    symbol: '🕉️',
    lore: 'The curved trunk resembles the primordial symbol OM (AUM), guiding wayward minds back to righteousness.',
  },
  {
    sanskrit: 'गजानन',
    transliteration: 'Gajanana',
    meaning: 'Elephant-headed Lord of Wisdom',
    symbol: '🐘',
    lore: 'Represents supreme intelligence, listening capability through grand ears, and profound discernment.',
  },
  {
    sanskrit: 'सिद्धिविनायक',
    transliteration: 'Siddhivinayak',
    meaning: 'Bestower of Success and Mastery',
    symbol: '✨',
    lore: 'Grants spiritual enlightenment (Buddhi) and worldly success (Siddhi) to earnest devotees.',
  },
  {
    sanskrit: 'भालचन्द्र',
    transliteration: 'Bhalachandra',
    meaning: 'The Moon-Crowned Lord',
    symbol: '🌙',
    lore: 'Adorns the cool crescent moon on His brow, teaching devotees patience, tranquility, and calmness.',
  },
  {
    sanskrit: 'मूषकवाहन',
    transliteration: 'Mushakvahana',
    meaning: 'Rider of the Humble Mouse Mushak',
    symbol: '🐭',
    lore: 'Demonstrates mastery over human desire and the wandering mind through conscious devotion and control.',
  },
  {
    sanskrit: 'मोदकप्रिय',
    transliteration: 'Modakapriya',
    meaning: 'Lover of the Sweet Steamed Modak',
    symbol: '🥟',
    lore: 'The modak symbolizes the sweet inner bliss (Ananda) enclosed within the outer shell of self-discipline.',
  },
  {
    sanskrit: 'हेरम्ब',
    transliteration: 'Heramba',
    meaning: 'Protector of the Weak and Helpless',
    symbol: '🙏',
    lore: 'Compassionate guardian who shields those who have no other refuge in the world.',
  },
];

export const GaneshaNamesGame: React.FC<GaneshaNamesGameProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = SACRED_NAMES[currentIndex];

  // Prepare shuffled options
  useEffect(() => {
    if (!currentQuestion) return;
    const correct = currentQuestion.meaning;
    const others = SACRED_NAMES.filter((n) => n.meaning !== correct)
      .map((n) => n.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const combined = [...others, correct].sort(() => 0.5 - Math.random());
    setOptions(combined);
    setSelectedMeaning(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, [currentIndex, currentQuestion]);

  const handleSelectOption = (meaning: string) => {
    if (isAnswered) return;
    setSelectedMeaning(meaning);
    setIsAnswered(true);

    const correct = meaning === currentQuestion.meaning;
    setIsCorrect(correct);

    if (correct) {
      if (soundOn) soundManager.playTempleBell();
      setScore((s) => s + 100 + streak * 20);
      setStreak((st) => st + 1);
    } else {
      if (soundOn) soundManager.playObstacleHit();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < SACRED_NAMES.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setQuizFinished(true);
      if (soundOn) soundManager.playShankhCelebration();
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setQuizFinished(false);
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
            <span>🕉️</span>
            <span>DIVINE NAMES</span>
            <span>🪶</span>
          </h1>
          <p className="text-[10px] text-amber-200/80">Ashtottara Sacred Meanings</p>
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-1.5 rounded-lg festival-glass border border-amber-500/30 text-amber-300"
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </header>

      {/* Progress & Score HUD */}
      <div className="w-full max-w-md flex items-center justify-between px-3 py-1.5 my-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
        <span className="text-amber-300 font-bold">
          Name {currentIndex + 1} / {SACRED_NAMES.length}
        </span>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold text-[10px]">
              {streak}x STREAK!
            </span>
          )}
          <span className="font-bold text-amber-400">Score: {score}</span>
        </div>
      </div>

      {!quizFinished ? (
        <div className="w-full max-w-md flex flex-col items-center flex-1 my-1">
          {/* Sacred Name Presentation Card */}
          <div className="w-full festival-glass rounded-2xl p-4 border-2 border-amber-400/60 text-center shadow-xl relative overflow-hidden bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950">
            {/* Background Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/20 to-amber-500/10 pointer-events-none" />

            <div className="flex items-center justify-center gap-2 mb-2">
              <GaneshaImage className="w-10 h-10 object-contain drop-shadow" />
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-lg">
                {currentQuestion.symbol}
              </div>
              <MushakImage className="w-8 h-8 object-contain drop-shadow" />
            </div>

            <div className="font-rozha text-2xl sm:text-3xl text-amber-300 tracking-wide">
              {currentQuestion.sanskrit}
            </div>
            <div className="font-cinzel text-sm sm:text-base text-amber-200 font-bold tracking-widest mt-0.5">
              "{currentQuestion.transliteration}"
            </div>

            <div className="mt-3 pt-2 border-t border-amber-500/20 text-[11px] text-amber-100/70 italic">
              What is the divine meaning of this sacred name?
            </div>
          </div>

          {/* Options Grid */}
          <div className="w-full grid grid-cols-1 gap-2 my-3">
            {options.map((opt, i) => {
              const isChosen = selectedMeaning === opt;
              const isTargetCorrect = opt === currentQuestion.meaning;

              let btnStyle = 'festival-glass border-amber-500/30 text-amber-100 hover:border-amber-400';
              if (isAnswered) {
                if (isTargetCorrect) {
                  btnStyle = 'bg-emerald-900/80 border-emerald-400 text-emerald-100 font-bold shadow-md shadow-emerald-500/20';
                } else if (isChosen) {
                  btnStyle = 'bg-rose-900/80 border-rose-400 text-rose-100 font-bold';
                } else {
                  btnStyle = 'opacity-40 border-amber-500/10 text-stone-500';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all active:scale-98 flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isTargetCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Lore and Explanation Card (Appears after answer) */}
          {isAnswered && (
            <div className="w-full festival-glass rounded-xl p-3 border border-amber-400/50 bg-amber-950/60 text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sacred Lore & Wisdom:</span>
              </div>
              <p className="text-[11px] text-amber-100/90 leading-relaxed">{currentQuestion.lore}</p>
              <button
                onClick={handleNext}
                className="w-full mt-2 festival-button min-h-[44px] py-2 rounded-xl text-xs sm:text-sm font-bold active:scale-95"
              >
                {currentIndex < SACRED_NAMES.length - 1 ? 'Next Holy Name ➔' : 'Complete Darshan 🕉️'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Victory Screen */
        <div className="w-full max-w-md festival-glass p-5 rounded-2xl border-2 border-amber-400/80 text-center space-y-4 my-auto shadow-2xl">
          <div className="flex justify-center items-center gap-3">
            <MushakImage className="w-12 h-12 object-contain" />
            <GaneshaImage className="w-16 h-16 object-contain drop-shadow-xl" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-amber-300">Ashtottara Darshan Complete!</h3>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            You have unlocked the divine knowledge of Lord Ganesha's 108 auspicious names. May His blessings bring wisdom and success!
          </p>
          <div className="p-3 bg-amber-950/70 rounded-xl border border-amber-500/30">
            <span className="text-xs text-amber-200">Devotional Score: </span>
            <span className="font-cinzel font-black text-lg text-amber-400">{score} pts</span>
          </div>
          <button
            onClick={restart}
            className="festival-button w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Chant Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
