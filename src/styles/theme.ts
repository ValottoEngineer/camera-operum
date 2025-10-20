export const colors = {
  // Futuristic Neon Palette - Operum
  neon: {
    pink: '#EE0BFF',      // Rosa Futurista
    purple: '#9C0AE8',    // Lilás Neon
    electric: '#6402FF',  // Roxo Elétrico
    ion: '#240AE8',       // Azul Íon
    future: '#0B30FF',    // Azul Futuro
  },
  
  // Neutral Palette - Minimalismo
  neutral: {
    light: '#F2F2F2',     // Fundo claro
    card: '#D9D9D9',      // Cartões/inputs
    secondary: '#8C8C8C', // Texto secundário
    primary: '#404040',   // Texto primário
    border: '#D9D9D9',    // Bordas neutras
    dark: '#595959',      // Bordas/ícones neutros
  },
  
  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Background
  background: '#F2F2F2',
  surface: '#FFFFFF',
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  families: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  // Escalas de tipografia padronizadas
  h1: { fontSize: 32, fontWeight: 'bold' as const, color: '#404040' },
  h2: { fontSize: 24, fontWeight: 'bold' as const, color: '#404040' },
  h3: { fontSize: 20, fontWeight: '600' as const, color: '#404040' },
  body: { fontSize: 16, fontWeight: 'normal' as const, color: '#404040' },
  bodySmall: { fontSize: 14, color: '#8C8C8C' },
  caption: { fontSize: 12, color: '#8C8C8C' },
  button: { fontSize: 16, fontWeight: '600' as const, color: '#FFFFFF' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    // Web-compatible shadow
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    // Web-compatible shadow
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    // Web-compatible shadow
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },
};

// Gradientes padronizados
export const gradients = {
  primary: ['#EE0BFF', '#0B30FF'],    // Rosa → Azul Futuro
  secondary: ['#9C0AE8', '#6402FF'],  // Lilás → Roxo Elétrico
  tertiary: ['#6402FF', '#240AE8'],   // Roxo Elétrico → Azul Íon
  neutral: ['#F2F2F2', '#D9D9D9'],    // Neutro
};

// Efeitos glassmorphism
export const glassmorphism = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    // Web-compatible backdrop filter
    backdropFilter: 'blur(10px)',
  },
  dark: {
    backgroundColor: 'rgba(64, 64, 64, 0.3)',
    borderColor: '#595959',
    borderWidth: 1,
    backdropFilter: 'blur(10px)',
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
  glassmorphism,
};

// Helper function for gradient background
export const gradientBackground = gradients;

export type Theme = typeof theme;
