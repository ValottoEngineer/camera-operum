import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './Card';
import { theme } from '../styles/theme';
import { StockQuote } from '../types/brapi';

interface StockListItemProps {
  stock: StockQuote;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export const StockListItem: React.FC<StockListItemProps> = ({
  stock,
  onPress,
  onFavorite,
  isFavorite = false,
  showFavoriteButton = true,
}) => {
  const changeColor = stock.regularMarketChangePercent && stock.regularMarketChangePercent >= 0 
    ? theme.colors.success 
    : theme.colors.error;

  const changeIcon = stock.regularMarketChangePercent && stock.regularMarketChangePercent >= 0 
    ? '📈' 
    : '📉';

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.leftContent}>
          <View style={styles.symbolContainer}>
            <Text style={styles.symbol}>{stock.symbol}</Text>
            <Text style={styles.shortName}>{stock.shortName}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              R$ {stock.regularMarketPrice?.toFixed(2) || 'N/A'}
            </Text>
            <View style={styles.changeContainer}>
              <Text style={styles.changeIcon}>{changeIcon}</Text>
              <Text style={[styles.change, { color: changeColor }]}>
                {stock.regularMarketChange?.toFixed(2) || '0.00'} 
                ({stock.regularMarketChangePercent?.toFixed(2) || '0.00'}%)
              </Text>
            </View>
          </View>
        </View>

        {showFavoriteButton && onFavorite && (
          <TouchableOpacity
            onPress={onFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? theme.colors.neon.pink : theme.colors.neutral.border}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  symbol: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.neutral.primary,
    marginBottom: theme.spacing.xs,
  },
  shortName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.neutral.secondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.neutral.primary,
    marginBottom: theme.spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    fontSize: 12,
    marginRight: theme.spacing.xs,
  },
  change: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  favoriteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});
