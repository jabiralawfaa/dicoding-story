import DicodingStoryApi from "../../data/dicoding-story-api";
import AuthHelper from "../../utils/auth-helper";
import StoryModel from "../../model/story-model";
import StoryPresenter from "../../presenter/story-presenter";
import StoryView from "../../view/story-view";
import { createStoryDetailTemplate } from "../templates/template-creator";
import { getUrlId } from "../../routes/url-parser";

export default class DetailPage {
  constructor() {
    // Simpan referensi ke peta untuk dibersihkan nanti
    this.map = null;
  }

  async render() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div id="story" class="story-detail-container" role="main">
          <h1 class="page-title" id="main-content" tabindex="-1">Detail Cerita</h1>
          <p class="loading-text" aria-live="polite">Memuat cerita...</p>
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
    // Tambahkan CSS untuk aksesibilitas
    this.addAccessibilityStyles();

    const storyContainer = document.querySelector("#story");
    const mainContent = document.getElementById("main-content");

    // Tambahkan event listener untuk membersihkan peta saat pengguna meninggalkan halaman
    const cleanupMap = () => {
      if (this.map) {
        this.map.remove();
        this.map = null;
        console.log("Peta dibersihkan saat meninggalkan halaman detail");
      }
    };

    // Event listener untuk saat pengguna meninggalkan halaman
    window.addEventListener("hashchange", cleanupMap);

    // Fokus ke elemen main-content untuk aksesibilitas
    if (mainContent) {
      setTimeout(() => {
        mainContent.focus();
      }, 100);
    }

    try {
      // Cek status login
      if (!AuthHelper.isUserSignedIn()) {
        storyContainer.innerHTML = `
          <div class="error-state" role="alert">
            <p>Silakan login untuk melihat detail cerita</p>
            <a href="#/login" class="btn btn-primary">Login</a>
          </div>
        `;
        return;
      }

      // Ambil ID dari URL
      const id = getUrlId();
      if (!id) {
        storyContainer.innerHTML = `
          <div class="error-state" role="alert" aria-live="assertive">
            <p>ID cerita tidak ditemukan</p>
          </div>
        `;
        return;
      }

      // Inisialisasi Model, View, dan Presenter
      const storyModel = new StoryModel();
      const storyView = new StoryView({
        storiesContainer: storyContainer,
        templateCreator: { createStoryDetailTemplate },
      });

      // Tambahkan method untuk menampilkan detail cerita
      storyView.showStoryDetail = (story) => {
        storyContainer.innerHTML = createStoryDetailTemplate(story);

        // Inisialisasi peta jika ada lokasi
        if (story.lat && story.lon) {
          const mapContainer = document.querySelector("#detail-map");

          if (mapContainer && typeof L !== "undefined") {
            // Bersihkan peta yang ada jika ada
            if (this.map) {
              this.map.remove();
            }

            this.map = L.map(mapContainer).setView([story.lat, story.lon], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.map);

            L.marker([story.lat, story.lon])
              .addTo(this.map)
              .bindPopup(
                `
                <div class="popup-content">
                  <h2>${story.name}</h2>
                  <p>${story.description}</p>
                </div>
              `
              )
              .openPopup();
          }
        }
      };

      // Buat presenter
      const storyPresenter = new StoryPresenter({
        storyModel,
        storyView,
      });

      // Ambil token dan tampilkan detail cerita
      const { token } = AuthHelper.getAuth();
      await storyPresenter.showStoryDetail(id, token);
    } catch (error) {
      console.error("Error:", error);
      storyContainer.innerHTML = `
        <div class="error-state" role="alert" aria-live="assertive">
          <p>Terjadi kesalahan saat memuat cerita</p>
        </div>
      `;
    }
  }

  addAccessibilityStyles() {
    // Cek apakah style sudah ada
    if (!document.getElementById("accessibility-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "accessibility-styles";
      styleElement.textContent = `
        .skip-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: #005fcc;
          color: #fff;
          padding: 8px;
          z-index: 100;
          transition: top 0.3s;
        }
        .skip-link:focus {
          top: 0;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }
}
