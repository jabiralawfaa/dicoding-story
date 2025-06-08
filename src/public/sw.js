// Service Worker for Push Notifications and Offline Support
const CACHE_NAME = "dicoding-story-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/scripts/index.js",
  "/styles/styles.css",
  "/manifest.json",
  "/favicon.png",
  "/images/logo.png",
  "/offline.html",
  "/images/leaflet/marker-icon.svg",
  "/images/leaflet/marker-shadow.svg",
  "/images/leaflet/leaflet-custom.css",
  // Tambahkan file CSS dan JS penting
  "/assets/index.css",
  "/assets/index.js",
  // Tambahkan aset Leaflet
  "/assets/leaflet.css",
  "/assets/leaflet.js",
  // Tambahkan font dan ikon
  "/assets/fonts/font-awesome.css",
  // Tambahkan gambar placeholder
  "/images/placeholder.png",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Service Worker: Installed");
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategi berbeda untuk API dan aset statis
  const isApiRequest = requestUrl.origin === "https://story-api.dicoding.dev";
  const isStaticAsset = event.request.url.match(/\.(css|js|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|eot)$/);

  if (isApiRequest) {
    // Network-first untuk API requests
    event.respondWith(networkFirstStrategy(event.request));
  } else if (isStaticAsset) {
    // Cache-first untuk aset statis
    event.respondWith(cacheFirstStrategy(event.request));
  } else {
    // Strategi default untuk request lainnya
    event.respondWith(defaultStrategy(event.request));
  }
});

// Strategi Cache-First: Coba cache dulu, jika tidak ada baru ke network
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    await updateCache(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Jika gagal mengambil dari network dan ini adalah gambar, kembalikan placeholder
    if (request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
      return caches.match("/images/placeholder.png");
    }

    // Jika ini adalah CSS atau JS, kembalikan respons kosong yang valid
    if (request.url.match(/\.(css|js)$/)) {
      return new Response("/* Offline fallback */", {
        headers: { "Content-Type": request.url.endsWith(".css") ? "text/css" : "application/javascript" },
      });
    }

    throw error;
  }
}

// Strategi Network-First: Coba network dulu, jika gagal baru ke cache
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    await updateCache(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Jika request adalah navigasi, kembalikan halaman offline
    if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }

    throw error;
  }
}

// Strategi Default: Kombinasi dari cache dan network
async function defaultStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Refresh cache di background
      fetch(request)
        .then((networkResponse) => updateCache(request, networkResponse))
        .catch((error) => console.log("Background fetch failed:", error));

      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    await updateCache(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Jika request adalah navigasi, kembalikan halaman offline
    if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }

    // Return error response untuk request lainnya
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Helper untuk update cache
async function updateCache(request, response) {
  if (!response || response.status !== 200 || response.type !== "basic") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response);
  }
}

// Push event handler
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push event received");

  let notificationData = {
    title: "Dicoding Story",
    options: {
      body: "Anda memiliki notifikasi baru",
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "dicoding-story",
      requireInteraction: true,
      actions: [
        {
          action: "open",
          title: "Buka Aplikasi",
        },
        {
          action: "close",
          title: "Tutup",
        },
      ],
    },
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData.title = pushData.title || notificationData.title;
      notificationData.options.body = pushData.options?.body || notificationData.options.body;
    } catch (error) {
      console.error("Error parsing push data:", error);
    }
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, notificationData.options));
});

// Notification click event handler
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "open" || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
    );
  }
  // Close action is handled by notification.close() above
});

// Background sync (optional)
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered");

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks here
      Promise.resolve()
    );
  }
});
