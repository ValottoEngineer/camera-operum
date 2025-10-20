/**
 * Mapeamento de códigos de erro do Firebase para mensagens em português
 * Centraliza todas as mensagens de erro do aplicativo
 */

export const ERROR_MESSAGES = {
  // Firebase Auth Errors
  'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
  'auth/user-not-found': 'Usuário não encontrado. Verifique o email ou crie uma conta.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/email-already-in-use': 'Este email já está em uso. Tente fazer login ou use outro email.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet e tente novamente.',
  'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
  'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.',
  'auth/invalid-credential': 'Credenciais inválidas. Verifique email e senha.',
  'auth/account-exists-with-different-credential': 'Já existe uma conta com este email usando outro método de login.',
  'auth/requires-recent-login': 'Esta operação requer login recente. Faça login novamente.',

  // Firestore Errors
  'firestore/permission-denied': 'Você não tem permissão para realizar esta operação.',
  'firestore/unavailable': 'Serviço temporariamente indisponível. Tente novamente.',
  'firestore/deadline-exceeded': 'Operação expirou. Tente novamente.',
  'firestore/resource-exhausted': 'Muitas operações. Aguarde um momento e tente novamente.',
  'firestore/failed-precondition': 'Operação falhou devido a uma condição não atendida.',
  'firestore/aborted': 'Operação foi cancelada. Tente novamente.',
  'firestore/out-of-range': 'Valor fora do intervalo permitido.',
  'firestore/unimplemented': 'Operação não implementada.',
  'firestore/internal': 'Erro interno do servidor. Tente novamente.',
  'firestore/data-loss': 'Dados corrompidos. Entre em contato com o suporte.',
  'firestore/unauthenticated': 'Você precisa estar logado para realizar esta operação.',

  // Generic Errors
  'network-error': 'Erro de conexão. Verifique sua internet e tente novamente.',
  'validation-error': 'Dados inválidos. Verifique as informações e tente novamente.',
  'unknown-error': 'Ocorreu um erro inesperado. Tente novamente.',
  'timeout-error': 'Operação demorou muito para responder. Tente novamente.',
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;

/**
 * Obter mensagem de erro amigável baseada no código
 */
export const getErrorMessage = (errorCode: string): string => {
  return ERROR_MESSAGES[errorCode as ErrorCode] || ERROR_MESSAGES['unknown-error'];
};

/**
 * Mensagens de sucesso
 */
export const SUCCESS_MESSAGES = {
  'login-success': 'Login realizado com sucesso!',
  'signup-success': 'Conta criada com sucesso!',
  'logout-success': 'Logout realizado com sucesso!',
  'password-reset-sent': 'Email de redefinição enviado!',
  'cliente-created': 'Cliente criado com sucesso!',
  'cliente-updated': 'Cliente atualizado com sucesso!',
  'cliente-deleted': 'Cliente excluído com sucesso!',
} as const;

export type SuccessCode = keyof typeof SUCCESS_MESSAGES;

/**
 * Obter mensagem de sucesso
 */
export const getSuccessMessage = (successCode: SuccessCode): string => {
  return SUCCESS_MESSAGES[successCode];
};
