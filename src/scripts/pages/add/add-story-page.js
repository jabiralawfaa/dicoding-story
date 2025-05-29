import AuthHelper from '../../utils/auth-helper';
import AddStoryView from '../../view/add-story-view';
import AddStoryPresenter from '../../presenter/add-story-presenter';
import StoryModel from '../../model/story-model';

// Leaflet CSS untuk peta
import 'leaflet/dist/leaflet.css';

export default class AddStoryPage {
  constructor() {
    this.view = new AddStoryView();
    this.model = new StoryModel();
    this.presenter = new AddStoryPresenter({
      storyModel: this.model,
      addStoryView: this.view
    });
  }
  
  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Cek status login
    if (!AuthHelper.isUserSignedIn()) {
      window.location.href = '#/login';
      return;
    }
    
    // Tunggu DOM sepenuhnya dimuat sebelum menginisialisasi presenter
    // Ini memastikan elemen peta sudah ada di DOM
    setTimeout(async () => {
      // Inisialisasi presenter
      await this.presenter.init();
    }, 100);
  }
}

// Hapus event listener global ini karena sudah dihandle di dalam class
// window.addEventListener('beforeunload', () => {
//   if (stream) {
//     stream.getTracks().forEach(track => track.stop());
//   }
// });