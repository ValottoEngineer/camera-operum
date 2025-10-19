import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../../state/authStore';
import { getClients, deleteClient, Client } from '../../services/firebase/db';
import { useOnline } from '../../hooks/useOnline';
import { useToast } from '../../hooks/useToast';
import { Loading } from '../../components/UI/Loading';
import { EmptyState } from '../../components/UI/EmptyState';
import { ErrorView } from '../../components/UI/ErrorView';
import { OfflineBanner } from '../../components/UI/OfflineBanner';
import { ClientCard } from '../../components/domain/ClientCard';
import { theme } from '../../styles/theme';
import { AppStackParamList } from '../navigation/types';

type ClientsListScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Tabs'>;

export const ClientsListScreen: React.FC = () => {
  const navigation = useNavigation<ClientsListScreenNavigationProp>();
  const { user } = useAuthStore();
  const { isOnline } = useOnline();
  const { showToast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadClients = async (isRefresh = false) => {
    if (!user) return;

    try {
      setError(null);
      if (isRefresh) {
        setRefreshing(true);
        setLastDoc(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const { clients: newClients, lastDoc: newLastDoc } = await getClients(
        user.uid,
        20,
        isRefresh ? undefined : lastDoc
      );

      if (isRefresh) {
        setClients(newClients);
      } else {
        setClients(prev => [...prev, ...newClients]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newClients.length === 20);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = () => {
    loadClients(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadClients(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.nome.toLowerCase().includes(query.toLowerCase()) ||
        client.cpf.includes(query)
      );
      setFilteredClients(filtered);
    }
  };

  const handleClientPress = (client: Client) => {
    navigation.navigate('ClientDetail', { clientId: client.id! });
  };

  const handleEditClient = (client: Client) => {
    navigation.navigate('ClientForm', { clientId: client.id });
  };

  const handleDeleteClient = async (client: Client) => {
    try {
      await deleteClient(client.id!);
      setClients(prev => prev.filter(c => c.id !== client.id));
      setFilteredClients(prev => prev.filter(c => c.id !== client.id));
      showToast({
        type: 'success',
        title: 'Cliente excluído',
        message: `${client.nome} foi removido com sucesso`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Erro ao excluir',
        message: err.message,
      });
    }
  };

  const navigateToNewClient = () => {
    navigation.navigate('ClientForm', {});
  };

  // Load clients on focus
  useFocusEffect(
    useCallback(() => {
      loadClients(true);
    }, [user])
  );

  // Update filtered clients when clients or search query changes
  useEffect(() => {
    handleSearch(searchQuery);
  }, [clients, searchQuery]);

  if (loading) {
    return <Loading variant="fullscreen" message="Carregando clientes..." />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onActionPress={() => loadClients(true)}
        actionTitle="Tentar novamente"
      />
    );
  }

  const displayClients = searchQuery ? filteredClients : clients;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou CPF..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Clients List */}
      {displayClients.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title={searchQuery ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
          message={
            searchQuery
              ? "Tente ajustar sua busca"
              : "Comece adicionando seu primeiro cliente"
          }
          actionTitle={searchQuery ? undefined : "Adicionar Cliente"}
          onActionPress={searchQuery ? undefined : navigateToNewClient}
        />
      ) : (
        <FlatList
          data={displayClients}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <ClientCard
              client={item}
              onPress={() => handleClientPress(item)}
              onEdit={() => handleEditClient(item)}
              onDelete={() => handleDeleteClient(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMore}>
                <Loading variant="inline" message="Carregando mais..." size="small" />
              </View>
            ) : null
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToNewClient}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>

      {/* Offline Banner */}
      <OfflineBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  loadingMore: {
    paddingVertical: theme.spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
});
