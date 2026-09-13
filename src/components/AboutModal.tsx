import React from 'react';
import { Info, Sparkles, Heart, Leaf, X } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex flex-col items-center justify-start sm:justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg my-auto festival-glass rounded-2xl sm:rounded-3xl border border-amber-500/40 text-amber-50 shadow-2xl max-h-[92vh] max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-stone-950/90 sm:bg-amber-950/90 backdrop-blur-md px-4 sm:px-6 pt-3 pb-2.5 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              ॐ
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-300 leading-tight">
                About Mushak Dash
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/80 font-rozha">
                Vinayaka Chaturthi Student Game Design Contest
              </p>
            </div>
          </div>

          <button
            id="close-about-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contest Theme Section */}
        <div className="space-y-3 px-4 sm:px-6 py-3 text-xs text-amber-100/90 leading-relaxed overflow-y-auto overscroll-contain flex-1">
          <div className="bg-amber-950/70 p-3.5 rounded-xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Contest Theme & Concept
            </h4>
            <p>
              <strong>Mushak Dash</strong> was crafted for the student Game Design Contest inspired by the beloved festival of <strong>Vinayaka Chaturthi (Ganesh Chaturthi)</strong>. 
              Players step into the agile paws of <strong>Mushak</strong>, Lord Ganesha&apos;s devoted mouse companion, embarking on a vibrant journey through five stages of festival preparations.
            </p>
          </div>

          <div className="bg-amber-950/70 p-3.5 rounded-xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              Respectful Religious Representation
            </h4>
            <p>
              Lord Ganesha is universally revered as <em>Vighnaharta</em> (Remover of Obstacles). In strict accordance with contest ethics and religious reverence:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-amber-200/80">
              <li>Lord Ganesha is never depicted as an obstacle, enemy, or target.</li>
              <li>Ganesha is represented solely in dignified benevolence, blessing the player and welcoming Mushak at the grand pandals and sacred waterfront.</li>
              <li>Obstacles are harmless festive equipment (flower baskets, decorative boxes, and crowd barricades).</li>
            </ul>
          </div>

          <div className="bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-500/30">
            <h4 className="font-bold text-sm text-emerald-300 mb-1 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Eco-Friendly Devotion Message
            </h4>
            <p>
              Stage 4 highlights the vital tradition of <strong>eco-friendly celebrations</strong>. Players earn points for collecting <em>Shadu Mati</em> (natural biodegradable clay), fresh leaves, and natural flowers, while learning that celebrations caring for nature bring the greatest blessings.
            </p>
          </div>

          <div className="bg-amber-950/70 p-3.5 rounded-xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1">
              Audio & Visual Craftsmanship
            </h4>
            <p>
              Every visual asset is rendered procedurally via high-performance HTML5 Canvas with multi-plane parallax depth. 
              The festival soundtrack uses the native <strong>Web Audio API</strong> to synthesize authentic Indian Dhol rhythms, temple bells, and festive pentatonic ragas completely offline with zero external audio bloat.
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 w-full px-4 sm:px-6 py-3 bg-stone-950/95 sm:bg-amber-950/95 backdrop-blur-md border-t border-amber-500/30 shrink-0">
          <button
            id="close-about-bottom-btn"
            onClick={onClose}
            className="festival-button w-full py-2.5 rounded-xl font-bold text-sm cursor-pointer active:scale-95"
          >
            BACK TO GAME
          </button>
        </div>
      </div>
    </div>
  );
};
