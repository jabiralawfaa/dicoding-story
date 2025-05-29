// Service Worker for Push Notifications
const CACHE_NAME = "dicoding-story-v1";
const urlsToCache = ["/", "/index.html", "/scripts/index.js", "/styles/styles.css", "/manifest.json", "/favicon.png", "/images/logo.png", "/offline.html"];

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
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      // Try to fetch from network
      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If both cache and network fail, return offline fallback for navigation
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }

          // Return nothing for other resources that fail
          return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

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
