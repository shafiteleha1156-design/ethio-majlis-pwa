// ===================================================================
// Firebase configuration.
// Replace the placeholder values below with your real Firebase project
// keys from: Firebase Console > Project Settings > General > Your apps.
// (Web API keys are public by design and safe to ship in a client app.)
// ===================================================================
export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'ethio-majlis.firebaseapp.com',
  projectId: 'ethio-majlis',
  storageBucket: 'ethio-majlis.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// VAPID key for Web Push (Firebase Console > Cloud Messaging > Web configuration).
export const vapidKey = 'YOUR_WEB_PUSH_VAPID_KEY';

// When keys are still placeholders the app runs in fully-functional
// "offline/demo" mode: local auth + local persistence, no network calls.
export const isConfigured = !firebaseConfig.apiKey.startsWith('YOUR_');
