import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/state/authStore';
import { getClientById, deleteClient, getWalletsByClient, Client, Wallet } from '@/services/firebase/db';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/UI/Loading';
import { ErrorView } from '@/components/UI/ErrorView';
import { EmptyState } from '@/components/UI/EmptyState';
import { Button } from '@/components/UI/Button';
import { WalletCard } from '@/components/domain/WalletCard';
import { theme } from '@/styles/theme';
import { AppStackParamList } from '@/app/navigation/types';

type ClientDetailScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'ClientDetail'>;
type ClientDetailScreenRouteProp = RouteProp<AppStackParamList, 'ClientDetail'>;

export const ClientDetailScreen: React.FC = () => {
  const navigation = useNavigation<ClientDetailScreenNavigationProp>();
  const route = useRoute<ClientDetailScreenRouteProp>();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const { clientId } = route.params;

  const [client, setClient] = useState<Client | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [clientData, walletsData] = await Promise.all([
        getClientById(clientId),
        getWalletsByClient(clientId),
      ]);

      if (!clientData) {
        setError('Cliente não encontrado');
        return;
      }

      setClient(clientData);
      setWallets(walletsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadWallets = async () => {
    try {
      setWalletsLoading(true);
      const walletsData = await getWalletsByClient(clientId);
      setWallets(walletsData);
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar carteiras',
        message: err.message,
      });
    } finally {
      setWalletsLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('ClientForm', { clientId });
  };

  const handleDelete = () => {
    if (!client) return;

    Alert.alert(
      'Excluir Cliente',
      `Tem certeza que deseja excluir ${client.nome}? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClient(clientId);
              showToast({
                type: 'success',
                title: 'Cliente excluído',
                message: `${client.nome} foi removido com sucesso`,
              });
              navigation.goBack();
            } catch (err: any) {
              showToast({
                type: 'error',
                title: 'Erro ao excluir',
                message: err.message,
              });
            }
          },
        },
      ]
    );
  };

  const handleCreateWallet = () => {
    navigation.navigate('WalletForm', { clientId });
  };

  const handleWalletPress = (wallet: Wallet) => {
    // TODO: Implementar tela de detalhes da carteira
    showToast({
      type: 'info',
      title: 'Em desenvolvimento',
      message: 'Detalhes da carteira em breve',
    });
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservador':
        return theme.colors.success;
      case 'moderado':
        return theme.colors.warning;
      case 'agressivo':
        return theme.colors.error;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'conservador':
        return 'Conservador';
      case 'moderado':
        return 'Moderado';
      case 'agressivo':
        return 'Agressivo';
      default:
        return risk;
    }
  };

  if (loading) {
    return <Loading variant="fullscreen" message="Carregando cliente..." />;
  }

  if (error || !client) {
    return (
      <ErrorView
        message={error || 'Cliente não encontrado'}
        onActionPress={loadClientData}
        actionTitle="Tentar novamente"
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={theme.colors.white} />
        </View>
        <Text style={styles.name}>{client.nome}</Text>
        <View style={[styles.riskBadge, { backgroundColor: getRiskColor(client.perfilRisco) }]}>
          <Text style={styles.riskText}>
            {getRiskLabel(client.perfilRisco)}
          </Text>
        </View>
      </View>

      {/* Client Info */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="card" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>CPF</Text>
              <Text style={styles.infoValue}>{formatCPF(client.cpf)}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Liquidez Mensal</Text>
              <Text style={styles.infoValue}>{formatCurrency(client.liquidezMensal)}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Cliente desde</Text>
              <Text style={styles.infoValue}>
                {new Date(client.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        </View>

        {/* Objetivos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivos de Investimento</Text>
          <View style={styles.objectivesList}>
            {client.objetivos.map((objetivo, index) => (
              <View key={index} style={styles.objectiveChip}>
                <Text style={styles.objectiveText}>{objetivo}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Carteiras */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Carteiras de Investimento</Text>
            <TouchableOpacity
              style={styles.addWalletButton}
              onPress={handleCreateWallet}
            >
              <Ionicons name="add" size={16} color={theme.colors.primary} />
              <Text style={styles.addWalletText}>Nova Carteira</Text>
            </TouchableOpacity>
          </View>

          {walletsLoading ? (
            <Loading variant="inline" message="Carregando carteiras..." />
          ) : wallets.length === 0 ? (
            <EmptyState
              icon="wallet-outline"
              title="Nenhuma carteira criada"
              message="Crie a primeira carteira de investimento para este cliente"
              actionTitle="Criar Carteira"
              onActionPress={handleCreateWallet}
            />
          ) : (
            <View style={styles.walletsList}>
              {wallets.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  wallet={wallet}
                  onPress={() => handleWalletPress(wallet)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Editar Cliente"
            onPress={handleEdit}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Excluir Cliente"
            onPress={handleDelete}
            variant="outline"
            style={[styles.actionButton, styles.deleteButton]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  riskBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  riskText: {
    ...theme.typography.bodySmall,
    color: theme.colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  infoContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  infoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  objectivesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  objectiveChip: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  objectiveText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  addWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
  },
  addWalletText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  walletsList: {
    gap: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});
