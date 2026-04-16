// ============================================================
//  PETRESCUE MX — Configuración de Firebase
//  1. Ve a https://console.firebase.google.com
//  2. Proyecto → Configuración → Tus apps → </> Web
//  3. Copia los valores y pégalos aquí
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getAnalytics } from "firebase/analytics";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb6fozFyn_7NBofGztR03VI2Kfzx41ez0",
  authDomain: "petrescue-c087f.firebaseapp.com",
  projectId: "petrescue-c087f",
  storageBucket: "petrescue-c087f.firebasestorage.app",
  messagingSenderId: "1029578348032",
  appId: "1:1029578348032:web:65b4b82e6b826cb355eae5",
  measurementId: "G-YXN9Y4QS4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
