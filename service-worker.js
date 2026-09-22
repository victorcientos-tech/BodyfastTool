const CACHE='body-fasting-v3.3';
const APP_SHELL=['./','./body-fasting-v3.3-ux.html','./manifest.webmanifest','./pdf.min.js','./pdf.min.mjs','./pdf.worker.min.mjs'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL).catch(()=>null)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{if(e.request.method==='GET')e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>list[0]?.focus()||clients.openWindow('./body-fasting-v3.3-ux.html')))});
self.addEventListener('message',e=>{if(e.data?.type==='APP_READY')e.source?.postMessage({type:'CHECK_TIMER'})});
