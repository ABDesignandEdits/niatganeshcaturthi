import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Music, X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { soundManager } from '../audio/soundManager';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState(soundManager.settings);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    soundManager.updateSettings({ soundEnabled: next });
    setSettings({ ...settings, soundEnabled: next });
    if (next) soundManager.playPowerUp();
  };

  const handleMusicToggle = () => {
    const next = !settings.musicEnabled;
    soundManager.updateSettings({ musicEnabled: next });
    setSettings({ ...settings, musicEnabled: next });
  };

  const handleSoundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.updateSettings({ soundVolume: val });
    setSettings({ ...settings, soundVolume: val });
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundManager.updateSettings({ musicVolume: val });
    setSettings({ ...settings, musicVolume: val });
  };

  const handleResetData = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
      <motion.div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 320 }}
        className="relative w-full max-w-md apple-liquid-glass-modal apple-glass-reflection rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-500/40 text-amber-50 shadow-2xl max-h-[92dvh] overflow-y-auto overscroll-contain box-border"
      >
        {/* Close Button */}
        <button
          id="close-settings-btn"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-amber-400 hover:text-amber-200 p-1.5 rounded-full apple-liquid-glass border border-amber-500/30 cursor-pointer transition-all active:scale-95"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full apple-liquid-glass border border-amber-400/40 mb-2 shadow-md">
            <Settings className="w-6 h-6 text-amber-400" />
          </div>
          <h2 id="settings-title" className="font-cinzel text-2xl font-bold text-amber-300">
            Game Settings
          </h2>
          <p className="text-xs text-amber-200/80 mt-0.5 font-marcellus">
            Audio & Accessibility Options
          </p>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col gap-3.5 mb-5">
          {/* Sound Effects */}
          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                <span>Sound Effects</span>
              </div>
              <button
                id="sound-enabled-toggle"
                onClick={handleSoundToggle}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                  settings.soundEnabled
                    ? 'glass-active shadow-sm'
                    : 'glass-level-1 text-stone-400'
                }`}
              >
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              disabled={!settings.soundEnabled}
              onChange={handleSoundVolumeChange}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Festive Background Music */}
          <div className="apple-glass-card p-3.5 rounded-2xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Festival Music (Dhol & Chimes)</span>
              </div>
              <button
                id="music-enabled-toggle"
                onClick={handleMusicToggle}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all active:scale-95 ${
                  settings.musicEnabled
                    ? 'glass-active shadow-sm'
                    : 'glass-level-1 text-stone-400'
                }`}
              >
                {settings.musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              disabled={!settings.musicEnabled}
              onChange={handleMusicVolumeChange}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Local Game Data */}
        <div className="apple-glass-card p-3 rounded-2xl border border-red-500/25 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-200 block">Clear Saved Data</span>
              <span className="text-[10px] text-amber-300/60">Reset local high score & records</span>
            </div>
            {!showConfirmReset ? (
              <button
                id="reset-data-btn"
                onClick={() => setShowConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-300 hover:bg-red-950/50 text-xs font-semibold cursor-pointer active:scale-95"
              >
                Reset
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetData}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold cursor-pointer active:scale-95"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 rounded-lg glass-level-1 text-stone-300 text-[11px] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Save/Close */}
        <button
          id="close-settings-bottom-btn"
          onClick={onClose}
          className="apple-glass-button w-full py-2.5 rounded-xl font-cinzel font-bold text-sm cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.98]"
        >
          DONE
        </button>
      </motion.div>
    </div>
  );
};
