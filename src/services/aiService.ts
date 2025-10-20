import { brapiService } from './brapiService';

class AIService {
  private conversationHistory: string[] = [];
  private responseCache = new Map<string, string>();

  private offlineResponses = {
    'o que é': 'Desculpe, estou offline no momento. Tente novamente quando tiver conexão com a internet.',
    'como': 'No momento estou sem conexão. Por favor, verifique sua internet e tente novamente.',
    'petr4': 'PETR4 é a ação da Petrobras, uma das maiores empresas de petróleo do Brasil. É uma ação de grande liquidez e muito negociada na B3. É considerada uma ação de commodities e está sujeita às variações do preço do petróleo.',
    'vale3': 'VALE3 é a ação da Vale, uma das maiores mineradoras do mundo. É conhecida por ser uma das principais exportadoras de minério de ferro. É uma ação de commodities e está sujeita às variações dos preços internacionais.',
    'itub4': 'ITUB4 é a ação do Itaú Unibanco, um dos maiores bancos privados do Brasil. É considerada uma ação de dividendos e tem boa liquidez. Bancos são sensíveis à taxa de juros e ao cenário econômico.',
    'mglu3': 'MGLU3 é a ação da Magazine Luiza, uma das maiores varejistas do Brasil. É conhecida por seu forte crescimento no e-commerce. É uma ação de varejo e está sujeita ao consumo interno.',
    'bbdc4': 'BBDC4 é a ação do Banco Bradesco, um dos maiores bancos privados do Brasil. É considerada uma ação de dividendos e tem boa liquidez. Bancos são sensíveis à taxa de juros.',
    'abev3': 'ABEV3 é a ação da Ambev, uma das maiores cervejarias do mundo. É conhecida por marcas como Skol, Brahma e Antarctica. É uma ação de consumo e está sujeita ao consumo interno.',
    'investimento': 'Investimento é o ato de aplicar dinheiro com o objetivo de obter retorno financeiro no futuro. Pode ser feito em ações, fundos, títulos, imóveis, etc. O importante é diversificar e ter paciência.',
    'portfolio': 'Portfolio é o conjunto de investimentos de uma pessoa ou empresa. A diversificação é importante para reduzir riscos. Um bom portfolio deve ter diferentes tipos de ativos.',
    'diversificação': 'Diversificação é a estratégia de espalhar investimentos em diferentes ativos para reduzir o risco total do portfolio. Não coloque todos os ovos na mesma cesta!',
    'ações': 'Ações são pequenas partes de uma empresa que você pode comprar. Quando a empresa vai bem, o valor da ação tende a subir. É importante estudar a empresa antes de investir.',
    'mercado': 'O mercado de ações é onde são negociadas as ações das empresas. No Brasil, a principal bolsa é a B3. É importante entender que o mercado tem ciclos de alta e baixa.',
    'risco': 'Risco é a possibilidade de perder dinheiro em um investimento. Quanto maior o risco, maior o potencial de retorno. É importante investir apenas o que pode perder.',
    'retorno': 'Retorno é o ganho ou perda de um investimento. Pode ser expresso em percentual ou valor absoluto. O retorno esperado deve compensar o risco assumido.',
    'liquidez': 'Liquidez é a facilidade de comprar ou vender um investimento. Ações de grandes empresas têm mais liquidez. É importante para conseguir sair do investimento quando necessário.',
    'dividendos': 'Dividendos são parte do lucro da empresa distribuída aos acionistas. Ações que pagam dividendos são boas para quem busca renda passiva.',
    'análise': 'Análise de investimentos pode ser fundamentalista (estudar a empresa) ou técnica (estudar gráficos). Ambas são importantes para tomar decisões informadas.',
    'b3': 'B3 é a bolsa de valores do Brasil, onde são negociadas as ações das empresas brasileiras. É a terceira maior bolsa da América Latina.',
    'ibovespa': 'Ibovespa é o principal índice da B3, que acompanha as principais ações negociadas. É usado como referência do desempenho do mercado brasileiro.',
    default: 'Estou temporariamente indisponível. Tente novamente em alguns instantes ou faça uma pergunta mais específica sobre investimentos.',
  };

  async chat(userMessage: string): Promise<string> {
    // Verificar cache primeiro
    const cacheKey = userMessage.toLowerCase().trim();
    if (this.responseCache.has(cacheKey)) {
      console.log('Using cached response');
      return this.responseCache.get(cacheKey)!;
    }

    // Adicionar contexto financeiro se necessário
    const context = await this.getFinancialContext(userMessage);
    const messageWithContext = context ? `${context}\n\n${userMessage}` : userMessage;
    
    // Adicionar ao histórico
    this.conversationHistory.push(userMessage);
    
    // Manter apenas últimas 5 mensagens
    if (this.conversationHistory.length > 5) {
      this.conversationHistory = this.conversationHistory.slice(-5);
    }

    // Sistema de resposta inteligente
    const message = messageWithContext.toLowerCase();
    
    // Procurar por ações específicas (mais específico primeiro)
    const stockSymbols = ['petr4', 'vale3', 'itub4', 'mglu3', 'bbdc4', 'abev3', 'wege3', 'b3sa3', 'suzb3', 'jbss3'];
    const stockMatch = stockSymbols.find(symbol => message.includes(symbol));
    
    if (stockMatch) {
      const response = this.offlineResponses[stockMatch as keyof typeof this.offlineResponses];
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    // Procurar por conceitos financeiros (ordem de prioridade)
    const financialConcepts = [
      'investimento', 'portfolio', 'diversificação', 'ações', 'mercado', 
      'risco', 'retorno', 'liquidez', 'dividendos', 'análise', 'b3', 'ibovespa'
    ];
    
    const conceptMatch = financialConcepts.find(concept => message.includes(concept));
    
    if (conceptMatch) {
      const response = this.offlineResponses[conceptMatch as keyof typeof this.offlineResponses];
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    // Procurar por palavras-chave gerais
    if (message.includes('o que é') || message.includes('o que significa')) {
      const response = 'Para explicar melhor, você pode ser mais específico? Por exemplo: "O que é PETR4?" ou "O que é diversificação?"';
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    if (message.includes('como') && message.includes('investir')) {
      const response = 'Para começar a investir, recomendo: 1) Estabelecer objetivos claros, 2) Definir seu perfil de risco, 3) Diversificar os investimentos, 4) Começar com valores pequenos. Lembre-se: nunca invista dinheiro que não pode perder!';
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    if (message.includes('melhor') || message.includes('recomend')) {
      const response = 'Não posso dar recomendações específicas de investimento, pois cada pessoa tem objetivos e perfil de risco diferentes. Recomendo consultar um assessor de investimentos qualificado.';
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    if (message.includes('ajuda') || message.includes('help')) {
      const response = 'Posso te ajudar com:\n• Explicações sobre ações (PETR4, VALE3, ITUB4, MGLU3, etc.)\n• Conceitos de investimento (diversificação, portfolio, risco)\n• Estratégias básicas de investimento\n• Dúvidas sobre o mercado financeiro\n\nFaça uma pergunta específica!';
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    if (message.includes('obrigado') || message.includes('valeu') || message.includes('thanks')) {
      const response = 'De nada! 😊 Fico feliz em ajudar. Se tiver mais dúvidas sobre investimentos, é só perguntar!';
      this.responseCache.set(cacheKey, response);
      return response;
    }
    
    // Fallback genérico
    const response = this.offlineResponses.default;
    this.responseCache.set(cacheKey, response);
    return response;
  }

  private async getFinancialContext(message: string): Promise<string | null> {
    // Detectar se a mensagem menciona ações específicas
    const stockSymbols = ['PETR4', 'VALE3', 'MGLU3', 'ITUB4', 'BBDC4', 'ABEV3', 'WEGE3', 'B3SA3', 'SUZB3', 'JBSS3'];
    const mentionedStocks = stockSymbols.filter(symbol => 
      message.toUpperCase().includes(symbol)
    );

    if (mentionedStocks.length > 0) {
      try {
        const quotes = await brapiService.getStockQuotes(mentionedStocks);
        const context = quotes.map(stock => 
          `${stock.symbol}: R$ ${stock.regularMarketPrice.toFixed(2)} (${stock.regularMarketChangePercent > 0 ? '+' : ''}${stock.regularMarketChangePercent.toFixed(2)}%)`
        ).join(', ');
        
        return `Dados atuais: ${context}`;
      } catch (error) {
        return null;
      }
    }

    return null;
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  clearCache() {
    this.responseCache.clear();
  }
}

export const aiService = new AIService();
