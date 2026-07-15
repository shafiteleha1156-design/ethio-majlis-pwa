// Firebase wrapper with a transparent local fallback so the app is fully
// functional even before real Firebase keys are added.
// Uses Firebase v10 modular SDK via CDN (loaded lazily only when configured).
import { firebaseConfig, isConfigured, vapidKey } from './firebase-config.js';
import { store } from './store.js';

const LS_USER = 'ethio-majlis:user';
const LS_USERS = 'ethio-majlis:local-users';

let fb = null;            // { app, auth, db, storage, analytics, messaging, mods }
let authListeners = new Set();
let currentUser = readLocalUser();

// ---------- Public auth state ----------
export function onAuth(cb) {
  authListeners.add(cb);
  cb(currentUser);
  return () => authListeners.delete(cb);
}
function emitAuth() { authListeners.forEach((cb) => cb(currentUser)); }
export function getUser() { return currentUser; }

function readLocalUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER) || 'null'); } catch { return null; }
}
function writeLocalUser(u) {
  currentUser = u;
  if (u) localStorage.setItem(LS_USER, JSON.stringify(u));
  else localStorage.removeItem(LS_USER);
  emitAuth();
}

// ---------- Lazy init of the real SDK ----------
export async function initFirebase() {
  if (!isConfigured) return null;
  if (fb) return fb;
  const [appMod, authMod, fsMod, stMod, anMod] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js').catch(() => null),
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db = fsMod.getFirestore(app);
  const storage = stMod.getStorage(app);
  let analytics = null;
  try { if (anMod && (await anMod.isSupported())) analytics = anMod.getAnalytics(app); } catch {}
  fb = { app, auth, db, storage, analytics, mods: { appMod, authMod, fsMod, stMod, anMod } };

  authMod.onAuthStateChanged(auth, (u) => {
    writeLocalUser(u ? {
      uid: u.uid, email: u.email, name: u.displayName || (u.email || '').split('@')[0],
      photo: u.photoURL || '', provider: (u.providerData[0] || {}).providerId || 'password',
    } : null);
  });
  return fb;
}

// ---------- Auth actions (real or local) ----------
export async function signUp(name, email, password) {
  if (isConfigured) {
    const { auth, mods } = await initFirebase();
    const cred = await mods.authMod.createUserWithEmailAndPassword(auth, email, password);
    await mods.authMod.updateProfile(cred.user, { displayName: name });
    writeLocalUser({ uid: cred.user.uid, email, name, photo: '', provider: 'password' });
    return currentUser;
  }
  // local
  const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
  if (users[email]) throw new Error('An account with this email already exists.');
  users[email] = { password, name };
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  writeLocalUser({ uid: 'local-' + btoa(email).slice(0, 10), email, name, photo: '', provider: 'password' });
  return currentUser;
}

export async function signIn(email, password) {
  if (isConfigured) {
    const { auth, mods } = await initFirebase();
    const cred = await mods.authMod.signInWithEmailAndPassword(auth, email, password);
    writeLocalUser({
      uid: cred.user.uid, email: cred.user.email,
      name: cred.user.displayName || email.split('@')[0], photo: cred.user.photoURL || '', provider: 'password',
    });
    return currentUser;
  }
  const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
  const u = users[email];
  if (!u || u.password !== password) throw new Error('Invalid email or password.');
  writeLocalUser({ uid: 'local-' + btoa(email).slice(0, 10), email, name: u.name, photo: '', provider: 'password' });
  return currentUser;
}

export async function signInWithGoogle() {
  if (isConfigured) {
    const { auth, mods } = await initFirebase();
    const provider = new mods.authMod.GoogleAuthProvider();
    const cred = await mods.authMod.signInWithPopup(auth, provider);
    writeLocalUser({
      uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName,
      photo: cred.user.photoURL || '', provider: 'google.com',
    });
    return currentUser;
  }
  // local demo google user
  writeLocalUser({ uid: 'demo-google', email: 'guest@ethio-majlis.app', name: 'Ethio-Majlis Guest', photo: '', provider: 'google.com' });
  return currentUser;
}

export async function resetPassword(email) {
  if (isConfigured) {
    const { auth, mods } = await initFirebase();
    await mods.authMod.sendPasswordResetEmail(auth, email);
    return;
  }
  await new Promise((r) => setTimeout(r, 500));
}

export async function signOutUser() {
  if (isConfigured && fb) {
    await fb.mods.authMod.signOut(fb.auth);
  }
  writeLocalUser(null);
}

export async function updateUserProfile({ name, photo }) {
  const u = { ...currentUser, ...(name ? { name } : {}), ...(photo ? { photo } : {}) };
  if (isConfigured && fb?.auth?.currentUser) {
    await fb.mods.authMod.updateProfile(fb.auth.currentUser, {
      displayName: name ?? undefined, photoURL: photo ?? undefined,
    });
  }
  writeLocalUser(u);
  return u;
}

// ---------- Firestore user-data sync (with local fallback) ----------
export async function saveUserData() {
  const u = currentUser;
  if (!u) return;
  const payload = {
    bookmarks: store.get('bookmarks'), favDuas: store.get('favDuas'),
    favSurahs: store.get('favSurahs'), lastRead: store.get('lastRead'),
    quizScores: store.get('quizScores'), achievements: store.get('achievements'),
    tasbihHistory: store.get('tasbihHistory'), updatedAt: Date.now(),
  };
  if (isConfigured && fb) {
    const { fsMod, db } = fb;
    await fsMod.setDoc(fsMod.doc(db, 'users', u.uid), payload, { merge: true });
  }
  // always keep a local mirror (already in store)
}

export async function loadUserData() {
  const u = currentUser;
  if (!u || !isConfigured || !fb) return;
  const { fsMod, db } = fb;
  const snap = await fsMod.getDoc(fsMod.doc(db, 'users', u.uid));
  if (snap.exists()) store.set(snap.data());
}

// ---------- Analytics ----------
export function logEvent(name, params = {}) {
  if (isConfigured && fb?.analytics) {
    try { fb.mods.anMod.logEvent(fb.analytics, name, params); } catch {}
  }
}

// ---------- Cloud Messaging ----------
export async function enablePush() {
  if (!isConfigured) { return { ok: false, reason: 'demo' }; }
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return { ok: false, reason: 'denied' };
    const msgMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js');
    const { app } = await initFirebase();
    const messaging = msgMod.getMessaging(app);
    const reg = await navigator.serviceWorker.ready;
    const token = await msgMod.getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
    msgMod.onMessage(messaging, (p) => {
      new Notification(p.notification?.title || 'Ethio-Majlis', { body: p.notification?.body, icon: '/public/icons/icon-192.png' });
    });
    return { ok: true, token };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

export const firebaseReady = isConfigured;
