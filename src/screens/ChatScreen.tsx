import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { TextField } from '../components/TextField';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { TypingIndicator } from '../components/TypingIndicator';
import { aiService } from '../services/aiService';
import { theme } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppStack';

type ChatScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const getContextualSuggestions = (): string[] => {
  // Sugestões baseadas no contexto atual
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return [
      'Como está o mercado hoje?',
      'Quais ações estão em alta?',
      'Resumo das minhas carteiras',
    ];
  }
  
  return [
    'Como diversificar meu portfolio?',
    'O que é análise fundamentalista?',
    'Estratégias para iniciantes',
  ];
};

export const ChatScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! 👋 Sou seu assistente financeiro inteligente. Posso te ajudar com dúvidas sobre investimentos, análise de ações e estratégias.\n\n💡 Posso explicar:\n• Ações específicas (PETR4, VALE3, ITUB4, MGLU3, etc.)\n• Conceitos financeiros (diversificação, portfolio, risco)\n• Estratégias de investimento\n• Dados em tempo real das suas ações\n\nComo posso ajudar?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await aiService.chat(userMessage.content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.neon.purple,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: theme.spacing.sm,
            }}
          >
            <Ionicons name="flash" size={20} color="white" />
          </View>
        )}

        <View
          style={{
            maxWidth: '75%',
            backgroundColor: isUser ? theme.colors.neon.electric : theme.colors.surface,
            borderRadius: 16,
            padding: theme.spacing.md,
            borderWidth: isUser ? 0 : 1,
            borderColor: theme.colors.neutral.border,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.md,
              color: isUser ? theme.colors.surface : theme.colors.neutral.primary,
              lineHeight: 22,
            }}
          >
            {message.content}
          </Text>
          <Text
            style={{
              fontSize: theme.typography.sizes.xs,
              color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors.neutral.secondary,
              marginTop: theme.spacing.xs,
            }}
          >
            {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {isUser && (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.neutral.border,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: theme.spacing.sm,
            }}
          >
            <Ionicons name="person" size={20} color={theme.colors.neutral.primary} />
          </View>
        )}
      </View>
    );
  };

  const suggestedQuestions = [
    'O que é PETR4?',
    'Como diversificar meu portfolio?',
    'O que é liquidez?',
    'Como começar a investir?',
    'O que é risco em investimentos?',
    'O que é B3?',
    ...getContextualSuggestions(),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title="Assistente Financeiro"
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: theme.spacing.lg }}
        >
          {messages.map(renderMessage)}

          {loading && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.lg,
                marginBottom: theme.spacing.md,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.colors.neon.purple,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: theme.spacing.sm,
                }}
              >
                <Ionicons name="flash" size={20} color="white" />
              </View>
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 16,
                  padding: theme.spacing.md,
                  borderWidth: 1,
                  borderColor: theme.colors.neutral.border,
                }}
              >
                <TypingIndicator />
              </View>
            </View>
          )}

          {messages.length === 1 && (
            <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.md }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.neutral.secondary,
                  marginBottom: theme.spacing.sm,
                }}
              >
                Sugestões de perguntas:
              </Text>
              {suggestedQuestions.map((question, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  style={{ marginBottom: theme.spacing.sm }}
                  onPress={() => setInputText(question)}
                >
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.sm,
                      color: theme.colors.neon.electric,
                    }}
                  >
                    {question}
                  </Text>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.neutral.border,
            gap: theme.spacing.sm,
          }}
        >
          <TextField
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua pergunta..."
            style={{ flex: 1 }}
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <IconButton
            iconName="send"
            onPress={handleSend}
            color={theme.colors.neon.electric}
            disabled={!inputText.trim() || loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
