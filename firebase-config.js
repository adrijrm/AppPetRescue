// ============================================================
//  PETRESCUE MX — Configuración de Firebase
//  1. Ve a https://console.firebase.google.com
//  2. Proyecto → Configuración → Tus apps → </> Web
//  3. Copia los valores y pégalos aquí
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 👇 Reemplaza estos valores con los de tu proyecto
const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
