import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// Tabs Navigator
export type TabsParamList = {
  Home: undefined;
  Clients: undefined;
  Profile: undefined;
};

// App Stack (main app with tabs)
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<TabsParamList>;
  ClientForm: { clientId?: string };
  ClientDetail: { clientId: string };
  WalletForm: { clientId?: string; walletId?: string };
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// Global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
