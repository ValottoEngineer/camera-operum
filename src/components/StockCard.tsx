import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StockQuote } from '../types/brapi';
import { brapiService } from '../services/brapiService';
import { theme } from '../styles/theme';

const FREE_STOCKS = ['PETR4', 'VALE3', 'MGLU3', 'ITUB4'];

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
  const isRealData = FREE_STOCKS.includes(stock.symbol);

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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
              }}
            >
              {stock.symbol}
            </Text>
            {isRealData && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#10B981',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                marginLeft: 8,
              }}>
                <Ionicons name="cloud-done" size={10} color="white" />
                <Text style={{
                  fontSize: 10,
                  color: 'white',
                  fontWeight: '600',
                  marginLeft: 2,
                }}>
                  Real
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: theme.typography.sizes.sm,
              color: theme.colors.neutral.secondary,
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
