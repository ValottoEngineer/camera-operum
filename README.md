# Operum Mobile App - SP4

Aplicativo mobile React Native desenvolvido com Expo e Firebase nativo para gestão de clientes de investimento.

## 📱 Sobre o Projeto

**Operum** é um MVP desenvolvido para o SP4 (Semestre 4) que permite:
- Autenticação segura via Firebase Auth
- CRUD completo de clientes com perfil de risco e liquidez
- Interface futurista e minimalista
- Sincronização em tempo real via Firestore
- Suporte offline nativo

## 🚀 Setup Super Simples

### 1. Instalar e executar
```bash
npm install
npm start
```

### 2. Escolher plataforma
- **Web**: Pressione `w` no terminal (desenvolvimento rápido)
- **Android**: Pressione `a` no terminal
- **iOS**: Pressione `i` no terminal

## 🔧 Configuração Firebase (apenas para build nativo)

### Para desenvolvimento web:
- ✅ Funciona imediatamente com `npm start` + `w`
- ✅ Dados mock para desenvolvimento rápido

### Para Android/iOS nativo:
1. Configure Firebase Console
2. Baixe `google-services.json` e `GoogleService-Info.plist`
3. Execute:
```bash
npm run prebuild
npm run android  # ou npm run ios
```

## 📱 Scripts Disponíveis

```bash
npm start          # Expo Dev Server (recomendado)
npm run android    # Android via Expo
npm run ios        # iOS via Expo  
npm run web        # Web via Expo
npm run prebuild   # Gerar código nativo (só se necessário)
npm run setup      # Verificar configuração
```

## ⚡ Desenvolvimento Rápido

1. `npm install`
2. `npm start`
3. Pressione `w` para web
4. Comece a desenvolver!

O app funciona perfeitamente no navegador para desenvolvimento, e você só precisa do build nativo quando for testar no dispositivo físico.

## 🔥 Configuração Firestore

### Regras de Segurança

Configure no Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/clientes/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### Estrutura de Dados

```
users/{uid}/clientes/{docId}
├── nome: string
├── perfilRisco: 'conservador' | 'moderado' | 'agressivo'
├── liquidez: 'baixa' | 'média' | 'alta'
├── objetivos: string
└── createdAt: Timestamp
```

## 🎨 Funcionalidades

### Autenticação
- ✅ Login com email/senha
- ✅ Cadastro de novos usuários
- ✅ Recuperação de senha
- ✅ Validação de formulários
- ✅ Mensagens de erro em português

### Gestão de Clientes
- ✅ Lista de clientes em tempo real
- ✅ Criar novo cliente
- ✅ Editar cliente existente
- ✅ Excluir cliente (com confirmação)
- ✅ Filtros por perfil de risco e liquidez
- ✅ Interface responsiva

### UX/UI
- ✅ Tema futurista com gradientes
- ✅ Navegação fluida
- ✅ Loading states
- ✅ Feedback de sucesso/erro
- ✅ Tratamento de interrupções de rede
- ✅ Acessibilidade básica

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── UI/                 # Componentes reutilizáveis
│   └── Layout/             # Componentes de layout
├── navigation/             # Configuração de navegação
├── screens/
│   ├── Auth/              # Telas de autenticação
│   └── App/               # Telas principais do app
├── services/              # Serviços Firebase
├── styles/                # Tema e estilos
├── types/                 # Definições TypeScript
└── utils/                 # Utilitários
```

## 🔧 Scripts Disponíveis

```bash
npm start          # Iniciar Expo Dev Server
npm run android    # Executar no Android
npm run ios        # Executar no iOS
npm run prebuild   # Gerar código nativo
npm run clean      # Limpar e regenerar código nativo
```

## 📱 Testando o App

### 1. Autenticação
- Crie uma conta com email válido
- Teste login/logout
- Teste recuperação de senha

### 2. CRUD de Clientes
- Adicione clientes com diferentes perfis
- Edite informações existentes
- Exclua clientes
- Verifique sincronização em tempo real

### 3. Validações
- Teste campos obrigatórios
- Teste formatos inválidos
- Teste cenários de erro de rede

## ⚠️ Notas Importantes

- **SDK Nativo**: Usa apenas `@react-native-firebase/*`, NÃO `firebase/app`
- **Offline**: Firestore tem persistência offline habilitada por padrão
- **Segurança**: Dados são isolados por usuário via regras Firestore
- **LGPD**: Informações sobre uso de dados incluídas no app

## 🐛 Solução de Problemas

### Erro de build Android
```bash
npx expo prebuild --clean
npx expo run:android
```

### Erro de build iOS
```bash
cd ios && pod install && cd ..
npx expo run:ios
```

### Firebase não conecta
- Verifique se os arquivos nativos estão nos locais corretos
- Confirme se as regras do Firestore estão configuradas
- Verifique se a autenticação está habilitada no Firebase Console

## 📄 Licença

Projeto acadêmico - FIAP SP4

---

**Desenvolvido com ❤️ usando React Native + Firebase Nativo**
