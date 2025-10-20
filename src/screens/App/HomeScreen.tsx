import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { GradientHeader } from '../../components/Layout/GradientHeader';
import { Card } from '../../components/UI/Card';
import { Loading } from '../../components/UI/Loading';
import { theme } from '../../styles/theme';
import { Cliente, AppStackParamList } from '../../types';
import { listenClientes, deleteCliente } from '../../services/db';
import { signOut } from '../../services/auth';
import { getErrorMessage } from '../../utils/errorMessages';

type HomeScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Home'>;

interface HomeScreenProps {
  userId: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userId }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = listenClientes(userId, (clientesData) => {
      setClientes(clientesData);
      setIsLoading(false);
      setIsRefreshing(false);
    });

    return unsubscribe;
  }, [userId]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // O listener já vai atualizar automaticamente
  };

  const handleAddCliente = () => {
    navigation.navigate('ClienteForm', {});
  };

  const handleEditCliente = (cliente: Cliente) => {
    navigation.navigate('ClienteForm', { cliente });
  };

  const handleDeleteCliente = (cliente: Cliente) => {
    Alert.alert(
      'Excluir Cliente',
      `Tem certeza que deseja excluir ${cliente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCliente(userId, cliente.id);
            } catch (error: any) {
              Alert.alert('Erro', getErrorMessage(error.message));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Erro', getErrorMessage(error.message));
            }
          },
        },
      ]
    );
  };

  const renderCliente = ({ item }: { item: Cliente }) => (
    <Card
      style={styles.clienteCard}
      onPress={() => handleEditCliente(item)}
    >
      <View style={styles.clienteHeader}>
        <Text style={styles.clienteNome}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCliente(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.colors.error}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.clienteInfo}>
        <View style={styles.infoRow}>
          <Ionicons
            name="trending-up"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.infoLabel}>Perfil de Risco:</Text>
          <Text style={[
            styles.infoValue,
            { color: getPerfilRiscoColor(item.perfilRisco) }
          ]}>
            {item.perfilRisco.charAt(0).toUpperCase() + item.perfilRisco.slice(1)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="water"
            size={16}
            color={theme.colors.info}
          />
          <Text style={styles.infoLabel}>Liquidez:</Text>
          <Text style={[
            styles.infoValue,
            { color: getLiquidezColor(item.liquidez) }
          ]}>
            {item.liquidez.charAt(0).toUpperCase() + item.liquidez.slice(1)}
          </Text>
        </View>

        {item.objetivos && (
          <View style={styles.objetivosContainer}>
            <Text style={styles.objetivosLabel}>Objetivos:</Text>
            <Text style={styles.objetivosText} numberOfLines={2}>
              {item.objetivos}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="people-outline"
        size={64}
        color={theme.colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>Nenhum cliente cadastrado</Text>
      <Text style={styles.emptySubtitle}>
        Toque no botão + para adicionar seu primeiro cliente
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <GradientHeader
          title="Operum"
          onRightPress={handleLogout}
          rightText="Sair"
        />
        <Loading visible={true} message="Carregando clientes..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Operum"
        onRightPress={handleLogout}
        rightText="Sair"
      />

      <View style={styles.content}>
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          renderItem={renderCliente}
          contentContainerStyle={[
            styles.listContainer,
            clientes.length === 0 && styles.emptyListContainer,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddCliente}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add"
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper functions
const getPerfilRiscoColor = (perfil: string) => {
  switch (perfil) {
    case 'conservador':
      return theme.colors.success;
    case 'moderado':
      return theme.colors.warning;
    case 'agressivo':
      return theme.colors.error;
    default:
      return theme.colors.textSecondary;
  }
};

const getLiquidezColor = (liquidez: string) => {
  switch (liquidez) {
    case 'baixa':
      return theme.colors.error;
    case 'média':
      return theme.colors.warning;
    case 'alta':
      return theme.colors.success;
    default:
      return theme.colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  clienteCard: {
    marginBottom: theme.spacing.md,
  },
  clienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  clienteNome: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  deleteButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  clienteInfo: {
    gap: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginLeft: 'auto',
  },
  objetivosContainer: {
    marginTop: theme.spacing.sm,
  },
  objetivosLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  objetivosText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
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
