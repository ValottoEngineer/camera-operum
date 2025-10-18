export const theme = {
  colors: {
    // Paleta futurista (tons frios e vibrantes)
    primary: '#6402FF',
    secondary: '#9C0AE8',
    accent: '#EE0BFF',
    info: '#0B30FF',
    electric: '#240AE8',
    
    // Gradientes
    gradient: ['#EE0BFF', '#0B30FF'],
    gradientSecondary: ['#9C0AE8', '#240AE8'],
    
    // Paleta neutra (minimalismo e leitura limpa)
    background: '#F2F2F2',
    card: '#D9D9D9',
    textPrimary: '#404040',
    textSecondary: '#595959',
    textTertiary: '#8C8C8C',
    border: '#8C8C8C',
    borderLight: '#D9D9D9',
    
    // Estados
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Neutros
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
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
    lg: 20,
    xl: 24,
    full: 9999,
  },
  
  typography: {
    fontFamily: 'System',
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
    bodySmall: { 
      fontSize: 14, 
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: { 
      fontSize: 13, 
      fontWeight: '300' as const,
      lineHeight: 18,
    },
    button: { 
      fontSize: 16, 
      fontWeight: '600' as const,
      lineHeight: 20,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    glow: {
      shadowColor: '#6402FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
  },
  
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
} as const;

export type Theme = typeof theme;
