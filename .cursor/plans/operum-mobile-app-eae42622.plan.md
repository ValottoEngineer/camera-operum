<!-- eae42622-3349-4ffe-97e8-6f40cb5c1635 054a29c6-39ce-4198-beb4-7f96f4ee08c5 -->
# Plano de Implementação - Operum Mobile App

## Visão Geral

Criar app mobile completo com Expo + React Native + TypeScript para gestão de clientes e carteiras de investimento, com autenticação Firebase, CRUD completo, tratamento robusto de erros e design futurista minimalista.

## 1. Configuração Inicial do Projeto

### 1.1 Inicializar projeto Expo TypeScript

- Criar estrutura base com `expo init` ou template TypeScript
- Configurar `app.json`, `app.config.ts`, `tsconfig.json`, `babel.config.js`
- Package name: `com.company.operumappandroid`

### 1.2 Instalar dependências principais

**Navegação:**

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

**Firebase:**

- `firebase` (JS SDK v9+)

**Forms e validação:**

- `react-hook-form`
- `zod`

**UI e estilo:**

- `expo-linear-gradient`
- `react-native-reanimated`
- `moti`
- `@expo/vector-icons`

**Network e estado:**

- `@react-native-community/netinfo`
- `zustand`
- `@react-native-async-storage/async-storage`
- `axios`

**Testes:**

- `jest`
- `@testing-library/react-native`
- `@testing-library/jest-native`

**Linting:**

- `eslint`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `prettier`

### 1.3 Configurar variáveis de ambiente

- Criar `.env.example` com todas as chaves Firebase vazias
- Criar `.env` com as credenciais reais do Firebase fornecidas
- Configurar `app.config.ts` para ler variáveis com `process.env`

## 2. Estrutura de Pastas e Arquitetura

Criar estrutura completa em `src/`:

```
src/
├── app/
│   ├── index.tsx
│   └── navigation/
│       ├── RootNavigator.tsx
│       ├── TabsNavigator.tsx
│       └── types.ts
├── screens/
│   ├── Auth/
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── Home/
│   │   └── HomeScreen.tsx
│   ├── Clients/
│   │   ├── ClientsListScreen.tsx
│   │   ├── ClientFormScreen.tsx
│   │   └── ClientDetailScreen.tsx
│   ├── Wallets/
│   │   └── WalletFormScreen.tsx
│   └── Settings/
│       └── ProfileScreen.tsx
├── components/
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorView.tsx
│   │   └── Loading.tsx
│   └── domain/
│       ├── ClientCard.tsx
│       └── WalletCard.tsx
├── services/
│   ├── firebase/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── db.ts
│   └── network/
│       └── retryFetch.ts
├── hooks/
│   ├── useOnline.ts
│   └── useToast.ts
├── state/
│   └── authStore.ts
├── utils/
│   ├── cpf.ts
│   └── xai.ts
├── styles/
│   └── theme.ts
└── tests/
    ├── ClientForm.test.tsx
    ├── utils/
    │   └── cpf.test.ts
    ├── auth.test.tsx
    └── db.test.tsx
```

## 3. Implementação do Sistema de Tema

### 3.1 Criar `src/styles/theme.ts`

- Definir paleta futurista (rosa #EE0BFF até azul #0B30FF)
- Definir paleta neutra (cinzas #F2F2F2 até #404040)
- Configurar tipografia (Poppins/Inter)
- Definir spacing, radius, shadows
- Exportar objeto `theme` centralizado

## 4. Componentes UI Reutilizáveis

### 4.1 Componentes básicos com estilo futurista

**Button.tsx:**

- Suporte a variantes (primary, secondary, outline)
- Gradiente para primary (#6402FF)
- Estados loading, disabled
- Ripple effect

**TextInput.tsx:**

- Estilo minimalista com borda #8C8C8C
- Label flutuante
- Validação visual (erro/sucesso)
- Ícones integrados

**Loading.tsx:**

- Spinner com gradiente animado
- Variantes: fullscreen, inline, overlay

**EmptyState.tsx:**

- Ícone + mensagem centralizada
- Botão de ação opcional

**ErrorView.tsx:**

- Mensagem de erro + botão "Tentar novamente"
- Ícone de alerta

### 4.2 Componentes de domínio

**ClientCard.tsx:**

- Card com estilo #D9D9D9
- Nome, CPF (mascarado), perfil de risco
- Ações: Ver detalhes, Editar, Excluir
- Animação de entrada (fade + slide)

**WalletCard.tsx:**

- Nome da carteira
- Lista de ativos (ticker + percentual)
- Explicação XAI resumida
- Ação para ver detalhes

## 5. Configuração do Firebase

### 5.1 `src/services/firebase/index.ts`

- Inicializar Firebase App com config do `.env`
- Exportar instâncias de `auth` e `firestore`
- Validar se todas as env vars estão presentes

### 5.2 `src/services/firebase/auth.ts`

- `signIn(email, password)`: retorna User ou throw erro
- `signUp(email, password)`: cria usuário + doc em `users/{uid}`
- `signOut()`: limpa auth e store
- `onAuthStateChanged(callback)`: listener de mudança de estado
- `getCurrentUser()`: retorna user atual ou null
- Tratamento de erros Firebase traduzidos para PT-BR

### 5.3 `src/services/firebase/db.ts`

**Clientes:**

- `createClient(data)`: valida CPF, checa duplicidade, salva com `ownerUid`
- `getClients(ownerUid, limit?, lastDoc?)`: paginação simples
- `getClientById(id)`: retorna doc ou null
- `updateClient(id, data)`: atualiza campos
- `deleteClient(id)`: remove doc
- `checkCpfExists(cpf, ownerUid)`: valida duplicidade

**Carteiras:**

- `createWallet(clientId, data)`: salva carteira vinculada ao cliente
- `getWalletsByClient(clientId)`: lista carteiras
- `getWalletById(id)`: retorna wallet
- `updateWallet(id, data)`: edita carteira
- `deleteWallet(id)`: remove carteira

**Usuários:**

- `getUserProfile(uid)`: busca dados do perfil
- `updateUserProfile(uid, data)`: atualiza perfil

Todos os métodos com retry automático e tratamento de erros.

## 6. Gerenciamento de Estado

### 6.1 `src/state/authStore.ts` (Zustand)

- Estado: `user`, `loading`, `isAuthenticated`
- Ações: `setUser`, `clearUser`, `setLoading`
- Persist em AsyncStorage (opcional)

## 7. Hooks Customizados

### 7.1 `src/hooks/useOnline.ts`

- Usar `NetInfo.addEventListener`
- Retornar `{ isOnline, isConnected, type }`
- Mostrar banner quando offline

### 7.2 `src/hooks/useToast.ts`

- Sistema de feedback visual
- Toast com gradiente suave
- Tipos: success, error, info, warning
- Auto-dismiss configurável

## 8. Utils e Helpers

### 8.1 `src/utils/cpf.ts`

- `validateCPF(cpf: string): boolean` - algoritmo completo de validação
- `formatCPF(cpf: string): string` - formata com pontos e traço
- `cleanCPF(cpf: string): string` - remove formatação

### 8.2 `src/utils/xai.ts`

- `generateWalletExplanation(profile, assets, liquidity): string`
- Mock inteligente que gera explicação baseada em:
  - Perfil de risco (conservador/moderado/agressivo)
  - Ativos selecionados (tickers)
  - Liquidez mensal do cliente
- Texto em PT-BR, claro e educativo

### 8.3 `src/services/network/retryFetch.ts`

- Wrapper para fetch/axios com retry exponencial
- Configurável: maxRetries (3), baseDelay (1000ms), jitter
- Usa `useOnline` para detectar conexão
- Throw erro customizado após todas as tentativas

## 9. Navegação

### 9.1 `src/app/navigation/types.ts`

- Definir tipos para todas as rotas (AuthStack, AppStack, TabsParams)
- Tipagem forte com React Navigation

### 9.2 `src/app/navigation/RootNavigator.tsx`

- Stack Navigator principal
- Lógica: se `isAuthenticated` → `AppStack`, senão → `AuthStack`
- Listener de `onAuthStateChanged` para atualizar estado
- Loading screen enquanto verifica auth

### 9.3 `src/app/navigation/TabsNavigator.tsx`

- Bottom Tabs: Home, Clientes, Perfil
- Ícones do Expo Icons (Ionicons, MaterialCommunityIcons, Feather)
- Cor ativa: #6402FF, inativa: #8C8C8C
- Background com gradiente sutil

## 10. Telas de Autenticação

### 10.1 `SignInScreen.tsx`

- Form: email + senha
- Validação com Zod schema
- React Hook Form
- Botão "Entrar" com loading
- Link para "Criar conta"
- Mensagens de erro amigáveis
- Background com LinearGradient

### 10.2 `SignUpScreen.tsx`

- Form: email + senha + confirmar senha
- Validação: email válido, senha forte (min 6 chars), senhas iguais
- Checkbox "Li e concordo com os termos (LGPD)"
- Cria doc em `users/{uid}` ao registrar
- Redirect para Home após sucesso

## 11. Tela Home

### 11.1 `HomeScreen.tsx`

- Header com gradiente e boas-vindas personalizadas
- Cards de atalho:
  - "Meus Clientes" → navega para ClientsListScreen
  - "Simular Carteira" → navega para WalletFormScreen (mock)
- Estatísticas rápidas (total de clientes, carteiras)
- Design clean com espaçamento amplo

## 12. CRUD de Clientes

### 12.1 `ClientsListScreen.tsx`

- Barra de busca (filtra por nome localmente)
- FlatList com `ClientCard`
- Paginação simples (load more ao chegar no fim)
- Pull-to-refresh
- EmptyState quando sem clientes
- FAB para adicionar novo cliente
- Loading state durante fetch
- ErrorView com retry se falhar

### 12.2 `ClientFormScreen.tsx` (Create/Edit)

**Campos:**

- Nome (obrigatório)
- CPF (obrigatório, validado, máscara)
- Perfil de Risco (select: Conservador, Moderado, Agressivo)
- Objetivos (chips multi-select: Aposentadoria, Educação, Reserva, Imóvel, Viagem)
- Liquidez Mensal (input numérico com R$)

**Validações:**

- Zod schema
- CPF válido (algoritmo)
- CPF não duplicado (consulta Firestore)
- Todos os campos obrigatórios preenchidos

**Estados:**

- Loading ao salvar
- Disabled durante operações
- Mensagens de erro inline

**Ações:**

- "Salvar" → `createClient` ou `updateClient`
- "Cancelar" → volta para lista
- Feedback de sucesso com toast

### 12.3 `ClientDetailScreen.tsx`

- Header com nome do cliente
- Seções:
  - Dados pessoais (CPF mascarado)
  - Perfil de risco (badge colorido)
  - Objetivos (lista)
  - Liquidez mensal (formatado em R$)
- Botões de ação:
  - "Editar Cliente"
  - "Excluir Cliente" (confirma com alert)
  - "Criar Carteira"
- Lista de carteiras do cliente (se houver)
- Loading/Error states

## 13. CRUD de Carteiras

### 13.1 `WalletFormScreen.tsx` (Create/Edit)

**Campos:**

- Nome da Carteira (obrigatório)
- Cliente vinculado (select, pré-selecionado se vier de ClientDetail)
- Lista de ativos (dinâmica, min 1, max 10):
  - Ticker (ex: PETR4, ITUB4)
  - Percentual (%)
- Validação: soma dos percentuais = 100%

**Geração XAI:**

- Ao salvar, chamar `generateWalletExplanation`
- Mostrar explicação gerada antes de confirmar
- Salvar explicação no Firestore junto com a carteira

**Estados:**

- Add/Remove ativo dinamicamente
- Cálculo automático do total de %
- Bloqueio se total ≠ 100%

### 13.2 Listar e editar carteiras

- Lista de carteiras em `ClientDetailScreen`
- Editar carteira: permite mudar ativos e %
- Excluir carteira: confirma e remove

## 14. Tela de Perfil

### 14.1 `ProfileScreen.tsx`

- Exibe email do usuário
- Nome (editável)
- Foto de perfil (placeholder, opcional)
- Botão "Sair" com confirmação
- Link para termos de uso/LGPD

## 15. Tratamento de Erros e Rede

### 15.1 Banner de conexão

- Hook `useOnline` monitora NetInfo
- Banner fixo no topo quando offline: "Sem conexão. Tentando reconectar..."
- Cor de alerta (#EE0BFF com opacity)

### 15.2 Retry automático

- Todas as chamadas Firebase usam `retryFetch` wrapper
- Exponential backoff: 1s, 2s, 4s
- Jitter aleatório para evitar thundering herd
- Após 3 falhas, mostra `ErrorView` com botão manual

### 15.3 Mensagens de erro

- Traduzir erros Firebase para PT-BR
- Mensagens claras: "Não foi possível salvar o cliente. Verifique sua conexão."
- Evitar jargões técnicos

## 16. Validações e Schemas Zod

### 16.1 Auth schemas

```typescript
signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

signUpSchema = signInSchema.extend({
  confirmPassword: z.string(),
  acceptedTerms: z.boolean().refine(v => v === true)
}).refine(data => data.password === data.confirmPassword)
```

### 16.2 Client schema

```typescript
clientSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  perfilRisco: z.enum(['conservador', 'moderado', 'agressivo']),
  objetivos: z.array(z.string()).min(1, 'Selecione ao menos um objetivo'),
  liquidezMensal: z.number().positive('Valor deve ser positivo')
})
```

### 16.3 Wallet schema

```typescript
walletSchema = z.object({
  nomeCarteira: z.string().min(3),
  clientId: z.string(),
  ativos: z.array(z.object({
    ticker: z.string().min(4).max(6),
    percentual: z.number().min(0).max(100)
  })).min(1).refine(
    ativos => ativos.reduce((sum, a) => sum + a.percentual, 0) === 100,
    'A soma deve ser 100%'
  )
})
```

## 17. Testes Automatizados

### 17.1 `src/tests/utils/cpf.test.ts`

- Testar CPFs válidos (11.111.111-11 válido? Não!)
- Testar CPFs inválidos (123.456.789-00)
- Testar formatação e limpeza

### 17.2 `src/tests/ClientForm.test.tsx`

- Renderizar formulário
- Validar campos obrigatórios (submit sem preencher)
- Validar CPF inválido
- Mock de rede offline: impedir submit
- Mock de Firestore: simular save com sucesso

### 17.3 `src/tests/auth.test.tsx`

- Mock de `signIn` com credenciais válidas/inválidas
- Verificar redirecionamento após login
- Testar `signOut`

### 17.4 `src/tests/db.test.tsx`

- Mock de Firestore
- Testar `createClient` com dados válidos
- Testar `checkCpfExists` com duplicidade
- Testar `deleteClient`

## 18. Configuração de Linting e Prettier

### 18.1 `.eslintrc.js`

- Extends: `@react-native-community`, `plugin:@typescript-eslint/recommended`
- Rules customizadas para evitar any, unused vars

### 18.2 `.prettierrc.js`

- Single quotes, trailing comma, semi true
- Tab width 2

### 18.3 Scripts no `package.json`

- `lint`: `eslint . --ext .ts,.tsx`
- `lint:fix`: `eslint . --ext .ts,.tsx --fix`
- `format`: `prettier --write "src/**/*.{ts,tsx}"`

## 19. Firestore Security Rules

### 19.1 Criar `firestore.rules` na raiz

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clients/{id} {
      allow read, write: if request.auth != null && 
                            resource.data.ownerUid == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.ownerUid == request.auth.uid;
    }
    match /wallets/{id} {
      allow read, write: if request.auth != null;
    }
    match /users/{uid} {
      allow read, write: if request.auth != null && uid == request.auth.uid;
    }
  }
}
```

## 20. README.md Completo

### 20.1 Estrutura do README

**Cabeçalho:**

- Logo/banner do Operum
- Badges (React Native, Expo, TypeScript, Firebase)

**Descrição:**

- O que é o Operum
- Objetivo do app (Mobile Development and IoT - SP4)

**Integrantes:**

- Placeholder: `[Nome Completo] - RM [número]`
- `[Nome Completo] - RM [número]`

**Funcionalidades:**

- Autenticação (login/signup)
- CRUD de Clientes (perfil de risco, objetivos, liquidez)
- CRUD de Carteiras (ativos, explicação XAI)
- Tratamento robusto de erros de rede
- Design futurista e minimalista

**Pré-requisitos:**

- Node 18+
- Expo CLI
- Conta Firebase configurada

**Configuração:**

1. Clone o repositório
2. `npm install`
3. Copie `.env.example` para `.env`
4. Preencha as variáveis Firebase
5. `npx expo start`

**Variáveis de Ambiente (.env.example):**

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

**Scripts:**

- `npm run dev`: inicia Expo
- `npm test`: roda testes
- `npm run lint`: verifica código
- `npm run format`: formata com Prettier

**Arquitetura:**

- Diagrama simples das pastas principais
- Fluxo de navegação (AuthStack → AppStack)

**Tecnologias:**

- Expo SDK 51+
- React Native
- TypeScript
- Firebase (Auth + Firestore)
- React Navigation
- Zod + React Hook Form
- Jest + Testing Library

**Limitações e Próximos Passos:**

- Integração com APIs reais de mercado financeiro
- Notificações push
- Relatórios em PDF
- Modo offline completo com sync

**Screenshots:**

- Placeholder para telas principais

**Licença:**

- MIT

## 21. Configuração do Expo e Build

### 21.1 `app.json` e `app.config.ts`

- Nome do app: "Operum"
- Slug: "operum-app"
- Package: `com.company.operumappandroid`
- Ícone e splash screen com gradiente
- Orientação: portrait
- Versão: 1.0.0

### 21.2 Comentar comando de build EAS

```json
// "build:android": "eas build -p android --profile preview"
```

## 22. Arquivos de Configuração

### 22.1 `tsconfig.json`

- Strict mode
- Paths alias: `@/*` → `src/*`
- ESNext target

### 22.2 `babel.config.js`

- Preset: `babel-preset-expo`
- Plugins: `react-native-reanimated/plugin`, `module-resolver`

### 22.3 `jest.config.js`

- Preset: `jest-expo`
- Setup files: `@testing-library/jest-native/extend-expect`
- Transform ignore patterns para node_modules específicos

### 22.4 `.gitignore`

- node_modules, .env, .expo, dist, build

## Sequência de Implementação

1. Setup projeto e dependências
2. Configurar Firebase e tema
3. Criar componentes UI base
4. Implementar navegação
5. Criar telas de Auth
6. Implementar serviços Firebase (auth + db)
7. Criar hooks (useOnline, useToast)
8. Implementar CRUD de Clientes (telas + lógica)
9. Implementar CRUD de Carteiras
10. Adicionar utils (CPF, XAI)
11. Implementar retry de rede
12. Criar testes
13. Configurar linting
14. Escrever README
15. Validar build e execução

## Critérios de Aceitação

- ✅ App inicia sem erros no emulador Android
- ✅ Login/Signup funcionam com Firebase
- ✅ CRUD completo de Clientes (criar, listar, editar, excluir)
- ✅ CRUD completo de Carteiras vinculadas a clientes
- ✅ Validação de CPF impede salvar dados inválidos
- ✅ Mensagens de erro claras quando sem rede
- ✅ Retry automático em falhas de conexão
- ✅ Navegação fluida entre telas
- ✅ Design futurista com paletas especificadas
- ✅ Testes passam com `npm test`
- ✅ README completo com instruções
- ✅ `.env.example` configurado

### To-dos

- [ ] Inicializar projeto Expo TypeScript, instalar todas as dependências e configurar arquivos base (tsconfig, babel, jest, eslint, prettier)
- [ ] Configurar variáveis de ambiente (.env, .env.example, app.config.ts) e inicializar Firebase SDK
- [ ] Criar sistema de tema (theme.ts) e componentes UI reutilizáveis (Button, TextInput, Loading, EmptyState, ErrorView)
- [ ] Implementar navegação completa (RootNavigator, AuthStack, TabsNavigator) com tipagem
- [ ] Criar serviços Firebase (auth.ts, db.ts) com funções de autenticação e CRUD de Firestore
- [ ] Implementar telas de autenticação (SignIn, SignUp) com validação Zod e React Hook Form
- [ ] Criar hooks customizados (useOnline, useToast) e utils (cpf.ts, xai.ts, retryFetch.ts)
- [ ] Implementar CRUD completo de Clientes (ClientsListScreen, ClientFormScreen, ClientDetailScreen, ClientCard)
- [ ] Implementar CRUD completo de Carteiras (WalletFormScreen, WalletCard, integração com XAI mock)
- [ ] Criar telas Home e Profile com design futurista e funcionalidades básicas
- [ ] Implementar tratamento robusto de erros (banner offline, retry automático, mensagens PT-BR)
- [ ] Criar testes automatizados (cpf.test, ClientForm.test, auth.test, db.test)
- [ ] Criar arquivo firestore.rules com regras de segurança
- [ ] Escrever README.md completo com instruções, screenshots placeholders e informações do projeto
- [ ] Validar build, corrigir linter errors, testar todos os fluxos no emulador e aplicar polish final