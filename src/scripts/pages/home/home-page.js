import StoryModel from "../../model/story-model";
import HomeView from "../../view/home-view";
import HomePresenter from "../../presenter/home-presenter";
import { createStoryItemTemplate } from "../templates/template-creator";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Dicoding Story</h1>
        
        <div class="story-action" role="navigation" aria-label="Navigasi utama">
          <a href="#/add" class="btn btn-primary" aria-label="Tambah cerita baru">Tambah Cerita</a>
          <a href="#/saved" class="btn btn-success" id="savedButton" style="display: none;" aria-label="Lihat cerita tersimpan">Cerita Tersimpan</a>
          <a href="#/notification" class="btn btn-info" id="notificationButton" style="display: none;" aria-label="Pengaturan notifikasi">Notifikasi</a>
          <a href="#/login" class="btn btn-secondary" id="loginButton" aria-label="Masuk ke akun">Login</a>
          <button class="btn btn-danger" id="logoutButton" style="display: none;" aria-label="Keluar dari akun">Logout</button>
        </div>

        <div id="map" class="map-container" tabindex="0" role="application" aria-label="Peta lokasi cerita"></div>
        
        <div id="stories" class="stories-container" role="main">
          <div class="stories-list" id="stories-list">
            <p class="loading-text" aria-live="polite">Memuat cerita...</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storiesContainer = document.querySelector("#stories-list");
    const mapContainer = document.querySelector("#map");

    // Inisialisasi Model, View, dan Presenter
    const storyModel = new StoryModel();
    const homeView = new HomeView({
      storiesContainer,
      mapContainer,
    });

    const homePresenter = new HomePresenter({
      storyModel,
      homeView,
      templateCreator: { createStoryItemTemplate },
    });

    // Jalankan presenter
    await homePresenter.init();
  }

  // Metode addAccessibilityStyles telah dipindahkan ke HomeView
}
