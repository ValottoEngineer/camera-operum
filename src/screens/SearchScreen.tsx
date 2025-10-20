import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { GradientContainer } from '../components/GradientContainer';
import { SearchBar } from '../components/SearchBar';
import { StockListItem } from '../components/StockListItem';
import { BackButton } from '../components/BackButton';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { brapiService } from '../services/brapiService';
import { StockQuote } from '../types/brapi';
import { theme } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppStack';

type SearchScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const AVAILABLE_STOCKS = [
  { symbol: 'ITUB4', name: 'Itaú Unibanco', description: 'Banco de investimentos' },
  { symbol: 'PETR4', name: 'Petrobras', description: 'Petróleo e gás' },
  { symbol: 'VALE3', name: 'Vale', description: 'Mineração e commodities' },
  { symbol: 'MGLU3', name: 'Magazine Luiza', description: 'Varejo e e-commerce' },
];

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadStocks = useCallback(async () => {
    try {
      const stockData = await brapiService.getStockQuotes();
      setStocks(stockData);
      setFilteredStocks(stockData);
    } catch (error) {
      console.error('Error loading stocks:', error);
      // O brapiService já retorna dados mockados automaticamente em caso de erro
      setStocks([]);
      setFilteredStocks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStocks(stocks);
      return;
    }

    const filtered = stocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.shortName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadStocks();
  }, [loadStocks]);

  const handleStockPress = (stock: StockQuote) => {
    // Navegar para detalhes da ação (implementar depois)
    console.log('Stock pressed:', stock.symbol);
  };

  const handleFavorite = (stock: StockQuote) => {
    // Implementar sistema de favoritos (implementar depois)
    console.log('Toggle favorite:', stock.symbol);
  };

  const renderLoadingSkeleton = () => (
    <View style={{ paddingHorizontal: theme.spacing.lg }}>
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} style={{ marginBottom: theme.spacing.sm, padding: theme.spacing.lg }}>
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
      <GradientContainer height={200}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.md,
          }}
        >
          <BackButton onPress={() => navigation.goBack()} color={theme.colors.surface} />
        </View>

        <Text
          style={{
            fontSize: theme.typography.sizes['3xl'],
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.surface,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
          }}
        >
          Explorar Ações
        </Text>
        <Text
          style={{
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.surface,
            textAlign: 'center',
          }}
        >
          Encontre as melhores oportunidades
        </Text>
      </GradientContainer>

      <View style={{ flex: 1, paddingTop: theme.spacing['2xl'] }}>
        {/* Barra de busca */}
        <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por símbolo ou nome..."
          />
        </View>

        {/* Lista de ações */}
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            renderLoadingSkeleton()
          ) : (
            <View style={{ paddingHorizontal: theme.spacing.lg }}>
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <StockListItem
                    key={stock.symbol}
                    stock={stock}
                    onPress={() => handleStockPress(stock)}
                    onFavorite={() => handleFavorite(stock)}
                    isFavorite={false} // Implementar sistema de favoritos
                    showFavoriteButton={true}
                  />
                ))
              ) : (
                <Card>
                  <View style={{ alignItems: 'center', padding: theme.spacing.xl }}>
                    <Text style={{ fontSize: 48, marginBottom: theme.spacing.md }}>🔍</Text>
                    <Text
                      style={{
                        fontSize: theme.typography.sizes.lg,
                        fontWeight: theme.typography.weights.medium,
                        color: theme.colors.neutral.primary,
                        marginBottom: theme.spacing.sm,
                        textAlign: 'center',
                      }}
                    >
                      Nenhuma ação encontrada
                    </Text>
                    <Text
                      style={{
                        fontSize: theme.typography.sizes.base,
                        color: theme.colors.neutral.secondary,
                        textAlign: 'center',
                      }}
                    >
                      {searchQuery 
                        ? `Não encontramos resultados para "${searchQuery}"`
                        : 'Tente buscar por símbolo ou nome da empresa'
                      }
                    </Text>
                  </View>
                </Card>
              )}
            </View>
          )}
        </ScrollView>

        {/* Ações disponíveis */}
        <View style={{ padding: theme.spacing.lg, backgroundColor: theme.colors.surface }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.base,
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.md,
            }}
          >
            Ações Disponíveis
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {AVAILABLE_STOCKS.map((stock) => (
              <View
                key={stock.symbol}
                style={{
                  padding: theme.spacing.sm,
                  backgroundColor: theme.colors.neutral.light,
                  borderRadius: theme.borderRadius.md,
                  flex: 1,
                  minWidth: '45%',
                }}
              >
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                    color: theme.colors.neutral.primary,
                  }}
                >
                  {stock.symbol}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.xs,
                    color: theme.colors.neutral.secondary,
                  }}
                >
                  {stock.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
