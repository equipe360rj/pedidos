const CACHE_NAME = 'karaoke-v3';
const urlsToCache = [
    './',
    './index.html',
    './dados.json',
    './manifest.json'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Força o novo SW a ativar imediatamente
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache v3');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Ignora requisições para a API do Google Scripts (evita erro CORB/CORS)
    if (event.request.url.includes('script.google.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
