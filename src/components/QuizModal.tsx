import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
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
    const bonus = isCorrect ? 100 : 25;
    onComplete(bonus);
  };

  const isCorrect = selectedIdx === question.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-modal-title"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/40 text-amber-50 shadow-2xl max-h-[92dvh] overflow-y-auto overscroll-contain box-border"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full apple-liquid-glass border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 font-cinzel">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Festival Bonus Trivia (+100 Pts)</span>
          </div>
          <h3 id="quiz-modal-title" className="font-cinzel text-lg sm:text-xl font-bold text-amber-200 leading-snug">
            {question.question}
          </h3>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 my-4">
          {question.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isRight = idx === question.correctIndex;

            let buttonClass = 'apple-glass-card text-amber-100';

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
                className={`w-full p-3.5 rounded-2xl border text-left font-outfit text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full apple-liquid-glass flex items-center justify-center text-xs font-bold text-amber-300">
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
          <div className="apple-glass-card border border-amber-500/30 p-3.5 rounded-2xl text-xs text-amber-100/90 mb-4 animate-in fade-in">
            <p className="font-bold text-amber-300 mb-1 font-cinzel">
              {isCorrect ? 'Correct! +100 Bonus Points!' : 'Festival Knowledge:'}
            </p>
            <p className="leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* Continue Button */}
        {isAnswered && (
          <button
            id="quiz-continue-btn"
            onClick={handleContinue}
            className="apple-glass-button w-full py-3 rounded-xl font-cinzel font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 active:scale-[0.98]"
          >
            <span>CONTINUE PILGRIMAGE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </div>
  );
};
