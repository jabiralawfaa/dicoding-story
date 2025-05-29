import AuthHelper from "../utils/auth-helper";
import NotificationHelper from "../utils/notification-helper";

class AddStoryPresenter {
  constructor({ storyModel, addStoryView }) {
    this.storyModel = storyModel;
    this.addStoryView = addStoryView;
  }

  async init() {
    // Inisialisasi peta setelah DOM sepenuhnya dimuat
    this.addStoryView.initMap();

    // Inisialisasi event handler untuk kamera
    this.addStoryView.initCameraButton(
      () => this.openCamera(),
      () => this.closeCamera(),
      () => this.capturePhoto()
    );

    // Inisialisasi event handler untuk lokasi
    this.addStoryView.initLocationButton(() => this.getCurrentPosition());

    // Inisialisasi event handler untuk form submit
    this.addStoryView.initFormSubmit((event) => this.submitStory(event));

    // Inisialisasi event handler untuk file input
    this.addStoryView.initFileInput((event) => this.addStoryView.handleFileInput(event));

    // Setup cleanup handlers untuk kamera dan event listeners
    this.addStoryView.setupCleanupHandlers();
  }

  async openCamera() {
    try {
      await this.addStoryView.openCamera();
    } catch (error) {
      console.error("Error opening camera:", error);
    }
  }

  closeCamera() {
    this.addStoryView.closeCamera();
  }

  capturePhoto() {
    this.addStoryView.capturePhoto();
  }

  async getCurrentPosition() {
    try {
      await this.addStoryView.getCurrentPosition();
    } catch (error) {
      console.error("Error getting position:", error);
    }
  }

  async submitStory(event) {
    try {
      this.addStoryView.showLoading();

      // Dapatkan data form
      const formData = this.addStoryView.getFormData();

      // Validasi data
      if (!formData.photo) {
        this.addStoryView.showError("Silakan pilih foto untuk melanjutkan");
        this.addStoryView.hideLoading();
        return;
      }

      // Tambahkan token ke data
      const { token } = AuthHelper.getAuth();
      const storyData = {
        token,
        ...formData,
      };

      // Kirim data ke API melalui model
      const response = await this.storyModel.addStory(storyData);

      if (response.error) {
        this.addStoryView.showError(response.message || "Terjadi kesalahan saat menambahkan cerita");
        return;
      }

      // Tampilkan pesan sukses
      this.addStoryView.showSuccess("Cerita berhasil ditambahkan");

      // Tampilkan notifikasi
      try {
        await NotificationHelper.showLocalNotification("Story berhasil dibuat", {
          body: `Anda telah membuat story baru dengan deskripsi: ${formData.description.substring(0, 50)}${formData.description.length > 50 ? "..." : ""}`,
        });
      } catch (error) {
        console.error("Error showing notification:", error);
      }

      // Reset form
      this.addStoryView.resetForm();

      // Redirect ke halaman utama setelah 2 detik
      this.addStoryView.redirectToHome(2000);
    } catch (error) {
      console.error("Error submitting story:", error);
      this.addStoryView.showError("Terjadi kesalahan saat menambahkan cerita");
    } finally {
      this.addStoryView.hideLoading();
    }
  }
}

export default AddStoryPresenter;
