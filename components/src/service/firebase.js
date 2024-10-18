import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
const auth = getAuth(app);

export { auth };