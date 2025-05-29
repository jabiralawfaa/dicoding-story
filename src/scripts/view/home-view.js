class HomeView {
  constructor({ storiesContainer, mapContainer }) {
    this.storiesContainer = storiesContainer;
    this.mapContainer = mapContainer;
  }

  showLoading() {
    this.storiesContainer.innerHTML = '<p class="loading-text">Memuat cerita...</p>';
  }

  hideLoading() {
    // Implementasi jika diperlukan
  }

  updateAuthButtons(isSignedIn) {
    const loginButton = document.querySelector("#loginButton");
    const logoutButton = document.querySelector("#logoutButton");
    const notificationButton = document.querySelector("#notificationButton");
    const savedButton = document.querySelector("#savedButton");

    if (isSignedIn) {
      loginButton.style.display = "none";
      logoutButton.style.display = "inline-block";
      notificationButton.style.display = "inline-block";
      savedButton.style.display = "inline-block";
    } else {
      loginButton.style.display = "inline-block";
      logoutButton.style.display = "none";
      notificationButton.style.display = "none";
      savedButton.style.display = "none";
    }
  }

  setLogoutButtonEvent(callback) {
    const logoutButton = document.querySelector("#logoutButton");
    logoutButton.addEventListener("click", callback);
  }

  redirectToHome() {
    window.location.href = "#/";
    window.location.reload();
  }

  showLoginMessage() {
    this.storiesContainer.innerHTML = `
      <div class="empty-state" role="alert" aria-live="polite">
        <p>Silakan login untuk melihat cerita</p>
      </div>
    `;
  }

  showEmptyState() {
    this.storiesContainer.innerHTML = `
      <div class="empty-state" role="alert" aria-live="polite">
        <p>Tidak ada cerita yang tersedia</p>
      </div>
    `;
  }

  showError(message) {
    this.storiesContainer.innerHTML = `
      <div class="error-state" role="alert" aria-live="assertive">
        <p>${message}</p>
      </div>
    `;
  }

  showStories(stories, templateCreator) {
    this.storiesContainer.innerHTML = "";
    stories.forEach((story) => {
      this.storiesContainer.innerHTML += templateCreator.createStoryItemTemplate(story);
    });
  }

  initMap(stories) {
    if (this.mapContainer && typeof L !== "undefined") {
      const map = L.map(this.mapContainer).setView([-2.548926, 118.0148634], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Tambahkan marker untuk setiap cerita yang memiliki lokasi
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker
            .bindPopup(
              `
            <div class="popup-content">
              <h2>${story.name}</h2>
              <img src="${story.photoUrl}" alt="${story.name}" style="width: 100%; max-width: 200px;">
              <p>${story.description}</p>
            </div>
          `
            )
            .openPopup();
        }
      });
    } else if (!this.mapContainer) {
      console.error("Map container not found");
    } else {
      console.error("Leaflet library is not loaded");
    }
  }

  afterRender() {
    // Tambahkan CSS untuk aksesibilitas
    this.addAccessibilityStyles();

    const mainContent = document.getElementById("main-content");

    // Fokus ke elemen main-content untuk aksesibilitas
    if (mainContent) {
      setTimeout(() => {
        mainContent.focus();
      }, 100);
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

export default HomeView;
