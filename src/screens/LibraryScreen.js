import React, { useMemo } from 'react';
import { SectionList, Text, View, StyleSheet } from 'react-native';
import { LEVELS, KANJI_BANK } from '../services/KanjiService';
import { palette, radius, spacing } from '../styles/theme';

export default function LibraryScreen() {
  const sections = useMemo(() => {
    return LEVELS.map((lvl) => ({
      title: lvl.label,
      data: KANJI_BANK.filter(k => k.level === lvl.id),
    }));
  }, []);

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(item) => `${item.level}-${item.id}`}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.kanji}>{item.kanji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.meaning}>{item.meaning}</Text>
            <Text style={styles.meta}>{item.radical} • {item.strokes} traits</Text>
          </View>
          <Text style={styles.levelTag}>{item.level}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  sectionHeader: { color: palette.ink, fontSize: 16, fontWeight: '800', marginTop: spacing.md, marginBottom: spacing.sm },
  row: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kanji: { fontSize: 28, fontWeight: '800', color: palette.ink, width: 40, textAlign: 'center' },
  meaning: { color: palette.ink, fontSize: 15, fontWeight: '700' },
  meta: { color: palette.muted, fontSize: 12 },
  levelTag: { color: palette.accent, fontWeight: '800' },
});
