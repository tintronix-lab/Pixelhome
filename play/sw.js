/* PixelFlow offline cache — generated at build time. */
const CACHE = 'pixelflow-87cbe0fe6f30';
const ASSETS = ["./","./assets/index-HEORK5xi.js","./assets/consent-status.enum-CdMsqkrY.js","./assets/de-5K5C7AA_.js","./assets/definitions-BdWVgBTV.js","./assets/dist-CMedSjkm.js","./assets/es-D388mDY8.js","./assets/esm-CciX6-2-.js","./assets/fr-J-I8hTwk.js","./assets/it-tGbP_AsT.js","./assets/ja-Y7owF2ub.js","./assets/ko-CkTrngq6.js","./assets/nl-DIFiKmOQ.js","./assets/pluginsWeb-CKrcRjth.js","./assets/preload-helper-CRzLMJPS.js","./assets/pt-BR-ByKRd5Df.js","./assets/sv-DbfJLrae.js","./assets/web-0Gf_qZUK.js","./assets/web-BM7xF5pS.js","./assets/web-BntV1nSB.js","./assets/web-Df3Htl63.js","./assets/web-L0Bi5kY9.js","./assets/web-vkiGPX-z.js","./assets/weekly-DrYQWqRL.js","./assets/zh-Hant-CJvueOdd.js","./assets/index-DRI3RqNS.css","./assets/solver.worker-BiqF2Vou.js","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./manifest.webmanifest","./studio.png"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith('pixelflow-') && key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    // Network first for the page itself so updates arrive promptly; cache when offline.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./', copy));
          return response;
        })
        .catch(() => caches.match('./')),
    );
    return;
  }
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
