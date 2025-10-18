import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getAuth, browserLocalPersistence, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import { firebaseWebConfig } from './config';

// Inicializar Firebase apenas se não estiver já inicializado
const app = getApps().length === 0 ? initializeApp(firebaseWebConfig) : getApps()[0];

// Configurar Auth com persistência adequada para cada plataforma
let auth;
if (Platform.OS === 'web') {
  // Para web, usar initializeAuth com persistência adequada
  try {
    auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    });
  } catch (error) {
    // Se já foi inicializado, usar getAuth
    auth = getAuth(app);
  }
} else {
  // Para mobile, usar getAuth normal
  auth = getAuth(app);
}

// Exportar instâncias
export { auth };
export const db = getFirestore(app);
export default app;
