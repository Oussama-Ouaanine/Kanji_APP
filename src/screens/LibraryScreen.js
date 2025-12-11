import React, { useMemo, useState } from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import KanjiService from '../services/KanjiService';
import { palette, radius, spacing } from '../styles/theme';

const gradeOrder = ['1', '2', '3', '4', '5', '6', 'S'];
const gradeLabels = {
  '1': 'Grade 1',
  '2': 'Grade 2',
  '3': 'Grade 3',
  '4': 'Grade 4',
  '5': 'Grade 5',
  '6': 'Grade 6',
  S: 'Secondary (S)',
  null: 'Unclassified',
  undefined: 'Unclassified',
};

const FILTERS = [{ id: 'all', label: 'All Joyo' }, ...gradeOrder.map(g => ({ id: g, label: gradeLabels[g] }))];

export default function LibraryScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sections = useMemo(() => {
    const all = KanjiService.getAllJoyo();
    const counts = gradeOrder.reduce((acc, g) => {
      acc[g] = all.filter(k => (k.grade || 'S') === g).length;
      return acc;
    }, {});
    return { all, counts };
  }, []);

  const filtered = useMemo(() => {
    if (selectedFilter === 'all') return sections.all;
    return sections.all.filter(k => (k.grade || 'S') === selectedFilter);
  }, [sections, selectedFilter]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Kanji Library</Text>
        <Text style={styles.subtitle}>Browse the full Joyo set</Text>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = selectedFilter === f.id;
          const count = f.id === 'all' ? sections.all.length : sections.counts[f.id];
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterPill, active && styles.filterPillActive]}
              onPress={() => setSelectedFilter(f.id)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              <Text style={[styles.filterCount, active && styles.filterCountActive]}> {count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => `${item.grade || 'S'}-${item.id}`}
        numColumns={3}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.kanji}>{item.kanji}</Text>
              <Text style={styles.meaning} numberOfLines={1} ellipsizeMode="tail">
                {item.meaning || 'Meaning not available'}
              </Text>
            <Text style={styles.meta}>{item.radical || '—'} • {item.strokes || '?'} strokes</Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{gradeLabels[item.grade || 'S'] || 'Grade'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, padding: spacing.lg },
  headerRow: { marginBottom: spacing.md },
  title: { color: palette.text, fontSize: 22, fontWeight: '800' },
  subtitle: { color: palette.textMuted, fontSize: 14, marginTop: spacing.xs },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    backgroundColor: palette.surface,
  },
  filterPillActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    ...{ shadowColor: palette.glow, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  },
  filterText: { color: palette.text, fontWeight: '700', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  filterCount: { color: palette.textMuted, fontWeight: '700', fontSize: 12 },
  filterCountActive: { color: '#fff' },
  content: { paddingBottom: spacing.xxxl },
  gridRow: { gap: spacing.md, marginBottom: spacing.md },
  card: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.glassBorder,
    alignItems: 'center',
    gap: spacing.xs,
  },
  kanji: { fontSize: 32, fontWeight: '800', color: palette.text },
  meaning: { color: palette.textSecondary, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  meta: { color: palette.textMuted, fontSize: 12 },
  tagPill: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.surfaceMuted,
    borderWidth: 1,
    borderColor: palette.glassBorder,
  },
  tagText: { color: palette.textSecondary, fontSize: 12, fontWeight: '700' },
});
