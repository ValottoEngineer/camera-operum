export const theme = {
  colors: {
    primary: '#6402FF',
    secondary: '#9C0AE8',
    accent: '#EE0BFF',
    info: '#0B30FF',
    gradient: ['#EE0BFF', '#0B30FF'],
    background: '#F2F2F2',
    card: '#D9D9D9',
    textPrimary: '#404040',
    textSecondary: '#595959',
    border: '#8C8C8C',
    white: '#FFFFFF',
    black: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 16,
    xl: 20,
    round: 50,
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 22,
    },
    caption: {
      fontSize: 13,
      fontWeight: '300' as const,
      lineHeight: 18,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
