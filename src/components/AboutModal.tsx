import React from 'react';
import { Info, Sparkles, Heart, Leaf, X } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg festival-glass rounded-2xl p-6 border border-amber-500/40 text-amber-50 shadow-2xl my-8">
        {/* Close Button */}
        <button
          id="close-about-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-900/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 mb-2">
            <span className="text-2xl">ॐ</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-amber-300">
            About Mushak Dash
          </h2>
          <p className="text-xs text-amber-200/80 mt-0.5 font-rozha">
            Vinayaka Chaturthi Student Game Design Contest Entry
          </p>
        </div>

        {/* Contest Theme Section */}
        <div className="space-y-3.5 text-xs text-amber-100/90 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
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

        {/* Footer */}
        <button
          id="close-about-bottom-btn"
          onClick={onClose}
          className="festival-button w-full mt-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
        >
          BACK TO GAME
        </button>
      </div>
    </div>
  );
};
