import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Sparkles, RefreshCw, Star, Info, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { GaneshaImage } from '../GaneshaImage';
import { MushakImage } from '../MushakImage';

interface FestiveMemoryGameProps {
  onBack: () => void;
}

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  lore: string;
  matched: boolean;
}

const ALL_FESTIVAL_CARDS = [
  {
    symbol: '🕉️',
    name: 'Ganesha',
    lore: 'Lord Ganesha (Vinayaka), the beloved son of Shiva and Parvati, embodies supreme intellect, prosperity, and blessings.',
  },
  {
    symbol: '🥟',
    name: 'Modak',
    lore: 'Lord Ganesha is fond of Ukadiche Modaks made of steamed rice flour, jaggery, and coconut.',
  },
  {
    symbol: '✨',
    name: 'Mushak',
    lore: 'Mushak the mouse devotee represents conquering the wandering human ego and mind through steady devotion.',
  },
  {
    symbol: '🌺',
    name: 'Jaswand',
    lore: 'Red Hibiscus is Bappa’s most cherished flower, symbolizing radiance and sacred love.',
  },
  {
    symbol: '🌿',
    name: 'Durva Grass',
    lore: '21 sacred blades of Durva cooled Lord Ganesha’s belly after he swallowed the demon Analasura.',
  },
  {
    symbol: '🪔',
    name: 'Akhand Diya',
    lore: 'The burning brass diya dispels darkness, ignorance, and welcomes wisdom into every home.',
  },
  {
    symbol: '🥁',
    name: 'Dhol',
    lore: 'The energetic rhythm of Dhol Tasha unites devotees in pure ecstatic celebration during Visarjan.',
  },
  {
    symbol: '🐚',
    name: 'Shankh',
    lore: 'Blowing the sacred conch produces the cosmic OM vibration that banishes negative energies.',
  },
  {
    symbol: '🪷',
    name: 'Kamal Lotus',
    lore: 'The lotus blossoms untainted above muddy waters, inspiring pure divine living in this world.',
  },
  {
    symbol: '🥥',
    name: 'Shriphal',
    lore: 'Breaking a green coconut signifies surrendering our hard outer ego to offer sweet water to God.',
  },
  {
    symbol: '🟡',
    name: 'Motichoor',
    lore: 'The sweet round laddu represents the bountiful sweetness of spiritual wisdom and happiness.',
  },
];

export const FestiveMemoryGame: React.FC<FestiveMemoryGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [activeLore, setActiveLore] = useState<string | null>(null);
  const [isGameWon, setIsGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Initialize Cards
  const initGame = (diff = difficulty) => {
    soundManager.userInteracted();
    soundManager.playSlide();

    const pairCount = diff === 'easy' ? 4 : diff === 'medium' ? 6 : 8;
    const selectedSymbols = ALL_FESTIVAL_CARDS.slice(0, pairCount);

    const deck: CardItem[] = [];
    selectedSymbols.forEach((item, index) => {
      deck.push({ id: index * 2, symbol: item.symbol, name: item.name, lore: item.lore, matched: false });
      deck.push({ id: index * 2 + 1, symbol: item.symbol, name: item.name, lore: item.lore, matched: false });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchesFound(0);
    setActiveLore(null);
    setIsGameWon(false);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  useEffect(() => {
    initGame();
  }, [difficulty]);

  // Game Timer
  useEffect(() => {
    if (isGameWon || startTime === 0) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isGameWon]);

  // Card Flip Click
  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index) || cards[index].matched) {
      return;
    }

    soundManager.playCardFlip();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.name === secondCard.name) {
        // Match!
        soundManager.playModakCollect();
        setActiveLore(`✨ ${firstCard.name}: ${firstCard.lore}`);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, matched: true } : c))
          );
          setFlippedIndices([]);
          setMatchesFound((m) => {
            const nextMatches = m + 1;
            const targetMatches = cards.length / 2;
            if (nextMatches >= targetMatches) {
              setIsGameWon(true);
              soundManager.playShankhCelebration();
            }
            return nextMatches;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const getStars = () => {
    const pairCount = cards.length / 2;
    if (moves <= pairCount + 2) return 3;
    if (moves <= pairCount + 6) return 2;
    return 1;
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
            <span>🎴</span>
            <span>BHAKTI MEMORY QUEST</span>
            <span>🎴</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Sacred Symbols & Festival Lore Match
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20 text-xs">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-2 py-0.5 rounded font-bold capitalize transition-all ${
                difficulty === d ? 'bg-amber-500 text-stone-950 shadow' : 'text-amber-200/70'
              }`}
            >
              {d === 'easy' ? 'Bal' : d === 'medium' ? 'Bhakta' : 'Maha'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Game Content Area */}
      <div className="w-full max-w-lg my-auto flex flex-col items-center">
        {/* HUD Stats */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 mb-3 festival-glass rounded-xl border border-amber-500/30 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-amber-300 font-bold">Moves: {moves}</span>
            <span className="text-amber-200">
              Matches: {matchesFound} / {cards.length / 2}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-amber-300">⏳ {elapsedSeconds}s</span>
            <button
              onClick={() => initGame()}
              className="p-1 rounded bg-amber-900/50 border border-amber-500/40 text-amber-300"
              title="Restart Game"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Lore Banner */}
        {activeLore && (
          <div className="w-full mb-3 p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-xs text-amber-200 text-center animate-in fade-in flex items-center justify-center gap-1.5 shadow-md">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="leading-tight">{activeLore}</span>
          </div>
        )}

        {/* Card Grid */}
        <div
          className={`grid gap-2 sm:gap-2.5 w-full ${
            difficulty === 'easy'
              ? 'grid-cols-4'
              : difficulty === 'medium'
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-4'
          }`}
        >
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center text-center p-1 transition-all transform cursor-pointer ${
                  card.matched
                    ? 'bg-amber-900/40 border-amber-400/80 text-amber-200 scale-95 shadow-inner'
                    : isFlipped
                    ? 'bg-amber-950 border-amber-300 text-amber-100 shadow-lg scale-100'
                    : 'bg-gradient-to-tr from-stone-900 to-amber-950/80 border-amber-500/30 text-amber-400 hover:border-amber-400 hover:scale-105 active:scale-95'
                }`}
              >
                {isFlipped ? (
                  <div className="animate-in zoom-in-50 duration-200 flex flex-col items-center justify-center">
                    {card.name === 'Mushak' ? (
                      <MushakImage className="w-8 h-8 sm:w-10 sm:h-10 object-contain mx-auto drop-shadow" />
                    ) : card.name === 'Ganesha' ? (
                      <GaneshaImage className="w-8 h-8 sm:w-10 sm:h-10 object-contain mx-auto drop-shadow" />
                    ) : (
                      <span className="text-2xl sm:text-3xl">{card.symbol}</span>
                    )}
                    <div className="text-[10px] font-bold text-amber-200 mt-1 leading-none">{card.name}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-60">
                    <span className="text-xl sm:text-2xl font-serif text-amber-400">ॐ</span>
                    <span className="text-[8px] tracking-widest text-amber-300 font-bold uppercase mt-0.5">Bappa</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Modal Overlay */}
        {isGameWon && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="festival-glass rounded-3xl p-6 border-2 border-amber-400 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="flex items-center justify-center gap-3">
                <MushakImage className="w-14 h-14 object-contain animate-bounce" />
                <GaneshaImage className="w-16 h-16 object-contain drop-shadow-xl" />
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-amber-300">Divine Memory Match!</h3>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                Lord Ganesha, the remover of all obstacles and giver of intellect (Buddhi), blesses you with wisdom!
              </p>

              {/* Stars Earned */}
              <div className="flex items-center justify-center gap-2 text-amber-400">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i < getStars() ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>

              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-xs text-amber-200 flex justify-around">
                <div>
                  <div className="text-[10px] uppercase text-amber-300/70">Time</div>
                  <div className="font-bold text-sm">{elapsedSeconds}s</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-amber-300/70">Total Moves</div>
                  <div className="font-bold text-sm">{moves}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => initGame()}
                  className="festival-button flex-1 py-2.5 rounded-xl font-bold text-xs"
                >
                  PLAY AGAIN
                </button>
                <button
                  onClick={onBack}
                  className="festival-glass flex-1 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-900/40"
                >
                  FESTIVAL HUB
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Lore */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-amber-300/70 border-t border-amber-900/30">
        Lord Ganesha is revered as "Buddhipradayaka" — the dispenser of wisdom, intellect, and razor-sharp memory.
      </footer>
    </div>
  );
};
