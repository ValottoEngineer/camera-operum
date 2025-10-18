/**
 * Remove formatação do CPF (pontos, traços, espaços)
 */
export const cleanCPF = (cpf: string): string => {
  return cpf.replace(/[^\d]/g, '');
};

/**
 * Formata CPF com pontos e traço (000.000.000-00)
 */
export const formatCPF = (cpf: string): string => {
  const cleaned = cleanCPF(cpf);
  
  if (cleaned.length !== 11) {
    return cpf; // Retorna original se não tiver 11 dígitos
  }
  
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Valida se um CPF é válido usando o algoritmo oficial
 */
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cleanCPF(cpf);
  
  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }
  
  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let remainder = sum % 11;
  let firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  // Verifica o primeiro dígito
  if (parseInt(cleaned[9]) !== firstDigit) {
    return false;
  }
  
  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  remainder = sum % 11;
  let secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  // Verifica o segundo dígito
  if (parseInt(cleaned[10]) !== secondDigit) {
    return false;
  }
  
  return true;
};

/**
 * Valida e formata CPF em uma única função
 */
export const validateAndFormatCPF = (cpf: string): { isValid: boolean; formatted: string } => {
  const cleaned = cleanCPF(cpf);
  const isValid = validateCPF(cleaned);
  const formatted = isValid ? formatCPF(cleaned) : cpf;
  
  return { isValid, formatted };
};
