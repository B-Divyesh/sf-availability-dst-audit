const CACHE = 'availability-dst-audit-v6';
const SHELL = ['/', '/?demo=1', '/demo/', '/privacy/', '/terms/', '/404.html', '/offline.html', '/favicon.svg', '/apple-touch-icon.png', '/time-boundary-preview.png', '/assets/main.js', '/assets/style.css', '/assets/time-boundary-observatory.webp', '/assets/time-boundary-observatory.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestedUrl = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    const fallbackDocument = requestedUrl.searchParams.get('demo') === '1' ? '/?demo=1' : requestedUrl.pathname;
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok && requestedUrl.origin === self.location.origin) {
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }).catch(() => caches.match(fallbackDocument).then((cached) => cached || caches.match('/offline.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, clone));
    }
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/offline.html') : Response.error())));
});
