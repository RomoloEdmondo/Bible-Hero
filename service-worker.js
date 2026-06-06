const CACHE_NAME = "bibbia-interattiva-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./informazioni.html",
  "./lezioni.html",
  "./ordina.html",
  "./quiz.html",
  "./timeline.html",
  "./footer.html",
  "./manifest.webmanifest",
  "./script.js",
  "./style/style.css",
  "./style/home.css",
  "./style/footer.css",
  "./style/informazioni.css",
  "./style/lezioni.css",
  "./style/ordina.css",
  "./style/quiz.css",
  "./style/timeline.css",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then(response => response || caches.match("./index.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
