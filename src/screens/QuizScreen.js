import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import KanjiService from '../services/KanjiService';
import { palette, gradients, radius, spacing, shadows } from '../styles/theme';
import ProgressService from '../services/ProgressService';

export default function QuizScreen({ route, navigation }) {
  const { questionCount = 10, level = '1' } = route.params || {};
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

  const levelLabel = KanjiService.getLevelLabel(level);

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
      <View style={styles.bgGradient} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Kanji Quiz</Text>
            <Text style={styles.headerSubtitle}>{levelLabel}</Text>
          </View>
          <View style={styles.scoreChip}>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.questionCounter}>Question {index + 1} of {questions.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.kanjiCircle}>
            <View style={styles.kanjiGlow} />
            <Text style={styles.kanji}>{current.kanji}</Text>
          </View>
          <Text style={styles.questionPrompt}>What is the meaning of this kanji?</Text>
        </View>

        <View style={styles.answersSection}>
          {current.answers.map((answer, idx) => {
            const isCorrect = answer === current.correctAnswer;
            const isSelected = answer === selected;
            const isWrongSelected = showResult && isSelected && !isCorrect;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.answerCard,
                  isSelected && !showResult && styles.answerSelected,
                  showResult && isCorrect && styles.answerCorrect,
                  isWrongSelected && styles.answerWrong,
                ]}
                onPress={() => handleAnswer(answer)}
                disabled={showResult}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.answerText,
                  showResult && isCorrect && styles.answerTextCorrect,
                  isWrongSelected && styles.answerTextWrong,
                ]}>
                  {answer}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {showResult && (
          <View style={styles.feedbackSection}>
            <Text style={[
              styles.feedbackText,
              selected === current.correctAnswer ? styles.feedbackCorrect : styles.feedbackWrong
            ]}>
              {selected === current.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextButton, !showResult && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!showResult}
          activeOpacity={0.8}
        >
          <Text style={[styles.nextButtonText, !showResult && styles.nextButtonTextDisabled]}>
            {nextLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: palette.background,
  },
  
  loaderContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: palette.background,
  },
  loaderText: { 
    color: palette.text, 
    fontSize: 16, 
    fontWeight: '600',
  },
  
  bgGradient: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: palette.secondary,
    opacity: 0.06,
  },
  
  scrollContent: { 
    padding: spacing.xl,
    paddingBottom: 120,
    gap: spacing.xl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  scoreChip: {
    minWidth: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  scoreValue: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '800',
  },
  
  // Progress Section
  progressSection: {
    gap: spacing.md,
  },
  questionCounter: {
    color: palette.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: palette.glassBorder,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    ...shadows.glow,
  },
  
  // Question Card
  questionCard: {
    alignItems: 'center',
    gap: spacing.xxxl,
    paddingVertical: spacing.xl,
  },
  
  kanjiCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: palette.glass,
    borderWidth: 2,
    borderColor: palette.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  kanjiGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: palette.primary,
    opacity: 0.2,
  },
  kanji: { 
    fontSize: 96, 
    fontWeight: '700', 
    color: palette.text,
    zIndex: 1,
  },
  questionPrompt: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  
  // Answers Section
  answersSection: {
    gap: spacing.md,
  },
  answerCard: {
    backgroundColor: palette.glass,
    borderWidth: 2,
    borderColor: palette.glassBorder,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.sm,
  },
  answerSelected: {
    backgroundColor: palette.glassHover,
    borderColor: palette.primary,
  },
  answerCorrect: {
    backgroundColor: palette.positiveGlow,
    borderColor: palette.positive,
  },
  answerWrong: {
    backgroundColor: palette.negativeGlow,
    borderColor: palette.negative,
  },
  answerText: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  answerTextCorrect: {
    color: palette.positive,
  },
  answerTextWrong: {
    color: palette.negative,
  },
  
  // Feedback Section
  feedbackSection: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackCorrect: {
    color: palette.positive,
  },
  feedbackWrong: {
    color: palette.negative,
  },
  
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xxxl,
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    ...shadows.lg,
  },
  nextButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.glow,
  },
  nextButtonDisabled: {
    backgroundColor: palette.glass,
    opacity: 0.4,
  },
  nextButtonText: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
  nextButtonTextDisabled: {
    color: palette.textMuted,
  },
});
