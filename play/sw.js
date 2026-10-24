/* PixelFlow offline cache — generated at build time. */
const CACHE = 'pixelflow-78feac6c1e99';
const ASSETS = ["./","./assets/index-Be1FLWV0.js","./assets/consent-status.enum-CdMsqkrY.js","./assets/de-PRwGjRY7.js","./assets/definitions-BdWVgBTV.js","./assets/dist-CMedSjkm.js","./assets/es-qQGcxq7y.js","./assets/esm-CciX6-2-.js","./assets/fr-wBR9sUYo.js","./assets/it-D4rvajbr.js","./assets/ja-nU-OpjTK.js","./assets/ko-Cf00uKf5.js","./assets/nl-DwlXtwdI.js","./assets/pluginsWeb-DNZrkZeu.js","./assets/preload-helper-CRzLMJPS.js","./assets/pt-BR-DP1uFTl2.js","./assets/sv-DPLntcsO.js","./assets/web-0Gf_qZUK.js","./assets/web-BM7xF5pS.js","./assets/web-BntV1nSB.js","./assets/web-Df3Htl63.js","./assets/web-L0Bi5kY9.js","./assets/web-vkiGPX-z.js","./assets/weekly-DrYQWqRL.js","./assets/zh-Hant-CQ-4On4L.js","./assets/index-vrP7YxDi.css","./assets/solver.worker-BiqF2Vou.js","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./manifest.webmanifest","./studio.png"];

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
