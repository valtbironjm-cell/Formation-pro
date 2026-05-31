const CACHE = 'formation-pro-v3';
const ASSETS = ['./','./index.html','./app.compiled.js','./course_data.js','./advanced_data.js','./manifest.json','./icon-192.png','./icon-512.png'];
const CDN = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ASSETS).then(() => c.addAll(CDN).catch(()=>{}))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // API calls: network only, offline fallback message
  if (url.includes('api.anthropic.com')) {
    e.respondWith(
      fetch(e.request).catch(()=>
        new Response(JSON.stringify({error:{message:"Hors ligne — connexion requise pour les fonctionnalités IA en live."}}),
          {headers:{'Content-Type':'application/json'}})
      )
    );
    return;
  }
  // Static: cache first, then network + cache update
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
