import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore'; // para Firestore
import { getDatabase } from 'firebase/database'; // para Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyDiq2gWqDwv0oMS76BcdVIobdaijoWww0g",
  authDomain: "inventario-3f7c3.firebaseapp.com",
  projectId: "inventario-3f7c3",
  storageBucket: "inventario-3f7c3.appspot.com",
  messagingSenderId: "571714259807",
  appId: "1:571714259807:web:18590d500f96747cbb44ea",
  measurementId: "G-RNS8RJMYR0"
};

const app = initializeApp(firebaseConfig);

// Inicializando o serviço de autenticação


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Para Firestore
const db = getFirestore(app);

// Para Realtime Database
const database = getDatabase(app);

export { auth, db, database };