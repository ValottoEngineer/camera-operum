import { StockQuote, BrapiResponse, BrapiError, STOCK_SYMBOLS } from '../types/brapi';

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

  async getStockQuotes(symbols?: string[]): Promise<StockQuote[]> {
    try {
      const symbolsToFetch = symbols || STOCK_SYMBOLS;
      const symbolsParam = symbolsToFetch.join(',');
      
      const response: BrapiResponse = await this.makeRequest(
        `/quote/${symbolsParam}`
      );

      return response.results || [];
    } catch (error) {
      console.error('Error fetching stock quotes:', error);
      throw error;
    }
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
}

export const brapiService = new BrapiService();
