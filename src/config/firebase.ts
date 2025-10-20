import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase para Android
const androidConfig = {
  apiKey: "AIzaSyAFtlJZcMiDFQHV1-IHEbJxWrn8Lv50hcc",
  authDomain: "operum-app-mobile-sp4.firebaseapp.com",
  projectId: "operum-app-mobile-sp4",
  storageBucket: "operum-app-mobile-sp4.firebasestorage.app",
  messagingSenderId: "214615855553",
  appId: "1:214615855553:android:0d466b19d8281cde541f40",
  databaseURL: "https://operum-app-mobile-sp4-default-rtdb.firebaseio.com"
};

// Configuração do Firebase para iOS
const iosConfig = {
  apiKey: "AIzaSyCP-wRMo_Wiit4jjuXh8tXnxBnHM0Y0IvA",
  authDomain: "operum-app-mobile-sp4.firebaseapp.com",
  projectId: "operum-app-mobile-sp4",
  storageBucket: "operum-app-mobile-sp4.firebasestorage.app",
  messagingSenderId: "214615855553",
  appId: "1:214615855553:ios:cd204caf53579663541f40",
  databaseURL: "https://operum-app-mobile-sp4-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
const app = initializeApp(androidConfig);

// Exportar instância de autenticação
export const auth = getAuth(app);
export default app;
