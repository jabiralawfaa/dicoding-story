import CONFIG from '../config';

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  POST_STORY: `${CONFIG.BASE_URL}/stories`,
  POST_GUEST_STORY: `${CONFIG.BASE_URL}/stories/guest`,
};

class DicodingStoryApi {
  static async register({ name, email, password }) {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async login({ email, password }) {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async getAllStories({ token, page = 1, size = 10, location = 0 }) {
    const response = await fetch(
      `${API_ENDPOINT.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const responseJson = await response.json();
    return responseJson;
  }

  static async getStoryDetail({ id, token }) {
    const response = await fetch(API_ENDPOINT.GET_STORY_DETAIL(id), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async postStory({ token, description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);

    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(API_ENDPOINT.POST_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();
    return responseJson;
  }

  static async postGuestStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);

    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(API_ENDPOINT.POST_GUEST_STORY, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();
    return responseJson;
  }
}

export default DicodingStoryApi;