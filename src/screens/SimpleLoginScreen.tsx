import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { theme } from '../styles/theme';

interface SimpleLoginScreenProps {
  onLogin: () => void;
  onGoToSignUp?: () => void;
}

export const SimpleLoginScreen: React.FC<SimpleLoginScreenProps> = ({ onLogin, onGoToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo/Title */}
            <View style={styles.header}>
              <Ionicons
                name="trending-up"
                size={48}
                color={theme.colors.white}
              />
              <Text style={styles.title}>Operum</Text>
              <Text style={styles.subtitle}>
                Faça login para continuar
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Input
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                title="Entrar"
                onPress={handleLogin}
                style={styles.submitButton}
              />

              {onGoToSignUp && (
                <TouchableOpacity
                  style={styles.link}
                  onPress={onGoToSignUp}
                >
                  <Text style={styles.linkText}>Não tem conta? Criar conta</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.white,
    fontWeight: '700',
    marginTop: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  form: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  link: {
    alignItems: 'center',
  },
  linkText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
