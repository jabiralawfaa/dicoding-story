// CSS imports
import "../styles/styles.css";

// Leaflet CSS untuk peta
import "leaflet/dist/leaflet.css";

// Import aplikasi dan helper
import App from "./pages/app";
import NotificationHelper from "./utils/notification-helper";

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
  // Pastikan elemen main-content ada sebelum inisialisasi App
  const mainContent = document.querySelector("#main-content");
  const drawerButton = document.querySelector("#drawer-button");
  const navigationDrawer = document.querySelector("#navigation-drawer");

  // Periksa apakah semua elemen yang diperlukan sudah ada
  if (!mainContent) {
    console.error("CRITICAL: Main content element #main-content not found. App cannot render.");
    return;
  }

  if (!drawerButton || !navigationDrawer) {
    console.error("CRITICAL: Navigation elements not found. App may not function properly.");
  }

  const app = new App({
    content: mainContent,
    drawerButton: drawerButton,
    navigationDrawer: navigationDrawer,
  });

  // Setup aksesibilitas
  setupAccessibility();

  // Render halaman terlebih dahulu
  try {
    await app.renderPage();
  } catch (error) {
    console.error("Error during initial page render:", error);
  }

  // Initialize push notifications setelah halaman dirender
  setTimeout(async () => {
    try {
      await NotificationHelper.initializeNotifications();
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
    }
  }, 1000); // Delay 1 detik untuk memastikan halaman sudah dirender

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
      }
    } catch (error) {
      console.error("Error during hashchange page render:", error);
    }
  });
});
