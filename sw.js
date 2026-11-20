/* DeadlineGuard Service Worker — offline shell + Web Push */
const CACHE_NAME = 'deadlineguard-shell-v2';
const APP_SHELL = new URL('./index.html', self.registration.scope).href;
const ASSETS = [
  APP_SHELL,
  new URL('./manifest.json', self.registration.scope).href,
  new URL('./icons/icon-192.png', self.registration.scope).href,
  new URL('./icons/icon-512.png', self.registration.scope).href,
  new URL('./icons/icon-maskable-512.png', self.registration.scope).href
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('deadlineguard-') && name !== CACHE_NAME)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) || (await caches.match(APP_SHELL));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (error) {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'DeadlineGuard: Pengingat Tugas';
  const options = {
    body: payload.body || 'Ada tugas yang mendekati tenggat waktu.',
    icon: new URL('./icons/icon-192.png', self.registration.scope).href,
    badge: new URL('./icons/icon-192.png', self.registration.scope).href,
    tag: payload.tag || `deadlineguard-push-${Date.now()}`,
    renotify: true,
    silent: false,
    vibrate: [250, 120, 250],
    timestamp: Date.now(),
    data: { url: payload.url || './' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || './', self.registration.scope).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('focus' in client) {
        if ('navigate' in client && client.url !== targetUrl) await client.navigate(targetUrl);
        return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
  })());
});
