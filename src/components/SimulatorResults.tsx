import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from './Card';
import { SimpleLineChart } from './charts/SimpleLineChart';
import { theme } from '../styles/theme';
import { SimulatorResults as SimulatorResultsType } from '../types/simulator';
import { formatCurrency, formatPercentage } from '../utils/investmentCalculations';

interface SimulatorResultsProps {
  results: SimulatorResultsType;
  loading?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export const SimulatorResults: React.FC<SimulatorResultsProps> = ({
  results,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={{ padding: theme.spacing.lg }}>
        <Card>
          <View style={{ alignItems: 'center', padding: theme.spacing.xl }}>
            <Text style={{ fontSize: theme.typography.sizes.lg, color: theme.colors.neutral.secondary }}>
              Calculando simulação...
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  // Preparar dados para o gráfico
  const investedData = results.projectedGrowth.map(g => ({
    x: g.year,
    y: g.invested,
  }));

  const valueData = results.projectedGrowth.map(g => ({
    x: g.year,
    y: g.value,
  }));

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: theme.spacing.lg }}>
        {/* Resumo Principal */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            Projeção de Retorno
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: theme.spacing.lg }}>
            {/* Total Investido */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Ionicons name="cash" size={24} color={theme.colors.neon.purple} style={{ marginBottom: theme.spacing.xs }} />
              <Text
                style={{
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.neutral.primary,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {formatCurrency(results.totalInvested)}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.neutral.secondary,
                  textAlign: 'center',
                }}
              >
                Total Investido
              </Text>
            </View>

            {/* Rendimento */}
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Ionicons name="trending-up" size={24} color={theme.colors.success} style={{ marginBottom: theme.spacing.xs }} />
              <Text
                style={{
                  fontSize: theme.typography.sizes.lg,
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.success,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {formatCurrency(results.totalReturn)}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.neutral.secondary,
                  textAlign: 'center',
                }}
              >
                Rendimento
              </Text>
            </View>
          </View>

          {/* Valor Final */}
          <View
            style={{
              backgroundColor: theme.colors.neon.electric,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              alignItems: 'center',
            }}
          >
            <Ionicons name="target" size={24} color={theme.colors.neon.electric} style={{ marginBottom: theme.spacing.sm }} />
            <Text
              style={{
                fontSize: theme.typography.sizes['2xl'],
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.surface,
                marginBottom: theme.spacing.xs,
              }}
            >
              {formatCurrency(results.finalValue)}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.base,
                color: theme.colors.surface,
                textAlign: 'center',
              }}
            >
              Valor Final Projetado
            </Text>
          </View>
        </Card>

        {/* Gráfico de Evolução */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.lg,
              textAlign: 'center',
            }}
          >
            Evolução do Patrimônio
          </Text>
          
          <View style={{ alignItems: 'center', marginVertical: theme.spacing.md }}>
            <SimpleLineChart
              data={investedData}
              width={screenWidth - (theme.spacing.lg * 2) - (theme.spacing.md * 2)}
              height={200}
              color="#2196F3"
              showDots={false}
            />
            <Text style={{ fontSize: 12, color: theme.colors.neutral.secondary, marginTop: theme.spacing.xs }}>
              Investido (azul) vs Valor Final (roxo)
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: theme.spacing.lg }}>
              <View
                style={{
                  width: 12,
                  height: 3,
                  backgroundColor: '#2196F3',
                  marginRight: theme.spacing.xs,
                }}
              />
              <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.neutral.secondary }}>
                Investido
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 3,
                  backgroundColor: '#9C27B0',
                  marginRight: theme.spacing.xs,
                }}
              />
              <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.neutral.secondary }}>
                Valor Final
              </Text>
            </View>
          </View>
        </Card>

        {/* Alocação por Ação */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Distribuição da Carteira
          </Text>
          
          {results.stockAllocation.map((stock, index) => (
            <View
              key={stock.symbol}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing.md,
                borderBottomWidth: index < results.stockAllocation.length - 1 ? 1 : 0,
                borderBottomColor: theme.colors.neutral.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.semibold,
                    color: theme.colors.neutral.primary,
                  }}
                >
                  {stock.symbol}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    color: theme.colors.neutral.secondary,
                  }}
                >
                  {stock.name}
                </Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.semibold,
                    color: theme.colors.neutral.primary,
                  }}
                >
                  {formatCurrency(stock.amount)}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    color: theme.colors.neutral.secondary,
                  }}
                >
                  {formatPercentage(stock.percentage)} • {formatPercentage(stock.expectedReturn * 100)}/ano
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Breakdown Mensal (Últimos 12 meses) */}
        <Card>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Evolução Mensal (Últimos 12 meses)
          </Text>
          
          {results.monthlyBreakdown.slice(-12).map((month, index) => (
            <View
              key={month.month}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: theme.spacing.sm,
                borderBottomWidth: index < 11 ? 1 : 0,
                borderBottomColor: theme.colors.neutral.border,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium,
                    color: theme.colors.neutral.primary,
                  }}
                >
                  Mês {month.month}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.xs,
                    color: theme.colors.neutral.secondary,
                  }}
                >
                  Investido: {formatCurrency(month.invested)}
                </Text>
              </View>
              
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                    color: month.return >= 0 ? theme.colors.success : theme.colors.error,
                  }}
                >
                  {formatCurrency(month.value)}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.xs,
                    color: month.return >= 0 ? theme.colors.success : theme.colors.error,
                  }}
                >
                  {formatPercentage(month.returnPercent)}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Disclaimer */}
        <View
          style={{
            backgroundColor: theme.colors.neon.electric + '20',
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginTop: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.neutral.secondary,
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Lembre-se: Esta é uma projeção baseada em retornos históricos. 
            Investimentos reais podem ter variações e riscos.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
