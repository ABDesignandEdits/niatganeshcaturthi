import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';
import { soundManager } from '../audio/soundManager';

interface QuizModalProps {
  question: QuizQuestion;
  onComplete: (earnedBonus: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ question, onComplete }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    soundManager.playQuizResult(isCorrect);
  };

  const handleContinue = () => {
    const isCorrect = selectedIdx === question.correctIndex;
    const bonus = isCorrect ? 100 : 25; // Even participating gives 25 grace blessing points
    onComplete(bonus);
  };

  const isCorrect = selectedIdx === question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg festival-glass rounded-2xl p-6 border border-amber-500/40 text-amber-50 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Festival Bonus Trivia (+100 Pts)</span>
          </div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 my-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isRight = idx === question.correctIndex;

            let buttonClass = 'festival-glass hover:bg-amber-900/40 border-amber-500/20 text-amber-100';

            if (isAnswered) {
              if (isRight) {
                buttonClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
              } else if (isSelected) {
                buttonClass = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
              } else {
                buttonClass = 'opacity-40 border-stone-700 text-stone-400';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-3.5 rounded-xl border text-left font-outfit text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-300">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isSelected && !isRight && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation when answered */}
        {isAnswered && (
          <div className="bg-amber-950/80 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-100/90 mb-4 animate-in fade-in">
            <p className="font-bold text-amber-300 mb-1">
              {isCorrect ? '✨ Correct! +100 Bonus Points!' : '💡 Festival Knowledge:'}
            </p>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* Continue Button */}
        {isAnswered && (
          <button
            id="quiz-continue-btn"
            onClick={handleContinue}
            className="festival-button w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>CONTINUE FESTIVAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
