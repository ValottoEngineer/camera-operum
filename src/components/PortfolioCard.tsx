import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Portfolio } from '../types/portfolio';
import { StockCard } from './StockCard';
import { brapiService } from '../services/brapiService';
import { RISK_LEVELS } from '../types/portfolio';
import { theme } from '../styles/theme';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onStockPress?: (stock: any) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolio,
  onStockPress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const riskLevel = RISK_LEVELS[portfolio.riskProfile];
  const averageReturnColor = brapiService.getChangeColor(portfolio.metrics.averageReturn);

  const formatCurrency = (value: number) => {
    return brapiService.formatPrice(value);
  };

  const formatPercentage = (value: number) => {
    return brapiService.formatPercentage(value);
  };

  const formatVolume = (value: number) => {
    return brapiService.formatVolume(value);
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        borderWidth: 2,
        borderColor: portfolio.color,
        ...theme.shadows.md,
      }}
    >
      {/* Header da Carteira */}
      <TouchableOpacity
        onPress={toggleExpanded}
        style={{
          padding: theme.spacing.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                marginRight: theme.spacing.sm,
              }}
            >
              {portfolio.name}
            </Text>
            <View
              style={{
                backgroundColor: portfolio.color,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: 2,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.sizes.xs,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.surface,
                }}
              >
                {riskLevel.label}
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.neutral.secondary,
              marginBottom: theme.spacing.xs,
            }}
          >
            {portfolio.description}
          </Text>

          <Text
            style={{
              fontSize: theme.typography.sizes.xs,
              color: theme.colors.neutral.secondary,
            }}
          >
            {portfolio.objective}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: averageReturnColor,
              marginBottom: theme.spacing.xs,
            }}
          >
            {formatPercentage(portfolio.metrics.averageReturn)}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.xs,
              color: theme.colors.neutral.secondary,
            }}
          >
            Retorno Médio
          </Text>
        </View>
      </TouchableOpacity>

      {/* Conteúdo Expansível */}
      <Animated.View
        style={{
          maxHeight: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000], // Valor alto para permitir expansão completa
          }),
          overflow: 'hidden',
        }}
      >
        <View style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg }}>
          {/* Métricas da Carteira */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.lg,
              paddingTop: theme.spacing.md,
              borderTopWidth: 1,
              borderTopColor: theme.colors.neutral.border,
            }}
          >
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.neutral.primary,
                }}
              >
                {portfolio.stocks.length} Ações
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.xs,
                  color: theme.colors.neutral.secondary,
                }}
              >
                Total
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.neutral.primary,
                }}
              >
                {formatVolume(portfolio.metrics.totalVolume)}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.xs,
                  color: theme.colors.neutral.secondary,
                }}
              >
                Volume
              </Text>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.neutral.primary,
                }}
              >
                {formatVolume(portfolio.metrics.totalMarketCap)}
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.xs,
                  color: theme.colors.neutral.secondary,
                }}
              >
                Market Cap
              </Text>
            </View>
          </View>

          {/* Melhor e Pior Ação */}
          {(portfolio.metrics.bestStock || portfolio.metrics.worstStock) && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.lg,
              }}
            >
              {portfolio.metrics.bestStock && (
                <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.xs,
                      color: theme.colors.neutral.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Melhor Performance
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                      color: '#4CAF50',
                    }}
                  >
                    {portfolio.metrics.bestStock.symbol} ({formatPercentage(portfolio.metrics.bestStock.regularMarketChangePercent)})
                  </Text>
                </View>
              )}

              {portfolio.metrics.worstStock && (
                <View style={{ flex: 1, marginLeft: theme.spacing.sm }}>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.xs,
                      color: theme.colors.neutral.secondary,
                      marginBottom: 2,
                    }}
                  >
                    Menor Performance
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                      color: '#F44336',
                    }}
                  >
                    {portfolio.metrics.worstStock.symbol} ({formatPercentage(portfolio.metrics.worstStock.regularMarketChangePercent)})
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Lista de Ações */}
          <View>
            <Text
              style={{
                fontSize: theme.typography.sizes.base,
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.neutral.primary,
                marginBottom: theme.spacing.md,
              }}
            >
              Ações da Carteira
            </Text>
            
            {portfolio.stocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                onPress={() => onStockPress?.(stock)}
                style={{ marginBottom: theme.spacing.sm }}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
