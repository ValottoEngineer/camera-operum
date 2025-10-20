import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { GradientContainer } from '../components/GradientContainer';
import { Card } from '../components/Card';
import { SecondaryButton } from '../components/SecondaryButton';
import { PortfolioCard } from '../components/PortfolioCard';
import { IconButton } from '../components/IconButton';
import { useAuth } from '../context/AuthContext';
import { brapiService } from '../services/brapiService';
import { Portfolio } from '../types/portfolio';
import { theme } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppStack';

type DashboardScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, logout } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadPortfolios = useCallback(async () => {
    try {
      const portfolioData = await brapiService.getPortfolios();
      setPortfolios(portfolioData);
      setUsingMockData(false);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      
      // Se a API falhar, tentar usar dados mockados
      try {
        const mockData = brapiService.getMockPortfolios();
        setPortfolios(mockData);
        setUsingMockData(true);
        Toast.show({
          type: 'info',
          text1: 'Dados de demonstração',
          text2: 'Usando dados simulados para demonstração.',
        });
      } catch (mockError) {
        Toast.show({
          type: 'error',
          text1: 'Erro ao carregar carteiras',
          text2: 'Tente novamente mais tarde.',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPortfolios();
  }, [loadPortfolios]);

  const handleLogout = async () => {
    await logout();
  };

  const handleStockPress = (stock: any) => {
    Toast.show({
      type: 'info',
      text1: `${stock.symbol}`,
      text2: `${stock.shortName}`,
    });
  };

  const renderLoadingSkeleton = () => (
    <View style={{ paddingHorizontal: theme.spacing.lg }}>
      {[1, 2, 3].map((index) => (
        <Card key={index} style={{ marginBottom: theme.spacing.md, padding: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
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
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes['2xl'],
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.neutral.primary,
                }}
              >
                Suas Carteiras de Investimento
              </Text>
              {usingMockData && (
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    color: theme.colors.neon.electric,
                    marginTop: theme.spacing.xs,
                  }}
                >
                  📊 Dados de demonstração
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <IconButton
                iconName="search"
                onPress={() => navigation.navigate('Search')}
                color={theme.colors.neon.electric}
                size="medium"
              />
              
              <IconButton
                iconName="calculator"
                onPress={() => navigation.navigate('Simulator')}
                color={theme.colors.neon.electric}
                size="medium"
              />
              
              <IconButton
                iconName="person"
                onPress={() => navigation.navigate('Profile')}
                color={theme.colors.neon.electric}
                size="medium"
              />
            </View>
          </View>

          {/* Loading state */}
          {loading ? (
            renderLoadingSkeleton()
          ) : (
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              {portfolios.map((portfolio) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  onStockPress={handleStockPress}
                />
              ))}

              {portfolios.length === 0 && (
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
                    Nenhuma carteira disponível
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
