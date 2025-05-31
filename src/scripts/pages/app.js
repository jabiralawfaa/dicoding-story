import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");

      // Update ARIA attributes for accessibility
      this.#drawerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
          this.#drawerButton.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Tambahkan event listener untuk keyboard accessibility
    this.#drawerButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.#drawerButton.click();
      }
    });

    // Tambahkan event listener untuk menutup drawer dengan tombol Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.#navigationDrawer.classList.contains("open")) {
        this.#navigationDrawer.classList.remove("open");
        this.#drawerButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = new routes[url]();

    // Gunakan View Transition API jika tersedia di browser
    if (document.startViewTransition) {
      // Gunakan View Transition API untuk transisi halaman yang halus
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      // Fallback untuk browser yang tidak mendukung View Transition API
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;
