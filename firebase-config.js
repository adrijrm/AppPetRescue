import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey:            "AIzaSyDb6fozFyn_7NBofGztR03VI2Kfzx41ez0",
  authDomain:        "petrescue-c087f.firebaseapp.com",
  projectId:         "petrescue-c087f",
  storageBucket:     "petrescue-c087f.firebasestorage.app",
  messagingSenderId: "1029578348032",
  appId:             "1:1029578348032:web:65b4b82e6b826cb355eae5"
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
