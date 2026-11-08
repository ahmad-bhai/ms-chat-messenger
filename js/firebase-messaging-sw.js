/* MS Chat - js/firebase-messaging-sw.js
   Service worker for MS Chat with Firebase background push. */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Path fix: sw.js is in js/ folder
importScripts('/js/sw.js'); 

firebase.initializeApp({
  apiKey: 'AIzaSyD7Nt1wwgGy5GxKFrc1NQvv8ulA3fDSJQE',
  authDomain: 'ms-chat-517b8.firebaseapp.com',
  projectId: 'ms-chat-517b8',
  storageBucket: 'ms-chat-517b8.firebasestorage.app',
  messagingSenderId: '34240289213',
  appId: '1:34240289213:web:d9f18bcfa824bbac5e1ad4'
});

// Ensure sw.js is fully loaded before Firebase handles messages
try {
  const messaging = firebase.messaging();
  
  // FCM ko background mein receive karein
  messaging.onBackgroundMessage(payload => {
    const d = payload.data || {};
    
    // Agar FCM ne default notification bheja hai to dobara mat dikhao
    if (payload.notification && !d.title) return;
    
    // sw.js mein showMsgNotification define hai
    if (typeof self.showMsgNotification === 'function') {
      return self.showMsgNotification(d);
    } else {
      // Fallback: Agar sw.js load nahi hua
      console.warn('showMsgNotification not defined, using default');
      return self.registration.showNotification(d.title || 'MS Chat', {
        body: d.body || '',
        icon: '/icon-512.png',
        data: d
      });
    }
  });
} catch (e) { 
  console.error('Firebase messaging error:', e);
}
