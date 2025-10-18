export type PerfilRisco = 'conservador' | 'moderado' | 'agressivo';

export interface Ativo {
  ticker: string;
  percentual: number;
}

export interface ClienteInfo {
  perfilRisco: PerfilRisco;
  liquidezMensal: number;
}

/**
 * Gera explicação inteligente da carteira baseada no perfil de risco e ativos
 */
export const generateWalletExplanation = (
  cliente: ClienteInfo,
  ativos: Ativo[]
): string => {
  const { perfilRisco, liquidezMensal } = cliente;
  
  // Ordenar ativos por percentual (maior para menor)
  const ativosOrdenados = [...ativos].sort((a, b) => b.percentual - a.percentual);
  
  // Identificar principais ativos
  const principalAtivo = ativosOrdenados[0];
  const segundoAtivo = ativosOrdenados[1];
  
  // Gerar explicação baseada no perfil
  let explicacao = '';
  
  // Introdução baseada no perfil
  const introducoes = {
    conservador: 'Esta carteira conservadora foi estruturada pensando em preservar seu capital e gerar renda estável.',
    moderado: 'Esta carteira moderada busca equilibrar segurança e crescimento, ideal para investidores que buscam retornos consistentes.',
    agressivo: 'Esta carteira agressiva foi desenhada para maximizar retornos a longo prazo, assumindo maior volatilidade.',
  };
  
  explicacao += introducoes[perfilRisco] + '\n\n';
  
  // Análise dos principais ativos
  explicacao += `**Composição Principal:**\n`;
  explicacao += `• ${principalAtivo.ticker} (${principalAtivo.percentual}%) - Ativo principal da carteira\n`;
  
  if (segundoAtivo && segundoAtivo.percentual > 10) {
    explicacao += `• ${segundoAtivo.ticker} (${segundoAtivo.percentual}%) - Segundo maior posicionamento\n`;
  }
  
  // Diversificação
  const numAtivos = ativos.length;
  if (numAtivos >= 3) {
    explicacao += `• Diversificação em ${numAtivos} ativos para reduzir riscos\n`;
  }
  
  explicacao += '\n';
  
  // Recomendações baseadas no perfil e liquidez
  explicacao += `**Recomendações:**\n`;
  
  if (perfilRisco === 'conservador') {
    explicacao += `• Foco em preservação de capital e renda estável\n`;
    explicacao += `• Ideal para investidores que priorizam segurança\n`;
    if (liquidezMensal < 1000) {
      explicacao += `• Com sua liquidez mensal de R$ ${liquidezMensal.toLocaleString('pt-BR')}, considere aportes regulares para maximizar os resultados\n`;
    }
  } else if (perfilRisco === 'moderado') {
    explicacao += `• Equilíbrio entre crescimento e estabilidade\n`;
    explicacao += `• Adequado para investidores com horizonte de médio prazo\n`;
    if (liquidezMensal >= 2000) {
      explicacao += `• Sua liquidez mensal de R$ ${liquidezMensal.toLocaleString('pt-BR')} permite diversificação adicional\n`;
    }
  } else {
    explicacao += `• Estratégia focada em crescimento de longo prazo\n`;
    explicacao += `• Adequado para investidores com alta tolerância ao risco\n`;
    if (liquidezMensal >= 5000) {
      explicacao += `• Com liquidez de R$ ${liquidezMensal.toLocaleString('pt-BR')}, considere estratégias mais sofisticadas\n`;
    }
  }
  
  // Considerações sobre liquidez
  if (liquidezMensal < 500) {
    explicacao += `• Considere aumentar sua capacidade de investimento mensal para melhorar os resultados\n`;
  } else if (liquidezMensal > 10000) {
    explicacao += `• Com alta liquidez, considere diversificar em outras classes de ativos\n`;
  }
  
  explicacao += '\n';
  
  // Aviso de risco
  explicacao += `**⚠️ Importante:** Esta é uma recomendação educativa. Consulte sempre um profissional qualificado antes de investir.`;
  
  return explicacao;
};

/**
 * Gera explicação resumida para cards
 */
export const generateShortExplanation = (
  perfilRisco: PerfilRisco,
  ativos: Ativo[]
): string => {
  const principalAtivo = ativos.reduce((prev, current) => 
    prev.percentual > current.percentual ? prev : current
  );
  
  const explicacoes = {
    conservador: `Carteira conservadora focada em ${principalAtivo.ticker} (${principalAtivo.percentual}%)`,
    moderado: `Estratégia moderada com ${principalAtivo.ticker} (${principalAtivo.percentual}%) como principal`,
    agressivo: `Carteira agressiva liderada por ${principalAtivo.ticker} (${principalAtivo.percentual}%)`,
  };
  
  return explicacoes[perfilRisco];
};
