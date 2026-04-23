importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "AIzaSyDb6fozFyn_7NBofGztR03VI2Kfzx41ez0",
  authDomain:        "petrescue-c087f.firebaseapp.com",
  projectId:         "petrescue-c087f",
  storageBucket:     "petrescue-c087f.firebasestorage.app",
  messagingSenderId: "1029578348032",
  appId:             "1:1029578348032:web:65b4b82e6b826cb355eae5"
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
      return clients.openWindow('/mapa.html');
    })
  );
});
