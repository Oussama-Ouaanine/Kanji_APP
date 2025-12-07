import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProgressService from '../services/ProgressService';
import { LEVELS } from '../services/KanjiService';
import { palette, radius, spacing } from '../styles/theme';

export default function ProgressScreen() {
  const [state, setState] = useState(null);

  useEffect(() => {
    ProgressService.load().then(setState);
  }, []);

  if (!state) {
    return (
      <View style={styles.container}> 
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Progression</Text>
      <Text style={styles.subtitle}>XP {state.xp} • Streak {state.streak}j</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Niveaux</Text>
        {LEVELS.map((lvl) => {
          const snap = ProgressService.getLevelProgressSnapshot(state, lvl.id);
          const pct = snap.threshold ? Math.min(100, Math.round((snap.mastered / snap.threshold) * 100)) : 0;
          return (
            <View key={lvl.id} style={styles.levelRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.levelLabel}>{lvl.label}</Text>
                <Text style={styles.levelNote}>
                  {snap.unlocked ? 'Débloqué' : 'Verrouillé'} • {snap.mastered}/{snap.threshold} kanji • {snap.sessions}/{snap.minSessions} sessions
                </Text>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
              </View>
              <Text style={styles.levelPct}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: palette.ink, marginBottom: 4 },
  subtitle: { fontSize: 14, color: palette.muted, marginBottom: spacing.sm },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.line,
    gap: spacing.md,
    shadowColor: palette.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  sectionTitle: { color: palette.ink, fontSize: 16, fontWeight: '800' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  levelLabel: { color: palette.ink, fontSize: 15, fontWeight: '800' },
  levelNote: { color: palette.muted, fontSize: 12 },
  levelPct: { color: palette.muted, fontWeight: '800', fontSize: 14 },
  progressBg: { height: 10, borderRadius: radius.pill, backgroundColor: palette.surfaceMuted, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: '100%', backgroundColor: palette.accent },
});
