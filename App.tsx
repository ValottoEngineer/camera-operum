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
