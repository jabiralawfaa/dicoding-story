import DicodingStoryApi from '../data/dicoding-story-api';
import AuthHelper from '../utils/auth-helper';

class AuthModel {
  async login({ email, password }) {
    try {
      const response = await DicodingStoryApi.login({ email, password });
      
      if (!response.error) {
        AuthHelper.saveAuth({
          token: response.loginResult.token,
          name: response.loginResult.name,
          userId: response.loginResult.userId,
        });
      }
      
      return response;
    } catch (error) {
      console.error('Error in login model:', error);
      throw error;
    }
  }

  async register({ name, email, password }) {
    try {
      const response = await DicodingStoryApi.register({ name, email, password });
      return response;
    } catch (error) {
      console.error('Error in register model:', error);
      throw error;
    }
  }

  isUserSignedIn() {
    return AuthHelper.isUserSignedIn();
  }

  getAuth() {
    return AuthHelper.getAuth();
  }

  logout() {
    AuthHelper.destroyAuth();
  }
}

export default AuthModel;