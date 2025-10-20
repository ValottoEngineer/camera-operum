import { StockQuote, BrapiResponse, BrapiError, STOCK_SYMBOLS } from '../types/brapi';
import { Portfolio, PORTFOLIO_CONFIGS, RiskProfile } from '../types/portfolio';

const BRAPI_BASE_URL = 'https://brapi.dev/api';
const BRAPI_TOKEN = '83ggNqPt65fEAYG7EhrWEr';
const FREE_STOCKS = ['PETR4', 'VALE3', 'MGLU3', 'ITUB4']; // Sem limite de rate!

class BrapiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requisições
  private requestCount = 0;
  private cacheHits = 0;

  private async makeRequest<T>(endpoint: string, useToken = false): Promise<T> {
    // Adicionar token como parâmetro de URL se necessário
    const url = useToken 
      ? `${BRAPI_BASE_URL}${endpoint}?token=${BRAPI_TOKEN}`
      : `${BRAPI_BASE_URL}${endpoint}`;
    
    // Verificar cache primeiro
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      this.cacheHits++;
      console.log(`Cache hit! Total: ${this.cacheHits}`);
      return cached.data;
    }

    // Rate limiting local - aguardar se necessário
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    try {
      this.requestCount++;
      console.log(`API request #${this.requestCount} - ${useToken ? 'with token' : 'free stocks'}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      this.lastRequestTime = Date.now();

      if (response.status === 429) {
        console.log('Rate limit hit (429), using cached/mock data');
        throw new Error('RATE_LIMIT');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Salvar no cache
      this.cache.set(url, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      // Apenas logar se não for rate limit
      if (!(error instanceof Error && error.message === 'RATE_LIMIT')) {
        console.error('Unexpected API error:', error);
      }
      
      if (error instanceof Error && error.message === 'RATE_LIMIT') {
        throw new Error('RATE_LIMIT');
      }
      
      throw new Error('Erro ao buscar dados financeiros. Tente novamente.');
    }
  }

  async getStockQuotes(symbols?: string[]): Promise<StockQuote[]> {
    const symbolsToFetch = symbols || FREE_STOCKS;
    
    // Dividir em chunks de 2 ações para evitar sobrecarga
    const chunks = this.chunkArray(symbolsToFetch, 2);
    const results: StockQuote[] = [];
    
    for (const chunk of chunks) {
      try {
        const symbolsParam = chunk.join(',');
        
        // Verificar se todas as ações do chunk são gratuitas
        const allFreeStocks = chunk.every(symbol => FREE_STOCKS.includes(symbol));
        
        const response: BrapiResponse = await this.makeRequest(
          `/quote/${symbolsParam}`,
          !allFreeStocks // Usar token apenas se NÃO forem todas gratuitas
        );
        results.push(...(response.results || []));
        
        // Aguardar 500ms entre chunks para ser gentil com a API
        if (chunks.indexOf(chunk) < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.log('Chunk failed, using mock for:', chunk);
        results.push(...this.getMockStockQuotes(chunk));
      }
    }
    
    return results;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Dados mockados para ações individuais (4 gratuitas + 6 adicionais)
  private getMockStockQuotes(symbols: string[]): StockQuote[] {
    const mockStocks = {
      // Ações gratuitas (reais quando cache expirar)
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
      
      // Ações adicionais mockadas para enriquecer portfolios
      BBDC4: {
        symbol: 'BBDC4',
        shortName: 'Bradesco',
        longName: 'Banco Bradesco S.A.',
        currency: 'BRL',
        regularMarketPrice: 14.30,
        regularMarketDayHigh: 14.80,
        regularMarketDayLow: 14.10,
        regularMarketChange: -0.15,
        regularMarketChangePercent: -1.04,
        regularMarketTime: new Date().toISOString(),
        marketCap: 150000000000,
        regularMarketVolume: 35000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      ABEV3: {
        symbol: 'ABEV3',
        shortName: 'Ambev',
        longName: 'Ambev S.A.',
        currency: 'BRL',
        regularMarketPrice: 11.85,
        regularMarketDayHigh: 12.20,
        regularMarketDayLow: 11.60,
        regularMarketChange: 0.25,
        regularMarketChangePercent: 2.15,
        regularMarketTime: new Date().toISOString(),
        marketCap: 200000000000,
        regularMarketVolume: 28000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      WEGE3: {
        symbol: 'WEGE3',
        shortName: 'WEG',
        longName: 'WEG S.A.',
        currency: 'BRL',
        regularMarketPrice: 38.90,
        regularMarketDayHigh: 39.50,
        regularMarketDayLow: 38.20,
        regularMarketChange: 1.20,
        regularMarketChangePercent: 3.18,
        regularMarketTime: new Date().toISOString(),
        marketCap: 180000000000,
        regularMarketVolume: 15000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      B3SA3: {
        symbol: 'B3SA3',
        shortName: 'B3',
        longName: 'B3 S.A. - Brasil, Bolsa, Balcão',
        currency: 'BRL',
        regularMarketPrice: 9.75,
        regularMarketDayHigh: 10.20,
        regularMarketDayLow: 9.50,
        regularMarketChange: 0.15,
        regularMarketChangePercent: 1.56,
        regularMarketTime: new Date().toISOString(),
        marketCap: 120000000000,
        regularMarketVolume: 22000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      SUZB3: {
        symbol: 'SUZB3',
        shortName: 'Suzano',
        longName: 'Suzano S.A.',
        currency: 'BRL',
        regularMarketPrice: 45.60,
        regularMarketDayHigh: 46.80,
        regularMarketDayLow: 45.10,
        regularMarketChange: -0.80,
        regularMarketChangePercent: -1.72,
        regularMarketTime: new Date().toISOString(),
        marketCap: 160000000000,
        regularMarketVolume: 18000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      JBSS3: {
        symbol: 'JBSS3',
        shortName: 'JBS',
        longName: 'JBS S.A.',
        currency: 'BRL',
        regularMarketPrice: 22.40,
        regularMarketDayHigh: 23.10,
        regularMarketDayLow: 22.00,
        regularMarketChange: 0.60,
        regularMarketChangePercent: 2.75,
        regularMarketTime: new Date().toISOString(),
        marketCap: 140000000000,
        regularMarketVolume: 32000000,
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
        `/quote/${symbolsParam}?range=${range}&interval=${interval}`,
        false // SEM token para ações gratuitas
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
      
      // Em caso de qualquer erro, usar dados mockados
      console.log('API error, using mock data for demonstration');
      return this.getMockPortfolios();
    }
  }

  // Dados mockados para demonstração quando a API estiver indisponível
  private getMockPortfolios(): Portfolio[] {
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
      BBDC4: {
        symbol: 'BBDC4',
        shortName: 'Bradesco',
        longName: 'Banco Bradesco S.A.',
        currency: 'BRL',
        regularMarketPrice: 14.30,
        regularMarketDayHigh: 14.80,
        regularMarketDayLow: 14.10,
        regularMarketChange: -0.15,
        regularMarketChangePercent: -1.04,
        regularMarketTime: new Date().toISOString(),
        marketCap: 150000000000,
        regularMarketVolume: 35000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      ABEV3: {
        symbol: 'ABEV3',
        shortName: 'Ambev',
        longName: 'Ambev S.A.',
        currency: 'BRL',
        regularMarketPrice: 11.85,
        regularMarketDayHigh: 12.20,
        regularMarketDayLow: 11.60,
        regularMarketChange: 0.25,
        regularMarketChangePercent: 2.15,
        regularMarketTime: new Date().toISOString(),
        marketCap: 200000000000,
        regularMarketVolume: 28000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      WEGE3: {
        symbol: 'WEGE3',
        shortName: 'WEG',
        longName: 'WEG S.A.',
        currency: 'BRL',
        regularMarketPrice: 38.90,
        regularMarketDayHigh: 39.50,
        regularMarketDayLow: 38.20,
        regularMarketChange: 1.20,
        regularMarketChangePercent: 3.18,
        regularMarketTime: new Date().toISOString(),
        marketCap: 180000000000,
        regularMarketVolume: 15000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      B3SA3: {
        symbol: 'B3SA3',
        shortName: 'B3',
        longName: 'B3 S.A. - Brasil, Bolsa, Balcão',
        currency: 'BRL',
        regularMarketPrice: 9.75,
        regularMarketDayHigh: 10.20,
        regularMarketDayLow: 9.50,
        regularMarketChange: 0.15,
        regularMarketChangePercent: 1.56,
        regularMarketTime: new Date().toISOString(),
        marketCap: 120000000000,
        regularMarketVolume: 22000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      SUZB3: {
        symbol: 'SUZB3',
        shortName: 'Suzano',
        longName: 'Suzano S.A.',
        currency: 'BRL',
        regularMarketPrice: 45.60,
        regularMarketDayHigh: 46.80,
        regularMarketDayLow: 45.10,
        regularMarketChange: -0.80,
        regularMarketChangePercent: -1.72,
        regularMarketTime: new Date().toISOString(),
        marketCap: 160000000000,
        regularMarketVolume: 18000000,
        logourl: 'https://brapi.dev/favicon.svg',
      },
      JBSS3: {
        symbol: 'JBSS3',
        shortName: 'JBS',
        longName: 'JBS S.A.',
        currency: 'BRL',
        regularMarketPrice: 22.40,
        regularMarketDayHigh: 23.10,
        regularMarketDayLow: 22.00,
        regularMarketChange: 0.60,
        regularMarketChangePercent: 2.75,
        regularMarketTime: new Date().toISOString(),
        marketCap: 140000000000,
        regularMarketVolume: 32000000,
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

  // Limpar cache (útil para testes ou quando necessário)
  clearCache(): void {
    this.cache.clear();
    console.log('Cache cleared');
  }

  // Verificar se há dados em cache
  hasCachedData(endpoint: string): boolean {
    const url = `${BRAPI_BASE_URL}${endpoint}`;
    const cached = this.cache.get(url);
    return cached ? Date.now() - cached.timestamp < this.CACHE_DURATION : false;
  }

  // Métricas de performance do cache
  getStats() {
    return {
      requests: this.requestCount,
      cacheHits: this.cacheHits,
      hitRate: this.requestCount + this.cacheHits > 0 
        ? (this.cacheHits / (this.requestCount + this.cacheHits)) * 100 
        : 0
    };
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