// CSS imports
import "../styles/styles.css";

// Leaflet CSS untuk peta
import "leaflet/dist/leaflet.css";

// Import aplikasi dan helper
import App from "./pages/app";
import NotificationHelper from "./utils/notification-helper";
import AuthHelper from "./utils/auth-helper";

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

// Fungsi untuk mendeteksi status online/offline dan menerapkan kelas yang sesuai
const setupOnlineOfflineDetection = () => {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle("is-online", isOnline);
    document.body.classList.toggle("is-offline", !isOnline);

    console.log(`Aplikasi sekarang ${isOnline ? "online" : "offline"}`);

    // Tampilkan notifikasi status koneksi jika berubah
    const statusMessage = document.createElement("div");
    statusMessage.className = isOnline ? "message success" : "message error";
    statusMessage.textContent = isOnline ? "Anda kembali online. Semua fitur tersedia." : "Anda sedang offline. Beberapa fitur mungkin tidak tersedia.";
    statusMessage.style.position = "fixed";
    statusMessage.style.bottom = "20px";
    statusMessage.style.right = "20px";
    statusMessage.style.zIndex = "9999";
    statusMessage.style.padding = "10px 20px";
    statusMessage.style.borderRadius = "4px";
    statusMessage.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

    document.body.appendChild(statusMessage);

    // Hapus notifikasi setelah beberapa detik
    setTimeout(() => {
      if (statusMessage.parentNode) {
        statusMessage.parentNode.removeChild(statusMessage);
      }
    }, 3000);
  };

  // Tambahkan event listener untuk perubahan status koneksi
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Periksa status awal
  updateOnlineStatus();
};

// Variabel untuk menyimpan event beforeinstallprompt
let deferredPrompt;

// Fungsi untuk menampilkan popup instalasi PWA
const setupInstallPopup = () => {
  // Tangkap event beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Cegah Chrome menampilkan popup instalasi otomatis
    e.preventDefault();
    // Simpan event untuk digunakan nanti
    deferredPrompt = e;
    // Tampilkan popup instalasi kustom
    showInstallPrompt();
  });

  // Tangkap event appinstalled
  window.addEventListener('appinstalled', () => {
    // Sembunyikan popup instalasi jika ada
    hideInstallPrompt();
    // Reset deferredPrompt
    deferredPrompt = null;
    // Tampilkan pesan sukses
    showMessage('Aplikasi berhasil diinstal!', 'success');
  });
};

// Fungsi untuk menampilkan popup instalasi
const showInstallPrompt = () => {
  // Periksa apakah popup sudah ada
  if (document.querySelector('.install-prompt')) return;
  
  // Buat elemen popup
  const promptContainer = document.createElement('div');
  promptContainer.className = 'install-prompt';
  promptContainer.innerHTML = `
    <div class="install-prompt__content">
      <div class="install-prompt__header">
        <img src="/favicon.png" alt="Dicoding Story Logo" class="install-prompt__logo">
        <h3>Instal Dicoding Story</h3>
        <button class="install-prompt__close" aria-label="Tutup popup">&times;</button>
      </div>
      <div class="install-prompt__body">
        <p>Instal aplikasi ini untuk pengalaman yang lebih baik:</p>
        <ul>
          <li>Akses lebih cepat</li>
          <li>Bekerja secara offline</li>
          <li>Tampilan layar penuh</li>
        </ul>
      </div>
      <div class="install-prompt__footer">
        <button class="btn btn-secondary install-prompt__later">Nanti</button>
        <button class="btn btn-primary install-prompt__install">Instal Sekarang</button>
      </div>
    </div>
  `;
  
  // Tambahkan ke body
  document.body.appendChild(promptContainer);
  
  // Tambahkan event listener untuk tombol tutup
  promptContainer.querySelector('.install-prompt__close').addEventListener('click', () => {
    hideInstallPrompt();
  });
  
  // Tambahkan event listener untuk tombol nanti
  promptContainer.querySelector('.install-prompt__later').addEventListener('click', () => {
    hideInstallPrompt();
  });
  
  // Tambahkan event listener untuk tombol instal
  promptContainer.querySelector('.install-prompt__install').addEventListener('click', async () => {
    if (!deferredPrompt) {
      showMessage('Tidak dapat menginstal aplikasi saat ini', 'error');
      hideInstallPrompt();
      return;
    }
    
    // Tampilkan prompt instalasi browser
    deferredPrompt.prompt();
    // Tunggu user merespons prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Log hasil
    console.log(`User ${outcome === 'accepted' ? 'menerima' : 'menolak'} instalasi`);
    // Reset deferredPrompt
    deferredPrompt = null;
    // Sembunyikan popup
    hideInstallPrompt();
  });
};

// Fungsi untuk menyembunyikan popup instalasi
const hideInstallPrompt = () => {
  const promptContainer = document.querySelector('.install-prompt');
  if (promptContainer) {
    promptContainer.classList.add('install-prompt--hide');
    setTimeout(() => {
      if (promptContainer.parentNode) {
        promptContainer.parentNode.removeChild(promptContainer);
      }
    }, 300);
  }
};

// Fungsi untuk menampilkan popup izin notifikasi
const showNotificationPrompt = () => {
  // Periksa apakah browser mendukung notifikasi
  if (!('Notification' in window)) {
    console.warn('Browser ini tidak mendukung notifikasi');
    return;
  }
  
  // Periksa apakah izin sudah diberikan atau ditolak
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return;
  }
  
  // Periksa apakah popup sudah ada
  if (document.querySelector('.notification-prompt')) return;
  
  // Buat elemen popup
  const promptContainer = document.createElement('div');
  promptContainer.className = 'notification-prompt';
  promptContainer.innerHTML = `
    <div class="notification-prompt__content">
      <div class="notification-prompt__header">
        <img src="/favicon.png" alt="Dicoding Story Logo" class="notification-prompt__logo">
        <h3>Aktifkan Notifikasi</h3>
        <button class="notification-prompt__close" aria-label="Tutup popup">&times;</button>
      </div>
      <div class="notification-prompt__body">
        <p>Dapatkan pemberitahuan tentang:</p>
        <ul>
          <li>Cerita baru dari pengguna lain</li>
          <li>Komentar pada cerita Anda</li>
          <li>Pembaruan aplikasi penting</li>
        </ul>
      </div>
      <div class="notification-prompt__footer">
        <button class="btn btn-secondary notification-prompt__later">Nanti</button>
        <button class="btn btn-primary notification-prompt__allow">Izinkan Notifikasi</button>
      </div>
    </div>
  `;
  
  // Tambahkan ke body
  document.body.appendChild(promptContainer);
  
  // Tambahkan event listener untuk tombol tutup
  promptContainer.querySelector('.notification-prompt__close').addEventListener('click', () => {
    hideNotificationPrompt();
  });
  
  // Tambahkan event listener untuk tombol nanti
  promptContainer.querySelector('.notification-prompt__later').addEventListener('click', () => {
    hideNotificationPrompt();
  });
  
  // Tambahkan event listener untuk tombol izinkan
  promptContainer.querySelector('.notification-prompt__allow').addEventListener('click', async () => {
    hideNotificationPrompt();
    try {
      const permissionGranted = await NotificationHelper.requestPermission();
      if (permissionGranted && AuthHelper.isUserSignedIn()) {
        await NotificationHelper.subscribeToPush();
        showMessage('Notifikasi berhasil diaktifkan!', 'success');
      } else if (!permissionGranted) {
        showMessage('Izin notifikasi ditolak', 'info');
      }
    } catch (error) {
      console.error('Gagal mengaktifkan notifikasi:', error);
      showMessage('Gagal mengaktifkan notifikasi', 'error');
    }
  });
};

// Fungsi untuk menyembunyikan popup notifikasi
const hideNotificationPrompt = () => {
  const promptContainer = document.querySelector('.notification-prompt');
  if (promptContainer) {
    promptContainer.classList.add('notification-prompt--hide');
    setTimeout(() => {
      if (promptContainer.parentNode) {
        promptContainer.parentNode.removeChild(promptContainer);
      }
    }, 300);
  }
};

// Fungsi untuk menampilkan pesan
const showMessage = (message, type = 'info') => {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;
  messageElement.style.position = 'fixed';
  messageElement.style.bottom = '20px';
  messageElement.style.right = '20px';
  messageElement.style.zIndex = '9999';
  messageElement.style.padding = '10px 20px';
  messageElement.style.borderRadius = '4px';
  messageElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  
  document.body.appendChild(messageElement);
  
  setTimeout(() => {
    if (messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }, 3000);
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

  // Setup deteksi online/offline
  setupOnlineOfflineDetection();
  
  // Setup popup instalasi PWA
  setupInstallPopup();

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
      
      // Tampilkan popup izin notifikasi setelah 5 detik
      setTimeout(() => {
        showNotificationPrompt();
      }, 5000);
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
