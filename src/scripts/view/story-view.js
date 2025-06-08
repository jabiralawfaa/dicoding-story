class StoryView {
  constructor({
    storiesContainer,
    mapContainer = null,
    templateCreator,
  }) {
    this.storiesContainer = storiesContainer;
    this.mapContainer = mapContainer;
    this.templateCreator = templateCreator;
  }

  showLoading() {
    this.storiesContainer.innerHTML = '<p class="loading-text">Memuat cerita...</p>';
  }

  hideLoading() {
    // Implementasi jika diperlukan
  }

  showError(message) {
    this.storiesContainer.innerHTML = `<p class="error-text">${message}</p>`;
  }

  showSuccess(message) {
    // Implementasi untuk menampilkan pesan sukses
    alert(message);
  }

  showStories(stories) {
    if (stories.length === 0) {
      this.storiesContainer.innerHTML = '<p class="empty-text">Tidak ada cerita yang tersedia</p>';
      return;
    }

    this.storiesContainer.innerHTML = '';
    stories.forEach((story) => {
      const storyElement = document.createElement('div');
      storyElement.innerHTML = this.templateCreator.createStoryItemTemplate(story);
      this.storiesContainer.appendChild(storyElement.firstElementChild);
    });

    // Jika ada map container dan stories memiliki lokasi, tampilkan di peta
    if (this.mapContainer && stories.some(story => story.lat && story.lon)) {
      this.showStoriesOnMap(stories);
    }
  }

  showStoryDetail(story) {
    this.storiesContainer.innerHTML = this.templateCreator.createStoryDetailTemplate(story);
    
    // Jika story memiliki lokasi dan map container tersedia, tampilkan di peta
    if (this.mapContainer && story.lat && story.lon) {
      this.showStoryLocationOnMap(story);
    }
  }

  showStoriesOnMap(stories) {
    if (!this.mapContainer) return;
    
    // Periksa status koneksi sebelum mencoba memuat peta
    if (!navigator.onLine) {
      this.mapContainer.innerHTML = `
        <div class="offline-state">
          <p>Peta tidak tersedia saat offline. Silakan periksa koneksi internet Anda.</p>
        </div>
      `;
      return;
    }
    
    try {
      // Implementasi peta menggunakan Leaflet
      const map = L.map(this.mapContainer).setView([-2.548926, 118.0148634], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      stories
        .filter(story => story.lat && story.lon)
        .forEach(story => {
          L.marker([story.lat, story.lon])
            .addTo(map)
            .bindPopup(`
              <h3>${story.name}</h3>
              <p>${story.description}</p>
            `)
            .openPopup();
        });
    } catch (error) {
      console.error('Error loading map:', error);
      this.mapContainer.innerHTML = `
        <div class="error-state">
          <p>Gagal memuat peta. Silakan coba lagi nanti.</p>
        </div>
      `;
    }
  }

  showStoryLocationOnMap(story) {
    if (!this.mapContainer || !story.lat || !story.lon) return;
    
    const detailMap = document.getElementById('detail-map');
    if (!detailMap) return;
    
    // Periksa status koneksi sebelum mencoba memuat peta
    if (!navigator.onLine) {
      // Tidak perlu menambahkan pesan di sini karena sudah ditangani di template
      return;
    }
    
    try {
      const map = L.map(detailMap).setView([story.lat, story.lon], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <h2>${story.name}</h2>
            <p>${story.description}</p>
          </div>
        `)
        .openPopup();
    } catch (error) {
      console.error('Error loading map:', error);
      detailMap.innerHTML = `
        <div class="error-state">
          <p>Gagal memuat peta. Silakan coba lagi nanti.</p>
        </div>
      `;
    }
  }
}

export default StoryView;