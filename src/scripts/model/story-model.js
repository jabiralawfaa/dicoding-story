import DicodingStoryApi from "../data/dicoding-story-api";

class StoryModel {
  async getAllStories(options) {
    try {
      const response = await DicodingStoryApi.getAllStories(options);
      return response;
    } catch (error) {
      console.error("Error in getAllStories model:", error);
      throw error;
    }
  }

  async getStoryDetail(id, token) {
    try {
      const response = await DicodingStoryApi.getStoryDetail({ id, token });
      return response;
    } catch (error) {
      console.error("Error in getStoryDetail model:", error);
      throw error;
    }
  }

  async addStory(storyData) {
    try {
      const response = await DicodingStoryApi.postStory(storyData);
      return response;
    } catch (error) {
      console.error("Error in addStory model:", error);
      throw error;
    }
  }
}

export default StoryModel;
