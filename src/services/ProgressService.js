import AsyncStorage from '@react-native-async-storage/async-storage';
import KanjiService, { LEVELS, KANJI_BANK } from './KanjiService';

const STORAGE_KEY = 'kanji_progress_v1';

const initialState = {
  currentLevel: 'N5',
  unlockedLevels: ['N5'],
  mastery: {}, // { [kanjiId]: correctCount }
  xp: 0,
  streak: 0,
  lastPlayedAt: null,
  sessions: {}, // { [levelId]: count }
};

const masteryThreshold = 2; // times answered correctly to count as "mastered"
const minSessionsToUnlock = 5; // enforce practice depth before unlock

function getLevelPool(levelId) {
  return KANJI_BANK.filter(k => k.level === levelId);
}

function getLevelIndex(levelId) {
  return LEVELS.findIndex(l => l.id === levelId);
}

function requiredToUnlock(levelId) {
  const pool = getLevelPool(levelId);
  // Require at least 60% of the level mastered, but never less than 10 and capped for huge lists.
  const threshold = Math.min(Math.max(10, Math.ceil(pool.length * 0.6)), 50);
  return { total: pool.length, threshold, minSessions: minSessionsToUnlock };
}

function computeMastered(state, levelId) {
  const pool = getLevelPool(levelId);
  const mastered = pool.filter(k => (state.mastery[k.id] || 0) >= masteryThreshold).length;
  const { total, threshold, minSessions } = requiredToUnlock(levelId);
  const sessions = state.sessions?.[levelId] || 0;
  return { mastered, total, threshold, sessions, minSessions };
}

async function load() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...initialState };
    const parsed = JSON.parse(raw);
    return { ...initialState, ...parsed };
  } catch (e) {
    return { ...initialState };
  }
}

async function save(state) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function recordQuiz({ levelId, correctIds }) {
  const state = await load();
  const next = { ...state, mastery: { ...state.mastery }, sessions: { ...state.sessions } };

  correctIds.forEach((id) => {
    next.mastery[id] = (next.mastery[id] || 0) + 1;
  });

  // Track sessions at this level to prevent unlocking after a single run
  next.sessions[levelId] = (next.sessions[levelId] || 0) + 1;

  // XP: 10 per correct + small bonus
  const gainedXp = correctIds.length * 10 + 5;
  next.xp += gainedXp;

  // Unlock logic
  const newlyMasteredCount = computeMastered(next, levelId).mastered - computeMastered(state, levelId).mastered;
  const currentIndex = getLevelIndex(levelId);
  const unlockedNow = [];

  if (currentIndex >= 0 && currentIndex < LEVELS.length - 1) {
    const { mastered, threshold, sessions, minSessions } = computeMastered(next, levelId);
    const nextLevel = LEVELS[currentIndex + 1];
    const alreadyUnlocked = state.unlockedLevels.includes(nextLevel.id);
    const practicedEnough = sessions >= minSessions;
    if (mastered >= threshold && practicedEnough && !alreadyUnlocked) {
      next.unlockedLevels = [...new Set([...next.unlockedLevels, nextLevel.id])];
      unlockedNow.push(nextLevel.id);
      next.currentLevel = nextLevel.id;
    }
  }

  await save(next);
  return {
    state: next,
    gainedXp,
    unlockedNow,
    newlyMastered: newlyMasteredCount,
  };
}

function getLevelProgressSnapshot(state, levelId) {
  const { mastered, total, threshold, sessions, minSessions } = computeMastered(state, levelId);
  const unlocked = state.unlockedLevels.includes(levelId);
  return { mastered, total, threshold, sessions, minSessions, unlocked };
}

export default {
  load,
  save,
  recordQuiz,
  getLevelProgressSnapshot,
  requiredToUnlock,
};
