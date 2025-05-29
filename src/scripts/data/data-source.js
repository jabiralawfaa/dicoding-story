import CONFIG from "../config";

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

class DataSource {
  static async openDB() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Browser ini tidak mendukung IndexedDB"));
        return;
      }

      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onerror = (event) => {
        reject(new Error("Error membuka database: " + event.target.errorCode));
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Buat object store jika belum ada
        if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
          console.log(`Object store ${OBJECT_STORE_NAME} berhasil dibuat`);
        }
      };
    });
  }

  static async saveStories(stories) {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);

      // Simpan setiap cerita ke dalam database
      stories.forEach((story) => {
        store.put(story);
      });

      return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
          resolve(true);
          console.log("Cerita berhasil disimpan ke IndexedDB");
        };

        tx.onerror = (event) => {
          reject(new Error("Gagal menyimpan cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat menyimpan cerita:", error);
      throw error;
    }
  }

  static async saveStory(story) {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);

      store.put(story);

      return new Promise((resolve, reject) => {
        tx.oncomplete = () => {
          resolve(true);
          console.log("Cerita berhasil disimpan ke IndexedDB");
        };

        tx.onerror = (event) => {
          reject(new Error("Gagal menyimpan cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat menyimpan cerita:", error);
      throw error;
    }
  }

  static async getAllStories() {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readonly");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          reject(new Error("Gagal mengambil cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat mengambil cerita:", error);
      throw error;
    }
  }

  static async getStoryById(id) {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readonly");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (event) => {
          reject(new Error("Gagal mengambil cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat mengambil cerita:", error);
      throw error;
    }
  }

  static async deleteStory(id) {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(true);
          console.log(`Cerita dengan ID ${id} berhasil dihapus`);
        };

        request.onerror = (event) => {
          reject(new Error("Gagal menghapus cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat menghapus cerita:", error);
      throw error;
    }
  }

  static async clearAllStories() {
    try {
      const db = await this.openDB();
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      const request = store.clear();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(true);
          console.log("Semua cerita berhasil dihapus");
        };

        request.onerror = (event) => {
          reject(new Error("Gagal menghapus semua cerita: " + event.target.errorCode));
        };
      });
    } catch (error) {
      console.error("Error saat menghapus semua cerita:", error);
      throw error;
    }
  }
}

export default DataSource;
