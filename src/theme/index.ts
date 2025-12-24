// Tema Material Design 3 - Light Mode

export const colors = {
  // Primary (Rosa/Magenta)
  primary: '#D81B60',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FFD8E4',
  onPrimaryContainer: '#3E001D',

  // Secondary (Viola)
  secondary: '#7B1FA2',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F3E5F5',
  onSecondaryContainer: '#4A0072',

  // Tertiary
  tertiary: '#6750A4',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#EADDFF',
  onTertiaryContainer: '#21005D',

  // Surface & Background
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#F3DEE2',
  onSurfaceVariant: '#524346',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F7F2F4',
  surfaceContainer: '#F1ECEE',
  surfaceContainerHigh: '#EBE6E8',
  surfaceContainerHighest: '#E5E1E3',

  // Background
  background: '#FFFBFE',
  onBackground: '#1C1B1F',

  // Outline
  outline: '#847377',
  outlineVariant: '#D5C2C6',

  // Status
  success: '#2E7D32',
  onSuccess: '#FFFFFF',
  successContainer: '#C8E6C9',
  warning: '#F57C00',
  onWarning: '#FFFFFF',
  warningContainer: '#FFE0B2',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',

  // Inverse
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF2',
  inversePrimary: '#FFB1C8',

  // Shadow & Scrim
  shadow: '#000000',
  scrim: '#000000',

  // Legacy compatibility
  text: '#1C1B1F',
  textSecondary: '#49454F',
  textMuted: '#79747E',
  border: '#CAC4CF',
  overlay: 'rgba(0, 0, 0, 0.32)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 22,
  xxl: 28,
  title: 32,
  display: 45,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// M3 Elevation levels (using shadow opacity)
export const elevation = {
  level0: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  level2: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  level3: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  elevation,
};
