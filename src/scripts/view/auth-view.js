class AuthView {
  constructor({
    loginButton,
    logoutButton,
    loginForm = null,
    registerForm = null,
  }) {
    this.loginButton = loginButton;
    this.logoutButton = logoutButton;
    this.loginForm = loginForm;
    this.registerForm = registerForm;
  }

  showLoading() {
    // Implementasi loading state pada form login/register
    if (this.loginForm) {
      const submitButton = this.loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses...';
      }
    }

    if (this.registerForm) {
      const submitButton = this.registerForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Memproses...';
      }
    }
  }

  hideLoading() {
    // Kembalikan state button submit
    if (this.loginForm) {
      const submitButton = this.loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
      }
    }

    if (this.registerForm) {
      const submitButton = this.registerForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
      }
    }
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    alert(message);
  }

  updateAuthUI(isSignedIn) {
    if (isSignedIn) {
      if (this.loginButton) this.loginButton.style.display = 'none';
      if (this.logoutButton) this.logoutButton.style.display = 'inline-block';
    } else {
      if (this.loginButton) this.loginButton.style.display = 'inline-block';
      if (this.logoutButton) this.logoutButton.style.display = 'none';
    }
  }

  setupLoginForm(loginCallback) {
    if (!this.loginForm) return;

    this.loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const email = this.loginForm.querySelector('#email').value;
      const password = this.loginForm.querySelector('#password').value;
      
      await loginCallback({ email, password });
    });
  }

  setupRegisterForm(registerCallback) {
    if (!this.registerForm) return;

    this.registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const name = this.registerForm.querySelector('#name').value;
      const email = this.registerForm.querySelector('#email').value;
      const password = this.registerForm.querySelector('#password').value;
      
      await registerCallback({ name, email, password });
    });
  }

  setupLogoutButton(logoutCallback) {
    if (!this.logoutButton) return;

    this.logoutButton.addEventListener('click', () => {
      logoutCallback();
    });
  }
}

export default AuthView;