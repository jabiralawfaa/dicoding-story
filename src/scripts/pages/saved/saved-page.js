import StoryModel from "../../model/story-model";
import AuthHelper from "../../utils/auth-helper";
import { createStoryItemTemplate } from "../templates/template-creator";

export default class SavedPage {
  constructor() {
    this.storyModel = new StoryModel();
  }

  async render() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Cerita Tersimpan</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div id="saved-stories" class="stories-container" role="main">
          <div class="stories-list" id="saved-stories-list">
            <p class="loading-text" aria-live="polite">Memuat cerita tersimpan...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Konfigurasi ikon Leaflet jika tersedia
    if (typeof L !== "undefined") {
      L.Icon.Default.prototype.options.iconUrl = "/images/leaflet/marker-icon.svg";
      L.Icon.Default.prototype.options.shadowUrl = "/images/leaflet/marker-shadow.svg";
      L.Icon.Default.prototype.options.iconSize = [25, 41];
      L.Icon.Default.prototype.options.shadowSize = [41, 41];
    }
    const storiesContainer = document.querySelector("#saved-stories-list");

    // Fokus ke elemen main-content untuk aksesibilitas
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      setTimeout(() => {
        mainContent.focus();
      }, 100);
    }

    // Cek status login
    if (!AuthHelper.isUserSignedIn()) {
      storiesContainer.innerHTML = `
        <div class="error-state" role="alert">
          <p>Silakan login untuk melihat cerita tersimpan</p>
          <a href="#/login" class="btn btn-primary">Login</a>
        </div>
      `;
      return;
    }

    try {
      // Tampilkan loading
      storiesContainer.innerHTML = '<p class="loading-text">Memuat cerita tersimpan...</p>';

      // Ambil data dari IndexedDB
      const response = await this.storyModel.getStoriesFromIndexedDB();

      if (response.error) {
        storiesContainer.innerHTML = `
          <div class="error-state" role="alert">
            <p>${response.message}</p>
          </div>
        `;
        return;
      }

      const stories = response.listStory;

      if (stories.length === 0) {
        storiesContainer.innerHTML = `
          <div class="empty-state" role="alert">
            <p>Tidak ada cerita tersimpan</p>
            <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
          </div>
        `;
        return;
      }

      // Tampilkan cerita
      storiesContainer.innerHTML = "";
      stories.forEach((story) => {
        const storyElement = document.createElement("div");
        storyElement.classList.add("story-item-container");
        storyElement.innerHTML = `
          ${createStoryItemTemplate(story)}
          <button class="btn btn-danger delete-story" data-id="${story.id}" aria-label="Hapus cerita ${story.name}">Hapus</button>
        `;
        storiesContainer.appendChild(storyElement);
      });

      // Tambahkan event listener untuk tombol hapus
      this.initDeleteButtons();
    } catch (error) {
      console.error("Error in SavedPage:", error);
      storiesContainer.innerHTML = `
        <div class="error-state" role="alert">
          <p>Terjadi kesalahan saat memuat cerita tersimpan</p>
        </div>
      `;
    }
  }

  initDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-story");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        const storyName = event.target.getAttribute("aria-label").replace("Hapus cerita ", "");

        // Konfirmasi penghapusan
        if (confirm(`Apakah Anda yakin ingin menghapus cerita "${storyName}" dari penyimpanan lokal?`)) {
          try {
            const response = await this.storyModel.deleteStoryFromIndexedDB(id);

            if (response.error) {
              alert(response.message);
              return;
            }

            // Hapus elemen dari DOM
            const storyContainer = event.target.closest(".story-item-container");
            storyContainer.remove();

            // Cek apakah masih ada cerita tersisa
            const storiesContainer = document.querySelector("#saved-stories-list");
            if (storiesContainer.children.length === 0) {
              storiesContainer.innerHTML = `
                <div class="empty-state" role="alert">
                  <p>Tidak ada cerita tersimpan</p>
                  <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
                </div>
              `;
            }

            // Tampilkan pesan sukses
            alert("Cerita berhasil dihapus dari penyimpanan lokal");
          } catch (error) {
            console.error("Error deleting story:", error);
            alert("Terjadi kesalahan saat menghapus cerita");
          }
        }
      });
    });
  }
}
