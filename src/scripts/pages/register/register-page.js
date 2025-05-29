import AuthModel from '../../model/auth-model';
import AuthPresenter from '../../presenter/auth-presenter';
import AuthView from '../../view/auth-view';

export default class RegisterPage {
  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Daftar Akun</h1>
        
        <div class="form-container">
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" minlength="8" required>
              <small>Password minimal 8 karakter</small>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Daftar</button>
            </div>
            
            <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </form>
          
          <div id="registerMessage" class="message"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.querySelector('#registerForm');
    const messageContainer = document.querySelector('#registerMessage');
    
    // Inisialisasi Model, View, dan Presenter
    const authModel = new AuthModel();
    const authView = new AuthView({
      registerForm,
      loginButton: null,
      logoutButton: null
    });
    
    // Buat custom view methods untuk menangani pesan
    authView.showLoading = () => {
      messageContainer.textContent = 'Sedang mendaftar...';
      messageContainer.classList.add('info');
      messageContainer.classList.remove('error', 'success');
      
      const submitButton = registerForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses...';
      }
    };
    
    authView.hideLoading = () => {
      const submitButton = registerForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Daftar';
      }
    };
    
    authView.showError = (message) => {
      messageContainer.textContent = message || 'Pendaftaran gagal';
      messageContainer.classList.add('error');
      messageContainer.classList.remove('success', 'info');
    };
    
    authView.showSuccess = (message) => {
      messageContainer.textContent = message || 'Pendaftaran berhasil! Silakan login.';
      messageContainer.classList.add('success');
      messageContainer.classList.remove('error', 'info');
      
      // Redirect ke halaman login
      setTimeout(() => {
        window.location.href = '#/login';
      }, 2000);
    };
    
    // Inisialisasi presenter
    const authPresenter = new AuthPresenter({
      authModel,
      authView
    });
    
    // Setup event listener untuk form register
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      
      try {
        await authPresenter.register({ name, email, password });
      } catch (error) {
        console.error('Error:', error);
        authView.showError('Terjadi kesalahan saat mendaftar');
      }
    });
  }
}