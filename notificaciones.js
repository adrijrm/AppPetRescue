import { getMessaging, getToken, onMessage, deleteToken }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";
import { db, auth } from '/firebase-config.js';
import { doc, setDoc, updateDoc, deleteField, getDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 👇 Obtén tu VAPID key en: Firebase Console → Configuración → Cloud Messaging → Web Push Certificates
const VAPID_KEY = 'TU_VAPID_KEY';

let _messaging = null;
function getMsg() {
  if (!_messaging) _messaging = getMessaging();
  return _messaging;
}

export async function suscribir(uid) {
  if (!('Notification' in window)) throw new Error('Tu navegador no soporta notificaciones.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Permiso denegado. Actívalo en la configuración del navegador.');
  const reg   = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const token = await getToken(getMsg(), { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
  if (!token) throw new Error('No se pudo obtener el token.');
  await setDoc(doc(db, 'usuarios', uid), {
    fcmToken: token, notifActivas: true, tokenActualizadoEn: serverTimestamp()
  }, { merge: true });
  return token;
}

export async function desuscribir(uid) {
  try { await deleteToken(getMsg()); } catch {}
  await updateDoc(doc(db, 'usuarios', uid), { fcmToken: deleteField(), notifActivas: false });
}

export async function notifActivas(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() && snap.data()?.notifActivas === true;
}

export function escucharMensajes(cb) {
  return onMessage(getMsg(), cb);
}
