import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { palette, radius, spacing } from '../styles/theme';

export default function ResultsScreen({ route, navigation }) {
  const { score = 0, total = 0, level = 'N5', gainedXp = 0, unlockedNow = [], newlyMastered = 0 } = route.params || {};
  const percentage = total ? Math.round((score / total) * 100) : 0;

  const message = percentage >= 90 ? '🎉 Excellent !'
    : percentage >= 70 ? '👍 Très bien !'
    : percentage >= 50 ? '👌 Pas mal !'
    : '💪 Continue à pratiquer !';

  return (
    <View style={styles.container}>
      <View style={styles.bgBlobA} />
      <View style={styles.bgBlobB} />

      <View style={styles.header}>
        <Text style={styles.kicker}>Session {level}</Text>
        <Text style={styles.title}>Résultats</Text>
        <Text style={styles.subtitle}>{message}</Text>
        <Text style={styles.subhint}>XP +{gainedXp} • Kanji maîtrisés +{newlyMastered}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreBlock}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score} / {total}</Text>
          </View>
          <View style={styles.percentBlock}>
            <Text style={styles.percentValue}>{percentage}%</Text>
            <Text style={styles.percentLabel}>Maîtrise</Text>
          </View>
        </View>

        {unlockedNow.length > 0 && (
          <View style={styles.unlockBox}>
            <Text style={styles.unlockTitle}>Niveau débloqué</Text>
            <Text style={styles.unlockText}>{unlockedNow.join(', ')}</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bonnes</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Restantes</Text>
            <Text style={styles.statValue}>{Math.max(total - score, 0)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={() => navigation.replace('Quiz', { questionCount: total || 10 })}>
          <Text style={styles.buttonText}>Rejouer ce quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonGhost} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonGhostText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
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
  header: { alignItems: 'center', marginBottom: spacing.md, gap: 4 },
  kicker: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '800', color: palette.ink },
  subtitle: { fontSize: 15, color: palette.muted, textAlign: 'center' },
  subhint: { fontSize: 13, color: palette.muted, textAlign: 'center' },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'stretch',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  scoreRow: { flexDirection: 'row', gap: spacing.sm },
  scoreBlock: {
    flex: 2,
    backgroundColor: palette.surfaceMuted,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.line,
    gap: 4,
  },
  percentBlock: {
    flex: 1,
    backgroundColor: palette.accentSoft,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.accent,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 2,
  },
  scoreLabel: { color: palette.muted, fontWeight: '700', fontSize: 13 },
  scoreValue: { color: palette.ink, fontSize: 24, fontWeight: '800' },
  percentValue: { color: palette.ink, fontSize: 24, fontWeight: '800' },
  percentLabel: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statBox: {
    flex: 1,
    backgroundColor: palette.surface,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.line,
  },
  unlockBox: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.accentSoft,
    borderWidth: 1,
    borderColor: palette.accent,
    alignItems: 'center',
    gap: 4,
  },
  unlockTitle: { color: palette.accent, fontWeight: '800', fontSize: 14 },
  unlockText: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  statLabel: { color: palette.muted, fontSize: 13, fontWeight: '700' },
  statValue: { color: palette.ink, fontSize: 20, fontWeight: '800' },
  actions: { width: '100%', maxWidth: 360, gap: spacing.sm },
  buttonPrimary: {
    backgroundColor: palette.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    shadowColor: palette.accent,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    borderWidth: 1,
    borderColor: palette.accent,
    alignItems: 'center',
  },
  buttonGhost: {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    shadowColor: palette.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonText: { color: palette.surface, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  buttonGhostText: { color: palette.ink, fontSize: 16, fontWeight: '800' },
});
