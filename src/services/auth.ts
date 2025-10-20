import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
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

  // Atualizar nome do usuário
  async updateUserProfile(name: string): Promise<AuthResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'Usuário não autenticado.',
        };
      }

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

  // Atualizar senha do usuário
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          success: false,
          error: 'Usuário não autenticado.',
        };
      }

      // Reautenticar usuário antes de alterar senha
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Atualizar senha
      await updatePassword(user, newPassword);

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

  // Excluir conta do usuário
  async deleteUserAccount(currentPassword: string): Promise<AuthResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          success: false,
          error: 'Usuário não autenticado.',
        };
      }

      // Reautenticar usuário antes de excluir conta
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Excluir conta
      await deleteUser(user);

      return {
        success: true,
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

  // Listener para mudanças de estado de autenticação
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged((firebaseUser) => {
      const user = firebaseUser ? mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }
}

export const authService = new AuthService();
