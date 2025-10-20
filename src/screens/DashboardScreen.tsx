import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { GradientContainer } from '../components/GradientContainer';
import { Card } from '../components/Card';
import { SecondaryButton } from '../components/SecondaryButton';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export const DashboardScreen: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1 }}>
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
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing['2xl'],
            paddingBottom: theme.spacing.xl,
          }}
        >
          <Card style={{ marginBottom: theme.spacing.lg }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              Perfil de risco
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.neutral.secondary,
                textAlign: 'center',
              }}
            >
              Análise de perfil de investimento
            </Text>
          </Card>

          <Card style={{ marginBottom: theme.spacing.lg }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              Liquidez
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.neutral.secondary,
                textAlign: 'center',
              }}
            >
              Gestão de fluxo de caixa
            </Text>
          </Card>

          <Card style={{ marginBottom: theme.spacing.lg }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.sm,
              }}
            >
              Recomendações
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.neutral.secondary,
                textAlign: 'center',
              }}
            >
              Sugestões personalizadas
            </Text>
          </Card>

          <SecondaryButton
            title="Sair"
            onPress={handleLogout}
            style={{ marginTop: theme.spacing.xl }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
