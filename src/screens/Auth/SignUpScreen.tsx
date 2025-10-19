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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { useAuthStore } from '../../state/authStore';
import { signUp } from '../../services/firebase/auth';
import { useToast } from '../../hooks/useToast';
import { theme } from '../../styles/theme';
import { AuthStackParamList } from '../navigation/types';

type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  acceptedTerms: z.boolean().refine((val) => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      acceptedTerms: false,
    },
  });

  const acceptedTerms = watch('acceptedTerms');

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      const user = await signUp(data.email, data.password, data.displayName);
      setUser(user);
      showToast({
        type: 'success',
        title: 'Conta criada com sucesso!',
        message: 'Bem-vindo ao Operum',
      });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao criar conta',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <LinearGradient
      colors={theme.colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Operum</Text>
              <Text style={styles.subtitle}>
                Crie sua conta e comece a investir
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.formTitle}>Criar Conta</Text>
              
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Nome completo"
                    placeholder="Seu nome completo"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.displayName?.message}
                    leftIcon="person-outline"
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email"
                    placeholder="seu@email.com"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Senha"
                    placeholder="Mínimo 6 caracteres"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    leftIcon="lock-closed-outline"
                    secureTextEntry
                    autoComplete="password"
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Confirmar senha"
                    placeholder="Digite a senha novamente"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    leftIcon="lock-closed-outline"
                    secureTextEntry
                    autoComplete="password"
                  />
                )}
              />

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <Controller
                  control={control}
                  name="acceptedTerms"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => onChange(!value)}
                    >
                      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                        {value && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.termsText}>
                        Li e concordo com os{' '}
                        <Text style={styles.termsLink}>termos de uso</Text> e{' '}
                        <Text style={styles.termsLink}>política de privacidade</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                {errors.acceptedTerms && (
                  <Text style={styles.errorText}>{errors.acceptedTerms.message}</Text>
                )}
              </View>

              <Button
                title="Criar conta"
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                disabled={loading || !acceptedTerms}
                style={styles.submitButton}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta?</Text>
                <Button
                  title="Entrar"
                  onPress={navigateToSignIn}
                  variant="outline"
                  size="small"
                />
              </View>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.white,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  formTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  termsContainer: {
    marginVertical: theme.spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
