/**
 * Firebase Authentication Service
 * 
 * Serviço de autenticação usando Firebase Auth nativo.
 * Inclui signIn, signUp, resetPassword, signOut e onAuthStateChanged.
 */

import { auth } from './firebase';
import { AuthUser, AppError } from '../types';

/**
 * Mapeamento de códigos de erro do Firebase para mensagens em português
 */
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
    'auth/user-not-found': 'Usuário não encontrado. Verifique o email ou crie uma conta.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/email-already-in-use': 'Este email já está em uso. Tente fazer login ou use outro email.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
    'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
    'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
  };

  return errorMessages[errorCode] || 'Ocorreu um erro inesperado. Tente novamente.';
};

/**
 * Converter Firebase User para AuthUser
 */
const mapFirebaseUser = (user: FirebaseAuthTypes.User | null): AuthUser | null => {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

/**
 * Fazer login com email e senha
 */
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = mapFirebaseUser(userCredential.user);
    
    if (!user) {
      throw new Error('Erro ao fazer login. Tente novamente.');
    }

    return user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * Criar nova conta com email e senha
 */
export const signUp = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = mapFirebaseUser(userCredential.user);
    
    if (!user) {
      throw new Error('Erro ao criar conta. Tente novamente.');
    }

    return user;
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * Enviar email de redefinição de senha
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await auth().sendPasswordResetEmail(email);
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * Fazer logout
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
  } catch (error: any) {
    throw new Error('Erro ao fazer logout. Tente novamente.');
  }
};

/**
 * Listener de mudanças no estado de autenticação
 */
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  return auth().onAuthStateChanged((user) => {
    const mappedUser = mapFirebaseUser(user);
    callback(mappedUser);
  });
};

/**
 * Obter usuário atual
 */
export const getCurrentUser = (): AuthUser | null => {
  const user = auth().currentUser;
  return mapFirebaseUser(user);
};
