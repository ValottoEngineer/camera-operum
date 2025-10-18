import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/state/authStore';
import { getClients } from '@/services/firebase/db';
import { useOnline } from '@/hooks/useOnline';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components/UI/Loading';
import { ErrorView } from '@/components/UI/ErrorView';
import { OfflineBanner } from '@/components/UI/OfflineBanner';
import { theme } from '@/styles/theme';
import { AppStackParamList } from '@/app/navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Tabs'>;

interface Stats {
  totalClients: number;
  totalWallets: number;
}

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, userProfile } = useAuthStore();
  const { isOnline } = useOnline();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState<Stats>({ totalClients: 0, totalWallets: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (!user) return;

    try {
      setError(null);
      const { clients } = await getClients(user.uid, 100);
      setStats({
        totalClients: clients.length,
        totalWallets: 0, // TODO: Implementar contagem de carteiras
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const navigateToClients = () => {
    navigation.navigate('Clients');
  };

  const navigateToWalletForm = () => {
    navigation.navigate('WalletForm', {});
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) {
    return <Loading variant="fullscreen" message="Carregando dados..." />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onActionPress={loadStats}
        actionTitle="Tentar novamente"
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {userProfile?.displayName || 'Usuário'}!
            </Text>
            <Text style={styles.subtitle}>
              Gerencie seus clientes e carteiras de investimento
            </Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={theme.colors.white} />
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="people" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.statNumber}>{stats.totalClients}</Text>
          <Text style={styles.statLabel}>Clientes</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="wallet" size={24} color={theme.colors.secondary} />
          </View>
          <Text style={styles.statNumber}>{stats.totalWallets}</Text>
          <Text style={styles.statLabel}>Carteiras</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToClients}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Ionicons name="people" size={32} color={theme.colors.white} />
            <Text style={styles.actionTitle}>Meus Clientes</Text>
            <Text style={styles.actionDescription}>
              Gerencie seus clientes e seus perfis de investimento
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={navigateToWalletForm}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.accent, theme.colors.info]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionGradient}
          >
            <Ionicons name="wallet" size={32} color={theme.colors.white} />
            <Text style={styles.actionTitle}>Simular Carteira</Text>
            <Text style={styles.actionDescription}>
              Crie e simule carteiras de investimento
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Offline Banner */}
      <OfflineBanner />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.white,
    fontWeight: '600',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statNumber: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionsContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  actionCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  actionGradient: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  actionTitle: {
    ...theme.typography.h3,
    color: theme.colors.white,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  actionDescription: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
  },
});
