import AuthModel from '../../model/auth-model';
import AuthPresenter from '../../presenter/auth-presenter';
import AuthView from '../../view/auth-view';

export default class LoginPage {
  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Login</h1>
        
        <div class="form-container">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            
            <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
          
          <div id="loginMessage" class="message"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.querySelector('#loginForm');
    const messageContainer = document.querySelector('#loginMessage');
    
    // Inisialisasi Model, View, dan Presenter
    const authModel = new AuthModel();
    const authView = new AuthView({
      loginForm,
      loginButton: null,
      logoutButton: null
    });
    
    // Buat custom view methods untuk menangani pesan
    authView.showLoading = () => {
      messageContainer.textContent = 'Sedang login...';
      messageContainer.classList.add('info');
      messageContainer.classList.remove('error', 'success');
      
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses...';
      }
    };
    
    authView.hideLoading = () => {
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
      }
    };
    
    authView.showError = (message) => {
      messageContainer.textContent = message || 'Login gagal';
      messageContainer.classList.add('error');
      messageContainer.classList.remove('success', 'info');
    };
    
    authView.showSuccess = (message) => {
      messageContainer.textContent = message || 'Login berhasil!';
      messageContainer.classList.add('success');
      messageContainer.classList.remove('error', 'info');
      
      // Redirect ke halaman utama
      setTimeout(() => {
        window.location.href = '#/';
        window.location.reload();
      }, 1000);
    };
    
    // Inisialisasi presenter
    const authPresenter = new AuthPresenter({
      authModel,
      authView
    });
    
    // Setup event listener untuk form login
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      
      try {
        await authPresenter.login({ email, password });
      } catch (error) {
        console.error('Error:', error);
        authView.showError('Terjadi kesalahan saat login');
      }
    });
  }
}