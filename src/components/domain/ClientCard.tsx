import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { Client } from '../../services/firebase/db';
import { theme } from '../../styles/theme';

export interface ClientCardProps {
  client: Client;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onPress,
  onEdit,
  onDelete,
}) => {
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

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Cliente',
      `Tem certeza que deseja excluir ${client.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

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
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{client.nome}</Text>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(client.perfilRisco) }]}>
              <Text style={styles.riskText}>
                {getRiskLabel(client.perfilRisco)}
              </Text>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Ionicons name="pencil" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Ionicons name="trash" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="card" size={16} color={theme.colors.textTertiary} />
            <Text style={styles.infoText}>{formatCPF(client.cpf)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="cash" size={16} color={theme.colors.textTertiary} />
            <Text style={styles.infoText}>
              Liquidez: {formatCurrency(client.liquidezMensal)}/mês
            </Text>
          </View>

          <View style={styles.objectivesContainer}>
            <Text style={styles.objectivesLabel}>Objetivos:</Text>
            <View style={styles.objectivesList}>
              {client.objetivos.slice(0, 3).map((objetivo, index) => (
                <View key={index} style={styles.objectiveChip}>
                  <Text style={styles.objectiveText}>{objetivo}</Text>
                </View>
              ))}
              {client.objetivos.length > 3 && (
                <View style={styles.objectiveChip}>
                  <Text style={styles.objectiveText}>
                    +{client.objetivos.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  riskBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  riskText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  objectivesContainer: {
    marginTop: theme.spacing.sm,
  },
  objectivesLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  objectivesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  objectiveChip: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  objectiveText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
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
});
