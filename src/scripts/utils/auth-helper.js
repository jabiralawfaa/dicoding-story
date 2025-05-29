const AUTH_KEY = 'dicoding_story_auth';

const AuthHelper = {
  saveAuth({ token, name, userId }) {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        token,
        name,
        userId,
      }),
    );
  },

  getAuth() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || { token: null };
  },

  destroyAuth() {
    localStorage.removeItem(AUTH_KEY);
  },

  isUserSignedIn() {
    const { token } = this.getAuth();
    return !!token;
  },
};

export default AuthHelper;