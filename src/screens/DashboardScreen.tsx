import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { GradientContainer } from '../components/GradientContainer';
import { Card } from '../components/Card';
import { SecondaryButton } from '../components/SecondaryButton';
import { StockCard } from '../components/StockCard';
import { useAuth } from '../context/AuthContext';
import { brapiService } from '../services/brapiService';
import { StockQuote } from '../types/brapi';
import { theme } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppStack';

type DashboardScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStocks = useCallback(async () => {
    try {
      const stockData = await brapiService.getStockQuotes();
      setStocks(stockData);
    } catch (error) {
      console.error('Error loading stocks:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao carregar cotações',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStocks();
  }, [loadStocks]);

  const handleLogout = async () => {
    await logout();
  };

  const handleStockPress = (stock: StockQuote) => {
    // Aqui você pode implementar navegação para detalhes da ação
    Toast.show({
      type: 'info',
      text1: `${stock.symbol}`,
      text2: `${stock.shortName}`,
    });
  };

  const renderLoadingSkeleton = () => (
    <View style={{ paddingHorizontal: theme.spacing.lg }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Card key={index} style={{ marginBottom: theme.spacing.sm }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 20,
                  backgroundColor: theme.colors.neutral.border,
                  borderRadius: 4,
                  marginBottom: 8,
                  width: '60%',
                }}
              />
              <View
                style={{
                  height: 14,
                  backgroundColor: theme.colors.neutral.border,
                  borderRadius: 4,
                  width: '80%',
                }}
              />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View
                style={{
                  height: 20,
                  backgroundColor: theme.colors.neutral.border,
                  borderRadius: 4,
                  marginBottom: 8,
                  width: 80,
                }}
              />
              <View
                style={{
                  height: 14,
                  backgroundColor: theme.colors.neutral.border,
                  borderRadius: 4,
                  width: 60,
                }}
              />
            </View>
          </View>
        </Card>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <GradientContainer height={200}>
          <Text
            style={{
              fontSize: theme.typography.sizes['3xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.surface,
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}
          >
            Operum
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.medium,
              color: theme.colors.surface,
              textAlign: 'center',
            }}
          >
            Olá, {currentUser?.name}!
          </Text>
        </GradientContainer>

        <View
          style={{
            flex: 1,
            paddingTop: theme.spacing['2xl'],
            paddingBottom: theme.spacing.xl,
          }}
        >
          {/* Header com navegação */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes['2xl'],
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
              }}
            >
              Cotações em Tempo Real
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.neon.electric,
              }}
            >
              <Text
                style={{
                  color: theme.colors.surface,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                }}
              >
                Perfil
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading state */}
          {loading ? (
            renderLoadingSkeleton()
          ) : (
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onPress={() => handleStockPress(stock)}
                />
              ))}

              {stocks.length === 0 && (
                <Card>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.medium,
                      color: theme.colors.neutral.primary,
                      textAlign: 'center',
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    Nenhuma cotação disponível
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.neutral.secondary,
                      textAlign: 'center',
                    }}
                  >
                    Tente atualizar a página
                  </Text>
                </Card>
              )}
            </View>
          )}

          <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl }}>
            <SecondaryButton
              title="Sair"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
