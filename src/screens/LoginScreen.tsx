import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { GradientContainer } from '../components/GradientContainer';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { InlineLink } from '../components/InlineLink';
import { useAuth } from '../context/AuthContext';
import { loginSchema, LoginFormData } from '../validation/schemas';
import { theme } from '../styles/theme';
import { AuthStackParamList } from '../navigation/AuthStack';

import { startFaceSession, getFaceStatus, cancelFaceSession } from '../services/httpFace';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // estado do login facial
  const [isFaceLoading, setIsFaceLoading] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        Toast.show({ type: 'success', text1: 'Login realizado', text2: 'Bem-vindo ao Operum!' });
      } else {
        Toast.show({ type: 'error', text1: 'Erro no login', text2: result.error || 'Credenciais inválidas.' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Erro no login', text2: 'Tente novamente mais tarde.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- login facial simples: inicia e faz polling do /status a cada 1s ---
  const startFace = async () => {
    try {
      setIsFaceLoading(true);
      await startFaceSession(); // Flask coloca status="pending"
      Toast.show({
        type: 'info',
        text1: 'Aguardando reconhecimento',
        text2: 'Abra o módulo Python para aprovar.',
      });

      pollTimerRef.current = setInterval(async () => {
        try {
          const status = await getFaceStatus();
          if (status === 'approved') {
            clearPoll();
            Toast.show({ type: 'success', text1: 'Login facial aprovado' });
            // aqui você pode chamar um "login guest" ou navegar
            // ex.: navigation.replace('Dashboard'); (ajuste ao seu fluxo)
          } else if (status === 'rejected' || status === 'idle' || status === 'cancelled') {
            clearPoll();
            if (status === 'rejected') {
              Toast.show({ type: 'error', text1: 'Reconhecimento rejeitado' });
            }
          }
        } catch {
          // ignora erros momentâneos no polling
        }
      }, 1000);
    } catch {
      setIsFaceLoading(false);
      Toast.show({ type: 'error', text1: 'Não foi possível iniciar o login facial' });
    }
  };

  const clearPoll = () => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    pollTimerRef.current = null;
    setIsFaceLoading(false);
    cancelFaceSession().catch(() => {});
  };

  useEffect(() => {
    return () => clearPoll(); // limpar ao desmontar a tela
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <GradientContainer height={200}>
          <Text
            style={{
              fontSize: theme.typography.sizes['3xl'],
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.surface,
              textAlign: 'center',
            }}
          >
            Operum
          </Text>
        </GradientContainer>

        <View
          style={{
            flex: 1,
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing['2xl'],
          }}
        >
          <Card>
            <Text
              style={{
                fontSize: theme.typography.sizes['2xl'],
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                textAlign: 'center',
                marginBottom: theme.spacing.xl,
              }}
            >
              Bem-vindo ao Operum
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
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
                <TextField
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

            <PrimaryButton
              title="Entrar"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting || isLoading}
              style={{ marginTop: theme.spacing.lg }}
            />

            <PrimaryButton
              title="Entrar com reconhecimento facial (beta)"
              onPress={startFace}
              loading={isFaceLoading}
              style={{ marginTop: theme.spacing.md, opacity: isFaceLoading ? 0.8 : 1 }}
            />

            <InlineLink
              title="Criar conta"
              onPress={() => navigation.navigate('Register')}
              style={{ marginTop: theme.spacing.lg }}
            />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
