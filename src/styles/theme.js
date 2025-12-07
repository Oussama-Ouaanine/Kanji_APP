// Shared design tokens for the refreshed kanji app UI
const palette = {
  background: '#f9f7f2',
  surface: '#ffffff',
  surfaceMuted: '#f3f5f9',
  accent: '#ff715b',
  accentSoft: '#ffe5dc',
  accentDeep: '#ff5a4a',
  ink: '#0b1220',
  muted: '#4b5565',
  line: '#e4e6ec',
  positive: '#16a34a',
  negative: '#dc2626',
  warning: '#f59e0b',
  glow: 'rgba(255, 113, 91, 0.15)',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
};

const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};

const theme = { palette, radius, spacing };

export default theme;
export { palette, radius, spacing };
