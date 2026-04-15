// =============================================================
//  PetRescue MX — Firebase Cloud Functions
//  Dispara notificaciones push automáticamente cuando:
//    1. Se crea un avistamiento nuevo
//    2. Una mascota es marcada como perdida
//
//  INSTALACIÓN:
//    npm install -g firebase-tools
//    firebase init functions   (en la raíz del proyecto)
//    cd functions && npm install
//    firebase deploy --only functions
// =============================================================

const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { initializeApp }   = require('firebase-admin/app');
const { getFirestore }    = require('firebase-admin/firestore');
const { getMessaging }    = require('firebase-admin/messaging');

initializeApp();
const db  = getFirestore();
const fcm = getMessaging();

// ── HELPER: enviar notif a todos los usuarios con token ──
async function notificarATodos(titulo, cuerpo, datos = {}) {
  const snap = await db.collection('usuarios')
    .where('notifActivas', '==', true)
    .get();

  const tokens = snap.docs
    .map(d => d.data().fcmToken)
    .filter(Boolean);

  if (tokens.length === 0) return;

  // FCM acepta hasta 500 tokens por llamada
  const chunks = [];
  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    await fcm.sendEachForMulticast({
      tokens: chunk,
      notification: { title: titulo, body: cuerpo },
      webpush: {
        notification: {
          title: titulo,
          body:  cuerpo,
          icon:  '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
        },
        fcmOptions: { link: 'mapa.html' }
      },
      data: datos
    });
  }
}

// ── HELPER: enviar notif solo al dueño de la mascota ────
async function notificarAlDueno(uid, titulo, cuerpo, datos = {}) {
  const snap = await db.collection('usuarios').doc(uid).get();
  if (!snap.exists) return;
  const token = snap.data()?.fcmToken;
  if (!token) return;

  await fcm.send({
    token,
    notification: { title: titulo, body: cuerpo },
    webpush: {
      notification: {
        title: titulo,
        body:  cuerpo,
        icon:  '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
      },
      fcmOptions: { link: 'mapa.html' }
    },
    data: datos
  });
}

// ── FUNCIÓN 1: Nuevo avistamiento creado ────────────────
exports.nuevoAvistamiento = onDocumentCreated(
  'avistamientos/{docId}',
  async event => {
    const data = event.data?.data();
    if (!data) return;

    const tipo = {
      perdido:    '🔴 Mascota perdida',
      avistado:   '🟡 Mascota avistada',
      encontrado: '🟢 Mascota encontrada'
    }[data.tipo] || '🐾 Nuevo reporte';

    const zona  = data.direccion || 'Puebla';
    const desc  = data.descripcion
      ? data.descripcion.substring(0, 80)
      : 'Sin descripción';

    const titulo = `${tipo} en ${zona}`;
    const cuerpo = desc;

    await notificarATodos(titulo, cuerpo, {
      tipo:    data.tipo,
      docId:   event.params.docId,
      lat:     String(data.lat  || ''),
      lng:     String(data.lng  || ''),
    });
  }
);

// ── FUNCIÓN 2: Mascota marcada como perdida ─────────────
exports.mascotaPerdida = onDocumentUpdated(
  'mascotas/{petId}',
  async event => {
    const antes  = event.data?.before?.data();
    const despues = event.data?.after?.data();
    if (!antes || !despues) return;

    // Solo actuar cuando el estado cambia A 'perdido'
    if (antes.estado === 'perdido' || despues.estado !== 'perdido') return;

    const nombre = despues.nombre || 'Una mascota';
    const especie = despues.especie ? ` (${despues.especie})` : '';
    const titulo  = `🔴 ${nombre}${especie} está perdido`;
    const cuerpo  = `Ayuda a encontrarlo — revisa el mapa de Puebla`;

    // Notificar al dueño (recordatorio)
    if (despues.uid) {
      await notificarAlDueno(
        despues.uid,
        `Reporte activado para ${nombre}`,
        `La comunidad de Puebla ha sido notificada. Revisa el mapa.`,
        { petId: event.params.petId }
      );
    }

    // Notificar a toda la comunidad
    await notificarATodos(titulo, cuerpo, {
      petId:   event.params.petId,
      especie: despues.especie || '',
    });
  }
);

// ── FUNCIÓN 3: Mascota marcada como encontrada ──────────
exports.mascotaEncontrada = onDocumentUpdated(
  'mascotas/{petId}',
  async event => {
    const antes   = event.data?.before?.data();
    const despues  = event.data?.after?.data();
    if (!antes || !despues) return;

    // Solo actuar cuando el estado cambia DE 'perdido' A 'en_casa'
    if (antes.estado !== 'perdido' || despues.estado !== 'en_casa') return;

    const nombre = despues.nombre || 'Una mascota';

    // Notificar solo al dueño con mensaje de celebración
    if (despues.uid) {
      await notificarAlDueno(
        despues.uid,
        `🎉 ¡${nombre} está en casa!`,
        `Gracias a la comunidad de Puebla por ayudar.`,
        { petId: event.params.petId }
      );
    }
  }
);
