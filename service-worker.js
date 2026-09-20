const CACHE = 'body-fasting-v3.2';
const APP_SHELL = ['./', './body-fasting-v3.2-ux.html', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL).catch(() => null)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url || './body-fasting-v3.2-ux.html';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
    for (const client of list) {
      if ('focus' in client) {
        client.postMessage({type:'CHECK_TIMER'});
        return client.focus();
      }
    }
    return clients.openWindow ? clients.openWindow(target) : null;
  }));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'APP_READY') event.source?.postMessage({type:'CHECK_TIMER'});
});
