import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Music, X, RotateCcw } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState(soundManager.settings);

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
    if (window.confirm('Reset local high scores and leaderboard?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md festival-glass rounded-2xl p-6 border border-amber-500/40 text-amber-50 shadow-2xl">
        {/* Close Button */}
        <button
          id="close-settings-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400 hover:text-amber-200 p-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-900/40 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 mb-2">
            <Settings className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-amber-300">
            Game Settings
          </h2>
          <p className="text-xs text-amber-200/80 mt-0.5 font-rozha">
            Audio & Accessibility Options
          </p>
        </div>

        {/* Audio Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Sound Effects */}
          <div className="bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
                <span>Sound Effects</span>
              </div>
              <button
                id="sound-enabled-toggle"
                onClick={handleSoundToggle}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  settings.soundEnabled
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-stone-800 text-stone-400'
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
          <div className="bg-amber-950/60 p-3.5 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Festival Music (Dhol & Chimes)</span>
              </div>
              <button
                id="music-enabled-toggle"
                onClick={handleMusicToggle}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                  settings.musicEnabled
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-stone-800 text-stone-400'
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
        <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-red-500/20">
          <div>
            <span className="text-xs font-bold text-amber-200 block">Clear Saved Data</span>
            <span className="text-[10px] text-amber-300/60">Reset local high score & records</span>
          </div>
          <button
            id="reset-data-btn"
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-950/50 text-xs font-semibold cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Save/Close */}
        <button
          id="close-settings-bottom-btn"
          onClick={onClose}
          className="festival-button w-full mt-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
