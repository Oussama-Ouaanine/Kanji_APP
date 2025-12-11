import JOYO_KANJI from '../data/joyoKanji.json';

// Grade-based levels using the full Joyo dataset
const GRADE_ORDER = ['1', '2', '3', '4', '5', '6', 'S'];
const GRADE_META = {
  '1': { label: 'Grade 1', note: 'Intro basics' },
  '2': { label: 'Grade 2', note: 'Early literacy' },
  '3': { label: 'Grade 3', note: 'Building fluency' },
  '4': { label: 'Grade 4', note: 'Mid-level practice' },
  '5': { label: 'Grade 5', note: 'Upper elementary' },
  '6': { label: 'Grade 6', note: 'Advanced elementary' },
  S: { label: 'Secondary (S)', note: 'Junior high +' },
};

const LEVELS = GRADE_ORDER.map((id) => {
  const count = JOYO_KANJI.filter(k => (k.grade || 'S') === id).length;
  return { id, label: GRADE_META[id].label, count, note: GRADE_META[id].note };
});

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

class KanjiService {
  constructor() {
    this.levels = LEVELS;
    this.joyo = JOYO_KANJI.map((k, idx) => {
      const meaning = (k.meaning || '').trim();
      return {
        id: k.id || idx + 1,
        kanji: k.kanji,
        old: k.old || null,
        radical: k.radical || null,
        strokes: k.strokes || null,
        grade: k.grade || 'S',
        yearAdded: k.yearAdded || null,
        meaning: meaning || 'Meaning not available',
        meanings: k.meanings || [],
        readingsOn: k.readingsOn || [],
        readingsKun: k.readingsKun || [],
      };
    });
  }

  getLevels() {
    return this.levels;
  }

  getLevelLabel(levelId) {
    return this.levels.find(l => l.id === levelId)?.label || `Grade ${levelId}`;
  }

  getByLevel(levelId) {
    const id = levelId || 'S';
    return this.joyo.filter(k => (k.grade || 'S') === id);
  }

  getAllJoyo() {
    return this.joyo;
  }

  getRandomKanjis(levelId = '1', count = 10) {
    const pool = this.getByLevel(levelId).filter(k => !!k.meaning);
    const fallbackPool = this.joyo.filter(k => !!k.meaning);
    const base = pool.length ? pool : fallbackPool;
    return shuffle(base).slice(0, Math.min(count, base.length));
  }

  createQuizQuestion(kanji, pool) {
    const wrongAnswers = shuffle(
      pool
        .filter(k => k.id !== kanji.id && !!k.meaning)
        .map(k => k.meaning)
    ).slice(0, 3);

    const answers = shuffle([kanji.meaning, ...wrongAnswers]);

    return {
      id: kanji.id,
      kanji: kanji.kanji,
      correctAnswer: kanji.meaning,
      answers,
      radical: kanji.radical,
      strokes: kanji.strokes,
      level: kanji.grade,
    };
  }

  generateQuiz(questionCount = 10, levelId = '1') {
    const pool = this.getByLevel(levelId).filter(k => !!k.meaning);
    const basePool = pool.length ? pool : this.joyo.filter(k => !!k.meaning);
    const selectedKanjis = this.getRandomKanjis(levelId, questionCount);
    return selectedKanjis.map(k => this.createQuizQuestion(k, basePool));
  }
}

export { LEVELS, GRADE_ORDER };
export default new KanjiService();
