const cacheName = 'snake-v1';
self.addEventListener('install', (e) => {
    console.log('sw installed');
    e.waitUntil(caches.open(cacheName).then(cache => {
        return cache.addAll([
            '/',
            '/index.html',
            '/snale.js'
        ]);
    }));
    self.skipWaiting();
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.match(e.request).then(response => {
        if (response) {
            return response;
        }
        let fetchRequest = e.request.clone();
        return fetch(fetchRequest).then(response => {
            if (!response || response.status !== 200) {
                return response;
            }
            let responseToCache = response.clone();
            caches.open(cacheName).then(cache => {
                cache.put(e.request, responseToCache);
            });
            return response;
        });
    }));
});
