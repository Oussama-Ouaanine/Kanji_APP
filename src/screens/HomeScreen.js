import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { palette, radius, spacing } from '../styles/theme';
import KanjiService from '../services/KanjiService';
import ProgressService from '../services/ProgressService';

function LevelProgress({ levelId, selected, locked, getLevelProgress }) {
  const { mastered, total, threshold, sessions, minSessions } = getLevelProgress(levelId);
  const progress = total ? Math.min(100, Math.round((mastered / Math.max(threshold, total)) * 100)) : 0;

  return (
    <View style={[styles.progressShell, locked && styles.progressShellLocked]}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
      <Text style={styles.progressText}>
        {locked
          ? `Verrouillé · ${threshold} kanji + ${minSessions} sessions`
          : `${mastered}/${threshold} kanji · ${sessions}/${minSessions} sessions`}
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const levels = useMemo(() => KanjiService.getLevels(), []);
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    const state = await ProgressService.load();
    setProgress(state);
    if (!state.unlockedLevels.includes(selectedLevel)) {
      setSelectedLevel(state.currentLevel || 'N5');
    }
    setLoading(false);
  }, [selectedLevel]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
    }, [refreshProgress])
  );

  const startQuiz = (count) => {
    navigation.navigate('Quiz', { questionCount: count, level: selectedLevel });
  };

  const getLevelProgress = (levelId) => {
    if (!progress) return { mastered: 0, total: 0, threshold: 0, minSessions: 0, sessions: 0, unlocked: levelId === 'N5' };
    return ProgressService.getLevelProgressSnapshot(progress, levelId);
  };

  const isLocked = (levelId) => !getLevelProgress(levelId).unlocked;

  return (
    <View style={styles.container}>
      <View style={styles.bgBlobA} />
      <View style={styles.bgBlobB} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>KANJI LAB</Text>
            <Text style={styles.badgeGhost}>Mode focus</Text>
          </View>

          <Text style={styles.title}>Maîtrise rapide, feedback clair.</Text>
          <Text style={styles.subtitle}>Des sessions courtes, des kanji nets, un suivi calme et lisible.</Text>

          <View style={styles.levelRow}>
            {levels.map((lvl) => (
              <TouchableOpacity
                key={lvl.id}
                onPress={() => !isLocked(lvl.id) && setSelectedLevel(lvl.id)}
                style={[
                  styles.levelChip,
                  selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelChipActive,
                  isLocked(lvl.id) && styles.levelChipLocked,
                ]}
              >
                <Text style={[styles.levelChipTitle, selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelChipTitleActive]}>{lvl.label}</Text>
                <Text style={[styles.levelChipNote, selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelChipNoteActive]}>
                  {lvl.note} • ~{lvl.count} kanji
                </Text>
                <LevelProgress levelId={lvl.id} selected={selectedLevel === lvl.id} locked={isLocked(lvl.id)} getLevelProgress={getLevelProgress} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Session</Text>
              <Text style={styles.statValue}>10 Q</Text>
              <Text style={styles.statHint}>≈ 2 minutes</Text>
            </View>
            <View style={styles.statCardMuted}>
              <Text style={styles.statLabel}>Sprint</Text>
              <Text style={styles.statValueMuted}>5 Q</Text>
              <Text style={styles.statHintMuted}>Échauffement</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.buttonPrimary, isLocked(selectedLevel) && styles.buttonDisabled]}
            onPress={() => !isLocked(selectedLevel) && startQuiz(10)}
            disabled={isLocked(selectedLevel)}
          >
            <Text style={styles.buttonTitle}>Commencer 10 kanji</Text>
            <Text style={styles.buttonSubtitle}>
              {isLocked(selectedLevel) ? 'Débloque ce niveau pour jouer' : 'Mode focus • feedback immédiat'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dualButtons}>
            <TouchableOpacity
              style={[styles.buttonGhost, isLocked(selectedLevel) && styles.buttonGhostDisabled]}
              onPress={() => !isLocked(selectedLevel) && startQuiz(5)}
              disabled={isLocked(selectedLevel)}
            >
              <Text style={styles.buttonGhostTitle}>Sprint 5 kanji</Text>
              <Text style={styles.buttonGhostSubtitle}>
                {isLocked(selectedLevel) ? 'Complète le niveau précédent' : 'Échauffement express'}
              </Text>
            </TouchableOpacity>

            <View style={styles.passiveCard}>
              <Text style={styles.passiveLabel}>Prochaines étapes</Text>
              <Text style={styles.passiveValue}>Révisions ciblées</Text>
              <Text style={styles.passiveHint}>Arrivent dans la prochaine version</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Focus du jour</Text>
            <Text style={styles.sectionHint}>Calme, clair, lisible</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Kanji nets</Text>
              <Text style={styles.tileValue}>Radicaux mis en avant</Text>
              <Text style={styles.tileHint}>Évite le bruit visuel</Text>
            </View>
            <View style={styles.tileAlt}>
              <Text style={styles.tileLabelAlt}>Micro-feedback</Text>
              <Text style={styles.tileValueAlt}>Correct / incorrect</Text>
              <Text style={styles.tileHintAlt}>Animations légères</Text>
            </View>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Sessions courtes</Text>
              <Text style={styles.tileValue}>5 ou 10 questions</Text>
              <Text style={styles.tileHint}>Idéal mobile</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl + 12 },
  bgBlobA: {
    position: 'absolute',
    top: -160,
    left: -140,
    width: 320,
    height: 320,
    borderRadius: 280,
    backgroundColor: palette.accentSoft,
    opacity: 0.45,
  },
  bgBlobB: {
    position: 'absolute',
    bottom: -200,
    right: -160,
    width: 360,
    height: 360,
    borderRadius: 320,
    backgroundColor: palette.surfaceMuted,
    opacity: 0.6,
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.shadow,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  badge: {
    backgroundColor: palette.accentSoft,
    color: palette.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    fontSize: 12,
    fontWeight: '800',
  },
  badgeGhost: {
    backgroundColor: palette.surfaceMuted,
    color: palette.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    fontSize: 12,
    fontWeight: '700',
  },
  title: { fontSize: 28, fontWeight: '800', color: palette.ink, lineHeight: 34 },
  subtitle: { fontSize: 15, color: palette.muted, lineHeight: 22 },
  heroStats: { flexDirection: 'row', gap: spacing.sm },
  levelRow: { flexDirection: 'column', gap: spacing.sm },
  levelChip: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  levelChipActive: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accent,
    shadowColor: palette.accent,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  levelChipTitle: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  levelChipTitleActive: { color: palette.accent },
  levelChipNote: { color: palette.muted, fontSize: 12, marginTop: 2 },
  levelChipNoteActive: { color: palette.ink },
  levelChipLocked: { opacity: 0.55 },
  progressShell: {
    marginTop: 8,
    height: 12,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.line,
    justifyContent: 'center',
  },
  progressShellLocked: { opacity: 0.7 },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: palette.accent,
  },
  progressText: {
    fontSize: 11,
    color: palette.ink,
    textAlign: 'center',
    fontWeight: '700',
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  statCardMuted: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
  },
  statLabel: { color: palette.muted, fontWeight: '700', fontSize: 12 },
  statValue: { color: palette.ink, fontSize: 22, fontWeight: '800', marginTop: 6 },
  statHint: { color: palette.muted, fontSize: 12, marginTop: 2 },
  statValueMuted: { color: palette.ink, fontSize: 20, fontWeight: '800', marginTop: 6 },
  statHintMuted: { color: palette.muted, fontSize: 12, marginTop: 2 },
  buttonPrimary: {
    backgroundColor: palette.accent,
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    shadowColor: palette.accent,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: palette.accent,
  },
  buttonTitle: { color: palette.surface, fontSize: 18, fontWeight: '800', marginBottom: 2 },
  buttonSubtitle: { color: '#ffe9e2', fontSize: 13, fontWeight: '600' },
  dualButtons: { flexDirection: 'row', gap: spacing.sm },
  buttonGhost: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonGhostTitle: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  buttonGhostSubtitle: { color: palette.muted, fontSize: 13, marginTop: 2 },
  passiveCard: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    justifyContent: 'center',
  },
  passiveLabel: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  passiveValue: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: 4 },
  passiveHint: { color: palette.muted, fontSize: 12, marginTop: 2 },
  section: {
    marginTop: spacing.xl,
    backgroundColor: palette.surface,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.line,
    gap: spacing.md,
    shadowColor: palette.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: palette.ink, fontSize: 18, fontWeight: '800' },
  sectionHint: { color: palette.muted, fontSize: 13, fontWeight: '600' },
  grid: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 6,
  },
  tileAlt: {
    flex: 1,
    backgroundColor: palette.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.accent,
    gap: 6,
  },
  tileLabel: { color: palette.muted, fontWeight: '700', fontSize: 13 },
  tileValue: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  tileHint: { color: palette.muted, fontSize: 12 },
  tileLabelAlt: { color: palette.accent, fontWeight: '800', fontSize: 13 },
  tileValueAlt: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  tileHintAlt: { color: palette.muted, fontSize: 12 },
  buttonDisabled: { opacity: 0.5 },
  buttonGhostDisabled: { opacity: 0.6 },
});
