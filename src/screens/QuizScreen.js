import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import KanjiService from '../services/KanjiService';
import { palette, radius, spacing } from '../styles/theme';
import ProgressService from '../services/ProgressService';

export default function QuizScreen({ route, navigation }) {
  const { questionCount = 10, level = 'N5' } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctIds, setCorrectIds] = useState([]);

  useEffect(() => {
    const quiz = KanjiService.generateQuiz(questionCount, level);
    setQuestions(quiz);
  }, [questionCount, level]);

  if (questions.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>Chargement du quiz...</Text>
      </View>
    );
  }

  const current = questions[index];
  const progress = ((index + 1) / questions.length) * 100;
  const nextLabel = index < questions.length - 1 ? 'Question suivante' : 'Voir les résultats';

  const handleAnswer = (answer) => {
    if (showResult) return;
    setSelected(answer);
    setShowResult(true);
    const isGood = answer === current.correctAnswer;
    if (isGood) {
      setScore((prev) => prev + 1);
      setCorrectIds((prev) => [...prev, current.id]);
    }
  };

  const handleNext = async () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const { gainedXp, unlockedNow, newlyMastered } = await ProgressService.recordQuiz({
        levelId: level,
        correctIds,
      });
      navigation.replace('Results', {
        score,
        total: questions.length,
        level,
        gainedXp,
        unlockedNow,
        newlyMastered,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgBlobA} />
      <View style={styles.bgBlobB} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.topTitles}>
            <Text style={styles.kicker}>Session kanji</Text>
            <Text style={styles.screenTitle}>Quiz en douceur</Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillLabel}>Score</Text>
            <Text style={styles.scorePillValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Question {index + 1} / {questions.length}</Text>
            <Text style={styles.progressHint}>Niveau {level}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.kanji}>{current.kanji}</Text>
          <View style={styles.metaRow}>
            <View style={styles.chip}><Text style={styles.chipText}>Radical {current.radical}</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>{current.strokes} traits</Text></View>
          </View>
          <Text style={styles.ask}>Choisis la bonne signification</Text>
        </View>

        <View style={styles.answers}>
          {current.answers.map((answer, idx) => {
            const isCorrect = answer === current.correctAnswer;
            const isSelected = answer === selected;
            const isWrongSelected = showResult && isSelected && !isCorrect;
            const letter = String.fromCharCode(65 + idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.answer,
                  isSelected && !showResult && styles.answerActive,
                  showResult && isCorrect && styles.answerCorrect,
                  isWrongSelected && styles.answerWrong,
                ]}
                onPress={() => handleAnswer(answer)}
                disabled={showResult}
              >
                <View style={styles.answerLetterBox}>
                  <Text style={styles.answerLetter}>{letter}</Text>
                </View>
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.footer}>
            <Text style={[styles.result, selected === current.correctAnswer ? styles.ok : styles.ko]}>
              {selected === current.correctAnswer ? 'Bonne réponse' : 'Mauvaise réponse'}
            </Text>
            <Text style={styles.helper}>Touchez « {nextLabel} » pour continuer</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextBtn, !showResult && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!showResult}
        >
          <Text style={styles.nextText}>{nextLabel}</Text>
        </TouchableOpacity>
        {!showResult && <Text style={styles.helperMuted}>Choisis une réponse pour débloquer la suite</Text>}
        {showResult && <Text style={styles.helperMuted}>Niveau {level} • {questions.length} questions</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl + 90, gap: spacing.md },
  loaderContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: palette.background },
  loaderText: { color: palette.ink, fontSize: 16, fontWeight: '600' },
  bgBlobA: {
    position: 'absolute',
    top: -140,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 200,
    backgroundColor: palette.accentSoft,
    opacity: 0.55,
  },
  bgBlobB: {
    position: 'absolute',
    bottom: -160,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 200,
    backgroundColor: palette.surfaceMuted,
    opacity: 0.7,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topTitles: { gap: 4 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  screenTitle: { color: palette.ink, fontSize: 22, fontWeight: '800' },
  scorePill: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
  },
  scorePillLabel: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  scorePillValue: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  progressCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    gap: spacing.xs,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: { fontSize: 14, color: palette.ink, fontWeight: '800' },
  progressHint: { fontSize: 12, color: palette.muted, fontWeight: '700' },
  progressBarBg: { height: 12, backgroundColor: palette.surfaceMuted, borderRadius: radius.pill, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: palette.accent, borderRadius: radius.pill },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    gap: spacing.sm,
  },
  kanji: { fontSize: 96, fontWeight: '800', color: palette.ink, marginTop: spacing.xs },
  metaRow: { flexDirection: 'row', gap: spacing.xs },
  chip: {
    backgroundColor: palette.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.line,
  },
  chipText: { color: palette.ink, fontSize: 13, fontWeight: '700' },
  ask: { fontSize: 16, fontWeight: '700', textAlign: 'center', color: palette.muted, marginTop: spacing.xs },
  answers: { width: '100%', gap: spacing.sm },
  answer: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  answerActive: { borderColor: palette.accent, backgroundColor: palette.accentSoft },
  answerLetterBox: {
    width: 30,
    height: 30,
    borderRadius: 16,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerLetter: {
    color: palette.ink,
    fontWeight: '800',
  },
  answerText: { fontSize: 16, color: palette.ink, flexShrink: 1, fontWeight: '700' },
  answerCorrect: { backgroundColor: '#ecfdf3', borderColor: palette.positive },
  answerWrong: { backgroundColor: '#fff1f2', borderColor: palette.negative },
  footer: { alignItems: 'center', marginTop: spacing.sm, gap: 4 },
  result: { fontSize: 16, fontWeight: '800' },
  ok: { color: palette.positive },
  ko: { color: palette.negative },
  helper: { color: palette.muted, fontSize: 13 },
  helperMuted: { color: palette.muted, fontSize: 12, textAlign: 'center', marginTop: 6 },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.lg + spacing.md, // lift above device bottom ~3cm
    padding: spacing.md,
    marginHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radius.xl,
    gap: 6,
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  nextBtn: {
    backgroundColor: palette.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    shadowColor: palette.accent,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: palette.accent,
  },
  nextBtnDisabled: { backgroundColor: palette.surfaceMuted, borderWidth: 1, borderColor: palette.line, shadowOpacity: 0 },
  nextText: { color: palette.surface, fontSize: 16, fontWeight: '800' },
});
