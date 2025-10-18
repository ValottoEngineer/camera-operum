# 🚀 Operum - Mobile App

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.74.5-blue.svg" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-51.0.0-black.svg" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-5.3.3-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Firebase-10.7.1-orange.svg" alt="Firebase" />
</div>

## 📱 Sobre o Projeto

O **Operum** é um aplicativo mobile para gestão de clientes e carteiras de investimento, desenvolvido para a disciplina **Mobile Development and IoT (SP4)** da FIAP.

### 🎯 Funcionalidades
- **Autenticação** com email/senha
- **CRUD completo** de clientes
- **CRUD completo** de carteiras de investimento
- **Validação de CPF** com algoritmo oficial
- **Geração automática** de explicações de carteiras
- **Design futurista** com paleta neon
- **Tratamento robusto** de erros de rede

## 👥 Integrantes

- **[Nome Completo] - RM [número]**
- **[Nome Completo] - RM [número]**

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install --legacy-peer-deps
```

### 2. Configurar Firebase
```bash
cp env.example .env
```

**✅ JÁ CONFIGURADO!** O arquivo `env.example` já contém suas credenciais Firebase.

### 3. Ativar Serviços Firebase
No console Firebase, ative:
- **Authentication** → Sign-in method → Email/Password
- **Firestore Database** → Criar banco de dados
- **Regras de segurança** (copie do arquivo `firestore.rules`)

### 4. Executar o App
```bash
npm run dev
```

### 5. Testar no Dispositivo
- Escaneie o QR code com o Expo Go
- Ou pressione `a` para Android / `i` para iOS

## 📱 Scripts Disponíveis

```bash
npm run dev          # Inicia o Expo
npm run android      # Executa no Android
npm run ios          # Executa no iOS
npm run web          # Executa no navegador
npm run type-check   # Verifica tipos TypeScript
```

## 🛠️ Tecnologias

- **Expo SDK 51+** - Framework React Native
- **TypeScript** - Tipagem estática
- **Firebase** - Autenticação e banco de dados
- **React Navigation** - Navegação entre telas
- **Zod + React Hook Form** - Validação de formulários
- **Zustand** - Gerenciamento de estado

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
├── screens/               # Telas da aplicação
│   ├── Auth/             # Login e cadastro
│   ├── Home/             # Tela inicial
│   ├── Clients/          # CRUD de clientes
│   ├── Wallets/          # CRUD de carteiras
│   └── Settings/         # Perfil do usuário
├── components/            # Componentes reutilizáveis
├── services/              # Serviços Firebase
├── hooks/                 # Hooks customizados
├── utils/                 # Funções utilitárias
└── styles/                # Tema e estilos
```

## 🔒 Segurança

### Regras Firestore
O arquivo `firestore.rules` contém as regras de segurança:
- **Clientes**: Apenas o dono pode ler/escrever
- **Carteiras**: Apenas o dono pode ler/escrever  
- **Usuários**: Apenas o próprio usuário pode acessar

## 🐛 Solução de Problemas

### Erro de Dependências
```bash
npm install --legacy-peer-deps
```

### Erro de Firebase
- Verifique se todas as variáveis de ambiente estão preenchidas
- Confirme se Authentication e Firestore estão ativados no console Firebase

### Limpar Cache
```bash
npx expo start --clear
```

## 📊 Status do Projeto

- ✅ **Autenticação** completa
- ✅ **CRUD de Clientes** completo
- ✅ **CRUD de Carteiras** completo
- ✅ **Validação de CPF** implementada
- ✅ **Tratamento de erros** robusto
- ✅ **Design futurista** aplicado
- ✅ **Firebase** configurado

## 🚧 Próximos Passos

1. Testar no emulador Android/iOS
2. Adicionar integração com APIs reais de mercado financeiro
3. Implementar relatórios em PDF
4. Adicionar notificações push

---

<div align="center">
  <p>Desenvolvido com ❤️ para a disciplina Mobile Development and IoT - SP4</p>
  <p>FIAP - Faculdade de Informática e Administração Paulista</p>
</div>