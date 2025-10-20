import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { StockQuote } from '../types/brapi';
import { brapiService } from '../services/brapiService';
import { theme } from '../styles/theme';

interface StockCardProps {
  stock: StockQuote;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onPress,
  style,
}) => {
  const changeColor = brapiService.getChangeColor(stock.regularMarketChange);
  const isPositive = stock.regularMarketChange > 0;
  const isNegative = stock.regularMarketChange < 0;

  const formatPrice = (price: number) => {
    return brapiService.formatPrice(price);
  };

  const formatPercentage = (percentage: number) => {
    return brapiService.formatPercentage(percentage);
  };

  const formatVolume = (volume: number) => {
    return brapiService.formatVolume(volume);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          borderWidth: 1,
          borderColor: theme.colors.neutral.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.xs,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
            }}
          >
            {stock.symbol}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.neutral.secondary,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {stock.shortName}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
            }}
          >
            {formatPrice(stock.regularMarketPrice)}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
                color: changeColor,
              }}
            >
              {isPositive ? '↗' : isNegative ? '↘' : '→'} {formatPercentage(stock.regularMarketChangePercent)}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          borderTopWidth: 1,
          borderTopColor: theme.colors.neutral.border,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: theme.typography.sizes.xs,
              color: theme.colors.neutral.secondary,
            }}
          >
            Volume
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.neutral.primary,
            }}
          >
            {formatVolume(stock.regularMarketVolume)}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.xs,
              color: theme.colors.neutral.secondary,
            }}
          >
            Market Cap
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.neutral.primary,
            }}
          >
            {formatVolume(stock.marketCap)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
