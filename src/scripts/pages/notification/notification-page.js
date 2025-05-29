import AuthHelper from "../../utils/auth-helper";
import NotificationView from "../../view/notification-view";

export default class NotificationPage {
  constructor() {
    this.view = new NotificationView();
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Check if user is signed in
    if (!AuthHelper.isUserSignedIn()) {
      window.location.href = "#/login";
      return;
    }

    // Initialize the notification view
    await this.view.afterRender();
  }
}
