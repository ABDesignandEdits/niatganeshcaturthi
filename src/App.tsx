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
    <div className="relative w-full h-screen overflow-hidden bg-stone-950 font-outfit select-none">
      {/* 1. Main Menu Screen */}
      {screen === 'menu' && (
        <MainMenu
          highScore={highScore}
          onPlay={handlePlayClick}
          onOpenLeaderboard={() => setScreen('leaderboard')}
          onOpenHowToPlay={() => setScreen('tutorial')}
          onOpenSettings={() => setScreen('settings')}
          onOpenAbout={() => setScreen('about')}
        />
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
