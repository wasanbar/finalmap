// Simple offline-first cache for GitHub Pages
const CACHE_NAME = "ramallah-heritage-v4";
const CORE = [
  "./",
  "./index.html",
  "./tours.html",
  "./map.html",
  "./building.html",
  "./about.html",
  "./passport.html",
  "./css/styles.css",
  "./js/common.js",
  "./data/buildings.json",
  "./data/tours.json",
  "./assets/img/placeholder.jpg",
  "./assets/img/favicon.png",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png",
  "./manifest.json",
  "./assets/img/placeholders/admin.svg",
  "./assets/img/placeholders/alley.svg",
  "./assets/img/placeholders/archaeology.svg",
  "./assets/img/placeholders/art.svg",
  "./assets/img/placeholders/cafe.svg",
  "./assets/img/placeholders/church.svg",
  "./assets/img/placeholders/culture.svg",
  "./assets/img/placeholders/heritage.svg",
  "./assets/img/placeholders/library.svg",
  "./assets/img/placeholders/market.svg",
  "./assets/img/placeholders/mosque.svg",
  "./assets/img/placeholders/park.svg",
  "./assets/img/placeholders/stop.svg",
  "./assets/img/placeholders/street_art.svg",
  "./assets/img/placeholders/view.svg",
  "./assets/img/placeholders/viewpoint.svg",
  "./assets/img/commons/al-manara.jpg",
  "./assets/img/commons/darwish-museum.jpg",
  "./assets/img/commons/friends-school.jpg",
  "./assets/img/commons/holy-family.jpg",
  "./assets/img/commons/melkite-annunciation.jpg",
  "./assets/img/commons/transfiguration-ramallah.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(()=> self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k!==CACHE_NAME) ? caches.delete(k) : null)))
      .then(()=> self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin requests
  if(url.origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        // Update cache for GET
        if(req.method === "GET" && res && res.status === 200){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(()=> cached);
      // Prefer cache first for speed, fall back to network
      return cached || fetchPromise;
    })
  );
});
