# 📱 Operum — Mobile Financial App

[![React Native](https://img.shields.io/badge/React%20Native-0A0A0A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Educational-blue?style=for-the-badge)]()

---

## 💡 Sobre o Projeto

O **Operum** é um aplicativo mobile voltado à **análise e simulação de investimentos em ações brasileiras**, desenvolvido com **React Native**, **Expo** e **TypeScript**.  
Ele integra dados em tempo real da **API [brapi.dev](https://brapi.dev)** e um **chatbot inteligente** via **Hugging Face**, oferecendo uma experiência moderna, fluida e intuitiva.

O design futurista com **paleta neon e glassmorphism** reforça a proposta tecnológica do app, trazendo uma interface envolvente e responsiva.

---

## 🎨 Identidade Visual

A identidade visual é baseada em tons **frios e vibrantes**, com estética *cyberpunk* e contrastes suaves.

| Cor | Nome | Hex |
|------|------|------|
| 🩷 | **Rosa Futurista** | `#EE0BFF` |
| 💜 | **Lilás Neon** | `#9C0AE8` |
| 💜 | **Roxo Elétrico** | `#6402FF` |
| 💙 | **Azul Íon** | `#240AE8` |
| 💙 | **Azul Futuro** | `#0B30FF` |

---

## 🚀 Pré-requisitos

- Node.js (versão **16+**)  
- Expo CLI → `npm install -g @expo/cli`  
- Dispositivo com **Expo Go** ou **emulador Android/iOS**

---

## 📦 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/TomazVC/MOBILE-SP4.git

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (veja abaixo)

# 4. Inicie o projeto
npm start
---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione suas chaves:

```bash
# Firebase Configuration
FIREBASE_API_KEY=sua_api_key_aqui
FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id

# brapi.dev API (opcional)
BRAPI_API_KEY=seu_token_brapi_aqui

# Hugging Face API (opcional)
HUGGING_FACE_API_KEY=seu_token_hf_aqui
---

## 🔧 Configuração Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)  
2. Crie um novo projeto  
3. Ative **Autenticação por e-mail/senha**  
4. Baixe:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
5. Coloque-os na raiz do projeto

---

## 🧰 Tecnologias Utilizadas

### Frontend Mobile
- ⚛️ **React Native** — Framework mobile multiplataforma  
- 🚀 **Expo** — Build, preview e deploy facilitados  
- 🔷 **TypeScript** — Tipagem estática e segura  
- 🧭 **React Navigation** — Navegação fluida  
- 🧾 **React Hook Form + Zod** — Validação e controle de formulários  

### Backend & APIs
- 🔐 **Firebase Authentication** — Autenticação de usuários  
- 📈 **brapi.dev** — Dados financeiros em tempo real  
- 🤖 **Hugging Face Inference API** — IA conversacional  

### UI/UX
- 💫 **Expo Linear Gradient** — Gradientes modernos  
- 🪞 **Expo Blur** — Efeito *glassmorphism*  
- 🔔 **React Native Toast Message** — Notificações e feedback  
- 📊 **React Native SVG** — Gráficos customizados  

---

## 💹 Funcionalidades Principais

### 🔐 Autenticação
- Login e cadastro com e-mail/senha  
- Atualização e exclusão de conta  
- Reautenticação para ações sensíveis  
- Validação robusta de formulários  

### 📊 Dashboard Financeiro
- Dados em tempo real via **brapi.dev**  
- Três perfis de portfólio:
  - 🧩 **Conservador** — foco em dividendos  
  - ⚖️ **Moderado** — equilíbrio risco/retorno  
  - 🚀 **Agressivo** — potencial de crescimento  
- Cache de 5 minutos + fallback mockado  

### 💰 Simulador de Investimentos
- Cálculo de **juros compostos**  
- Projeções de até **30 anos**  
- Gráficos de performance interativos  
- Aportes mensais configuráveis  

### 🔎 Busca de Ações
- Consulta por **símbolos brasileiros**  
- Dados fundamentalistas e históricos  
- Métricas e preços em tempo real  

### 🤖 Chatbot Financeiro
- IA com **conhecimento financeiro especializado**  
- Respostas contextuais  
- Integração com **dados de mercado reais**  
- Funcionalidade **offline/online híbrida**  

---

## 🧭 Design System

### 🎨 Paleta Futurista Neon

| Nome | Hex |
|------|------|
| Rosa Futurista | `#EE0BFF` |
| Lilás Neon | `#9C0AE8` |
| Roxo Elétrico | `#6402FF` |
| Azul Íon | `#240AE8` |
| Azul Futuro | `#0B30FF` |

### ⚪ Paleta Neutra

| Nome | Hex |
|------|------|
| Fundo | `#F2F2F2` |
| Cartões | `#D9D9D9` |
| Texto Primário | `#404040` |
| Texto Secundário | `#8C8C8C` |
| Bordas | `#595959` |

### 🧩 Componentes

- **PrimaryButton:** gradiente rosa → azul  
- **SecondaryButton:** fundo lilás  
- **Card:** efeito *glassmorphism* sutil  
- **Header:** gradiente com blur  
- **TextField:** bordas arredondadas e feedback visual  
- **Bottom Tabs:** navegação intuitiva  

---

## 🔌 Integrações

### 📈 brapi.dev API
- Ações gratuitas: `PETR4`, `VALE3`, `MGLU3`, `ITUB4`  
- Premium: `BBDC4`, `ABEV3`, `WEGE3`, `B3SA3`  
- Cache inteligente (5 min)  
- Fallback automático em caso de erro  

### 🔐 Firebase Authentication
- Login / Registro  
- Atualização e exclusão de conta  
- Reautenticação segura  

### 🤖 Hugging Face Inference API
- IA especializada em finanças  
- Respostas contextuais e híbridas  
- Suporte offline  

---

## ⚡ Performance & Acessibilidade

- Cache e rate limiting locais  
- Lazy loading de componentes  
- Retry automático com *backoff* exponencial  
- Suporte a leitores de tela  
- Contraste adequado e fontes responsivas  

---

## 🧪 Testes

### 🧩 Testes Manuais
- Fluxo completo de autenticação  
- Navegação e dashboard  
- Simulação de investimentos  
- Chatbot financeiro  

### ⚙️ Testes de API
- Integração com **brapi.dev**  
- Tratamento de rate limiting  
- Cache e fallback de dados  

---

## 📁 Estrutura do Projeto

src/
├── components/ # Componentes reutilizáveis
│ ├── UI/ # Elementos visuais
│ ├── Layout/ # Estruturas de tela
│ └── Charts/ # Gráficos SVG
├── context/ # Context API global
│ └── AuthContext.tsx # Estado de autenticação
├── navigation/ # Pilhas e navegadores
│ ├── AppStack.tsx
│ ├── AuthStack.tsx
│ └── RootNavigator.tsx
├── screens/ # Telas principais
│ ├── Auth/
│ ├── App/
│ └── Modals/
├── services/ # Integrações externas
│ ├── auth.ts
│ ├── brapiService.ts
│ ├── aiService.ts
│ └── simulatorService.ts
├── styles/ # Tema e paleta
│ └── theme.ts
├── types/ # Tipagens TypeScript
│ ├── brapi.ts
│ ├── portfolio.ts
│ └── simulator.ts
├── utils/ # Funções auxiliares
│ ├── firebaseErrors.ts
│ └── investmentCalculations.ts
└── validation/ # Schemas Zod
└── schemas.ts


---

## 👨‍💻 Equipe

| Nome | RM |
|------|------|
| **Pedro Oliveira Valotto** | 551445 |
| **Rony Ken Nagai** | 551549 |
| **Tomáz Versolato Carballo** | 551417 |

---

## 🙏 Agradecimentos

- [brapi.dev](https://brapi.dev) — Dados financeiros  
- [Firebase](https://firebase.google.com/) — Autenticação  
- [Expo](https://expo.dev/) — Desenvolvimento mobile  
- [Hugging Face](https://huggingface.co/) — IA financeira  
- **TypeScript**, **React Hook Form**, **Zod**, **React Navigation**

---

## 🎯 Próximos Passos

- Integração com backend real  
- Persistência local de dados  
- Expansão do dashboard  
- Testes automatizados  
- Publicação nas stores  

---

## 📄 Licença

Este projeto é **para fins educacionais e demonstração**.  
Desenvolvido com ❤️ pela equipe **Operum** para a comunidade financeira brasileira.
