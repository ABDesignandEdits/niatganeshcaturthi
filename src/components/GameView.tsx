import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Heart, Pause, Play, Volume2, VolumeX, Leaf, Flame, Sparkles, Gamepad2, Shield, MoveUp, MoveDown, MoveLeft, MoveRight } from 'lucide-react';
import { motion } from 'motion/react';
import { GameEngine } from '../game/engine';
import { GameRenderer } from '../game/renderer';
import { STAGES } from '../game/constants';
import { StageConfig, RangoliColor, PowerUpType } from '../types';
import { soundManager } from '../audio/soundManager';
import { getHighScore } from '../storage/storage';
import { GaneshaImage } from './GaneshaImage';

interface GameViewProps {
  initialStageIndex: number;
  initialScore?: number;
  initialEcoScore?: number;
  initialMaxCombo?: number;
  onStageComplete: (stage: StageConfig, score: number, ecoScore: number, maxCombo: number) => void;
  onGameOver: (
    score: number,
    ecoScore: number,
    maxCombo: number,
    obstacleName?: string,
    offeringsCount?: number
  ) => void;
  onExitToMenu: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  initialStageIndex,
  initialScore = 0,
  initialEcoScore = 0,
  initialMaxCombo = 0,
  onStageComplete,
  onGameOver,
  onExitToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  // HUD States
  const [score, setScore] = useState(initialScore);
  const [highScore, setHighScore] = useState(getHighScore());
  const [ecoScore, setEcoScore] = useState(initialEcoScore);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);
  const [currentMetres, setCurrentMetres] = useState(0);
  const [obstacleWarning, setObstacleWarning] = useState<'jump' | 'slide' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.settings.soundEnabled);
  const [activePowerUps, setActivePowerUps] = useState<{ type: PowerUpType; timeLeft: number }[]>([]);
  const [colorSequence, setColorSequence] = useState<{ colors: RangoliColor[]; currentIdx: number } | null>(null);
  const [showTouchControls, setShowTouchControls] = useState(() => {
    if (typeof window === 'undefined') return true;
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
  });

  const stage = STAGES[initialStageIndex];

  // Stable callback references to prevent useEffect teardown and unexpected resets
  const callbacksRef = useRef({
    onScoreUpdate: (newScore: number, newEco: number, newCombo: number) => {},
    onLivesUpdate: (newLives: number) => {},
    onStageProgress: (prog: number, dist: number) => {},
    onPowerUpUpdate: (powerUps: { type: PowerUpType; timeLeft: number }[]) => {},
    onColorSequenceUpdate: (colors: RangoliColor[], currentIdx: number) => {},
    onStageComplete,
    onGameOver,
    onObstacleWarning: (warning: 'jump' | 'slide' | null) => {},
  });

  callbacksRef.current = {
    onScoreUpdate: (newScore: number, newEco: number, newCombo: number) => {
      setScore(newScore);
      setEcoScore(newEco);
      setCombo(newCombo);
      setHighScore((prev) => Math.max(prev, newScore));
    },
    onLivesUpdate: (newLives: number) => {
      setLives(newLives);
    },
    onStageProgress: (prog: number, dist: number) => {
      setProgress(prog);
      setCurrentMetres(Math.floor(dist));
    },
    onPowerUpUpdate: (powerUps: { type: PowerUpType; timeLeft: number }[]) => {
      setActivePowerUps(powerUps);
    },
    onColorSequenceUpdate: (colors: RangoliColor[], currentIdx: number) => {
      setColorSequence({ colors, currentIdx });
    },
    onStageComplete,
    onGameOver,
    onObstacleWarning: (warning: 'jump' | 'slide' | null) => {
      setObstacleWarning(warning);
    },
  };

  // Initialize Canvas, Engine & Loop - runs strictly once per stage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI Canvas setup with fill-rate protection on desktop & 4K screens
    const updateSize = () => {
      // DPR capped to 1.25 on screens wider than 1024 to eliminate lag and 4K GPU stalling
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth >= 1024 ? 1.25 : 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (engineRef.current) {
        engineRef.current.resize(w, h);
      }
      if (rendererRef.current) {
        rendererRef.current.resize(w, h);
      }
    };

    const initialW = window.innerWidth;
    const initialH = window.innerHeight;

    const renderer = new GameRenderer(ctx, initialW, initialH);
    rendererRef.current = renderer;

    const engine = new GameEngine(
      initialW,
      initialH,
      initialScore,
      initialEcoScore,
      initialMaxCombo,
      {
        onScoreUpdate: (s, e, c) => callbacksRef.current.onScoreUpdate(s, e, c),
        onLivesUpdate: (l) => callbacksRef.current.onLivesUpdate(l),
        onStageProgress: (p, d) => callbacksRef.current.onStageProgress(p, d),
        onPowerUpUpdate: (pu) => callbacksRef.current.onPowerUpUpdate(pu),
        onColorSequenceUpdate: (col, idx) => callbacksRef.current.onColorSequenceUpdate(col, idx),
        onStageComplete: (stg, sc, eco, comb) => callbacksRef.current.onStageComplete(stg, sc, eco, comb),
        onGameOver: (sc, eco, maxC, reason, off) => callbacksRef.current.onGameOver(sc, eco, maxC, reason, off),
        onObstacleWarning: (w) => callbacksRef.current.onObstacleWarning(w),
      }
    );
    engineRef.current = engine;

    updateSize();
    window.addEventListener('resize', updateSize);

    // Start Stage
    engine.startStage(initialStageIndex);

    // Main Game Loop
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap at 50ms to prevent spiral
      lastTime = currentTime;

      const currentStage = STAGES[engine.currentStageIndex];

      // Update Engine state
      engine.update(dt);

      // Render graphics
      ctx.save();
      // Apply screen shake
      if (engine.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      renderer.drawBackground(currentStage, engine.cameraX, currentTime / 1000);

      // Draw Lord Ganesha Shrine & Fireworks when distance approaches destination (30m)
      renderer.drawLordGaneshaShrine(
        engine.distance,
        engine.groundY,
        currentTime / 1000,
        engine.isAtAltar,
        engine.player.x
      );

      // Draw obstacles
      for (const obs of engine.obstacles) {
        renderer.drawObstacle(obs, currentTime / 1000);
      }

      // Draw collectibles
      for (const col of engine.collectibles) {
        renderer.drawCollectible(col, currentTime / 1000);
      }

      // Draw Player Mushak
      renderer.drawPlayer(engine.player, currentTime / 1000);

      // Draw particles & floating texts
      renderer.drawParticles(engine.particles);
      renderer.drawFloatingTexts(engine.floatingTexts);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // ESC key to toggle pause
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animId);
      soundManager.stopMusic();
    };
  }, [initialStageIndex]);

  const togglePause = () => {
    if (!engineRef.current) return;
    const nextState = !isPaused;
    engineRef.current.isPaused = nextState;
    setIsPaused(nextState);

    if (nextState) {
      soundManager.stopMusic();
    } else {
      soundManager.startMusic();
    }
  };

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.updateSettings({
      soundEnabled: nextVal,
      musicEnabled: nextVal,
    });
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleJumpPress = useCallback(() => {
    soundManager.userInteracted();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
    if (engineRef.current) {
      engineRef.current.triggerJump();
    }
  }, []);

  const handleSlidePress = useCallback(() => {
    soundManager.userInteracted();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(10);
    }
    if (engineRef.current) {
      engineRef.current.triggerSlide();
    }
  }, []);

  // Comprehensive Mobile Touch & Swipe Handling on Canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      soundManager.userInteracted();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;
    const elapsed = Date.now() - touchStartTime.current;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > 25 || absY > 25) {
      // Swipe gesture
      if (absY > absX) {
        if (diffY < -25) {
          // Swipe UP -> Jump!
          handleJumpPress();
        } else if (diffY > 25) {
          // Swipe DOWN -> Slide!
          handleSlidePress();
        }
      } else {
        if (diffX < -25) {
          // Swipe LEFT -> Steer Left!
          engineRef.current?.nudgeLeft(55);
        } else if (diffX > 25) {
          // Swipe RIGHT -> Steer Right!
          engineRef.current?.nudgeRight(55);
        }
      }
    } else if (elapsed < 350) {
      // Fast Tap: check horizontal zone for single-finger mobile play
      const screenW = window.innerWidth;
      if (touchEndX < screenW * 0.28) {
        // Tapped left third -> Steer Left
        engineRef.current?.nudgeLeft(45);
      } else if (touchEndX > screenW * 0.72) {
        // Tapped right third -> Steer Right
        engineRef.current?.nudgeRight(45);
      } else {
        // Tapped center -> Jump!
        handleJumpPress();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Mouse click fallback for desktop users without touch
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only fire on mouse clicks (pointerType === 'mouse')
    if (e.nativeEvent && (e.nativeEvent as any).pointerType === 'touch') return;
    handleJumpPress();
  };

  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden select-none bg-black touch-none">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleCanvasClick}
      />

      {/* TOP HUD BAR */}
      <div className="absolute top-0 left-0 right-0 p-2.5 sm:p-4 flex items-start justify-between pointer-events-none z-20 safe-top">
        {/* Left Side: Lives & Combo */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Life / Shield Status Badge */}
          <div className="glass-level-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center gap-2 border border-amber-500/30 shadow-md">
            {activePowerUps.some((p) => p.type === 'blessing') ? (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Shield className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Shielded by Bappa!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((heartIndex) => (
                    <Heart
                      key={heartIndex}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                        heartIndex <= lives
                          ? 'fill-red-500 text-red-500 animate-pulse'
                          : 'fill-stone-800 text-stone-600 opacity-40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-amber-200">
                  {lives} {lives === 1 ? 'Heart' : 'Hearts'}
                </span>
              </div>
            )}
          </div>

          {/* Combo Multiplier Flame Badge */}
          {combo >= 2 && (
            <div className="glass-level-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 border border-orange-500/40 animate-pulse self-start">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span className="font-outfit font-black text-[11px] sm:text-xs text-orange-300">
                x{combo} COMBO!
              </span>
            </div>
          )}

          {/* Active Power-Ups */}
          {activePowerUps.length > 0 && (
            <div className="flex flex-col gap-1 mt-0.5">
              {activePowerUps.map((p) => (
                <div
                  key={p.type}
                  className="glass-level-2 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-amber-400/40 animate-bounce text-amber-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="capitalize">{p.type === 'blessing' ? 'Divine Shield' : p.type}</span>
                  <span className="text-amber-300 font-mono">({Math.ceil(p.timeLeft)}s)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Stage Title & Progress Meter */}
        <div className="flex flex-col items-center max-w-xs sm:max-w-md w-full px-2">
          <div className="glass-level-2 px-3 sm:px-4 py-1 rounded-full border border-amber-500/30 mb-1 flex items-center gap-2">
            <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-300">
              {stage.title}
            </span>
            <span className="text-amber-200/90 text-[11px] sm:text-xs font-mono font-bold">
              • {currentMetres}m / {stage.targetDistance || 30}m
            </span>
          </div>

          {/* Progress Bar with Ganesha Goal Destination */}
          <div className="w-full glass-level-1 rounded-full h-3 sm:h-3.5 p-0.5 border border-amber-500/40 shadow-inner relative overflow-hidden flex items-center">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 h-full rounded-full transition-all duration-150"
              style={{ width: `${Math.max(2, progress * 100)}%` }}
            />
            <span className="absolute right-0.5 flex items-center justify-center" title="Reach Lord Ganesha at 30m">
              <GaneshaImage className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain drop-shadow" />
            </span>
          </div>

          {/* Stage 2 Rangoli Color Sequence HUD */}
          {stage.hasColorSequence && colorSequence && (
            <div className="glass-level-2 mt-1.5 px-3 py-1 rounded-xl flex items-center gap-2 border border-amber-400/40">
              <span className="text-[10px] uppercase tracking-wider text-amber-200 font-bold">
                Target:
              </span>
              <div className="flex items-center gap-1.5">
                {colorSequence.colors.map((color, idx) => {
                  const isCurrent = idx === colorSequence.currentIdx;
                  const isDone = idx < colorSequence.currentIdx;
                  let bgClass = 'bg-red-500';
                  if (color === 'yellow') bgClass = 'bg-yellow-400';
                  if (color === 'green') bgClass = 'bg-green-500';
                  if (color === 'blue') bgClass = 'bg-blue-500';

                  return (
                    <div
                      key={color}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${bgClass} transition-all duration-200 ${
                        isCurrent
                          ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black'
                          : isDone
                          ? 'opacity-40'
                          : 'opacity-75'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Score, Eco Score & Audio/Pause Actions */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2">
          {/* Score Counter */}
          <div className="glass-level-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-2xl border border-amber-500/30 text-right shadow-md">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-300/80 block font-cinzel">Score</span>
            <span className="font-outfit font-black text-sm sm:text-base text-amber-300 leading-none">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Eco Score */}
          {(stage.isEcoStage || ecoScore > 0) && (
            <div className="glass-level-2 px-2.5 sm:px-3 py-1 rounded-xl border border-emerald-500/40 text-right flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-300 block">Eco</span>
                <span className="font-outfit font-bold text-xs text-emerald-300 leading-none">
                  {ecoScore}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons: Pause, Mute & On-screen Controls */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              id="game-controls-toggle"
              onClick={() => setShowTouchControls((prev) => !prev)}
              className={`glass-level-2 p-2 rounded-xl border border-amber-500/30 ${
                showTouchControls ? 'text-amber-300 glass-active' : 'text-amber-300/60'
              } hover:text-amber-100 cursor-pointer active:scale-95`}
              title={showTouchControls ? 'Hide Touch Buttons' : 'Show Touch Buttons'}
            >
              <Gamepad2 className="w-4 h-4" />
            </button>

            <button
              id="game-sound-toggle"
              onClick={toggleSound}
              className="glass-level-2 p-2 rounded-xl border border-amber-500/30 text-amber-300 hover:text-amber-100 cursor-pointer active:scale-95"
              title="Toggle Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="game-pause-toggle"
              onClick={togglePause}
              className="glass-level-2 p-2 rounded-xl border border-amber-500/30 text-amber-300 hover:text-amber-100 cursor-pointer active:scale-95"
              title="Pause Game"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* APPROACHING LORD GANESHA CELEBRATION BANNER */}
      {currentMetres >= 25 && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
          <div className="glass-modal px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-amber-400 shadow-2xl flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="font-cinzel font-black text-xs sm:text-sm text-amber-300">
              {currentMetres >= 30
                ? 'REACHED LORD GANESHA! RECEIVING DIVINE BLESSINGS!'
                : `${30 - currentMetres}M TO LORD GANESHA! KEEP DASHING!`}
            </span>
            <GaneshaImage className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow" />
          </div>
        </div>
      )}

      {/* EASY OBSTACLE ACTION ALERT */}
      {obstacleWarning && currentMetres < 26 && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-25 pointer-events-none animate-pulse">
          <div className="glass-level-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-orange-400 shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-200">
            {obstacleWarning === 'jump' ? <MoveUp className="w-4 h-4 text-amber-400" /> : <MoveDown className="w-4 h-4 text-orange-400" />}
            <span>{obstacleWarning === 'jump' ? 'UPCOMING OBSTACLE: JUMP (SPACE / TAP)' : 'UPCOMING BARRIER: SLIDE (DOWN / SWIPE)'}</span>
          </div>
        </div>
      )}

      {/* DESKTOP KEYBOARD CONTROLS HELPER */}
      <div className="hidden sm:flex absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none items-center gap-3 glass-level-2 px-4 py-1 rounded-full border border-amber-500/25 text-[11px] font-medium text-amber-200/80">
        <span><strong className="text-amber-300 font-mono">SPACE / ↑</strong> Jump</span>
        <span>•</span>
        <span><strong className="text-amber-300 font-mono">↓</strong> Slide</span>
        <span>•</span>
        <span><strong className="text-amber-300 font-mono">← / →</strong> Steer</span>
        <span>•</span>
        <span className="flex items-center gap-1.5"><strong className="text-amber-300 font-mono">Goal:</strong> 30m to Lord Ganesha <GaneshaImage className="w-4 h-4 object-contain inline-block" /></span>
      </div>

      {/* ON-SCREEN MOBILE / TOUCH CONTROLS */}
      {showTouchControls && (
        <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 px-2.5 sm:px-6 flex items-end justify-between pointer-events-none z-25 select-none pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {/* Left Cluster: Steer Left & Right */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto select-none">
            <button
              id="btn-steer-left"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                soundManager.userInteracted();
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(8);
                engineRef.current?.nudgeLeft(45);
                engineRef.current?.steerLeft(true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                engineRef.current?.steerLeft(false);
              }}
              onPointerLeave={() => engineRef.current?.steerLeft(false)}
              onPointerCancel={() => engineRef.current?.steerLeft(false)}
              className="glass-card w-13 h-13 sm:w-16 sm:h-16 rounded-2xl border-2 border-amber-500/50 active:scale-90 flex flex-col items-center justify-center font-bold text-amber-300 shadow-xl select-none cursor-pointer touch-none"
              title="Steer Left"
            >
              <MoveLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-black mt-0.5">LEFT</span>
            </button>

            <button
              id="btn-steer-right"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                soundManager.userInteracted();
                if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(8);
                engineRef.current?.nudgeRight(45);
                engineRef.current?.steerRight(true);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                engineRef.current?.steerRight(false);
              }}
              onPointerLeave={() => engineRef.current?.steerRight(false)}
              onPointerCancel={() => engineRef.current?.steerRight(false)}
              className="glass-card w-13 h-13 sm:w-16 sm:h-16 rounded-2xl border-2 border-amber-500/50 active:scale-90 flex flex-col items-center justify-center font-bold text-amber-300 shadow-xl select-none cursor-pointer touch-none"
              title="Steer Right"
            >
              <MoveRight className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-black mt-0.5">RIGHT</span>
            </button>
          </div>

          {/* Right Cluster: Slide & Jump */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto select-none">
            <button
              id="mobile-slide-button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSlidePress();
              }}
              className="glass-card w-13 h-13 sm:w-16 sm:h-16 rounded-2xl border-2 border-orange-500/60 active:scale-90 flex flex-col items-center justify-center font-bold text-orange-300 shadow-xl select-none cursor-pointer touch-none"
              title="Slide / Duck"
            >
              <MoveDown className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-black mt-0.5">SLIDE</span>
            </button>

            <button
              id="mobile-jump-button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleJumpPress();
              }}
              className="glass-button w-15 h-15 sm:w-18 sm:h-18 rounded-2xl border-2 border-amber-300 active:scale-90 flex flex-col items-center justify-center font-bold text-amber-100 shadow-2xl shadow-amber-500/40 select-none cursor-pointer touch-none"
              title="Jump"
            >
              <MoveUp className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="text-[10px] sm:text-xs tracking-wider uppercase font-black mt-0.5">JUMP</span>
            </button>
          </div>
        </div>
      )}

      {/* PAUSE MODAL OVERLAY */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 apple-defocus-backdrop safe-top safe-bottom safe-x box-border">
          <motion.div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="pause-dialog-title"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="apple-liquid-glass-modal apple-glass-reflection w-full max-w-sm rounded-3xl p-6 border border-amber-500/40 text-center shadow-2xl"
          >
            <h3 id="pause-dialog-title" className="font-cinzel text-2xl font-bold text-amber-300 mb-2">Game Paused</h3>
            <p className="text-xs text-amber-200/70 mb-5 font-marcellus">Take a peaceful breath and resume your festive dash!</p>

            <div className="flex flex-col gap-3">
              <button
                id="resume-btn"
                onClick={togglePause}
                className="apple-glass-button py-3 px-6 rounded-2xl font-cinzel font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>RESUME</span>
              </button>

              <button
                id="exit-menu-btn"
                onClick={onExitToMenu}
                className="glass-button-secondary w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95"
              >
                QUIT TO MAIN MENU
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
