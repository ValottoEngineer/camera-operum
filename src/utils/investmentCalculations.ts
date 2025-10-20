import { SimulatorInputs, SimulatorResults, MonthlyBreakdown, StockAllocation, ProjectedGrowth, HistoricalReturn } from '../types/simulator';

/**
 * Calcula o valor futuro de um investimento com juros compostos e aportes mensais
 * Fórmula: FV = PV × (1 + r)^n + PMT × [((1 + r)^n - 1) / r]
 */
export const calculateFutureValue = (
  presentValue: number,
  monthlyRate: number,
  periods: number,
  monthlyPayment: number
): number => {
  if (monthlyRate === 0) {
    return presentValue + (monthlyPayment * periods);
  }

  const compoundInterest = presentValue * Math.pow(1 + monthlyRate, periods);
  const annuityValue = monthlyPayment * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);
  
  return compoundInterest + annuityValue;
};

/**
 * Converte taxa anual para taxa mensal
 */
export const annualToMonthlyRate = (annualRate: number): number => {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
};

/**
 * Calcula retorno médio histórico de uma ação baseado em dados reais
 */
export const calculateHistoricalReturn = (
  symbol: string,
  historicalData: any[]
): number => {
  if (!historicalData || historicalData.length < 2) {
    return 0.12; // 12% ao ano como fallback
  }

  const prices = historicalData.map(d => d.close || d.regularMarketPrice);
  const returns = [];
  
  for (let i = 1; i < prices.length; i++) {
    const returnRate = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(returnRate);
  }

  const averageReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  return Math.max(0, averageReturn * 12); // Convert to annual rate
};

/**
 * Calcula volatilidade (desvio padrão) dos retornos
 */
export const calculateVolatility = (historicalData: any[]): number => {
  if (!historicalData || historicalData.length < 2) {
    return 0.2; // 20% como fallback
  }

  const prices = historicalData.map(d => d.close || d.regularMarketPrice);
  const returns = [];
  
  for (let i = 1; i < prices.length; i++) {
    const returnRate = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(returnRate);
  }

  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(12); // Annualized volatility
};

/**
 * Calcula Sharpe Ratio (retorno ajustado ao risco)
 */
export const calculateSharpeRatio = (
  expectedReturn: number,
  riskFreeRate: number = 0.06, // 6% SELIC como taxa livre de risco
  volatility: number
): number => {
  if (volatility === 0) return 0;
  return (expectedReturn - riskFreeRate) / volatility;
};

/**
 * Simula investimento com dados reais
 */
export const simulateInvestment = (
  inputs: SimulatorInputs,
  historicalReturns: Record<string, number>
): SimulatorResults => {
  const { initialAmount, monthlyContribution, period, selectedStocks } = inputs;
  
  // Calcular retorno médio esperado baseado nas ações selecionadas
  const averageReturn = selectedStocks.length > 0 
    ? selectedStocks.reduce((sum, symbol) => sum + (historicalReturns[symbol] || 0.12), 0) / selectedStocks.length
    : 0.12;

  const monthlyRate = annualToMonthlyRate(averageReturn);
  const totalMonths = period * 12;
  
  // Calcular valor final
  const finalValue = calculateFutureValue(initialAmount, monthlyRate, totalMonths, monthlyContribution);
  const totalInvested = initialAmount + (monthlyContribution * totalMonths);
  const totalReturn = finalValue - totalInvested;

  // Gerar breakdown mensal
  const monthlyBreakdown: MonthlyBreakdown[] = [];
  let currentValue = initialAmount;
  
  for (let month = 1; month <= totalMonths; month++) {
    currentValue = calculateFutureValue(initialAmount, monthlyRate, month, monthlyContribution);
    const invested = initialAmount + (monthlyContribution * month);
    const returnAmount = currentValue - invested;
    const returnPercent = invested > 0 ? (returnAmount / invested) * 100 : 0;
    
    monthlyBreakdown.push({
      month,
      invested,
      value: currentValue,
      return: returnAmount,
      returnPercent,
    });
  }

  // Calcular alocação por ação
  const stockAllocation: StockAllocation[] = selectedStocks.map(symbol => {
    const stockReturn = historicalReturns[symbol] || 0.12;
    const percentage = 100 / selectedStocks.length;
    const amount = (finalValue * percentage) / 100;
    
    return {
      symbol,
      name: getStockName(symbol),
      percentage,
      amount,
      expectedReturn: stockReturn,
    };
  });

  // Gerar projeção anual
  const projectedGrowth: ProjectedGrowth[] = [];
  for (let year = 1; year <= period; year++) {
    const months = year * 12;
    const value = calculateFutureValue(initialAmount, monthlyRate, months, monthlyContribution);
    const invested = initialAmount + (monthlyContribution * months);
    const returnAmount = value - invested;
    
    projectedGrowth.push({
      year,
      invested,
      value,
      return: returnAmount,
    });
  }

  return {
    totalInvested,
    totalReturn,
    finalValue,
    monthlyBreakdown,
    stockAllocation,
    projectedGrowth,
  };
};

/**
 * Otimiza alocação de carteira baseada no retorno esperado e volatilidade
 */
export const optimizePortfolio = (
  stocks: string[],
  historicalReturns: Record<string, number>,
  historicalVolatility: Record<string, number>
): Record<string, number> => {
  // Algoritmo simples de otimização baseado no Sharpe Ratio
  const allocations: Record<string, number> = {};
  
  const sharpeRatios = stocks.map(symbol => ({
    symbol,
    sharpe: calculateSharpeRatio(
      historicalReturns[symbol] || 0.12,
      0.06,
      historicalVolatility[symbol] || 0.2
    )
  }));

  // Ordenar por Sharpe Ratio
  sharpeRatios.sort((a, b) => b.sharpe - a.sharpe);

  // Alocar mais para ações com melhor Sharpe Ratio
  const totalWeight = sharpeRatios.reduce((sum, stock, index) => {
    const weight = Math.pow(0.7, index); // Peso decrescente
    allocations[stock.symbol] = weight;
    return sum + weight;
  }, 0);

  // Normalizar para somar 100%
  Object.keys(allocations).forEach(symbol => {
    allocations[symbol] = (allocations[symbol] / totalWeight) * 100;
  });

  return allocations;
};

/**
 * Formata valores monetários
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata percentuais
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

/**
 * Obtém nome da ação pelo símbolo
 */
const getStockName = (symbol: string): string => {
  const names: Record<string, string> = {
    'ITUB4': 'Itaú Unibanco',
    'PETR4': 'Petrobras',
    'VALE3': 'Vale',
    'MGLU3': 'Magazine Luiza',
  };
  return names[symbol] || symbol;
};

/**
 * Calcula métricas de risco
 */
export const calculateRiskMetrics = (
  historicalData: any[],
  expectedReturn: number
): {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  var95: number;
} => {
  const volatility = calculateVolatility(historicalData);
  const sharpeRatio = calculateSharpeRatio(expectedReturn, 0.06, volatility);
  
  // Calcular Maximum Drawdown
  const prices = historicalData.map(d => d.close || d.regularMarketPrice);
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (const price of prices) {
    if (price > peak) peak = price;
    const drawdown = (peak - price) / peak;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
  }
  
  // Calcular VaR 95% (simplificado)
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  returns.sort((a, b) => a - b);
  const var95 = returns[Math.floor(returns.length * 0.05)] || -0.05;
  
  return {
    volatility,
    sharpeRatio,
    maxDrawdown,
    var95,
  };
};
