import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GradientHeader } from '../components/Layout/GradientHeader';
import { Card } from '../components/UI/Card';
import { theme } from '../styles/theme';

interface SimpleHomeScreenProps {
  onLogout: () => void;
}

// Dados mock para demonstração
const mockClientes = [
  {
    id: '1',
    nome: 'João Silva',
    perfilRisco: 'conservador',
    liquidez: 'alta',
    objetivos: 'Aposentadoria segura',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    perfilRisco: 'moderado',
    liquidez: 'média',
    objetivos: 'Compra de imóvel',
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    perfilRisco: 'agressivo',
    liquidez: 'baixa',
    objetivos: 'Crescimento acelerado',
  },
];

export const SimpleHomeScreen: React.FC<SimpleHomeScreenProps> = ({ onLogout }) => {
  const renderCliente = ({ item }: { item: any }) => (
    <Card style={styles.clienteCard}>
      <View style={styles.clienteHeader}>
        <Text style={styles.clienteNome}>{item.nome}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
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

        <View style={styles.objetivosContainer}>
          <Text style={styles.objetivosLabel}>Objetivos:</Text>
          <Text style={styles.objetivosText} numberOfLines={2}>
            {item.objetivos}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Operum"
        onRightPress={onLogout}
        rightText="Sair"
      />

      <View style={styles.content}>
        <FlatList
          data={mockClientes}
          keyExtractor={(item) => item.id}
          renderItem={renderCliente}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
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
