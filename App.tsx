import { registerRootComponent } from 'expo';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import RootNavigator from './src/app/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <StatusBar 
        style="light" 
        backgroundColor={Platform.OS === 'web' ? undefined : "#6402FF"} 
      />
      <RootNavigator />
    </>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
