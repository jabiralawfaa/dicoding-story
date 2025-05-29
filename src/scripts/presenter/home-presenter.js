import AuthHelper from "../utils/auth-helper";

class HomePresenter {
  constructor({ storyModel, homeView, templateCreator }) {
    this.storyModel = storyModel;
    this.homeView = homeView;
    this.templateCreator = templateCreator;
  }

  async init() {
    this.homeView.showLoading();
    await this.showStories();
    this.initAuthButtons();
  }

  initAuthButtons() {
    const isSignedIn = AuthHelper.isUserSignedIn();
    this.homeView.updateAuthButtons(isSignedIn);

    // Setup logout button event
    this.homeView.setLogoutButtonEvent(() => {
      AuthHelper.destroyAuth();
      this.homeView.redirectToHome();
    });
  }

  async showStories() {
    try {
      if (!AuthHelper.isUserSignedIn()) {
        this.homeView.showLoginMessage();
        return;
      }

      const { token } = AuthHelper.getAuth();
      let response;

      try {
        // Coba ambil data dari API
        response = await this.storyModel.getAllStories({ token, location: 1 });
      } catch (apiError) {
        console.error("Error fetching from API:", apiError);
        // Jika gagal mengambil dari API, coba ambil dari IndexedDB
        response = await this.storyModel.getStoriesFromIndexedDB();
      }

      if (response.error) {
        this.homeView.showError(response.message);
        return;
      }

      const stories = response.listStory;
      if (stories && stories.length > 0) {
        this.homeView.showStories(stories, this.templateCreator);
        this.homeView.initMap(stories);
      } else {
        this.homeView.showEmptyState();
      }
    } catch (error) {
      console.error("Error in showStories presenter:", error);
      this.homeView.showError("Terjadi kesalahan saat memuat cerita");
    } finally {
      this.homeView.hideLoading();
    }
  }
}

export default HomePresenter;
