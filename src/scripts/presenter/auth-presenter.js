class AuthPresenter {
  constructor({ authModel, authView }) {
    this.authModel = authModel;
    this.authView = authView;
  }
 
  async login({ email, password }) {
    try {
      this.authView.showLoading();
      const response = await this.authModel.login({ email, password });
      
      if (response.error) {
        this.authView.showError(response.message);
        return false;
      }
      
      this.authView.showSuccess('Login berhasil');
      return true;
    } catch (error) {
      this.authView.showError('Terjadi kesalahan saat login');
      console.error('Error in login presenter:', error);
      return false;
    } finally {
      this.authView.hideLoading();
    }
  }

  async register({ name, email, password }) {
    try {
      this.authView.showLoading();
      const response = await this.authModel.register({ name, email, password });
      
      if (response.error) {
        this.authView.showError(response.message);
        return false;
      }
      
      this.authView.showSuccess('Registrasi berhasil, silakan login');
      return true;
    } catch (error) {
      this.authView.showError('Terjadi kesalahan saat registrasi');
      console.error('Error in register presenter:', error);
      return false;
    } finally {
      this.authView.hideLoading();
    }
  }

  checkAuth() {
    const isSignedIn = this.authModel.isUserSignedIn();
    this.authView.updateAuthUI(isSignedIn);
    return isSignedIn;
  }

  logout() {
    this.authModel.logout();
    this.authView.updateAuthUI(false);
    this.authView.showSuccess('Logout berhasil');
  }
}

export default AuthPresenter;