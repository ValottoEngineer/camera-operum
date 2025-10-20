// Tipos para Firestore

// Cliente interface
export interface Cliente {
  id: string;
  nome: string;
  perfilRisco: 'conservador' | 'moderado' | 'agressivo';
  liquidez: 'baixa' | 'média' | 'alta';
  objetivos: string;
  createdAt: Date;
}

// Cliente form data (without id and createdAt)
export interface ClienteFormData {
  nome: string;
  perfilRisco: 'conservador' | 'moderado' | 'agressivo';
  liquidez: 'baixa' | 'média' | 'alta';
  objetivos: string;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Sign up form data
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  ClienteForm: {
    cliente?: Cliente;
  };
};

// Firebase Auth User
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// Error types
export interface AppError {
  code: string;
  message: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Picker options
export const PERFIL_RISCO_OPTIONS = [
  { label: 'Conservador', value: 'conservador' as const },
  { label: 'Moderado', value: 'moderado' as const },
  { label: 'Agressivo', value: 'agressivo' as const },
] as const;

export const LIQUIDEZ_OPTIONS = [
  { label: 'Baixa', value: 'baixa' as const },
  { label: 'Média', value: 'média' as const },
  { label: 'Alta', value: 'alta' as const },
] as const;
