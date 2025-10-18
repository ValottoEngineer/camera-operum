interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  jitter?: boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  jitter: true,
};

// Função para calcular delay com backoff exponencial e jitter
const calculateDelay = (attempt: number, baseDelay: number, maxDelay: number, jitter: boolean): number => {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
  if (jitter) {
    // Adicionar jitter aleatório de ±25%
    const jitterRange = cappedDelay * 0.25;
    const jitterValue = (Math.random() - 0.5) * 2 * jitterRange;
    return Math.max(0, cappedDelay + jitterValue);
  }
  
  return cappedDelay;
};

// Função para aguardar um delay
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Função principal de retry
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const config = { ...defaultOptions, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Se é a última tentativa, não aguardar
      if (attempt === config.maxRetries) {
        break;
      }

      // Calcular delay para próxima tentativa
      const delay = calculateDelay(attempt, config.baseDelay, config.maxDelay, config.jitter);
      
      // Aguardar antes da próxima tentativa
      await sleep(delay);
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  throw new Error(`Operação falhou após ${config.maxRetries + 1} tentativas. Último erro: ${lastError!.message}`);
};

// Wrapper para fetch com retry
export const retryFetch = async (
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> => {
  return retryOperation(async () => {
    const response = await fetch(url, options);
    
    // Considerar erros HTTP como falhas que merecem retry
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  }, retryOptions);
};

// Wrapper para operações Firebase com retry
export const withRetry = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  retryOptions: RetryOptions = {}
): T => {
  return (async (...args: Parameters<T>) => {
    return retryOperation(() => fn(...args), retryOptions);
  }) as T;
};
