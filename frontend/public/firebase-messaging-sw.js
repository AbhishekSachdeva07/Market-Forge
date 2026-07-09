importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCg7HJKKYUuetRbhBsZFhc_xAc-Ns8EHvY",
  authDomain: "tranaly-5956c.firebaseapp.com",
  projectId: "tranaly-5956c",
  storageBucket: "tranaly-5956c.firebasestorage.app",
  messagingSenderId: "176928531974",
  appId: "1:176928531974:web:5f9ddf651a58bda5ae4587",
  measurementId: "G-92940QSGP1"
});

const messaging = firebase.messaging();