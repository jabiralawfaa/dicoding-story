class StoryPresenter {
  constructor({ storyModel, storyView }) {
    this.storyModel = storyModel;
    this.storyView = storyView;
  }

  async showAllStories(options) {
    try {
      this.storyView.showLoading();
      const response = await this.storyModel.getAllStories(options);
      
      if (response.error) {
        this.storyView.showError(response.message);
        return;
      }
      
      this.storyView.showStories(response.listStory);
    } catch (error) {
      this.storyView.showError('Terjadi kesalahan saat memuat cerita');
      console.error('Error in showAllStories presenter:', error);
    } finally {
      this.storyView.hideLoading();
    }
  }

  async showStoryDetail(id, token) {
    try {
      this.storyView.showLoading();
      const response = await this.storyModel.getStoryDetail(id, token);
      
      if (response.error) {
        this.storyView.showError(response.message);
        return;
      }
      
      this.storyView.showStoryDetail(response.story);
    } catch (error) {
      this.storyView.showError('Terjadi kesalahan saat memuat detail cerita');
      console.error('Error in showStoryDetail presenter:', error);
    } finally {
      this.storyView.hideLoading();
    }
  }

  async addStory(storyData) {
    try {
      this.storyView.showLoading();
      const response = await this.storyModel.addStory(storyData);
      
      if (response.error) {
        this.storyView.showError(response.message);
        return false;
      }
      
      this.storyView.showSuccess('Cerita berhasil ditambahkan');
      return true;
    } catch (error) {
      this.storyView.showError('Terjadi kesalahan saat menambahkan cerita');
      console.error('Error in addStory presenter:', error);
      return false;
    } finally {
      this.storyView.hideLoading();
    }
  }
}

export default StoryPresenter;