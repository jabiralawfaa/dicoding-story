class AddStoryView {
  constructor() {
    this.map = null;
    this.marker = null;
    this.currentPosition = null;
    this.stream = null;
    this.cleanupCamera = null;
    this.mapContainer = null;
    this.mapInitialized = false;
    this.mapInitializationAttempted = false;
    this.coordinatesContainer = null;
    this.observer = null;
    this.ACCESSIBILITY_MESSAGES = {
      CAMERA_ACTIVE: 'Kamera aktif, siap mengambil foto',
      CAMERA_ERROR: 'Gagal mengakses kamera, silakan coba lagi atau gunakan opsi unggah',
      LOCATION_LOADING: 'Sedang mendapatkan lokasi Anda, harap tunggu',
      LOCATION_SUCCESS: 'Lokasi berhasil didapatkan dan ditampilkan pada peta',
      LOCATION_ERROR: 'Gagal mendapatkan lokasi, silakan pilih lokasi secara manual pada peta',
      LOCATION_UPDATED: 'Lokasi diperbarui pada peta',
      LOCATION_SELECTED: 'Lokasi baru dipilih dari peta',
      FORM_SUBMITTING: 'Sedang mengirim cerita, harap tunggu',
      FORM_SUCCESS: 'Cerita berhasil dikirim! Anda akan dialihkan ke halaman utama',
      FORM_ERROR: 'Terjadi kesalahan saat mengirim cerita, silakan coba lagi',
      PHOTO_REQUIRED: 'Silakan pilih foto untuk melanjutkan'
    };
  }
  
  getTemplate() {
    return `
      <section class="container">
        <a href="#main-content" class="skip-link">Lewati ke konten utama</a>
        <h1 class="page-title" id="main-content" tabindex="-1">Tambah Cerita Baru</h1>
        
        <div class="back-button">
          <a href="#/" class="btn btn-secondary" aria-label="Kembali ke halaman utama">← Kembali</a>
        </div>
        
        <div class="form-container">
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">Cerita</label>
              <textarea id="description" name="description" rows="5" required aria-describedby="descriptionHelp"></textarea>
              <small id="descriptionHelp" class="form-text">Ceritakan pengalaman Anda</small>
            </div>
            
            <div class="form-group">
              <label for="photo">Foto</label>
              <div class="photo-capture-container">
                <input type="file" id="photo" name="photo" accept="image/*" capture="environment" required aria-describedby="photoHelp">
                <button type="button" id="openCameraButton" class="btn btn-secondary">Buka Kamera</button>
                <small id="photoHelp" class="form-text">Pilih foto atau ambil foto dengan kamera</small>
              </div>
              <div class="camera-container" id="cameraContainer" hidden aria-hidden="true">
                <video id="cameraPreview" autoplay playsinline aria-label="Pratinjau kamera"></video>
                <button type="button" id="captureButton" class="btn btn-primary" aria-label="Ambil foto dari kamera">Ambil Foto</button>
                <button type="button" id="closeCameraButton" class="btn btn-secondary" aria-label="Tutup kamera">Tutup Kamera</button>
              </div>
              <canvas id="photoCanvas" hidden></canvas>
              <div id="imagePreview" class="image-preview" aria-live="polite"></div>
            </div>
            
            <div class="form-group">
              <label for="locationMap">Lokasi</label>
              <div class="location-controls">
                <button type="button" id="getLocationButton" class="btn btn-secondary" aria-describedby="locationHelp">Gunakan Lokasi Saya</button>
                <span id="locationStatus" aria-live="polite"></span>
              </div>
              <small id="locationHelp" class="form-text">Klik pada peta untuk memilih lokasi atau gunakan lokasi saat ini</small>
              <div id="locationMap" class="location-map" tabindex="0" aria-label="Peta untuk memilih lokasi" role="application" aria-describedby="locationHelp"></div>
              <input type="hidden" id="lat" name="lat">
              <input type="hidden" id="lon" name="lon">
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Kirim Cerita</button>
            </div>
          </form>
          
          <div id="addStoryMessage" class="message" role="status" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  showLoading() {
    const submitButton = document.querySelector('#submitButton');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Mengirim...';
    }
  }

  hideLoading() {
    const submitButton = document.querySelector('#submitButton');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Kirim Cerita';
    }
  }
  
  initFileInput(callback) {
    const photoInput = document.querySelector('#photo');
    if (photoInput) {
      photoInput.addEventListener('change', callback);
    }
  }
  
  setupCleanupHandlers() {
    // Tambahkan event listener untuk membersihkan kamera saat pengguna meninggalkan halaman
    this.cleanupCamera = () => {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
        const cameraPreview = document.querySelector('#cameraPreview');
        if (cameraPreview) {
          cameraPreview.srcObject = null;
        }
        console.log('Kamera dimatikan saat meninggalkan halaman');
      }
    };
    
    // Event listener untuk saat pengguna meninggalkan halaman
    window.addEventListener('hashchange', this.cleanupCamera);
    window.addEventListener('beforeunload', this.cleanupCamera);
    
    // Tambahkan observer untuk membersihkan event listener saat komponen dihancurkan
    const app = document.getElementById('app') || document.body;
    if (app) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && !app.contains(document.querySelector('#addStoryForm'))) {
            // Halaman telah berubah, bersihkan event listener
            if (this.cleanupCamera) {
              this.cleanupCamera();
              window.removeEventListener('hashchange', this.cleanupCamera);
              window.removeEventListener('beforeunload', this.cleanupCamera);
              console.log('Event listener dibersihkan');
            }
            this.observer.disconnect();
          }
        });
      });
      
      this.observer.observe(app, { childList: true, subtree: true });
    }
  }
  
  redirectToHome(delay = 2000) {
    setTimeout(() => {
      window.location.href = '#/';
    }, delay);
  }

  showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert error';
    errorContainer.setAttribute('role', 'alert');
    errorContainer.setAttribute('aria-live', 'assertive');
    errorContainer.textContent = message;

    // Hapus pesan error sebelumnya jika ada
    const existingError = document.querySelector('.alert.error');
    if (existingError) {
      existingError.remove();
    }

    // Tambahkan pesan error baru
    const form = document.querySelector('#addStoryForm');
    form.insertBefore(errorContainer, form.firstChild);

    // Hapus pesan error setelah 5 detik
    setTimeout(() => {
      errorContainer.remove();
    }, 5000);
  }

  showSuccess(message) {
    const successContainer = document.createElement('div');
    successContainer.className = 'alert success';
    successContainer.setAttribute('role', 'alert');
    successContainer.setAttribute('aria-live', 'polite');
    successContainer.textContent = message;

    // Hapus pesan sukses sebelumnya jika ada
    const existingSuccess = document.querySelector('.alert.success');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    // Tambahkan pesan sukses baru
    const form = document.querySelector('#addStoryForm');
    form.insertBefore(successContainer, form.firstChild);
  }

  initMap() {
    // Tandai bahwa inisialisasi peta sudah dicoba
    this.mapInitializationAttempted = true;
    
    // Pastikan mapContainer sudah diinisialisasi
    this.mapContainer = document.getElementById('locationMap');
    
    if (!this.mapContainer) {
      console.error('Map container not found');
      return null;
    }
    
    if (typeof L === 'undefined') {
      console.error('Leaflet library is not loaded');
      return null;
    }
    
    try {
      // Coba inisialisasi peta
      this.map = L.map(this.mapContainer).setView([-2.548926, 118.0148634], 5);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // Buat container untuk menampilkan koordinat
      this.createCoordinatesContainer();

      // Tambahkan event listener untuk klik pada peta
      this.map.on('click', (e) => {
        this.updateMarker(e.latlng.lat, e.latlng.lng);
        this.announceLocationUpdate('Lokasi baru dipilih dari peta');
      });
      
      // Tandai bahwa peta berhasil diinisialisasi
      this.mapInitialized = true;
      
      return this.map;
    } catch (error) {
      console.error('Error initializing map:', error);
      return null;
    }
  }

  createCoordinatesContainer() {
    // Hapus container koordinat yang sudah ada jika ada
    if (this.coordinatesContainer) {
      this.coordinatesContainer.remove();
    }

    // Buat container baru untuk menampilkan koordinat
    this.coordinatesContainer = document.createElement('div');
    this.coordinatesContainer.className = 'coordinates-info';
    this.coordinatesContainer.setAttribute('role', 'status');
    this.coordinatesContainer.setAttribute('aria-live', 'polite');
    this.coordinatesContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    this.coordinatesContainer.style.padding = '8px';
    this.coordinatesContainer.style.borderRadius = '4px';
    this.coordinatesContainer.style.marginTop = '10px';
    this.coordinatesContainer.style.fontSize = '14px';
    this.coordinatesContainer.style.fontWeight = 'bold';
    this.coordinatesContainer.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';

    // Tambahkan container koordinat ke dalam container peta
    this.mapContainer.parentNode.insertBefore(this.coordinatesContainer, this.mapContainer.nextSibling);
  }

  displayCoordinates(lat, lng) {
    // Pastikan container koordinat sudah dibuat
    if (!this.coordinatesContainer) {
      this.createCoordinatesContainer();
    }

    // Format koordinat dengan 6 angka desimal
    const formattedLat = lat.toFixed(6);
    const formattedLng = lng.toFixed(6);

    // Tampilkan koordinat dalam container
    this.coordinatesContainer.innerHTML = `
      <div>Koordinat yang dipilih:</div>
      <div>Latitude: ${formattedLat}</div>
      <div>Longitude: ${formattedLng}</div>
    `;
  }

  updateMarker(lat, lng) {
    // Pastikan map sudah diinisialisasi
    if (!this.map) {
      console.error('Map belum diinisialisasi');
      return;
    }
    
    // Hapus marker sebelumnya jika ada
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    try {
      // Tambahkan marker baru
      this.marker = L.marker([lat, lng]).addTo(this.map);
      this.currentPosition = { lat, lng };

      // Update nilai input tersembunyi
      const latInput = document.querySelector('#lat');
      const lonInput = document.querySelector('#lon');
      if (latInput && lonInput) {
        latInput.value = lat;
        lonInput.value = lng;
      }

      // Tampilkan informasi koordinat
      this.displayCoordinates(lat, lng);

      // Zoom ke lokasi
      this.map.setView([lat, lng], 13);
    } catch (error) {
      console.error('Error saat menambahkan marker:', error);
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.announceLocationUpdate('Geolokasi tidak didukung oleh browser Anda');
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      this.announceLocationUpdate('Sedang mendapatkan lokasi Anda, harap tunggu');

      // Pastikan peta sudah diinisialisasi sebelum mendapatkan posisi
      if (!this.map) {
        // Coba inisialisasi peta jika belum ada
        this.mapContainer = document.getElementById('locationMap');
        if (this.mapContainer) {
          this.initMap();
        }
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Pastikan peta sudah diinisialisasi sebelum memperbarui marker
          if (this.map) {
            this.updateMarker(latitude, longitude);
            this.announceLocationUpdate('Lokasi berhasil didapatkan dan ditampilkan pada peta');
            // Tampilkan koordinat lokasi saat ini
            this.displayCoordinates(latitude, longitude);
          } else {
            console.error('Peta belum diinisialisasi saat mencoba memperbarui marker');
            this.announceLocationUpdate('Gagal menampilkan lokasi pada peta, silakan coba lagi');
          }
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          let errorMessage = 'Gagal mendapatkan lokasi';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Izin geolokasi ditolak';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia';
              break;
            case error.TIMEOUT:
              errorMessage = 'Waktu permintaan lokasi habis';
              break;
            case error.UNKNOWN_ERROR:
              errorMessage = 'Terjadi kesalahan yang tidak diketahui';
              break;
          }
          this.announceLocationUpdate(errorMessage);
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  initCameraButton(openCameraCallback, closeCameraCallback, captureCallback) {
    const openCameraButton = document.querySelector('#openCameraButton');
    const closeCameraButton = document.querySelector('#closeCameraButton');
    const captureButton = document.querySelector('#captureButton');

    if (openCameraButton) {
      openCameraButton.addEventListener('click', openCameraCallback);
    }

    if (closeCameraButton) {
      closeCameraButton.addEventListener('click', closeCameraCallback);
    }

    if (captureButton) {
      captureButton.addEventListener('click', captureCallback);
    }
  }

  initLocationButton(getCurrentPositionCallback) {
    const getLocationButton = document.querySelector('#getLocationButton');
    if (getLocationButton) {
      getLocationButton.addEventListener('click', getCurrentPositionCallback);
    }
  }

  initFormSubmit(submitCallback) {
    const form = document.querySelector('#addStoryForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitCallback(event);
      });
    }
  }

  openCamera() {
    const cameraContainer = document.querySelector('#cameraContainer');
    const cameraPreview = document.querySelector('#cameraPreview');
    const openCameraButton = document.querySelector('#openCameraButton');

    if (cameraContainer && cameraPreview) {
      cameraContainer.hidden = false;
      cameraContainer.setAttribute('aria-hidden', 'false');
      openCameraButton.disabled = true;

      return navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          this.stream = stream;
          cameraPreview.srcObject = stream;
          this.announceAccessibilityMessage('Kamera aktif, siap mengambil foto');
          return stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
          this.announceAccessibilityMessage('Gagal mengakses kamera, silakan coba lagi atau gunakan opsi unggah');
          this.closeCamera();
          throw error;
        });
    }
    return Promise.reject(new Error('Camera elements not found'));
  }

  closeCamera() {
    const cameraContainer = document.querySelector('#cameraContainer');
    const cameraPreview = document.querySelector('#cameraPreview');
    const openCameraButton = document.querySelector('#openCameraButton');

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (cameraPreview) {
      cameraPreview.srcObject = null;
    }

    if (cameraContainer) {
      cameraContainer.hidden = true;
      cameraContainer.setAttribute('aria-hidden', 'true');
    }

    if (openCameraButton) {
      openCameraButton.disabled = false;
    }
  }

  capturePhoto() {
    const cameraPreview = document.querySelector('#cameraPreview');
    const photoCanvas = document.querySelector('#photoCanvas');
    const imagePreview = document.querySelector('#imagePreview');
    const photoInput = document.querySelector('#photo');

    if (cameraPreview && photoCanvas && imagePreview) {
      // Set canvas dimensions to match video
      photoCanvas.width = cameraPreview.videoWidth;
      photoCanvas.height = cameraPreview.videoHeight;

      // Draw video frame to canvas
      const context = photoCanvas.getContext('2d');
      context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);

      // Convert canvas to blob
      photoCanvas.toBlob((blob) => {
        // Create preview image
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.alt = 'Preview foto yang diambil';

        // Clear previous preview and add new image
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);

        // Create a File object from the blob
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });

        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        // Set the file input's files
        if (photoInput) {
          photoInput.files = dataTransfer.files;
        }

        // Close camera after capturing
        this.closeCamera();
      }, 'image/jpeg', 0.8);
    }
  }

  handleFileInput(event) {
    const file = event.target.files[0];
    const imagePreview = document.querySelector('#imagePreview');

    if (file && imagePreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Preview foto yang diunggah';

        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }

  getFormData() {
    const description = document.querySelector('#description').value;
    const photoInput = document.querySelector('#photo');
    const latInput = document.querySelector('#lat');
    const lonInput = document.querySelector('#lon');

    const formData = {
      description,
      photo: photoInput.files[0],
      lat: latInput && latInput.value ? parseFloat(latInput.value) : null,
      lon: lonInput && lonInput.value ? parseFloat(lonInput.value) : null
    };

    return formData;
  }

  resetForm() {
    const form = document.querySelector('#addStoryForm');
    const imagePreview = document.querySelector('#imagePreview');

    if (form) {
      form.reset();
    }

    if (imagePreview) {
      imagePreview.innerHTML = '';
    }

    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    this.currentPosition = null;
  }

  announceAccessibilityMessage(message) {
    const liveRegion = document.querySelector('#accessibilityAnnouncer');
    if (!liveRegion) {
      const announcer = document.createElement('div');
      announcer.id = 'accessibilityAnnouncer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }

    const announcer = document.querySelector('#accessibilityAnnouncer');
    announcer.textContent = message;
  }

  announceLocationUpdate(message) {
    const locationStatus = document.querySelector('#locationStatus');
    if (locationStatus) {
      locationStatus.textContent = message;
    }
    this.announceAccessibilityMessage(message);
  }
}

export default AddStoryView;