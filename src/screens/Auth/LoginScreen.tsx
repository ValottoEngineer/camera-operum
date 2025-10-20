import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Loading } from '../../components/UI/Loading';
import { theme } from '../../styles/theme';
import { signIn, signUp, resetPassword } from '../../services/auth';
import { getErrorMessage } from '../../utils/errorMessages';

// Schema de validação para login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema de validação para cadastro
const signUpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormData | SignUpFormData>({
    resolver: zodResolver(isLogin ? loginSchema : signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      onLoginSuccess();
    } catch (error: any) {
      Alert.alert('Erro no Login', getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password);
      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso! Você já pode fazer login.',
        [{ text: 'OK', onPress: () => setIsLogin(true) }]
      );
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt(
      'Esqueci a Senha',
      'Digite seu email para receber instruções de redefinição:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async (email) => {
            if (!email) return;
            
            try {
              setIsLoading(true);
              await resetPassword(email);
              Alert.alert('Sucesso!', 'Email de redefinição enviado!');
            } catch (error: any) {
              Alert.alert('Erro', getErrorMessage(error.message));
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      'plain-text',
      '',
      'email-address'
    );
  };

  const onSubmit = (data: LoginFormData | SignUpFormData) => {
    if (isLogin) {
      handleLogin(data as LoginFormData);
    } else {
      handleSignUp(data as SignUpFormData);
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
                {isLogin ? 'Faça login para continuar' : 'Crie sua conta'}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Digite seu email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    secureTextEntry
                  />
                )}
              />

              {!isLogin && (
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Confirmar Senha"
                      placeholder="Confirme sua senha"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.confirmPassword?.message}
                      secureTextEntry
                    />
                  )}
                />
              )}

              {/* Forgot Password Link */}
              {isLogin && (
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={handleForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>
                    Esqueci a senha
                  </Text>
                </TouchableOpacity>
              )}

              {/* Submit Button */}
              <Button
                title={isLogin ? 'Entrar' : 'Criar Conta'}
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                style={styles.submitButton}
              />

              {/* Toggle Mode */}
              <TouchableOpacity
                style={styles.toggleMode}
                onPress={handleToggleMode}
              >
                <Text style={styles.toggleModeText}>
                  {isLogin
                    ? 'Não tem conta? Criar conta'
                    : 'Já tem conta? Fazer login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Loading visible={isLoading} message="Processando..." />
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginBottom: theme.spacing.lg,
  },
  toggleMode: {
    alignItems: 'center',
  },
  toggleModeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
