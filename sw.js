const CACHE_NAME = 'dynamic-cache-v1';

// Install event: nothing to pre-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("push", event=>{
  const data=event.data.json();
  self.registration.showNotification(data.title,{body:data.body});

  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
      clients.forEach(client => client.postMessage({ type: "push", payload: data }));
  });
});

// self.addEventListener('fetch', (event) => {
//   if (event.request.method !== 'GET') return;
//   event.respondWith(
//     caches.match(event.request).then(async (cachedResponse) => {
//       if (cachedResponse) {
//         try {
//           const fetchResponse = await fetch(event.request);
//           if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
//             const cache = await caches.open(CACHE_NAME);
//             cache.put(event.request, fetchResponse.clone());
//           }
//         } catch (err) {
//         }
//         return cachedResponse;
//       } else {
//         return fetch(event.request)
//           .then(async (response) => {
//             if (response && response.status === 200 && response.type === 'basic') {
//               const cache = await caches.open(CACHE_NAME);
//               cache.put(event.request, response.clone());
//             }
//             return response;
//           })
//           .catch(() => {
//           });
//       }
//     })
//   );
// });