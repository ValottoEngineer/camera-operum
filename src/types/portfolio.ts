import { StockQuote } from './brapi';

export type RiskProfile = 'conservador' | 'moderado' | 'arrojado';

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  riskProfile: RiskProfile;
  objective: string;
  color: string;
  symbols: string[];
  stocks: StockQuote[];
  metrics: {
    averageReturn: number;
    bestStock: StockQuote | null;
    worstStock: StockQuote | null;
    totalVolume: number;
    totalMarketCap: number;
  };
}

export const PORTFOLIO_CONFIGS = {
  conservador: {
    id: 'conservador',
    name: 'Perfil Conservador',
    description: 'Preservação de capital com baixo risco',
    objective: 'Foco em dividendos e estabilidade',
    color: '#2196F3', // Azul
    symbols: ['ITUB4'], // Itaú - Banco estável com dividendos
  },
  moderado: {
    id: 'moderado',
    name: 'Perfil Moderado',
    description: 'Crescimento equilibrado com risco moderado',
    objective: 'Crescimento sustentável e valorização',
    color: '#9C27B0', // Roxo
    symbols: ['PETR4', 'VALE3'], // Petrobras e Vale - Commodities sólidas
  },
  arrojado: {
    id: 'arrojado',
    name: 'Perfil Arrojado',
    description: 'Alto crescimento com maior risco',
    objective: 'Máxima valorização e crescimento rápido',
    color: '#E91E63', // Rosa
    symbols: ['MGLU3'], // Magazine Luiza - Varejo/tech com alto crescimento
  },
} as const;

export const RISK_LEVELS = {
  conservador: {
    label: 'Baixo Risco',
    icon: 'shield-checkmark',
    description: 'Preservação de capital',
  },
  moderado: {
    label: 'Risco Moderado',
    icon: 'balance',
    description: 'Equilíbrio risco/retorno',
  },
  arrojado: {
    label: 'Alto Risco',
    icon: 'rocket',
    description: 'Máximo potencial de crescimento',
  },
} as const;
