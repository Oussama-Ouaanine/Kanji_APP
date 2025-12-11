import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { palette, gradients, radius, spacing, shadows } from '../styles/theme';
import KanjiService from '../services/KanjiService';
import ProgressService from '../services/ProgressService';

function LevelProgress({ levelId, selected, locked, getLevelProgress }) {
  const { mastered, total, threshold, sessions, minSessions } = getLevelProgress(levelId);
  const progress = total ? Math.min(100, Math.round((mastered / Math.max(threshold, total)) * 100)) : 0;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {locked
          ? `🔒 ${threshold} kanji • ${minSessions} sessions required`
          : `${mastered}/${threshold} kanji • ${sessions}/${minSessions} sessions`}
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const levels = useMemo(() => KanjiService.getLevels(), []);
  const defaultLevel = levels[0]?.id || '1';
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProgress = useCallback(async () => {
    const state = await ProgressService.load();
    setProgress(state);
    if (!state.unlockedLevels.includes(selectedLevel)) {
      setSelectedLevel(state.currentLevel || defaultLevel);
    }
    setLoading(false);
  }, [selectedLevel, defaultLevel]);

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
    if (!progress) return { mastered: 0, total: 0, threshold: 0, minSessions: 0, sessions: 0, unlocked: levelId === defaultLevel };
    return ProgressService.getLevelProgressSnapshot(progress, levelId);
  };

  const isLocked = (levelId) => !getLevelProgress(levelId).unlocked;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Animated background gradients */}
      <View style={styles.bgGradient1} />
      <View style={styles.bgGradient2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Header with Gradient */}
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>Good evening 👋</Text>
          <Text style={styles.heroTitle}>漢字道</Text>
          <Text style={styles.heroSubtitle}>Master the way of Kanji</Text>
        </View>

        {/* Streak Card with Gradient */}
        <View style={styles.streakCard}>
          <View style={styles.streakGlow} />
          <Text style={styles.streakEmoji}>🔥</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakNumber}>
              {progress?.stats?.streakDays || 0} Days
            </Text>
            <Text style={styles.streakLabel}>Keep your streak going!</Text>
          </View>
        </View>

        {/* Level Progress Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Your Progress</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>
                {levels.find(l => l.id === (progress?.currentLevel || defaultLevel))?.label || 'Level'}
              </Text>
            </View>
          </View>
          
          <View style={styles.xpBarContainer}>
            <View style={styles.xpBar}>
              <View style={[styles.xpFill, { width: '68%' }]} />
            </View>
            <Text style={styles.xpText}>680 / 1000 XP to next level</Text>
          </View>
        </View>

        {/* Mode Selection Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>⚡</Text>
          <Text style={styles.sectionTitle}>Quick Start</Text>
        </View>

        {/* Level Selection Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.levelPillsScroll}
          contentContainerStyle={styles.levelPills}
        >
          {levels.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              onPress={() => !isLocked(lvl.id) && setSelectedLevel(lvl.id)}
              style={[
                styles.levelPill,
                selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelPillActive,
                isLocked(lvl.id) && styles.levelPillLocked,
              ]}
            >
              <Text style={[
                styles.levelPillText,
                selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelPillTextActive
              ]}>
                {lvl.label}
              </Text>
              <Text style={[
                styles.levelPillCount,
                selectedLevel === lvl.id && !isLocked(lvl.id) && styles.levelPillCountActive
              ]}>
                ~{lvl.count} kanji
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Level Progress Detail */}
        {!isLocked(selectedLevel) && (
          <View style={styles.levelDetail}>
            <LevelProgress 
              levelId={selectedLevel} 
              selected={true} 
              locked={false} 
              getLevelProgress={getLevelProgress} 
            />
          </View>
        )}

        {/* Mode Cards */}
        <View style={styles.modeGrid}>
          {/* Lightning Round */}
          <TouchableOpacity
            style={[styles.modeCard, isLocked(selectedLevel) && styles.modeCardDisabled]}
            onPress={() => !isLocked(selectedLevel) && startQuiz(20)}
            disabled={isLocked(selectedLevel)}
            activeOpacity={0.8}
          >
            <View style={[styles.modeIconWrapper, { backgroundColor: gradients.primary[0] }]}>
              <Text style={styles.modeIcon}>⚡</Text>
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>Lightning Round</Text>
              <Text style={styles.modeDesc}>20 questions • 5 mins</Text>
            </View>
            <Text style={styles.modeArrow}>→</Text>
          </TouchableOpacity>

          {/* Practice Mode */}
          <TouchableOpacity
            style={[styles.modeCard, isLocked(selectedLevel) && styles.modeCardDisabled]}
            onPress={() => !isLocked(selectedLevel) && startQuiz(10)}
            disabled={isLocked(selectedLevel)}
            activeOpacity={0.8}
          >
            <View style={[styles.modeIconWrapper, { backgroundColor: gradients.cool[0] }]}>
              <Text style={styles.modeIcon}>🎯</Text>
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>Practice Mode</Text>
              <Text style={styles.modeDesc}>10 questions • Focused</Text>
            </View>
            <Text style={styles.modeArrow}>→</Text>
          </TouchableOpacity>

          {/* Quick Sprint */}
          <TouchableOpacity
            style={[styles.modeCard, isLocked(selectedLevel) && styles.modeCardDisabled]}
            onPress={() => !isLocked(selectedLevel) && startQuiz(5)}
            disabled={isLocked(selectedLevel)}
            activeOpacity={0.8}
          >
            <View style={[styles.modeIconWrapper, { backgroundColor: palette.accent }]}>
              <Text style={styles.modeIcon}>🏃</Text>
            </View>
            <View style={styles.modeInfo}>
              <Text style={styles.modeName}>Quick Sprint</Text>
              <Text style={styles.modeDesc}>5 questions • Warm-up</Text>
            </View>
            <Text style={styles.modeArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Locked Level Message */}
        {isLocked(selectedLevel) && (
          <View style={styles.lockedMessage}>
            <Text style={styles.lockedEmoji}>🔒</Text>
            <Text style={styles.lockedText}>
              Complete the previous level to unlock {levels.find(l => l.id === selectedLevel)?.label || selectedLevel}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: palette.background 
  },
  
  // Animated background
  bgGradient1: {
    position: 'absolute',
    top: -200,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: palette.primary,
    opacity: 0.08,
  },
  bgGradient2: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: palette.secondary,
    opacity: 0.06,
  },
  
  scrollContent: { 
    padding: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  
  // Hero Section
  heroSection: {
    marginBottom: spacing.xl,
  },
  greeting: {
    color: palette.textMuted,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '800',
    color: palette.text,
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  heroSubtitle: {
    color: palette.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Streak Card with Gradient
  streakCard: {
    backgroundColor: palette.primary,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.glow,
    overflow: 'hidden',
    position: 'relative',
  },
  streakGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: palette.secondary,
    opacity: 0.3,
  },
  streakEmoji: {
    fontSize: 52,
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    color: palette.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  streakLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Level Card
  levelCard: {
    backgroundColor: palette.glass,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    ...shadows.md,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  levelTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
  },
  levelBadge: {
    backgroundColor: palette.accentWarm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  levelBadgeText: {
    color: palette.background,
    fontSize: 13,
    fontWeight: '800',
  },
  xpBarContainer: {
    gap: spacing.sm,
  },
  xpBar: {
    height: 10,
    backgroundColor: palette.glassBorder,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: palette.positive,
    borderRadius: radius.pill,
    ...shadows.glow,
  },
  xpText: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '800',
  },
  
  // Level Pills (horizontal scroll)
  levelPillsScroll: {
    marginBottom: spacing.lg,
  },
  levelPills: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  levelPill: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  levelPillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primaryLight,
    ...shadows.glow,
  },
  levelPillLocked: {
    opacity: 0.4,
  },
  levelPillText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  levelPillTextActive: {
    color: palette.text,
  },
  levelPillCount: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  levelPillCountActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Level Detail
  levelDetail: {
    backgroundColor: palette.glass,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: palette.glassBorder,
  },
  
  // Progress Container
  progressContainer: {
    gap: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: palette.glassBorder,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
  },
  progressText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Mode Grid
  modeGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  modeCard: {
    backgroundColor: palette.glass,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.md,
  },
  modeCardDisabled: {
    opacity: 0.4,
  },
  modeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  modeIcon: {
    fontSize: 28,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  modeDesc: {
    color: palette.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  modeArrow: {
    color: palette.textMuted,
    fontSize: 24,
  },
  
  // Locked Message
  lockedMessage: {
    backgroundColor: palette.glass,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.glassBorder,
  },
  lockedEmoji: {
    fontSize: 40,
  },
  lockedText: {
    color: palette.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
