import DicodingStoryApi from "../data/dicoding-story-api";
import DataSource from "../data/data-source";
  
class StoryModel {
  async getAllStories(options) {
    try {
      // Coba ambil data dari API
      const response = await DicodingStoryApi.getAllStories(options);

      // Jika berhasil, simpan ke IndexedDB
      if (!response.error && response.listStory) {
        await DataSource.saveStories(response.listStory);
      }

      return response;
    } catch (error) {
      console.error("Error in getAllStories model:", error);
      console.log("Mencoba mengambil data dari IndexedDB...");

      // Jika gagal mengambil dari API, coba ambil dari IndexedDB
      try {
        const stories = await DataSource.getAllStories();
        return {
          error: false,
          listStory: stories,
          message: "Data diambil dari penyimpanan lokal",
        };
      } catch (dbError) {
        console.error("Error mengambil data dari IndexedDB:", dbError);
        throw error; // Throw error asli jika IndexedDB juga gagal
      }
    }
  }

  async getStoryDetail(id, token) {
    try {
      // Coba ambil data dari API
      const response = await DicodingStoryApi.getStoryDetail({ id, token });

      // Jika berhasil, simpan ke IndexedDB
      if (!response.error && response.story) {
        await DataSource.saveStory(response.story);
      }

      return response;
    } catch (error) {
      console.error("Error in getStoryDetail model:", error);
      console.log("Mencoba mengambil data detail dari IndexedDB...");

      // Jika gagal mengambil dari API, coba ambil dari IndexedDB
      try {
        const story = await DataSource.getStoryById(id);
        if (story) {
          return {
            error: false,
            story,
            message: "Data detail diambil dari penyimpanan lokal",
          };
        }
        throw new Error("Data tidak ditemukan di penyimpanan lokal");
      } catch (dbError) {
        console.error("Error mengambil data detail dari IndexedDB:", dbError);
        throw error; // Throw error asli jika IndexedDB juga gagal
      }
    }
  }

  async addStory(storyData) {
    try {
      const response = await DicodingStoryApi.postStory(storyData);

      // Jika berhasil menambahkan cerita, perbarui IndexedDB
      if (!response.error) {
        // Ambil data terbaru dari server setelah menambahkan cerita
        const { token } = storyData;
        const updatedResponse = await DicodingStoryApi.getAllStories({ token });
        if (!updatedResponse.error && updatedResponse.listStory) {
          await DataSource.saveStories(updatedResponse.listStory);
        }
      }

      return response;
    } catch (error) {
      console.error("Error in addStory model:", error);
      throw error;
    }
  }

  async getStoriesFromIndexedDB() {
    try {
      const stories = await DataSource.getAllStories();
      return {
        error: false,
        listStory: stories,
        message: "Data diambil dari penyimpanan lokal",
      };
    } catch (error) {
      console.error("Error mengambil data dari IndexedDB:", error);
      return {
        error: true,
        message: "Gagal mengambil data dari penyimpanan lokal",
      };
    }
  }

  async deleteStoryFromIndexedDB(id) {
    try {
      await DataSource.deleteStory(id);
      return {
        error: false,
        message: "Cerita berhasil dihapus dari penyimpanan lokal",
      };
    } catch (error) {
      console.error("Error menghapus data dari IndexedDB:", error);
      return {
        error: true,
        message: "Gagal menghapus data dari penyimpanan lokal",
      };
    }
  }
}

export default StoryModel;
