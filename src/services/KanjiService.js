/**
 * Service pour gérer les données de kanjis, avec niveaux JLPT et progression.
 * Les listes sont embarquées pour éviter un parsing CSV côté mobile.
 */

export const LEVELS = [
  { id: 'N5', label: 'N5 • Fondations', count: 103, note: 'Base + survie' },
  { id: 'N4', label: 'N4 • Bases étendues', count: 181, note: 'Vie courante' },
  { id: 'N3', label: 'N3 • Intermédiaire', count: 370, note: 'Fluidité' },
  { id: 'N2', label: 'N2 • Avancé', count: 500, note: 'Pro et médias' },
  { id: 'N1', label: 'N1 • Maîtrise', count: 700, note: 'Académique' },
];

export const KANJI_BANK = [
  // N5 (extraits, 10 exemples)
  { id: 1, level: 'N5', kanji: '日', meaning: 'jour, soleil', radical: '日', strokes: 4 },
  { id: 2, level: 'N5', kanji: '一', meaning: 'un', radical: '一', strokes: 1 },
  { id: 3, level: 'N5', kanji: '人', meaning: 'personne', radical: '人', strokes: 2 },
  { id: 4, level: 'N5', kanji: '大', meaning: 'grand', radical: '大', strokes: 3 },
  { id: 5, level: 'N5', kanji: '年', meaning: 'année', radical: '干', strokes: 6 },
  { id: 6, level: 'N5', kanji: '中', meaning: 'milieu', radical: '丨', strokes: 4 },
  { id: 7, level: 'N5', kanji: '会', meaning: 'rencontrer', radical: '人', strokes: 6 },
  { id: 8, level: 'N5', kanji: '本', meaning: 'livre, origine', radical: '木', strokes: 5 },
  { id: 9, level: 'N5', kanji: '長', meaning: 'long, chef', radical: '長', strokes: 8 },
  { id: 10, level: 'N5', kanji: '出', meaning: 'sortir', radical: '凵', strokes: 5 },

  // N4 (10 exemples)
  { id: 11, level: 'N4', kanji: '事', meaning: 'chose, affaire', radical: '亅', strokes: 8 },
  { id: 12, level: 'N4', kanji: '作', meaning: 'faire, fabriquer', radical: '人', strokes: 7 },
  { id: 13, level: 'N4', kanji: '用', meaning: 'utiliser', radical: '用', strokes: 5 },
  { id: 14, level: 'N4', kanji: '方', meaning: 'direction, méthode', radical: '方', strokes: 4 },
  { id: 15, level: 'N4', kanji: '新', meaning: 'nouveau', radical: '斤', strokes: 13 },
  { id: 16, level: 'N4', kanji: '場', meaning: 'lieu', radical: '土', strokes: 12 },
  { id: 17, level: 'N4', kanji: '社', meaning: 'société, sanctuaire', radical: '示', strokes: 7 },
  { id: 18, level: 'N4', kanji: '開', meaning: 'ouvrir', radical: '門', strokes: 12 },
  { id: 19, level: 'N4', kanji: '電', meaning: 'électricité', radical: '雨', strokes: 13 },
  { id: 20, level: 'N4', kanji: '語', meaning: 'langage', radical: '言', strokes: 14 },

  // N3 (10 exemples)
  { id: 21, level: 'N3', kanji: '機', meaning: 'machine, occasion', radical: '木', strokes: 16 },
  { id: 22, level: 'N3', kanji: '題', meaning: 'sujet, thème', radical: '頁', strokes: 18 },
  { id: 23, level: 'N3', kanji: '意', meaning: 'idée, intention', radical: '心', strokes: 13 },
  { id: 24, level: 'N3', kanji: '予', meaning: 'avant, prévoir', radical: '亅', strokes: 4 },
  { id: 25, level: 'N3', kanji: '交', meaning: 'mélanger, échanger', radical: '亠', strokes: 6 },
  { id: 26, level: 'N3', kanji: '実', meaning: 'réel, fruit', radical: '宀', strokes: 8 },
  { id: 27, level: 'N3', kanji: '参', meaning: 'participer', radical: '厶', strokes: 8 },
  { id: 28, level: 'N3', kanji: '受', meaning: 'recevoir', radical: '又', strokes: 8 },
  { id: 29, level: 'N3', kanji: '続', meaning: 'continuer', radical: '糸', strokes: 13 },
  { id: 30, level: 'N3', kanji: '指', meaning: 'doigt, indiquer', radical: '手', strokes: 9 },

  // N2 (10 exemples)
  { id: 31, level: 'N2', kanji: '権', meaning: 'droit, autorité', radical: '木', strokes: 15 },
  { id: 32, level: 'N2', kanji: '比', meaning: 'comparer', radical: '比', strokes: 4 },
  { id: 33, level: 'N2', kanji: '解', meaning: 'résoudre, délier', radical: '角', strokes: 13 },
  { id: 34, level: 'N2', kanji: '判', meaning: 'juger, tampon', radical: '刀', strokes: 7 },
  { id: 35, level: 'N2', kanji: '増', meaning: 'augmenter', radical: '土', strokes: 14 },
  { id: 36, level: 'N2', kanji: '減', meaning: 'diminuer', radical: '水', strokes: 12 },
  { id: 37, level: 'N2', kanji: '認', meaning: 'reconnaître', radical: '言', strokes: 14 },
  { id: 38, level: 'N2', kanji: '線', meaning: 'ligne', radical: '糸', strokes: 15 },
  { id: 39, level: 'N2', kanji: '調', meaning: 'ajuster, enquête', radical: '言', strokes: 15 },
  { id: 40, level: 'N2', kanji: '整', meaning: 'mettre en ordre', radical: '攵', strokes: 16 },

  // N1 (10 exemples)
  { id: 41, level: 'N1', kanji: '政', meaning: 'politique', radical: '攵', strokes: 9 },
  { id: 42, level: 'N1', kanji: '厳', meaning: 'strict, sévère', radical: '又', strokes: 17 },
  { id: 43, level: 'N1', kanji: '繁', meaning: 'prospère', radical: '糸', strokes: 17 },
  { id: 44, level: 'N1', kanji: '総', meaning: 'total, général', radical: '糸', strokes: 14 },
  { id: 45, level: 'N1', kanji: '複', meaning: 'complexe, multiple', radical: '衣', strokes: 14 },
  { id: 46, level: 'N1', kanji: '論', meaning: 'argument, discours', radical: '言', strokes: 15 },
  { id: 47, level: 'N1', kanji: '織', meaning: 'tisser', radical: '糸', strokes: 18 },
  { id: 48, level: 'N1', kanji: '憂', meaning: 'chagrin, inquiétude', radical: '心', strokes: 15 },
  { id: 49, level: 'N1', kanji: '微', meaning: 'subtil, délicat', radical: '彳', strokes: 13 },
  { id: 50, level: 'N1', kanji: '戦', meaning: 'guerre, combat', radical: '戈', strokes: 13 },
];

class KanjiService {
  constructor() {
    this.levels = LEVELS;
    this.kanjis = KANJI_BANK;
  }

  getLevels() {
    return this.levels;
  }

  getByLevel(levelId) {
    return this.kanjis.filter(k => k.level === levelId);
  }

  getRandomKanjis(levelId = 'N5', count = 10) {
    const pool = this.getByLevel(levelId);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  createQuizQuestion(kanji, pool) {
    const wrongAnswers = pool
      .filter(k => k.id !== kanji.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(k => k.meaning);

    const answers = [kanji.meaning, ...wrongAnswers].sort(() => 0.5 - Math.random());

    return {
      id: kanji.id,
      kanji: kanji.kanji,
      correctAnswer: kanji.meaning,
      answers,
      radical: kanji.radical,
      strokes: kanji.strokes,
      level: kanji.level,
    };
  }

  generateQuiz(questionCount = 10, levelId = 'N5') {
    const pool = this.getByLevel(levelId);
    const selectedKanjis = this.getRandomKanjis(levelId, questionCount);
    return selectedKanjis.map(k => this.createQuizQuestion(k, pool));
  }
}

export default new KanjiService();
