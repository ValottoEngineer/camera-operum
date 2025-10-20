import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFirebaseErrorMessage, getFirebaseErrorCode } from '../utils/firebaseErrors';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Converter Firebase User para nossa interface User
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || '',
  email: firebaseUser.email || '',
});

class AuthService {
  async signUp(data: RegisterData): Promise<AuthResponse> {
    try {
      const { name, email, password } = data;
      
      // Criar usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Atualizar perfil com o nome
      await updateProfile(user, {
        displayName: name,
      });
      
      return {
        success: true,
        user: mapFirebaseUser(user),
      };
    } catch (error: any) {
      const errorCode = getFirebaseErrorCode(error);
      const errorMessage = getFirebaseErrorMessage(errorCode);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        success: true,
        user: mapFirebaseUser(user),
      };
    } catch (error: any) {
      const errorCode = getFirebaseErrorCode(error);
      const errorMessage = getFirebaseErrorMessage(errorCode);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const user = auth.currentUser;
    return user ? mapFirebaseUser(user) : null;
  }

  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Listener para mudanças de estado de autenticação
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged((firebaseUser) => {
      const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }
}

export const authService = new AuthService();
