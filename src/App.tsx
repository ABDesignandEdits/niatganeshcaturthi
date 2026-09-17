/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameScreen, StageConfig, QuizQuestion } from './types';
import { STAGES, QUIZ_QUESTIONS } from './game/constants';
import { getHighScore } from './storage/storage';
import { soundManager } from './audio/soundManager';

import { MainMenu } from './components/MainMenu';
import { TutorialModal } from './components/TutorialModal';
import { GameView } from './components/GameView';
import { StageClearModal } from './components/StageClearModal';
import { QuizModal } from './components/QuizModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';

// Festival Mini-Games
import { RangoliGame } from './components/games/RangoliGame';
import { ModakKitchenGame } from './components/games/ModakKitchenGame';
import { DholTashaGame } from './components/games/DholTashaGame';
import { GaneshaShringaarGame } from './components/games/GaneshaShringaarGame';
import { EcoClayMurtiGame } from './components/games/EcoClayMurtiGame';
import { FestiveMemoryGame } from './components/games/FestiveMemoryGame';
import { ModakTowerGame } from './components/games/ModakTowerGame';
import { LaddooRushGame } from './components/games/LaddooRushGame';
import { VisarjanMirajGame } from './components/games/VisarjanMirajGame';
import { GaneshaNamesGame } from './components/games/GaneshaNamesGame';
import { DiyaMandalaGame } from './components/games/DiyaMandalaGame';
import { DurvaPujaGame } from './components/games/DurvaPujaGame';
import { PandalBuilderGame } from './components/games/PandalBuilderGame';
import { GaneshaPuzzleGame } from './components/games/GaneshaPuzzleGame';
import { PandalViewer3D } from './components/three3d/PandalViewer3D';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentEcoScore, setCurrentEcoScore] = useState(0);
  const [currentMaxCombo, setCurrentMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore());
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [lastObstacleHit, setLastObstacleHit] = useState<string>('Festival Obstacle');
  const [offeringsCount, setOfferingsCount] = useState<number>(0);
  const [gameSessionId, setGameSessionId] = useState<number>(1);

  // Triggered when clicking Play on Main Menu
  const handlePlayClick = () => {
    // Show tutorial before Stage 1
    setScreen('tutorial');
  };

  // Triggered when starting the game from tutorial
  const handleStartGame = () => {
    setCurrentStageIndex(0);
    setCurrentScore(0);
    setCurrentEcoScore(0);
    setCurrentMaxCombo(0);
    setOfferingsCount(0);
    setGameSessionId((prev) => prev + 1);
    setScreen('playing');
  };

  // Triggered when pilgrimage is completed (reaching Lord Ganesha at 30m)
  const handleStageComplete = (
    stage: StageConfig,
    score: number,
    ecoScore: number,
    maxCombo: number
  ) => {
    setCurrentScore(score);
    setCurrentEcoScore(ecoScore);
    setCurrentMaxCombo(maxCombo);
    if (score > highScore) {
      setHighScore(score);
    }

    // Reaching Lord Ganesha ends the run with the Grand Victory Darshan!
    setScreen('victory');
  };

  // Advance to next stage directly
  const handleNextStage = () => {
    const nextIdx = currentStageIndex + 1;
    if (nextIdx < STAGES.length) {
      setCurrentStageIndex(nextIdx);
      setScreen('playing');
    } else {
      setScreen('victory');
    }
  };

  // Launch Festival Trivia Quiz
  const handleTakeQuiz = () => {
    // Pick question corresponding to stage or random
    const qIndex = currentStageIndex % QUIZ_QUESTIONS.length;
    setCurrentQuiz(QUIZ_QUESTIONS[qIndex]);
    setScreen('quiz');
  };

  // Quiz answered
  const handleQuizComplete = (bonus: number) => {
    setCurrentScore((prev) => prev + bonus);
    handleNextStage();
  };

  // Triggered on obstacle hit or game over
  const handleGameOver = (
    score: number,
    ecoScore: number,
    maxCombo: number,
    obstacleName = 'Festival Obstacle',
    offerings = 0
  ) => {
    setCurrentScore(score);
    setCurrentEcoScore(ecoScore);
    setCurrentMaxCombo(maxCombo);
    setLastObstacleHit(obstacleName);
    setOfferingsCount(offerings);
    if (score > highScore) {
      setHighScore(score);
    }
    soundManager.stopMusic();
    setScreen('game_over');
  };

  // Restart current run (starts a fresh session with 3 hearts)
  const handleTryAgain = () => {
    setCurrentStageIndex(0);
    setCurrentScore(0);
    setCurrentEcoScore(0);
    setCurrentMaxCombo(0);
    setOfferingsCount(0);
    setGameSessionId((prev) => prev + 1);
    setScreen('playing');
  };

  const handleMainMenu = () => {
    soundManager.stopMusic();
    setHighScore(getHighScore());
    setScreen('menu');
  };

  return (
    <div
      className={`relative w-full ${
        screen === 'playing'
          ? 'h-screen h-[100dvh] fixed inset-0 overflow-hidden'
          : 'w-full min-h-screen min-h-[100dvh] overflow-x-hidden'
      } bg-stone-950 font-outfit select-none box-border`}
    >
      {/* 1. Main Menu Screen (Active base view for menu-related screens) */}
      {(screen === 'menu' ||
        screen === 'tutorial' ||
        screen === 'leaderboard' ||
        screen === 'settings' ||
        screen === 'about') && (
        <MainMenu
          highScore={highScore}
          isModalOpen={screen !== 'menu'}
          onPlay={handlePlayClick}
          onPlayRangoli={() => setScreen('game_rangoli')}
          onPlayModak={() => setScreen('game_modak')}
          onPlayDhol={() => setScreen('game_dhol')}
          onPlayShringaar={() => setScreen('game_shringaar')}
          onPlayEcoClay={() => setScreen('game_clay')}
          onPlayMemory={() => setScreen('game_memory')}
          onPlayModakTower={() => setScreen('game_modak_tower')}
          onPlayLaddooRush={() => setScreen('game_laddoo_rush')}
          onPlayVisarjanMiraj={() => setScreen('game_visarjan_miraj')}
          onPlayGaneshaNames={() => setScreen('game_ganesha_names')}
          onPlayDiyaMandala={() => setScreen('game_diya_mandala')}
          onPlayDurvaPuja={() => setScreen('game_durva_puja')}
          onPlayPandalBuilder={() => setScreen('game_pandal_builder')}
          onPlayGaneshaPuzzle={() => setScreen('game_ganesha_puzzle')}
          onOpenPandalViewer={() => setScreen('pandal_viewer')}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenHowToPlay={() => setScreen('tutorial')}
          onOpenSettings={() => setScreen('settings')}
          onOpenAbout={() => setScreen('about')}
        />
      )}

      {/* Festival Mini-Games */}
      {screen === 'game_rangoli' && (
        <RangoliGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_modak' && (
        <ModakKitchenGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_dhol' && (
        <DholTashaGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_shringaar' && (
        <GaneshaShringaarGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_clay' && (
        <EcoClayMurtiGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_memory' && (
        <FestiveMemoryGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_modak_tower' && (
        <ModakTowerGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_laddoo_rush' && (
        <LaddooRushGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_visarjan_miraj' && (
        <VisarjanMirajGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_ganesha_names' && (
        <GaneshaNamesGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_diya_mandala' && (
        <DiyaMandalaGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_durva_puja' && (
        <DurvaPujaGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_pandal_builder' && (
        <PandalBuilderGame onBack={() => setScreen('menu')} />
      )}

      {screen === 'game_ganesha_puzzle' && (
        <GaneshaPuzzleGame onBack={() => setScreen('menu')} />
      )}

      {/* 3D Pandal Walkthrough & Stage Viewer */}
      {screen === 'pandal_viewer' && (
        <PandalViewer3D onClose={handleMainMenu} />
      )}

      {/* 2. Active Game Screen */}
      {screen === 'playing' && (
        <GameView
          key={`session-${gameSessionId}-stage-${currentStageIndex}`}
          initialStageIndex={currentStageIndex}
          initialScore={currentScore}
          initialEcoScore={currentEcoScore}
          initialMaxCombo={currentMaxCombo}
          onStageComplete={handleStageComplete}
          onGameOver={handleGameOver}
          onExitToMenu={handleMainMenu}
        />
      )}

      {/* 3. Tutorial Modal */}
      {screen === 'tutorial' && (
        <TutorialModal
          onStartGame={handleStartGame}
          onClose={() => setScreen('menu')}
        />
      )}

      {/* 4. Stage Clear Modal */}
      {screen === 'stage_clear' && (
        <StageClearModal
          stage={STAGES[currentStageIndex]}
          score={currentScore}
          ecoScore={currentEcoScore}
          maxCombo={currentMaxCombo}
          onTakeQuiz={handleTakeQuiz}
          onNextStage={handleNextStage}
        />
      )}

      {/* 5. Festival Trivia Quiz Modal */}
      {screen === 'quiz' && currentQuiz && (
        <QuizModal
          question={currentQuiz}
          onComplete={handleQuizComplete}
        />
      )}

      {/* 6. Game Over Modal */}
      {screen === 'game_over' && (
        <GameOverModal
          score={currentScore}
          ecoScore={currentEcoScore}
          maxCombo={currentMaxCombo}
          stageReached={currentStageIndex + 1}
          obstacleName={lastObstacleHit}
          offeringsCount={offeringsCount}
          onTryAgain={handleTryAgain}
          onMainMenu={handleMainMenu}
          onViewLeaderboard={() => setScreen('leaderboard')}
        />
      )}

      {/* 7. Victory Screen */}
      {screen === 'victory' && (
        <VictoryModal
          score={currentScore}
          ecoScore={currentEcoScore}
          maxCombo={currentMaxCombo}
          onPlayAgain={handleTryAgain}
          onMainMenu={handleMainMenu}
          onViewLeaderboard={() => setScreen('leaderboard')}
          hasNextStage={currentStageIndex < STAGES.length - 1}
          onNextStage={handleNextStage}
        />
      )}

      {/* 8. Leaderboard Modal */}
      {screen === 'leaderboard' && (
        <LeaderboardModal
          onClose={() => setScreen('menu')}
        />
      )}

      {/* 9. Settings Modal */}
      {screen === 'settings' && (
        <SettingsModal
          onClose={() => setScreen('menu')}
        />
      )}

      {/* 10. About Modal */}
      {screen === 'about' && (
        <AboutModal
          onClose={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
