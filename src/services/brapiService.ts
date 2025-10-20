import { StockQuote, BrapiResponse, BrapiError, STOCK_SYMBOLS } from '../types/brapi';
import { Portfolio, PORTFOLIO_CONFIGS, RiskProfile } from '../types/portfolio';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_TOKEN = '83ggNqPt65fEAYG7EhrWEr';

class BrapiService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BRAPI_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${BRAPI_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Brapi API Error:', error);
      throw new Error('Erro ao buscar dados financeiros. Tente novamente.');
    }
  }

  async getStockQuotes(symbols?: string[], retryCount = 0): Promise<StockQuote[]> {
    try {
      const symbolsToFetch = symbols || STOCK_SYMBOLS;
      const symbolsParam = symbolsToFetch.join(',');
      
      const response: BrapiResponse = await this.makeRequest(
        `/quote/${symbolsParam}`
      );

      return response.results || [];
    } catch (error) {
      console.error('Error fetching stock quotes:', error);
      
      // Se for rate limit (429), aguardar e tentar novamente
      if (error instanceof Error && error.message.includes('429') && retryCount < 2) {
        console.log(`Rate limited, retrying in ${(retryCount + 1) * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
        return this.getStockQuotes(symbols, retryCount + 1);
      }
      
      // Se ainda estiver com erro após retry, usar dados mockados
      if (retryCount >= 2) {
        console.log('API unavailable after retries, using mock data');
        return this.getMockStockQuotes(symbols || STOCK_SYMBOLS);
      }
      
      throw error;
    }
  }

  // Dados mockados para ações individuais (apenas as 4 ações gratuitas)
  private getMockStockQuotes(symbols: string[]): StockQuote[] {
    const mockStocks = {
      ITUB4: {
        symbol: 'ITUB4',
        shortName: 'Itaú Unibanco',
        longName: 'Itaú Unibanco Holding S.A.',
        currency: 'BRL',
        regularMarketPrice: 28.45,
        regularMarketDayHigh: 29.10,
        regularMarketDayLow: 28.20,
        regularMarketChange: 0.35,
        regularMarketChangePercent: 1.25,
        regularMarketTime: new Date().toISOString(),
        marketCap: 280000000000,
        regularMarketVolume: 45000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      PETR4: {
        symbol: 'PETR4',
        shortName: 'Petrobras',
        longName: 'Petróleo Brasileiro S.A. - Petrobras',
        currency: 'BRL',
        regularMarketPrice: 35.20,
        regularMarketDayHigh: 36.00,
        regularMarketDayLow: 34.80,
        regularMarketChange: 1.50,
        regularMarketChangePercent: 4.45,
        regularMarketTime: new Date().toISOString(),
        marketCap: 450000000000,
        regularMarketVolume: 85000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      VALE3: {
        symbol: 'VALE3',
        shortName: 'Vale',
        longName: 'Vale S.A.',
        currency: 'BRL',
        regularMarketPrice: 58.90,
        regularMarketDayHigh: 60.20,
        regularMarketDayLow: 58.10,
        regularMarketChange: -0.80,
        regularMarketChangePercent: -1.34,
        regularMarketTime: new Date().toISOString(),
        marketCap: 280000000000,
        regularMarketVolume: 42000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      MGLU3: {
        symbol: 'MGLU3',
        shortName: 'Magazine Luiza',
        longName: 'Magazine Luiza S.A.',
        currency: 'BRL',
        regularMarketPrice: 12.45,
        regularMarketDayHigh: 13.20,
        regularMarketDayLow: 12.10,
        regularMarketChange: 0.75,
        regularMarketChangePercent: 6.42,
        regularMarketTime: new Date().toISOString(),
        marketCap: 85000000000,
        regularMarketVolume: 25000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
    };

    return symbols
      .map(symbol => mockStocks[symbol as keyof typeof mockStocks])
      .filter(Boolean);
  }

  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const quotes = await this.getStockQuotes([symbol]);
      return quotes.length > 0 ? quotes[0] : null;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  async getStockQuotesWithHistory(
    symbols: string[],
    range: string = '1mo',
    interval: string = '1d'
  ): Promise<StockQuote[]> {
    try {
      const symbolsParam = symbols.join(',');
      
      const response: BrapiResponse = await this.makeRequest(
        `/quote/${symbolsParam}?range=${range}&interval=${interval}`
      );

      return response.results || [];
    } catch (error) {
      console.error('Error fetching stock quotes with history:', error);
      throw error;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  formatPercentage(percentage: number): string {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  }

  getChangeColor(change: number): string {
    if (change > 0) return '#4CAF50'; // Verde
    if (change < 0) return '#F44336'; // Vermelho
    return '#8C8C8C'; // Neutro
  }

  // Buscar todas as carteiras com dados atualizados
  async getPortfolios(): Promise<Portfolio[]> {
    try {
      // Buscar todas as ações de todas as carteiras em uma única requisição
      const allSymbols = Object.values(PORTFOLIO_CONFIGS).flatMap(config => config.symbols);
      const uniqueSymbols = [...new Set(allSymbols)];
      
      const stocks = await this.getStockQuotes(uniqueSymbols);
      
      // Criar carteiras com dados atualizados
      const portfolios: Portfolio[] = Object.values(PORTFOLIO_CONFIGS).map(config => {
        const portfolioStocks = stocks.filter(stock => 
          config.symbols.includes(stock.symbol)
        );
        
        const metrics = this.calculatePortfolioMetrics(portfolioStocks);
        
        return {
          id: config.id,
          name: config.name,
          description: config.description,
          riskProfile: config.id as RiskProfile,
          objective: config.objective,
          color: config.color,
          symbols: config.symbols,
          stocks: portfolioStocks,
          metrics,
        };
      });

      return portfolios;
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      
      // Se a API estiver com rate limit, usar dados mockados
      if (error instanceof Error && error.message.includes('429')) {
        console.log('API rate limited, using mock data for demonstration');
        return this.getMockPortfolios();
      }
      
      throw error;
    }
  }

  // Dados mockados para demonstração quando a API estiver indisponível (apenas as 4 ações gratuitas)
  getMockPortfolios(): Portfolio[] {
    const mockStocks = {
      ITUB4: {
        symbol: 'ITUB4',
        shortName: 'Itaú Unibanco',
        longName: 'Itaú Unibanco Holding S.A.',
        currency: 'BRL',
        regularMarketPrice: 28.45,
        regularMarketDayHigh: 29.10,
        regularMarketDayLow: 28.20,
        regularMarketChange: 0.35,
        regularMarketChangePercent: 1.25,
        regularMarketTime: new Date().toISOString(),
        marketCap: 280000000000,
        regularMarketVolume: 45000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      PETR4: {
        symbol: 'PETR4',
        shortName: 'Petrobras',
        longName: 'Petróleo Brasileiro S.A. - Petrobras',
        currency: 'BRL',
        regularMarketPrice: 35.20,
        regularMarketDayHigh: 36.00,
        regularMarketDayLow: 34.80,
        regularMarketChange: 1.50,
        regularMarketChangePercent: 4.45,
        regularMarketTime: new Date().toISOString(),
        marketCap: 450000000000,
        regularMarketVolume: 85000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      VALE3: {
        symbol: 'VALE3',
        shortName: 'Vale',
        longName: 'Vale S.A.',
        currency: 'BRL',
        regularMarketPrice: 58.90,
        regularMarketDayHigh: 60.20,
        regularMarketDayLow: 58.10,
        regularMarketChange: -0.80,
        regularMarketChangePercent: -1.34,
        regularMarketTime: new Date().toISOString(),
        marketCap: 280000000000,
        regularMarketVolume: 42000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      MGLU3: {
        symbol: 'MGLU3',
        shortName: 'Magazine Luiza',
        longName: 'Magazine Luiza S.A.',
        currency: 'BRL',
        regularMarketPrice: 12.45,
        regularMarketDayHigh: 13.20,
        regularMarketDayLow: 12.10,
        regularMarketChange: 0.75,
        regularMarketChangePercent: 6.42,
        regularMarketTime: new Date().toISOString(),
        marketCap: 85000000000,
        regularMarketVolume: 25000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
    };

    return Object.values(PORTFOLIO_CONFIGS).map(config => {
      const portfolioStocks = config.symbols.map(symbol => mockStocks[symbol as keyof typeof mockStocks]).filter(Boolean);
      const metrics = this.calculatePortfolioMetrics(portfolioStocks);
      
      return {
        id: config.id,
        name: config.name,
        description: config.description,
        riskProfile: config.id as RiskProfile,
        objective: config.objective,
        color: config.color,
        symbols: config.symbols,
        stocks: portfolioStocks,
        metrics,
      };
    });
  }

  // Calcular métricas da carteira
  private calculatePortfolioMetrics(stocks: StockQuote[]) {
    if (stocks.length === 0) {
      return {
        averageReturn: 0,
        bestStock: null,
        worstStock: null,
        totalVolume: 0,
        totalMarketCap: 0,
      };
    }

    const returns = stocks.map(stock => stock.regularMarketChangePercent);
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    
    const bestStock = stocks.reduce((best, current) => 
      current.regularMarketChangePercent > best.regularMarketChangePercent ? current : best
    );
    
    const worstStock = stocks.reduce((worst, current) => 
      current.regularMarketChangePercent < worst.regularMarketChangePercent ? current : worst
    );
    
    const totalVolume = stocks.reduce((sum, stock) => sum + stock.regularMarketVolume, 0);
    const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.marketCap, 0);

    return {
      averageReturn,
      bestStock,
      worstStock,
      totalVolume,
      totalMarketCap,
    };
  }
}

export const brapiService = new BrapiService();
