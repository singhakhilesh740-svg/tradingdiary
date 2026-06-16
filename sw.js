const CACHE_NAME = 'tradelog-v22';

// Only cache local files — never external CDN/Firebase URLs
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS))
      .catch(err => console.warn('Cache install failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Never intercept Firebase, Google auth, or external CDN requests
  const passThrough = [
    'firebaseapp.com', 'googleapis.com', 'gstatic.com',
    'firestore.googleapis.com', 'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com', 'tradingview.com',
    'jsdelivr.net', 'cloudflare.com', 'cdnjs.cloudflare.com'
  ];
  if (passThrough.some(d => url.hostname.includes(d))) return;

  // For local files: cache first, fallback to network
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request)
        .catch(() => caches.match('/index.html'))
      )
  );
});
