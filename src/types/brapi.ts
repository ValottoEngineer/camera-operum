export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketTime: string;
  marketCap: number;
  regularMarketVolume: number;
  logourl?: string;
}

export interface BrapiResponse {
  results: StockQuote[];
  requestedAt: string;
  took: string;
}

export interface BrapiError {
  message: string;
  status: number;
}

export type StockSymbol = 'PETR4' | 'VALE3' | 'ITUB4' | 'BBDC4' | 'MGLU3';

export const STOCK_SYMBOLS: StockSymbol[] = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'MGLU3'];
