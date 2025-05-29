import NotificationHelper from "../utils/notification-helper";

class NotificationView {
  constructor() {
    this.isSubscribed = false;
  }

  getTemplate() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Pengaturan Notifikasi</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div class="notification-settings">
          <div class="setting-item">
            <h2>Push Notifications</h2>
            <p>Terima notifikasi ketika ada update terbaru dari aplikasi</p>
            
            <div class="notification-status" id="notificationStatus">
              <span class="status-text">Memeriksa status notifikasi...</span>
            </div>
            
            <div class="notification-controls" id="notificationControls">
              <button type="button" id="enableNotifications" class="btn btn-primary" style="display: none;">
                Aktifkan Notifikasi
              </button>
              <button type="button" id="disableNotifications" class="btn btn-secondary" style="display: none;">
                Nonaktifkan Notifikasi
              </button>
            </div>
            
            <div class="notification-info">
              <h3>Tentang Push Notifications</h3>
              <ul>
                <li>Anda akan menerima notifikasi ketika berhasil membuat story baru</li>
                <li>Notifikasi akan muncul meskipun aplikasi tidak sedang dibuka</li>
                <li>Anda dapat mengatur izin notifikasi melalui pengaturan browser</li>
                <li>Data notifikasi disimpan secara aman dan tidak dibagikan dengan pihak ketiga</li>
              </ul>
            </div>
          </div>
          
          <div class="setting-item">
            <h2>Test Notification</h2>
            <p>Kirim notifikasi test untuk memastikan fitur berfungsi dengan baik</p>
            <button type="button" id="testNotification" class="btn btn-outline">
              Kirim Test Notification
            </button>
          </div>
        </div>
        
        <div id="notificationMessage" class="message" role="status" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.checkNotificationStatus();
    this.initEventListeners();
  }

  async checkNotificationStatus() {
    const statusElement = document.querySelector("#notificationStatus .status-text");
    const enableButton = document.querySelector("#enableNotifications");
    const disableButton = document.querySelector("#disableNotifications");

    try {
      // Check if notifications are supported
      if (!("Notification" in window)) {
        statusElement.textContent = "Browser tidak mendukung notifikasi";
        statusElement.className = "status-text status-error";
        return;
      }

      // Check permission status
      const permission = Notification.permission;
      const isSubscribed = await NotificationHelper.isSubscribed();
      this.isSubscribed = isSubscribed;

      if (permission === "granted" && isSubscribed) {
        statusElement.textContent = "Notifikasi aktif";
        statusElement.className = "status-text status-success";
        enableButton.style.display = "none";
        disableButton.style.display = "inline-block";
      } else if (permission === "granted" && !isSubscribed) {
        statusElement.textContent = "Notifikasi diizinkan tapi belum berlangganan";
        statusElement.className = "status-text status-warning";
        enableButton.style.display = "inline-block";
        disableButton.style.display = "none";
      } else if (permission === "denied") {
        statusElement.textContent = "Notifikasi diblokir. Silakan aktifkan melalui pengaturan browser";
        statusElement.className = "status-text status-error";
        enableButton.style.display = "none";
        disableButton.style.display = "none";
      } else {
        statusElement.textContent = "Notifikasi belum diaktifkan";
        statusElement.className = "status-text status-inactive";
        enableButton.style.display = "inline-block";
        disableButton.style.display = "none";
      }
    } catch (error) {
      console.error("Error checking notification status:", error);
      statusElement.textContent = "Terjadi kesalahan saat memeriksa status notifikasi";
      statusElement.className = "status-text status-error";
    }
  }

  initEventListeners() {
    const enableButton = document.querySelector("#enableNotifications");
    const disableButton = document.querySelector("#disableNotifications");
    const testButton = document.querySelector("#testNotification");

    if (enableButton) {
      enableButton.addEventListener("click", () => this.enableNotifications());
    }

    if (disableButton) {
      disableButton.addEventListener("click", () => this.disableNotifications());
    }

    if (testButton) {
      testButton.addEventListener("click", () => this.sendTestNotification());
    }
  }

  async enableNotifications() {
    try {
      this.showLoading("Mengaktifkan notifikasi...");

      const permissionGranted = await NotificationHelper.requestPermission();

      if (!permissionGranted) {
        this.showError("Izin notifikasi ditolak. Silakan aktifkan melalui pengaturan browser.");
        return;
      }

      await NotificationHelper.subscribeToPush();
      this.showSuccess("Notifikasi berhasil diaktifkan!");

      // Refresh status
      await this.checkNotificationStatus();
    } catch (error) {
      console.error("Error enabling notifications:", error);
      this.showError("Gagal mengaktifkan notifikasi: " + error.message);
    } finally {
      this.hideLoading();
    }
  }

  async disableNotifications() {
    try {
      this.showLoading("Menonaktifkan notifikasi...");

      await NotificationHelper.unsubscribeFromPush();
      this.showSuccess("Notifikasi berhasil dinonaktifkan!");

      // Refresh status
      await this.checkNotificationStatus();
    } catch (error) {
      console.error("Error disabling notifications:", error);
      this.showError("Gagal menonaktifkan notifikasi: " + error.message);
    } finally {
      this.hideLoading();
    }
  }

  async sendTestNotification() {
    try {
      if (Notification.permission !== "granted") {
        this.showError("Izin notifikasi belum diberikan. Silakan aktifkan notifikasi terlebih dahulu.");
        return;
      }

      await NotificationHelper.showLocalNotification("Test Notification", {
        body: "Ini adalah notifikasi test dari Dicoding Story. Fitur notifikasi berfungsi dengan baik!",
        tag: "test-notification",
      });

      this.showSuccess("Test notification berhasil dikirim!");
    } catch (error) {
      console.error("Error sending test notification:", error);
      this.showError("Gagal mengirim test notification: " + error.message);
    }
  }

  showLoading(message = "Memproses...") {
    const messageElement = document.querySelector("#notificationMessage");
    messageElement.innerHTML = `
      <div class="alert info">
        <span class="loading-spinner"></span> ${message}
      </div>
    `;
  }

  hideLoading() {
    const messageElement = document.querySelector("#notificationMessage");
    messageElement.innerHTML = "";
  }

  showError(message) {
    const messageElement = document.querySelector("#notificationMessage");
    messageElement.innerHTML = `
      <div class="alert error" role="alert">
        ${message}
      </div>
    `;

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.hideLoading();
    }, 5000);
  }

  showSuccess(message) {
    const messageElement = document.querySelector("#notificationMessage");
    messageElement.innerHTML = `
      <div class="alert success" role="alert">
        ${message}
      </div>
    `;

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.hideLoading();
    }, 3000);
  }
}

export default NotificationView;
