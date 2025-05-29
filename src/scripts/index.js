// CSS imports
import "../styles/styles.css";

// Leaflet CSS untuk peta
import "leaflet/dist/leaflet.css";

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

  // Setup aksesibilitas
  setupAccessibility();

  // Initialize push notifications
  try {
    await NotificationHelper.initializeNotifications();
  } catch (error) {
    console.error("Failed to initialize push notifications:", error);
  }

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    // Gunakan View Transition API jika tersedia
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
  });
});
