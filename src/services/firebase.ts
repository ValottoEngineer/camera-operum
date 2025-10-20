/**
 * Firebase Configuration
 * 
 * Este arquivo configura o Firebase usando o SDK nativo do React Native.
 * NÃO usar o Web SDK (firebase/app) - apenas @react-native-firebase/*
 * 
 * Para desenvolvimento web, usa mocks automáticos.
 * Para Android/iOS, usa SDK nativo com arquivos de configuração.
 */

import { Platform } from 'react-native';

// Verificar se estamos no ambiente web
if (Platform.OS === 'web') {
  // Usar mocks para desenvolvimento web
  console.log('🌐 Usando Firebase Web Mock para desenvolvimento');
  const { auth, firestore } = require('./firebase.web');
  export { auth, firestore };
} else {
  // Usar SDK nativo para Android/iOS
  console.log('📱 Usando Firebase Nativo para', Platform.OS);
  
  const { initializeApp, getApps } = require('@react-native-firebase/app');
  
  // Verificar se o Firebase já foi inicializado
  if (getApps().length === 0) {
    // A inicialização é automática com os arquivos nativos
    initializeApp();
  }
  
  // Exportar para uso em outros serviços
  export { default as auth } from '@react-native-firebase/auth';
  export { default as firestore } from '@react-native-firebase/firestore';
}
