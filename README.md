# Operum - Mobile Financial App

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

**Um aplicativo mobile moderno e futurista para análise e simulação de investimentos em ações brasileiras**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## Sobre o Projeto

O **Operum** é um aplicativo mobile desenvolvido com React Native e Expo que oferece uma experiência completa para análise e simulação de investimentos em ações brasileiras. Com design futurista e funcionalidades avançadas, o app integra dados em tempo real da API brapi.dev e oferece ferramentas de simulação, análise de portfólios e assistente financeiro inteligente.

### Principais Características

- **Autenticação Segura** com Firebase
- **Dashboard Interativo** com dados em tempo real
- **Simulador de Investimentos** com cálculos precisos
- **Busca de Ações** com dados fundamentalistas
- **Chatbot Financeiro** com IA integrada
- **Design Futurista** com paleta neon e glassmorphism
- **Dados Reais** da API brapi.dev

---

## Tecnologias Utilizadas

### **Frontend Mobile**
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento e deploy
- **TypeScript** - Tipagem estática para maior confiabilidade
- **React Navigation** - Navegação fluida entre telas
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas e dados

### **Backend & APIs**
- **Firebase Authentication** - Autenticação de usuários
- **brapi.dev API** - Dados financeiros em tempo real
- **Hugging Face Inference API** - Chatbot com IA

### **UI/UX**
- **Expo Linear Gradient** - Gradientes modernos
- **Expo Blur** - Efeitos glassmorphism
- **React Native Toast Message** - Notificações
- **React Native SVG** - Gráficos e ícones customizados

---

## Funcionalidades

### **Sistema de Autenticação**
- Login e registro com email/senha
- Atualização de perfil (nome e senha)
- Exclusão de conta com confirmação
- Reautenticação para operações sensíveis
- Validação robusta de formulários

### **Dashboard Financeiro**
- **3 Portfólios Diferentes**:
  - **Conservador**: Foco em dividendos e estabilidade
  - **Moderado**: Equilíbrio entre risco e retorno
  - **Agressivo**: Alto potencial de crescimento
- Dados em tempo real da brapi.dev API
- Métricas de performance e volatilidade
- Sistema de cache inteligente (5 minutos)
- Fallback para dados mockados em caso de falha

### **Busca e Análise de Ações**
- Busca por símbolos de ações brasileiras
- Dados fundamentalistas completos
- Preços em tempo real
- Histórico de cotações
- Informações de mercado (volume, capitalização)

### **Simulador de Investimentos**
- Cálculos de juros compostos
- Simulação com dados reais de ações
- Múltiplas ações simultâneas
- Gráficos de performance
- Projeções de longo prazo (até 30 anos)
- Aportes mensais personalizáveis

### **Chatbot Financeiro Inteligente**
- IA com conhecimento financeiro especializado
- Respostas contextuais sobre investimentos
- Integração com dados reais de ações
- Sistema offline/online híbrido
- Sugestões de perguntas contextuais

### **Design System Moderno**
- Paleta futurista neon consistente
- Efeitos glassmorphism
- Navegação inferior intuitiva
- Componentes reutilizáveis
- Animações suaves
- Responsividade mobile

---

## Instalação e Configuração

### **1. Clone o Repositório**

```bash
git clone https://github.com/TomazVC/MOBILE-SP4.git
```

### **2. Instale as Dependências**

```bash
npm install
```

### **3. Configure as Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id

# brapi.dev API (opcional - tem fallback para dados mockados)
BRAPI_API_KEY=seu_token_brapi_aqui

# Hugging Face API (opcional - tem fallback offline)
HUGGING_FACE_API_KEY=seu_token_hf_aqui
```

### **4. Configure o Firebase**

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative a autenticação por email/senha
4. Baixe o arquivo `google-services.json` (Android) e `GoogleService-Info.plist` (iOS)
5. Coloque os arquivos na raiz do projeto

### **5. Inicie o Projeto**

```bash
npm start
```

### **6. Execute no Dispositivo**

- **Android**: Pressione `a` no terminal ou escaneie o QR code com Expo Go
- **iOS**: Pressione `i` no terminal ou escaneie o QR code com Expo Go
- **Web**: Pressione `w` no terminal

---

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── UI/             # Componentes de interface
│   ├── Layout/         # Componentes de layout
│   └── Charts/         # Componentes de gráficos
├── context/            # Context API para estado global
│   └── AuthContext.tsx # Contexto de autenticação
├── navigation/         # Configuração de navegação
│   ├── AppStack.tsx    # Navegação principal (Bottom Tabs)
│   ├── AuthStack.tsx   # Navegação de autenticação
│   └── RootNavigator.tsx # Navegador raiz
├── screens/            # Telas da aplicação
│   ├── Auth/           # Telas de autenticação
│   ├── App/            # Telas principais
│   └── Modals/         # Modais e overlays
├── services/           # Serviços e integrações
│   ├── auth.ts         # Serviço de autenticação Firebase
│   ├── brapiService.ts # Integração com brapi.dev API
│   ├── aiService.ts    # Serviço de IA (chatbot)
│   └── simulatorService.ts # Serviço de simulação
├── styles/             # Tema e estilos
│   └── theme.ts        # Paleta de cores e design system
├── types/              # Definições de tipos TypeScript
│   ├── brapi.ts        # Tipos da API brapi.dev
│   ├── portfolio.ts    # Tipos de portfólio
│   └── simulator.ts    # Tipos do simulador
├── utils/              # Utilitários e helpers
│   ├── firebaseErrors.ts # Mapeamento de erros Firebase
│   └── investmentCalculations.ts # Cálculos financeiros
└── validation/         # Schemas de validação
    └── schemas.ts      # Schemas Zod para validação
```

---

## Design System

### **Paleta de Cores**

#### **Futurista Neon**
- **Rosa Futurista**: `#EE0BFF`
- **Lilás Neon**: `#9C0AE8`
- **Roxo Elétrico**: `#6402FF`
- **Azul Íon**: `#240AE8`
- **Azul Futuro**: `#0B30FF`

#### **Neutra**
- **Fundo**: `#F2F2F2`
- **Cartões**: `#D9D9D9`
- **Texto Primário**: `#404040`
- **Texto Secundário**: `#8C8C8C`
- **Bordas**: `#595959`

### **Componentes Principais**

- **PrimaryButton**: Gradiente rosa → azul
- **SecondaryButton**: Fundo lilás
- **Card**: Glassmorphism sutil
- **TextField**: Bordas arredondadas e feedback visual
- **Header**: Gradiente com efeito blur

---

## Integrações

### **brapi.dev API**

O app integra com a [brapi.dev API](https://brapi.dev/docs) para obter dados financeiros em tempo real:

- **Ações Gratuitas**: PETR4, VALE3, MGLU3, ITUB4
- **Ações Premium**: BBDC4, ABEV3, WEGE3, B3SA3 (com token)
- **Cache Inteligente**: 5 minutos de duração
- **Rate Limiting**: 1 segundo entre requisições
- **Fallback**: Dados mockados em caso de falha

### **Firebase Authentication**

- Autenticação por email/senha
- Atualização de perfil
- Exclusão de conta
- Reautenticação para operações sensíveis

### **Hugging Face Inference API**

- Chatbot com conhecimento financeiro
- Respostas contextuais
- Sistema offline/online híbrido

---

## Performance e Otimizações

### **Cache e Performance**
- Cache agressivo de 5 minutos para dados da API
- Rate limiting local para evitar sobrecarga
- Carregamento em chunks para melhor UX
- Lazy loading de componentes

### **Tratamento de Erros**
- Mapeamento de erros Firebase para português
- Fallback para dados mockados
- Retry automático com backoff
- Feedback visual claro para o usuário

### **Acessibilidade**
- Suporte a leitores de tela
- Contraste adequado de cores
- Tamanhos de fonte responsivos
- Navegação por teclado

---

## Testes

### **Testes Manuais**
- [x] Fluxo de autenticação completo
- [x] Navegação entre telas
- [x] Simulador de investimentos
- [x] Busca de ações
- [x] Chatbot financeiro
- [x] Atualização de perfil

### **Testes de API**
- [x] Integração brapi.dev
- [x] Tratamento de rate limiting
- [x] Fallback para dados mockados
- [x] Cache e performance

---

## Equipe

- **Nome**: Pedro Oliveira Valotto | **RM**: 551445
- **Nome**: Rony Ken Nagai         | **RM**: 551549
- **Nome**: Tomáz Versolato Carballo | **RM**: 551417

---

## Agradecimentos

- [brapi.dev](https://brapi.dev) pela API de dados financeiros
- [Firebase](https://firebase.google.com) pela autenticação
- [Expo](https://expo.dev) pela plataforma de desenvolvimento
- [React Native](https://reactnative.dev) pelo framework mobile
- [Hugging Face](https://huggingface.co) pela API de IA

---

<div align="center">

**Desenvolvido com ❤️ para a comunidade financeira brasileira**

[![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-blue.svg)](https://reactnative.dev)
[![Powered by Expo](https://img.shields.io/badge/Powered%20by-Expo-000020.svg)](https://expo.dev)

</div>