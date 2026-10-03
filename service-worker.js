const CACHE='body-fasting-v36';
const APP=['./','./index.html','./manifest.webmanifest','./jszip.min.js','./pdf.min.mjs','./pdf.worker.min.mjs','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;
  }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
self.addEventListener('message',event=>{if(event.data?.type==='APP_READY')event.source?.postMessage({type:'CHECK_TIMER'})});
