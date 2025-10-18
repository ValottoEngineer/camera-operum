import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserProfile } from '../services/firebase/auth';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  // Estado inicial
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,

  // Ações
  setUser: (user) => set((state) => ({
    user,
    isAuthenticated: !!user,
    loading: false,
  })),

  setUserProfile: (userProfile) => set({ userProfile }),

  setLoading: (loading) => set({ loading }),

  clearAuth: () => set({
    user: null,
    userProfile: null,
    loading: false,
    isAuthenticated: false,
  }),
}));
