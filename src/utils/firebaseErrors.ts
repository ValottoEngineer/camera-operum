export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    // Erros de cadastro
    'auth/email-already-in-use': 'Email já cadastrado.',
    'auth/invalid-email': 'Email inválido.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    
    // Erros de login
    'auth/user-not-found': 'Credenciais inválidas.',
    'auth/wrong-password': 'Credenciais inválidas.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    
    // Erros de rede
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/timeout': 'Tempo esgotado. Tente novamente.',
    
    // Erros gerais
    'auth/invalid-argument': 'Argumento inválido.',
    'auth/missing-email': 'Email é obrigatório.',
    'auth/missing-password': 'Senha é obrigatória.',
    'auth/requires-recent-login': 'Faça login novamente para continuar.',
    
    // Erros de perfil
    'auth/invalid-display-name': 'Nome inválido.',
  };

  return errorMessages[errorCode] || 'Erro interno. Tente novamente.';
};

export const getFirebaseErrorCode = (error: any): string => {
  if (error?.code) {
    return error.code;
  }
  
  if (error?.message) {
    // Extrair código do erro da mensagem
    const match = error.message.match(/auth\/[a-z-]+/);
    if (match) {
      return match[0];
    }
  }
  
  return 'unknown';
};
