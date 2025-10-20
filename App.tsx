import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SimpleNavigator } from './src/navigation/SimpleNavigator';
import { theme } from './src/styles/theme';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
        <SimpleNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}