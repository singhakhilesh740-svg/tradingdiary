const CACHE_NAME = 'tradelog-v27';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Let ALL requests go directly to network — no caching interference
  // This prevents SW from blocking auth redirects and CDN requests
  return;
});
