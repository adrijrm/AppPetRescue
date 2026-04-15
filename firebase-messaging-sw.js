importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// 👇 Mismos valores que firebase-config.js
firebase.initializeApp({
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'PetRescue', {
    body:    body || 'Nuevo avistamiento en Puebla',
    icon:    '/icon-192.png',
    badge:   '/icon-192.png',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'ver_mapa', title: '🗺️ Ver en mapa' },
      { action: 'ignorar',  title: 'Ignorar' }
    ]
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'ignorar') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('apprescuepets'));
      if (existing) return existing.focus();
      return clients.openWindow('/mapa');
    })
  );
});
