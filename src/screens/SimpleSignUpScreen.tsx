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

interface SimpleSignUpScreenProps {
  onSignedUp: () => void;
  onGoToLogin?: () => void;
}

export const SimpleSignUpScreen: React.FC<SimpleSignUpScreenProps> = ({ onSignedUp, onGoToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim()) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Formato de email inválido';
    if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    if (password !== confirmPassword) return 'Senhas não coincidem';
    return null;
  };

  const handleSignUp = () => {
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    // Mock de cadastro bem-sucedido no web
    onSignedUp();
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
            <View style={styles.header}>
              <Ionicons name="person-add" size={48} color={theme.colors.white} />
              <Text style={styles.title}>Criar conta</Text>
              <Text style={styles.subtitle}>Preencha os campos para continuar</Text>
            </View>

            <View style={styles.form}>
              {!!error && <Text style={styles.error}>{error}</Text>}

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

              <Input
                label="Confirmar senha"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <Button
                title="Criar conta"
                onPress={handleSignUp}
                style={styles.submitButton}
              />

              {onGoToLogin && (
                <TouchableOpacity style={styles.link} onPress={onGoToLogin}>
                  <Text style={styles.linkText}>Já tem conta? Fazer login</Text>
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
  error: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
});
