// Premium light theme with warm tones and elegant design
const palette = {
  // Sophisticated light backgrounds
  background: '#faf8f5',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceMuted: '#f5f3f0',
  
  // Elegant coral-orange gradient system
  primary: '#ff6b4a',        // Vibrant coral
  primaryLight: '#ff8b6a',   // Light coral
  primaryDark: '#ff4a2a',    // Deep coral
  secondary: '#ff9770',      // Peachy coral
  secondaryLight: '#ffb090', // Light peach
  
  // Accent colors for variety
  accent: '#2dd4bf',         // Teal
  accentWarm: '#f59e0b',     // Amber
  accentCool: '#8b5cf6',     // Violet
  
  // Text colors
  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#888888',
  textDisabled: '#c0c0c0',

  // Legacy aliases for components still referencing old keys
  ink: '#1a1a1a',
  muted: '#888888',
  line: 'rgba(0, 0, 0, 0.06)',
  
  // Semantic colors
  positive: '#10b981',       // Emerald
  positiveGlow: 'rgba(16, 185, 129, 0.15)',
  negative: '#ef4444',       // Red
  negativeGlow: 'rgba(239, 68, 68, 0.15)',
  warning: '#f59e0b',        // Amber
  
  // Subtle overlays
  glass: 'rgba(255, 255, 255, 0.7)',
  glassBorder: 'rgba(0, 0, 0, 0.06)',
  glassHover: 'rgba(0, 0, 0, 0.03)',
  overlay: 'rgba(0, 0, 0, 0.3)',
  
  // Soft shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  glow: 'rgba(255, 107, 74, 0.2)',
  glowPink: 'rgba(255, 151, 112, 0.2)',
  glowCyan: 'rgba(45, 212, 191, 0.2)',
};

const gradients = {
  primary: ['#ff6b4a', '#ff9770'],
  primaryReverse: ['#ff9770', '#ff6b4a'],
  accent: ['#2dd4bf', '#14b8a6'],
  warm: ['#fbbf24', '#f59e0b'],
  cool: ['#8b5cf6', '#6366f1'],
  success: ['#10b981', '#34d399'],
  danger: ['#ef4444', '#f43f5e'],
};

const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

const shadows = {
  sm: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
};

const theme = { palette, gradients, radius, spacing, shadows };

export default theme;
export { palette, gradients, radius, spacing, shadows };
