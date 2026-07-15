// Ethio-Majlis Service Worker — offline-first PWA caching.
const VERSION = 'em-v1.0.0';
const APP_SHELL = `shell-${VERSION}`;
const RUNTIME = `runtime-${VERSION}`;

const SHELL_ASSETS = [
  '/', '/index.html', '/offline.html', '/manifest.json',
  '/css/theme.css', '/css/components.css',
  '/js/app.js', '/js/router.js', '/js/store.js', '/js/utils.js',
  '/js/icons.js', '/js/i18n.js', '/js/firebase.js', '/js/firebase-config.js',
  '/js/data.js', '/js/prayer.js',
  '/public/icons/logo.png', '/public/icons/icon-192.png', '/public/icons/icon-512.png',
  '/public/images/kaaba-hero.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL);
    await Promise.allSettled(SHELL_ASSETS.map((u) => cache.add(u)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache Firebase / auth endpoints
  if (/googleapis|gstatic|firebase|identitytoolkit|firebaseio/.test(url.hostname)) return;

  // HTML navigations: network-first, fall back to cache then offline page
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put('/index.html', fresh.clone());
        return fresh;
      } catch {
        return (await caches.match('/index.html')) || (await caches.match('/offline.html'));
      }
    })());
    return;
  }

  // Static app assets: cache-first
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }

  // Cross-origin (fonts, APIs like Aladhan/AlQuran): stale-while-revalidate
  e.respondWith((async () => {
    const cache = await caches.open(RUNTIME);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => { cache.put(req, res.clone()); return res; }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});

// Push notifications
self.addEventListener('push', (e) => {
  let data = { title: 'Ethio-Majlis', body: 'You have a new notification.' };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch {}
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/public/icons/icon-192.png',
    badge: '/public/icons/icon-96.png',
    vibrate: [80, 40, 80],
    data: { url: data.url || '/' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const hit = all.find((c) => c.url.includes(self.location.origin));
    if (hit) { hit.focus(); hit.navigate(url); } else self.clients.openWindow(url);
  })());
});
