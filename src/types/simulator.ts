export interface SimulatorInputs {
  initialAmount: number;
  monthlyContribution: number;
  period: number; // em anos
  selectedStocks: string[];
  expectedReturn?: number; // taxa anual esperada
}

export interface SimulatorResults {
  totalInvested: number;
  totalReturn: number;
  finalValue: number;
  monthlyBreakdown: MonthlyBreakdown[];
  stockAllocation: StockAllocation[];
  projectedGrowth: ProjectedGrowth[];
}

export interface MonthlyBreakdown {
  month: number;
  invested: number;
  value: number;
  return: number;
  returnPercent: number;
}

export interface StockAllocation {
  symbol: string;
  name: string;
  percentage: number;
  amount: number;
  expectedReturn: number;
}

export interface ProjectedGrowth {
  year: number;
  invested: number;
  value: number;
  return: number;
}

export interface HistoricalReturn {
  symbol: string;
  period: string; // '1m', '3m', '6m', '1y', '2y', '5y'
  return: number;
  volatility: number;
  sharpeRatio: number;
}

export interface SimulatorPreset {
  id: string;
  name: string;
  description: string;
  inputs: Partial<SimulatorInputs>;
  color: string;
  icon: string;
}

export const SIMULATOR_PRESETS: SimulatorPreset[] = [
  {
    id: 'conservative',
    name: 'Conservador',
    description: 'Foco em preservação de capital',
    inputs: {
      initialAmount: 10000,
      monthlyContribution: 500,
      period: 10,
      selectedStocks: ['ITUB4'],
    },
    color: '#2196F3',
    icon: '🛡️',
  },
  {
    id: 'moderate',
    name: 'Moderado',
    description: 'Equilíbrio entre risco e retorno',
    inputs: {
      initialAmount: 15000,
      monthlyContribution: 800,
      period: 15,
      selectedStocks: ['PETR4', 'VALE3'],
    },
    color: '#9C27B0',
    icon: '⚖️',
  },
  {
    id: 'aggressive',
    name: 'Arrojado',
    description: 'Máximo potencial de crescimento',
    inputs: {
      initialAmount: 5000,
      monthlyContribution: 1000,
      period: 20,
      selectedStocks: ['MGLU3'],
    },
    color: '#E91E63',
    icon: '🚀',
  },
  {
    id: 'balanced',
    name: 'Balanceada',
    description: 'Diversificação completa',
    inputs: {
      initialAmount: 20000,
      monthlyContribution: 1000,
      period: 25,
      selectedStocks: ['ITUB4', 'PETR4', 'VALE3', 'MGLU3'],
    },
    color: '#4CAF50',
    icon: '📊',
  },
];
