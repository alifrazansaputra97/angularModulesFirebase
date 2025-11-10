// firebase-messaging-sw.js
// https://firebase.google.com/docs/cloud-messaging/receive-messages?platform=web
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

let vapidKey = null;
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_VAPID_KEY') {
    vapidKey = event.data.vapidKey;
    console.log('VAPID key diterima di SW:', vapidKey);
  }
});
self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: data.notification.icon || '/assets/icons/icon-72x72.png',
      data: data.notification.click_action || '/'
    })
  );
});

firebase.initializeApp({
  apiKey: "AIzaSyAopWdFrzLKgZAkdW9gXVkKh74azduFc9U",
  authDomain: "angularmodulesfirebase.firebaseapp.com",
  projectId: "angularmodulesfirebase",
  storageBucket: "angularmodulesfirebase.firebasestorage.app",
  messagingSenderId: "54309195266",
  appId: "1:54309195266:web:a961611ef67137fe29a11b",
  measurementId: "G-E72QGJQM61",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/assets/icons/icon-72x72.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  console.log(
    "[firebase-messaging-sw.js] Notification click Received.",
    event.notification
  );

  event.notification.close();

  // Contoh redirect ke halaman tertentu di app Angular
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          // Kalau ada tab yang sudah terbuka dengan URL target, fokuskan
          if (
            client.url === "https://localhost:4200/some-page" &&
            "focus" in client
          ) {
            return client.focus();
          }
        }
        // Kalau belum ada, buka tab baru ke URL target
        if (clients.openWindow) {
          return clients.openWindow("https://localhost:4200/some-page");
        }
      })
  );
});
