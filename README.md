# Operum Mobile App

Um aplicativo mobile simples e funcional desenvolvido com **Expo + React Native + TypeScript** para demonstração de fluxos de autenticação e dashboard.

## 🎨 Identidade Visual

O app utiliza uma paleta futurista neon com tons frios e vibrantes:
- **Rosa Futurista**: `#EE0BFF`
- **Lilás Neon**: `#9C0AE8` 
- **Roxo Elétrico**: `#6402FF`
- **Azul Íon**: `#240AE8`
- **Azul Futuro**: `#0B30FF`

## 🚀 Pré-requisitos

- Node.js (versão 16 ou superior)
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo móvel com Expo Go ou emulador

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm start
   ```

4. Escaneie o QR code com o Expo Go (Android/iOS) ou pressione `i` para iOS Simulator / `a` para Android Emulator

## 🔧 Funcionalidades

### Telas Disponíveis

- **Login**: Autenticação com email e senha
- **Cadastro**: Criação de nova conta com validação
- **Dashboard**: Tela principal com cards informativos

### Fluxos de Navegação

- Login ↔ Cadastro (navegação entre telas de autenticação)
- Após login bem-sucedido → Dashboard
- Logout → retorna para tela de Login

### Validações

- **Email**: Formato válido obrigatório
- **Senha**: Mínimo 6 caracteres
- **Nome**: Mínimo 2 caracteres
- **Confirmar senha**: Deve coincidir com a senha

### Feedback

- Mensagens de erro inline abaixo dos campos
- Toasts de sucesso/erro para ações
- Estados de carregamento nos botões

## 🔐 Autenticação

**Nota**: Este app utiliza autenticação simulada (mock) sem backend. Os dados são armazenados apenas em memória durante a sessão.

- Registre uma nova conta para testar
- Faça login com as credenciais criadas
- Os dados são perdidos ao fechar o app

## 🛠 Tecnologias

- **Expo** - Plataforma de desenvolvimento
- **React Native** - Framework mobile
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Expo Linear Gradient** - Gradientes
- **React Native Toast Message** - Notificações

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Context API para estado global
├── navigation/         # Configuração de navegação
├── screens/           # Telas da aplicação
├── services/          # Serviços (mock de autenticação)
├── styles/            # Tema e estilos
├── types/             # Definições de tipos
└── validation/        # Schemas de validação
```

## 🎯 Próximos Passos

- Integração com backend real
- Persistência de dados local
- Funcionalidades do dashboard
- Testes automatizados
- Deploy para stores

## 📄 Licença

Este projeto é para fins educacionais e demonstração.
