import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { Wallet } from '../../services/firebase/db';
import { theme } from '../../styles/theme';

export interface WalletCardProps {
  wallet: Wallet;
  onPress: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  onPress,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getTotalPercentage = () => {
    return wallet.ativos.reduce((sum, ativo) => sum + ativo.percentual, 0);
  };

  const getMainAsset = () => {
    return wallet.ativos.reduce((prev, current) => 
      prev.percentual > current.percentual ? prev : current
    );
  };

  const mainAsset = getMainAsset();
  const totalPercentage = getTotalPercentage();

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{wallet.nomeCarteira}</Text>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>
                {totalPercentage.toFixed(0)}%
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
        </View>

        <View style={styles.content}>
          {/* Main Asset */}
          <View style={styles.mainAsset}>
            <View style={styles.assetInfo}>
              <Text style={styles.assetTicker}>{mainAsset.ticker}</Text>
              <Text style={styles.assetPercentage}>{mainAsset.percentual}%</Text>
            </View>
            <View style={styles.assetBar}>
              <View 
                style={[
                  styles.assetBarFill, 
                  { width: `${mainAsset.percentual}%` }
                ]} 
              />
            </View>
          </View>

          {/* Other Assets */}
          {wallet.ativos.length > 1 && (
            <View style={styles.otherAssets}>
              <Text style={styles.otherAssetsLabel}>
                +{wallet.ativos.length - 1} outros ativos
              </Text>
            </View>
          )}

          {/* Explanation Preview */}
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationLabel}>Explicação:</Text>
            <Text style={styles.explanationText} numberOfLines={2}>
              {wallet.explicacao}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            Criada em {new Date(wallet.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: totalPercentage === 100 ? theme.colors.success : theme.colors.warning }
            ]} />
            <Text style={styles.statusText}>
              {totalPercentage === 100 ? 'Completa' : 'Incompleta'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  percentageContainer: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  percentageText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  mainAsset: {
    marginBottom: theme.spacing.sm,
  },
  assetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  assetTicker: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  assetPercentage: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  assetBar: {
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  assetBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  otherAssets: {
    marginBottom: theme.spacing.sm,
  },
  otherAssetsLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  explanationContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  explanationLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  explanationText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  dateText: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
