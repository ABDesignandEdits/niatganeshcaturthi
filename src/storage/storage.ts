import { LeaderboardEntry } from '../types';

const STORAGE_KEYS = {
  HIGH_SCORE: 'mushak_high_score',
  BEST_ECO_SCORE: 'mushak_best_eco_score',
  MAX_COMBO: 'mushak_max_combo',
  LEADERBOARD: 'mushak_leaderboard',
  UNLOCKED_STAGE: 'mushak_unlocked_stage',
};

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Aarav (IITB)', score: 14850, ecoScore: 420, maxCombo: 16, stageReached: 5, date: '2026-09-08' },
  { id: '2', name: 'Diya (BITS)', score: 13200, ecoScore: 380, maxCombo: 14, stageReached: 5, date: '2026-09-09' },
  { id: '3', name: 'Rohan (NITK)', score: 11950, ecoScore: 350, maxCombo: 12, stageReached: 4, date: '2026-09-10' },
  { id: '4', name: 'Ananya (VJTI)', score: 10400, ecoScore: 310, maxCombo: 10, stageReached: 4, date: '2026-09-11' },
  { id: '5', name: 'Kabir (COEP)', score: 8750, ecoScore: 260, maxCombo: 8, stageReached: 3, date: '2026-09-11' },
];

export const getHighScore = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveHighScore = (score: number): boolean => {
  try {
    const current = getHighScore();
    if (score > current) {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
      return true;
    }
  } catch {
    // Ignore
  }
  return false;
};

export const getBestEcoScore = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.BEST_ECO_SCORE);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveBestEcoScore = (ecoScore: number): void => {
  try {
    const current = getBestEcoScore();
    if (ecoScore > current) {
      localStorage.setItem(STORAGE_KEYS.BEST_ECO_SCORE, ecoScore.toString());
    }
  } catch {
    // Ignore
  }
};

export const getMaxComboRecord = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.MAX_COMBO);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveMaxComboRecord = (combo: number): void => {
  try {
    const current = getMaxComboRecord();
    if (combo > current) {
      localStorage.setItem(STORAGE_KEYS.MAX_COMBO, combo.toString());
    }
  } catch {
    // Ignore
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // Ignore
  }
  return DEFAULT_LEADERBOARD;
};

export const addLeaderboardEntry = (
  name: string,
  score: number,
  ecoScore: number,
  maxCombo: number,
  stageReached: number
): LeaderboardEntry[] => {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    id: Date.now().toString(),
    name: name.trim() || 'Festive Runner',
    score,
    ecoScore,
    maxCombo,
    stageReached,
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [...current, newEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
  } catch {
    // Ignore
  }

  return updated;
};

export const getUnlockedStage = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.UNLOCKED_STAGE);
    return val ? parseInt(val, 10) : 1;
  } catch {
    return 1;
  }
};

export const saveUnlockedStage = (stage: number): void => {
  try {
    const current = getUnlockedStage();
    if (stage > current) {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_STAGE, stage.toString());
    }
  } catch {
    // Ignore
  }
};
