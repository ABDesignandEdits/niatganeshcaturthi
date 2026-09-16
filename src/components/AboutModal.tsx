import React from 'react';
import { Sparkles, Heart, Leaf, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-lg apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl border border-amber-500/40 text-amber-50 shadow-2xl h-[92dvh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden box-border"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 glass-level-1 px-4 sm:px-6 pt-3.5 pb-2.5 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full apple-liquid-glass border border-amber-400/40 flex items-center justify-center text-xl shrink-0 font-serif text-amber-300 shadow-md">
              ॐ
            </div>
            <div>
              <h2 id="about-modal-title" className="font-cinzel text-lg sm:text-xl font-bold text-amber-300 leading-tight">
                About Mushak Dash
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/80 font-marcellus">
                Vinayaka Chaturthi Festival Experience
              </p>
            </div>
          </div>

          <button
            id="close-about-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full apple-liquid-glass border border-amber-400/40 text-amber-300 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0"
            title="Close"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Content Section */}
        <div className="space-y-3 px-4 sm:px-6 py-3.5 text-xs text-amber-100/90 leading-relaxed overflow-y-auto overscroll-contain flex-1">
          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5 font-cinzel">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Festival Theme & Concept
            </h4>
            <p>
              <strong>Mushak Dash</strong> was crafted inspired by the beloved festival of <strong>Vinayaka Chaturthi (Ganesh Chaturthi)</strong>. 
              Players step into the agile paws of <strong>Mushak</strong>, Lord Ganesha&apos;s devoted companion, embarking on a vibrant pilgrimage through five stages of sacred festival preparations.
            </p>
          </div>

          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5 font-cinzel">
              <Heart className="w-4 h-4 text-rose-400" />
              Devotional Respect & Ethics
            </h4>
            <p>
              Lord Ganesha is universally revered as <em>Vighnaharta</em> (Remover of Obstacles). In strict accordance with religious reverence:
            </p>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-amber-200/80">
              <li>Lord Ganesha is never depicted as an obstacle, enemy, or target.</li>
              <li>Lord Ganesha is represented solely in benevolent majesty, blessing the player and welcoming Mushak at the grand pandals and sacred waterfront.</li>
              <li>Obstacles are harmless festive street crates and floral garlands.</li>
            </ul>
          </div>

          <div className="apple-glass-card p-3.5 rounded-2xl border border-emerald-500/30">
            <h4 className="font-bold text-sm text-emerald-300 mb-1 flex items-center gap-1.5 font-cinzel">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Eco-Friendly Devotion
            </h4>
            <p>
              Emphasizing the vital tradition of <strong>eco-friendly celebrations</strong>. Players earn points for collecting <em>Shadu Mati</em> (natural biodegradable clay), fresh durva leaves, and natural hibiscus flowers, promoting environmental stewardship.
            </p>
          </div>

          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20">
            <h4 className="font-bold text-sm text-amber-300 mb-1 font-cinzel">
              Liquid Glass & Procedural Audio
            </h4>
            <p>
              Designed with a premium Apple-inspired Liquid Glass interface, 3D WebGL PBR scenes, and a procedural synthesizer that generates authentic Indian Dhol rhythms and temple chimes in real-time.
            </p>
          </div>

          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20 text-center">
            <p className="text-xs sm:text-sm text-amber-200 font-medium font-outfit">
              Designed and Developed with ❤️ by <span className="text-amber-300 font-bold">AB Developers</span>
            </p>
          </div>
        </div>

        {/* Sticky Footer */}
        <footer className="sticky bottom-0 z-10 w-full px-4 sm:px-6 py-3 glass-level-1 border-t border-amber-500/30 shrink-0 safe-bottom">
          <button
            id="close-about-bottom-btn"
            onClick={onClose}
            className="apple-glass-button w-full py-2.5 rounded-xl font-cinzel font-bold text-sm cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            BACK TO SHRINE
          </button>
          <p className="text-[10px] sm:text-[11px] text-center text-amber-300/70 font-outfit font-medium mt-2">
            Designed and Developed with ❤️ by AB Developers
          </p>
        </footer>
      </motion.div>
    </div>
  );
};
