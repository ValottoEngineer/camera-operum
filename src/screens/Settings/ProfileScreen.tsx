import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '@/state/authStore';
import { signOutUser } from '@/services/firebase/auth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/UI/Button';
import { Loading } from '@/components/UI/Loading';
import { theme } from '@/styles/theme';
import { AppStackParamList } from '@/app/navigation/types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Tabs'>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user, userProfile, clearAuth } = useAuthStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await signOutUser();
              clearAuth();
              showToast({
                type: 'success',
                title: 'Logout realizado',
                message: 'Até logo!',
              });
            } catch (error: any) {
              showToast({
                type: 'error',
                title: 'Erro ao sair',
                message: error.message,
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openTerms = () => {
    Alert.alert(
      'Termos de Uso',
      'Aqui você encontraria os termos de uso do Operum. Em uma versão completa, este link abriria uma página web ou modal com os termos completos.',
      [{ text: 'OK' }]
    );
  };

  const openPrivacy = () => {
    Alert.alert(
      'Política de Privacidade',
      'Aqui você encontraria a política de privacidade do Operum, incluindo informações sobre LGPD e como seus dados são tratados.',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return <Loading variant="fullscreen" message="Saindo..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={theme.colors.white} />
        </View>
        <Text style={styles.name}>
          {userProfile?.displayName || 'Usuário'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      {/* Profile Info */}
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>
                {userProfile?.displayName || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Membro desde</Text>
              <Text style={styles.infoValue}>
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR')
                  : 'Não disponível'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o App</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Versão</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={theme.colors.textTertiary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Segurança</Text>
              <Text style={styles.infoValue}>LGPD Compliant</Text>
            </View>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={openTerms}>
            <Ionicons name="document-text" size={20} color={theme.colors.textTertiary} />
            <Text style={styles.menuText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={openPrivacy}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.textTertiary} />
            <Text style={styles.menuText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutContainer}>
          <Button
            title="Sair da Conta"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
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
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  name: {
    ...theme.typography.h2,
    color: theme.colors.white,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  signOutContainer: {
    marginTop: theme.spacing.lg,
  },
  signOutButton: {
    borderColor: theme.colors.error,
  },
});
