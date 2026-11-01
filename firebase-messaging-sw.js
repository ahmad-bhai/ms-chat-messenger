/* MS Chat - firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
importScripts('/sw.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD7Nt1wwgGy5GxKFrc1NQvv8ulA3fDSJQE',
  authDomain: 'ms-chat-517b8.firebaseapp.com',
  projectId: 'ms-chat-517b8',
  storageBucket: 'ms-chat-517b8.firebasestorage.app',
  messagingSenderId: '34240289213',
  appId: '1:34240289213:web:d9f18bcfa824bbac5e1ad4'
});

try {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage(payload => {
    const d = payload.data || {};
    if (payload.notification && !d.title) return;
    if (typeof self.showMsgNotification === 'function') {
      return self.showMsgNotification(d);
    }
  });
} catch (e) {
  // FCM optional
}
