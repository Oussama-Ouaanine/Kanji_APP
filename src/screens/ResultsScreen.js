import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { palette, gradients, radius, spacing, shadows } from '../styles/theme';
import KanjiService from '../services/KanjiService';

export default function ResultsScreen({ route, navigation }) {
  const { score = 0, total = 0, level = '1', gainedXp = 0, unlockedNow = [], newlyMastered = 0 } = route.params || {};
  const levelLabel = KanjiService.getLevelLabel(level);
  const unlockedLabels = unlockedNow.map(id => KanjiService.getLevelLabel(id));
  const percentage = total ? Math.round((score / total) * 100) : 0;

  const message = percentage >= 90 ? '🎉 Excellent !'
    : percentage >= 70 ? '👍 Très bien !'
    : percentage >= 50 ? '👌 Pas mal !'
    : '💪 Continue à pratiquer !';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgGradient} />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.celebrationEmoji}>
          {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : percentage >= 50 ? '👍' : '💪'}
        </Text>
        <Text style={styles.heroTitle}>
          {message}
        </Text>
        <Text style={styles.heroSubtitle}>{levelLabel} Quiz Complete</Text>
      </View>

      {/* Score Display */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreGlow} />
        <Text style={styles.scorePercentage}>{percentage}%</Text>
        <Text style={styles.scoreDetails}>{score} out of {total} correct</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>+{gainedXp}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{newlyMastered}</Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
      </View>

      {/* Unlock Notification */}
      {unlockedNow.length > 0 && (
        <View style={styles.unlockCard}>
          <Text style={styles.unlockEmoji}>🎆</Text>
          <Text style={styles.unlockTitle}>Level Unlocked!</Text>
          <Text style={styles.unlockText}>{unlockedLabels.join(', ')}</Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.buttonPrimary} 
          onPress={() => navigation.replace('Quiz', { questionCount: total || 10, level })}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonPrimaryText}>🔄 Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonSecondary} 
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonSecondaryText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  
  bgGradient: {
    position: 'absolute',
    top: -100,
    alignSelf: 'center',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: palette.positive,
    opacity: 0.08,
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  celebrationEmoji: {
    fontSize: 72,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: palette.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textMuted,
    textAlign: 'center',
  },
  
  // Score Card
  scoreCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    borderRadius: radius.xxl,
    padding: spacing.xxxl,
    alignItems: 'center',
    ...shadows.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  scoreGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: palette.primary,
    opacity: 0.2,
  },
  scorePercentage: {
    fontSize: 72,
    fontWeight: '800',
    color: palette.text,
    zIndex: 1,
  },
  scoreDetails: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textSecondary,
    marginTop: spacing.sm,
    zIndex: 1,
  },
  
  // Stats Grid
  statsGrid: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: palette.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.textMuted,
  },
  
  // Unlock Card
  unlockCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: palette.positive,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.glow,
  },
  unlockEmoji: {
    fontSize: 40,
  },
  unlockTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.text,
  },
  unlockText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Action Buttons
  actions: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.glow,
  },
  buttonPrimaryText: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
  buttonSecondary: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800',
  },
});
