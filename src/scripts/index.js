// CSS imports
import "../styles/styles.css";

// Leaflet CSS untuk peta
import "leaflet/dist/leaflet.css";

// Konfigurasi ikon Leaflet
document.addEventListener("DOMContentLoaded", () => {
  // Pastikan Leaflet sudah dimuat
  if (typeof L !== "undefined") {
    // Atur path default untuk ikon
    L.Icon.Default.prototype.options.iconUrl = "/images/leaflet/marker-icon.svg";
    L.Icon.Default.prototype.options.shadowUrl = "/images/leaflet/marker-shadow.svg";
    L.Icon.Default.prototype.options.iconSize = [25, 41];
    L.Icon.Default.prototype.options.shadowSize = [41, 41];
  }
});

import App from "./pages/app";
import NotificationHelper from "./utils/notification-helper";

// Fungsi untuk memastikan aksesibilitas fokus pada konten utama
const setupAccessibility = () => {
  // Pastikan skip link berfungsi dengan benar
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", (e) => {
      e.preventDefault();
      const mainContent = document.querySelector("#main-content");
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  // Check if main content exists
  if (!app.content) {
    console.error("CRITICAL: Main content element #main-content not found. App cannot render.");
    return;
  }

  // Setup aksesibilitas
  setupAccessibility();

  // Initialize push notifications
  try {
    await NotificationHelper.initializeNotifications();
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
  }

  try {
    await app.renderPage();
  } catch (error) {
    console.error("Error during initial page render:", error);
  }

  window.addEventListener("hashchange", async () => {
    // Gunakan View Transition API jika tersedia
    try {
      if (document.startViewTransition) {
        document.startViewTransition(async () => {
          await app.renderPage();
          // Fokus ke konten utama setelah navigasi
          const mainContent = document.querySelector("#main-content");
          if (mainContent) {
            mainContent.focus();
          }
        });
      } else {
        await app.renderPage();
        // Fokus ke konten utama setelah navigasi
        const mainContent = document.querySelector("#main-content");
        if (mainContent) {
          mainContent.focus();
        }
      }
    } catch (error) {
      console.error("Error during hashchange page render:", error);
    }
  });
});
