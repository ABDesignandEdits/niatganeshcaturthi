import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Trophy, Heart, Sparkles, RefreshCw, Flame, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { drawMushakAsset } from '../../utils/gameAssets';

interface ModakKitchenGameProps {
  onBack: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'ukadiche' | 'fried' | 'chocolate' | 'laddu' | 'golden' | 'chilli' | 'mouse';
  size: number;
  rotation: number;
}

export const ModakKitchenGame: React.FC<ModakKitchenGameProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'catch' | 'craft'>('catch');
  const [soundOn, setSoundOn] = useState(true);

  // --- Catch Mode State ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('mushak_modak_catch_high') || '0');
    } catch {
      return 0;
    }
  });

  const basketX = useRef<number>(200);
  const itemsRef = useRef<FallingItem[]>([]);
  const nextId = useRef(1);

  // --- Crafting Mode State ---
  const [craftStep, setCraftStep] = useState<1 | 2 | 3 | 4>(1);
  const [pleatCount, setPleatCount] = useState(0);
  const [isSteaming, setIsSteaming] = useState(false);
  const [steamProgress, setSteamProgress] = useState(0);
  const [isCraftComplete, setIsCraftComplete] = useState(false);
  const [doughSmoothness, setDoughSmoothness] = useState(0);

  // --- Catch Game Loop ---
  const startGame = () => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(60);
    setGameOver(false);
    setIsPlaying(true);
    itemsRef.current = [];
    soundManager.userInteracted();
    soundManager.playPowerUp();
  };

  useEffect(() => {
    if (!isPlaying || activeTab !== 'catch') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          soundManager.playShankhCelebration();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activeTab]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying || activeTab !== 'catch') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let spawnTimer = 0;

    const basketWidth = 95;
    const basketHeight = 24;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warm festive kitchen background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#2d0c03');
      bgGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative banana leaves and garland border along bottom
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height, canvas.width * 0.55, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Spawn falling modaks / hazards
      spawnTimer++;
      if (spawnTimer > 35) {
        spawnTimer = 0;
        const rand = Math.random();
        let type: FallingItem['type'] = 'ukadiche';
        if (rand < 0.35) type = 'ukadiche';
        else if (rand < 0.6) type = 'fried';
        else if (rand < 0.75) type = 'laddu';
        else if (rand < 0.85) type = 'golden';
        else if (rand < 0.93) type = 'chilli';
        else type = 'mouse';

        itemsRef.current.push({
          id: nextId.current++,
          x: 40 + Math.random() * (canvas.width - 80),
          y: -25,
          speed: 2.2 + Math.random() * 2.5,
          type,
          size: 26,
          rotation: (Math.random() - 0.5) * 0.05,
        });
      }

      // Update and draw items
      const remainingItems: FallingItem[] = [];
      const basketY = canvas.height - 45;

      for (const item of itemsRef.current) {
        item.y += item.speed;

        // Draw item
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.font = `${item.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (item.type === 'ukadiche') ctx.fillText('🥟', 0, 0);
        else if (item.type === 'fried') ctx.fillText('🥠', 0, 0);
        else if (item.type === 'laddu') ctx.fillText('🟡', 0, 0);
        else if (item.type === 'golden') {
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 12;
          ctx.fillText('✨🥟', 0, 0);
        } else if (item.type === 'chilli') ctx.fillText('🌶️', 0, 0);
        else if (item.type === 'mouse') {
          drawMushakAsset(ctx, 0, 0, item.size * 1.5, item.size * 1.5);
        }

        ctx.restore();

        // Collision with basket
        const inBasketX = item.x >= basketX.current - basketWidth / 2 && item.x <= basketX.current + basketWidth / 2;
        const inBasketY = item.y >= basketY - 15 && item.y <= basketY + 20;

        if (inBasketX && inBasketY) {
          if (item.type === 'chilli') {
            soundManager.playHeartLost();
            setCombo(0);
            setLives((l) => {
              const nl = l - 1;
              if (nl <= 0) {
                setGameOver(true);
                setIsPlaying(false);
                soundManager.playGameOver();
              }
              return nl;
            });
          } else if (item.type === 'mouse') {
            soundManager.playObstacleHit();
            setScore((s) => Math.max(0, s - 25));
            setCombo(0);
          } else {
            // Modak collected!
            let pts = 10;
            if (item.type === 'fried') pts = 15;
            if (item.type === 'laddu') pts = 20;
            if (item.type === 'golden') pts = 50;

            soundManager.playModakCollect();
            setCombo((c) => {
              const nc = c + 1;
              if (nc % 5 === 0) soundManager.playCombo(Math.min(5, Math.floor(nc / 5)));
              return nc;
            });

            setScore((s) => {
              const newScore = s + pts * (1 + Math.min(combo * 0.1, 2));
              if (newScore > highScore) {
                setHighScore(Math.floor(newScore));
                try {
                  localStorage.setItem('mushak_modak_catch_high', String(Math.floor(newScore)));
                } catch {
                  // Ignore
                }
              }
              return Math.floor(newScore);
            });
          }
          continue; // Item collected
        }

        // Missed item
        if (item.y > canvas.height + 25) {
          if (item.type !== 'chilli' && item.type !== 'mouse') {
            setCombo(0);
          }
        } else {
          remainingItems.push(item);
        }
      }

      itemsRef.current = remainingItems;

      // Draw Brass Puja Thali Basket
      ctx.save();
      const bx = basketX.current;
      const by = basketY;

      // Thali glow
      const thaliGlow = ctx.createRadialGradient(bx, by, 5, bx, by, 55);
      thaliGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      thaliGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = thaliGlow;
      ctx.beginPath();
      ctx.ellipse(bx, by, 60, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden Brass Thali Rim
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.ellipse(bx, by, basketWidth / 2, basketHeight / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(bx, by - 2, (basketWidth - 8) / 2, (basketHeight - 6) / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Diya on the thali center
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪔', bx, by - 4);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, activeTab, combo, highScore]);

  // Handle touch / mouse movement for basket
  const handlePointerMove = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const x = (clientX - rect.left) * scale;
    basketX.current = Math.max(50, Math.min(canvas.width - 50, x));
  };

  // --- Crafting Simulation Handlers ---
  const handleKnead = () => {
    soundManager.playSlide();
    setDoughSmoothness((prev) => {
      const next = prev + 25;
      if (next >= 100) {
        soundManager.playPowerUp();
        setTimeout(() => setCraftStep(2), 600);
      }
      return Math.min(100, next);
    });
  };

  const handlePinchPleat = () => {
    soundManager.playDurvaCollect();
    setPleatCount((prev) => {
      const next = prev + 1;
      if (next >= 21) {
        soundManager.playShankhCelebration();
        setTimeout(() => setCraftStep(4), 800);
      }
      return next;
    });
  };

  const handleStartSteaming = () => {
    setIsSteaming(true);
    soundManager.playSizzle();
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setSteamProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsSteaming(false);
        setIsCraftComplete(true);
        soundManager.playShankhCelebration();
      }
    }, 400);
  };

  const resetCraft = () => {
    setCraftStep(1);
    setPleatCount(0);
    setDoughSmoothness(0);
    setSteamProgress(0);
    setIsCraftComplete(false);
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-stone-950 text-amber-50 flex flex-col items-center justify-start py-2 px-3 sm:px-4 select-none overflow-y-auto overflow-x-hidden box-border safe-top safe-bottom safe-x">
      {/* Top Header */}
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
            <span>🥟</span>
            <span>MODAK RASOI</span>
            <span>🥟</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-200/80 font-rozha">
            Prasad Catch Mania & Sacred Kitchen
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/20 text-xs">
          <button
            onClick={() => {
              setActiveTab('catch');
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'catch' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
            }`}
          >
            Catch Mania
          </button>
          <button
            onClick={() => setActiveTab('craft')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === 'craft' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-amber-200 hover:text-white'
            }`}
          >
            Master Chef
          </button>
        </div>
      </header>

      {/* Mode A: Catch Mania */}
      {activeTab === 'catch' && (
        <div className="w-full max-w-md flex flex-col items-center my-2">
          {/* Catch HUD */}
          <div className="w-full flex items-center justify-between px-3 py-1.5 mb-2 festival-glass rounded-xl border border-amber-500/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold">Score:</span>
              <span className="font-cinzel font-black text-base text-amber-400">{score}</span>
              {combo > 1 && (
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] animate-pulse">
                  {combo}x STREAK!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((h) => (
                  <Heart
                    key={h}
                    className={`w-4 h-4 ${h <= lives ? 'text-red-500 fill-red-500' : 'text-stone-600'}`}
                  />
                ))}
              </div>
              <div className="font-mono text-amber-300 font-bold">⏳ {timeLeft}s</div>
            </div>
          </div>

          {/* Catch Canvas */}
          <div
            className="relative w-full max-w-[350px] rounded-2xl border-2 border-amber-500/50 shadow-2xl overflow-hidden touch-none"
            onTouchMove={(e) => {
              if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
            }}
            onMouseMove={(e) => handlePointerMove(e.clientX)}
          >
            <canvas ref={canvasRef} width={350} height={420} className="w-full h-auto aspect-[350/420] block cursor-ew-resize touch-none" />

            {/* Start / Game Over Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                {gameOver ? (
                  <>
                    <span className="text-4xl mb-2">🐚</span>
                    <h3 className="font-cinzel text-xl font-bold text-amber-300">Prasad Offering Complete!</h3>
                    <p className="text-xs text-amber-200 mt-1">Lord Ganesha is deeply pleased with your devotion!</p>
                    <div className="my-3 p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 w-full">
                      <div className="text-xs text-amber-300">Final Modaks Collected:</div>
                      <div className="font-cinzel text-2xl font-black text-amber-400">{score}</div>
                      <div className="text-[11px] text-amber-200/70 mt-1">Best Record: {highScore}</div>
                    </div>
                    <button
                      onClick={startGame}
                      className="festival-button w-full py-2.5 rounded-xl font-bold text-sm"
                    >
                      PLAY AGAIN
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-4xl mb-2">🥟🪔</span>
                    <h3 className="font-cinzel text-xl font-bold text-amber-300">Modak Catch Rush</h3>
                    <p className="text-xs text-amber-100/80 mt-1 max-w-xs leading-relaxed">
                      Slide the brass Puja Thali to catch steaming Ukadiche Modaks, Fried Modaks, and golden Laddus! Avoid hot chillies and mischievous mice!
                    </p>
                    <div className="flex items-center gap-3 my-3 text-[11px] text-amber-300">
                      <span>🥟 +10</span>
                      <span>🥠 +15</span>
                      <span>🟡 +20</span>
                      <span>✨ +50</span>
                    </div>
                    <button
                      onClick={startGame}
                      className="festival-button w-full py-3 rounded-xl font-bold text-base shadow-lg"
                    >
                      START CATCHING
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* On-screen Mobile Steering Buttons */}
          {isPlaying && (
            <div className="flex items-center justify-between w-full max-w-xs mt-2 px-2">
              <button
                onTouchStart={() => (basketX.current = Math.max(50, basketX.current - 40))}
                onClick={() => (basketX.current = Math.max(50, basketX.current - 40))}
                className="w-16 h-12 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xl active:bg-amber-600 active:text-stone-950 flex items-center justify-center cursor-pointer shadow-md"
              >
                ◀
              </button>
              <span className="text-[11px] text-amber-200/60 font-semibold">Touch & Drag or Tap</span>
              <button
                onTouchStart={() => (basketX.current = Math.min(330, basketX.current + 40))}
                onClick={() => (basketX.current = Math.min(330, basketX.current + 40))}
                className="w-16 h-12 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xl active:bg-amber-600 active:text-stone-950 flex items-center justify-center cursor-pointer shadow-md"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode B: Modak Master Chef Crafting */}
      {activeTab === 'craft' && (
        <div className="w-full max-w-md flex flex-col items-center my-auto p-4 festival-glass rounded-2xl border border-amber-500/40 text-center space-y-4">
          <div className="flex items-center justify-between w-full border-b border-amber-500/20 pb-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Step {craftStep} of 4:
            </span>
            <span className="text-xs text-amber-200 font-semibold">
              {craftStep === 1 && 'Knead Rice Flour Dough'}
              {craftStep === 2 && 'Fill Coconut-Jaggery'}
              {craftStep === 3 && 'Pinch the 21 Sacred Pleats'}
              {craftStep === 4 && 'Steam in Banana Leaf'}
            </span>
          </div>

          {/* Visual Interactive Cooking Stage */}
          <div className="relative w-64 h-64 mx-auto rounded-2xl bg-amber-950/60 border-2 border-amber-500/30 flex flex-col items-center justify-center p-4">
            {craftStep === 1 && (
              <div className="space-y-3">
                <div
                  style={{ transform: `scale(${1 + doughSmoothness * 0.002})` }}
                  className="w-28 h-28 mx-auto rounded-full bg-stone-100 border-4 border-amber-200 shadow-xl flex items-center justify-center text-3xl transition-transform"
                >
                  🍚
                </div>
                <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-amber-500/30">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full transition-all"
                    style={{ width: `${doughSmoothness}%` }}
                  />
                </div>
                <button
                  onClick={handleKnead}
                  className="festival-button px-5 py-2 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
                >
                  TAP TO KNEAD ({doughSmoothness}%)
                </button>
              </div>
            )}

            {craftStep === 2 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="w-28 h-28 mx-auto rounded-full bg-stone-100 border-4 border-amber-200 shadow-xl relative flex items-center justify-center">
                  {/* Dough bowl with brown jaggery coconut filling */}
                  <div className="w-16 h-16 rounded-full bg-amber-800 border-2 border-amber-600 flex items-center justify-center text-xl">
                    🥥
                  </div>
                </div>
                <p className="text-xs text-amber-200">Coconut, Jaggery, Elaichi (Cardamom) and Nutmeg filling added!</p>
                <button
                  onClick={() => {
                    soundManager.playPowerUp();
                    setCraftStep(3);
                  }}
                  className="festival-button px-5 py-2 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
                >
                  PROCEED TO PLEATING
                </button>
              </div>
            )}

            {craftStep === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <div className="relative w-32 h-32 mx-auto rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center bg-stone-900/40">
                  <span className="text-4xl">🥟</span>
                  {/* Render pleat pins around circle */}
                  {Array.from({ length: 21 }).map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 21;
                    const x = 54 + Math.cos(angle) * 50;
                    const y = 54 + Math.sin(angle) * 50;
                    return (
                      <div
                        key={i}
                        style={{ left: x, top: y }}
                        className={`absolute w-3 h-3 rounded-full text-[8px] flex items-center justify-center ${
                          i < pleatCount ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-700'
                        }`}
                      >
                        •
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs font-bold text-amber-300">
                  Pleats Pinched: {pleatCount} / 21
                </div>
                <button
                  onClick={handlePinchPleat}
                  disabled={pleatCount >= 21}
                  className="festival-button px-5 py-2 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
                >
                  PINCH PLEAT ({pleatCount}/21)
                </button>
              </div>
            )}

            {craftStep === 4 && (
              <div className="space-y-3 animate-in fade-in">
                {!isCraftComplete ? (
                  <>
                    <div className="relative text-5xl animate-bounce">
                      {isSteaming ? '♨️🥟' : '🍃🥟'}
                    </div>
                    {isSteaming && (
                      <div className="w-full bg-stone-900 rounded-full h-2.5 overflow-hidden border border-amber-500/30">
                        <div
                          className="bg-amber-400 h-2.5 rounded-full transition-all"
                          style={{ width: `${steamProgress}%` }}
                        />
                      </div>
                    )}
                    <button
                      onClick={handleStartSteaming}
                      disabled={isSteaming}
                      className="festival-button px-5 py-2 rounded-xl text-xs font-bold active:scale-95 cursor-pointer"
                    >
                      {isSteaming ? `STEAMING... ${steamProgress}%` : 'STEAM TRADITIONAL MODAK'}
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 animate-in zoom-in">
                    <div className="text-5xl animate-pulse">✨🪔🥟</div>
                    <h4 className="font-cinzel font-bold text-amber-300 text-sm">Divine Prasad Ready!</h4>
                    <p className="text-[11px] text-amber-100/90 leading-tight">
                      Garnished with saffron milk and fresh Durva grass blades for Lord Ganesha!
                    </p>
                    <button
                      onClick={resetCraft}
                      className="festival-glass px-4 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-900/40"
                    >
                      Cook Another Modak
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-amber-300/70 border-t border-amber-900/30">
        Lord Ganesha is lovingly known as "Modak-Priya" • 21 Modaks are traditionally offered during Ganesh Chaturthi
      </footer>
    </div>
  );
};
