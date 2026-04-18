importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.5.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC74Yy1umbex7FlZbo3WLb9Skr3YRyDGDA",
  authDomain: "n423-6048d.firebaseapp.com",
  projectId: "n423-6048d",
  storageBucket: "n423-6048d.appspot.com",
  messagingSenderId: "358545178901",
  appId: "1:358545178901:web:19ce544398e43bb601e91c",
});

const messaging = firebase.messaging();
const PUSH_ICON_URL = "/icons/dt-android-notif-icon.png?v=2";
const PUSH_BADGE_URL = "/icons/dt-android-notif-badge.png?v=2";

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || "DreamTeam Update";
  const options = {
    body: payload?.notification?.body || "You have a new update.",
    icon: PUSH_ICON_URL,
    badge: PUSH_BADGE_URL,
    data: payload?.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/dashboard.html") && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow("/dashboard.html");
        }

        return undefined;
      })
  );
});
