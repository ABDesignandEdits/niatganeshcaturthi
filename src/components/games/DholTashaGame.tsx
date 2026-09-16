import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Sparkles, Trophy, Volume2, VolumeX, Flame, Music } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface DholTashaGameProps {
  onBack: () => void;
}

interface Note {
  id: number;
  lane: 0 | 1 | 2 | 3;
  y: number; // 0 to 100%
  hit: boolean;
  missed: boolean;
}

const LANES = [
  { id: 0, name: 'Dhol', icon: '🥁', color: '#f97316', key: 'D' },
  { id: 1, name: 'Tasha', icon: '🪘', color: '#eab308', key: 'F' },
  { id: 2, name: 'Ghanti', icon: '🔔', color: '#38bdf8', key: 'J' },
  { id: 3, name: 'Lejim', icon: '🪇', color: '#ec4899', key: 'K' },
];

export const DholTashaGame: React.FC<DholTashaGameProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('mushak_dhol_tasha_high') || '0');
    } catch {
      return 0;
    }
  });

  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackColor, setFeedbackColor] = useState('#facc15');
  const [activeTrack, setActiveTrack] = useState<'morya' | 'nashik' | 'aarti'>('morya');
  const [songProgress, setSongProgress] = useState(0);
  const [cheerCount, setCheerCount] = useState(0);

  const notesRef = useRef<Note[]>([]);
  const nextNoteId = useRef(1);
  const animFrameRef = useRef<number | null>(null);
  const trackTimerRef = useRef<number | null>(null);

  // Trigger drum sound based on lane
  const triggerDrum = useCallback((laneIndex: number) => {
    soundManager.userInteracted();
    if (laneIndex === 0) {
      soundManager.playDholHit(true);
    } else if (laneIndex === 1) {
      soundManager.playTashaHit();
    } else if (laneIndex === 2) {
      soundManager.playTempleBell();
    } else if (laneIndex === 3) {
      soundManager.playLejimJingle();
    }
  }, []);

  const handleHitLane = useCallback((laneIndex: number) => {
    triggerDrum(laneIndex);

    // Check collision with hit zone (target line at ~85% height)
    const hitZone = 85;
    const tolerance = 12;

    let closestNote: Note | null = null;
    let minDistance = Infinity;

    for (const note of notesRef.current) {
      if (note.lane === laneIndex && !note.hit && !note.missed) {
        const dist = Math.abs(note.y - hitZone);
        if (dist < minDistance && dist <= tolerance) {
          minDistance = dist;
          closestNote = note;
        }
      }
    }

    if (closestNote) {
      closestNote.hit = true;
      let pts = 50;
      let rating = 'GOOD';
      let color = '#38bdf8';

      if (minDistance <= 4) {
        pts = 100;
        rating = 'PERFECT! 🔥';
        color = '#f59e0b';
      } else if (minDistance <= 8) {
        pts = 75;
        rating = 'MORYA! ✨';
        color = '#10b981';
      }

      setFeedback(rating);
      setFeedbackColor(color);

      setCombo((c) => {
        const nc = c + 1;
        if (nc > maxCombo) setMaxCombo(nc);
        if (nc % 10 === 0) soundManager.playChantCheer();
        return nc;
      });

      setScore((s) => {
        const mult = Math.min(4, 1 + Math.floor(combo / 5) * 0.5);
        const ns = Math.floor(s + pts * mult);
        if (ns > highScore) {
          setHighScore(ns);
          try {
            localStorage.setItem('mushak_dhol_tasha_high', String(ns));
          } catch {
            // Ignore
          }
        }
        return ns;
      });
    }
  }, [combo, maxCombo, highScore, triggerDrum]);

  // Keyboard controls (D, F, J, K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'D') handleHitLane(0);
      else if (key === 'F') handleHitLane(1);
      else if (key === 'J') handleHitLane(2);
      else if (key === 'K') handleHitLane(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleHitLane]);

  // Rhythm Note Generation Loop
  const startRhythmGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setSongProgress(0);
    notesRef.current = [];
    soundManager.userInteracted();
    soundManager.playShankhCelebration();

    const bpm = activeTrack === 'nashik' ? 145 : activeTrack === 'morya' ? 130 : 115;
    const intervalMs = (60 / bpm) * 1000 / 2; // 8th note intervals

    let beat = 0;
    const totalBeats = 160;

    trackTimerRef.current = window.setInterval(() => {
      beat++;
      setSongProgress(Math.min(100, Math.floor((beat / totalBeats) * 100)));

      if (beat >= totalBeats) {
        if (trackTimerRef.current) clearInterval(trackTimerRef.current);
        setIsPlaying(false);
        soundManager.playShankhCelebration();
        return;
      }

      // Track-specific rhythmic syncopation
      if (activeTrack === 'morya') {
        // Dhol pattern on beats 0, 2; Tasha on syncopated 1, 3; Bell on 0
        if (beat % 4 === 0) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 0, y: 0, hit: false, missed: false });
          if (beat % 8 === 0) {
            notesRef.current.push({ id: nextNoteId.current++, lane: 2, y: 0, hit: false, missed: false });
          }
        } else if (beat % 4 === 1 || beat % 4 === 3) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 1, y: 0, hit: false, missed: false });
        } else if (beat % 4 === 2) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 3, y: 0, hit: false, missed: false });
        }
      } else if (activeTrack === 'nashik') {
        // High tempo Nashik Dhol
        const r = Math.random();
        if (r < 0.4) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 0, y: 0, hit: false, missed: false });
        }
        if (r > 0.3 && r < 0.8) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 1, y: 0, hit: false, missed: false });
        }
        if (beat % 6 === 0) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 3, y: 0, hit: false, missed: false });
        }
      } else {
        // Aarti Shankhnaad groove
        if (beat % 2 === 0) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 2, y: 0, hit: false, missed: false });
        }
        if (beat % 4 === 0) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 0, y: 0, hit: false, missed: false });
        } else if (beat % 4 === 2) {
          notesRef.current.push({ id: nextNoteId.current++, lane: 3, y: 0, hit: false, missed: false });
        }
      }
    }, intervalMs);
  };

  // Note Animation Frame
  useEffect(() => {
    if (!isPlaying) return;

    const noteSpeed = activeTrack === 'nashik' ? 1.4 : 1.1; // Percentage per frame

    const loop = () => {
      notesRef.current.forEach((n) => {
        n.y += noteSpeed;
        if (n.y > 96 && !n.hit && !n.missed) {
          n.missed = true;
          setCombo(0);
          setFeedback('MISS');
          setFeedbackColor('#ef4444');
        }
      });

      // Filter out offscreen notes
      notesRef.current = notesRef.current.filter((n) => n.y <= 105);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeTrack]);

  const handleDevoteeCheer = () => {
    soundManager.playChantCheer();
    setCheerCount((c) => c + 1);
    setScore((s) => s + 25);
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-stone-950 text-amber-50 flex flex-col items-center justify-start py-2 px-3 sm:px-4 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Top Header Navigation */}
      <header className="w-full max-w-2xl flex items-center justify-between py-1 sm:py-2 border-b border-amber-500/30">
        <button
          onClick={() => {
            if (trackTimerRef.current) clearInterval(trackTimerRef.current);
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
            <span>🥁</span>
            <span>DHOL TASHA UTSAV</span>
            <span>🪘</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Devotees Visarjan Rhythm Procession
          </p>
        </div>

        {/* Track Selection */}
        <div className="flex items-center gap-1">
          <select
            value={activeTrack}
            onChange={(e) => setActiveTrack(e.target.value as any)}
            disabled={isPlaying}
            className="bg-black/60 border border-amber-500/40 rounded-xl px-2 py-1 text-[11px] text-amber-300 font-semibold cursor-pointer"
          >
            <option value="morya">Bappa Morya</option>
            <option value="nashik">Nashik Dhol</option>
            <option value="aarti">Aarti Taalm</option>
          </select>
        </div>
      </header>

      {/* Main Rhythm Section */}
      <div className="w-full max-w-md flex flex-col items-center my-auto">
        {/* HUD Info */}
        <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-bold">Score:</span>
            <span className="font-cinzel font-black text-base text-amber-400">{score}</span>
            {combo > 2 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] animate-pulse">
                {combo}x COMBO!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-amber-200 text-[11px] font-mono">Progress: {songProgress}%</div>
            <div className="text-amber-300 font-bold text-[11px]">Best: {highScore}</div>
          </div>
        </div>

        {/* 4-Lane Rhythm Highway */}
        <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-stone-950 via-amber-950/80 to-stone-950 border-2 border-amber-500/40 overflow-hidden shadow-2xl flex">
          {/* Visual lane dividers */}
          {LANES.map((lane, idx) => (
            <div
              key={lane.id}
              className="relative flex-1 h-full border-r last:border-r-0 border-amber-500/20 flex flex-col justify-between items-center"
            >
              {/* Lane Header Icon */}
              <div className="pt-2 text-center">
                <span className="text-xl sm:text-2xl">{lane.icon}</span>
                <div className="text-[10px] text-amber-300/80 font-bold uppercase">{lane.name}</div>
              </div>

              {/* Falling Rhythm Notes for this lane */}
              {notesRef.current
                .filter((n) => n.lane === idx)
                .map((n) => (
                  <div
                    key={n.id}
                    style={{
                      top: `${n.y}%`,
                      backgroundColor: lane.color,
                      opacity: n.hit ? 0 : n.missed ? 0.3 : 1,
                      transform: `translateY(-50%) scale(${n.hit ? 1.5 : 1})`,
                    }}
                    className="absolute w-10 h-6 sm:w-12 sm:h-7 rounded-full border-2 border-white/80 shadow-lg flex items-center justify-center text-[10px] font-black text-stone-950 transition-transform pointer-events-none"
                  >
                    {lane.key}
                  </div>
                ))}

              {/* Hit Target Line (at 85% height) */}
              <div
                style={{ borderColor: lane.color }}
                className="absolute top-[85%] -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed flex items-center justify-center pointer-events-none opacity-80"
              >
                <div
                  style={{ backgroundColor: lane.color }}
                  className="w-4 h-4 rounded-full opacity-40 animate-ping"
                />
              </div>

              {/* Tap Button at Bottom */}
              <button
                id={`lane-btn-${lane.id}`}
                onTouchStart={() => handleHitLane(idx)}
                onMouseDown={() => handleHitLane(idx)}
                style={{ borderColor: lane.color }}
                className="w-full py-4 bg-stone-900/80 active:bg-amber-500 active:text-stone-950 text-amber-200 border-t flex flex-col items-center justify-center font-bold cursor-pointer transition-all active:scale-95"
              >
                <span className="text-xs uppercase">{lane.name}</span>
                <span className="text-[10px] text-amber-400/80 font-mono hidden sm:inline">[{lane.key}]</span>
              </button>
            </div>
          ))}

          {/* Hit Feedback Rating Banner */}
          {feedback && (
            <div
              style={{ color: feedbackColor }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cinzel font-black text-xl sm:text-2xl drop-shadow-md pointer-events-none animate-bounce"
            >
              {feedback}
            </div>
          )}

          {/* Start Screen Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in">
              <span className="text-4xl mb-2">🥁🪘🚩</span>
              <h3 className="font-cinzel text-xl font-bold text-amber-300">Visarjan Dhol Tasha</h3>
              <p className="text-xs text-amber-100/80 mt-1 max-w-xs leading-relaxed">
                Tap the Dhol, Tasha, Ghanti, and Lejim as notes hit the target line! Feel the devotional beat of the Ganpati Visarjan procession!
              </p>
              <div className="grid grid-cols-4 gap-2 my-4 text-xs">
                {LANES.map((l) => (
                  <div key={l.id} className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30">
                    <div>{l.icon}</div>
                    <div className="font-bold text-[10px] text-amber-300">{l.name}</div>
                    <div className="text-[9px] text-amber-200/60 font-mono">[{l.key}]</div>
                  </div>
                ))}
              </div>
              <button
                onClick={startRhythmGame}
                className="festival-button w-full py-3 rounded-xl font-bold text-base shadow-lg"
              >
                START RHYTHM PROCESSION
              </button>
            </div>
          )}
        </div>

        {/* Devotee Procession Cheer Button */}
        <div className="w-full flex items-center justify-between gap-2 mt-2 px-1">
          <button
            onClick={handleDevoteeCheer}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-amber-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <span>🚩</span>
            <span>GANPATI BAPPA MORYA! (+25)</span>
          </button>
          <div className="text-xs text-amber-300 font-bold px-2 py-1 festival-glass rounded-lg border border-amber-500/30">
            Cheers: {cheerCount}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-amber-300/70 border-t border-amber-900/30">
        Dhol Tasha Pathaks in Maharashtra play over 100 synchronized drums celebrating Bappa’s grand festival!
      </footer>
    </div>
  );
};
