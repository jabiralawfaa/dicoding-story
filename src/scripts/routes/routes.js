import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import DetailPage from "../pages/detail/detail-page";
import AddStoryPage from "../pages/add/add-story-page";
import LoginPage from "../pages/login/login-page";
import RegisterPage from "../pages/register/register-page";
import NotificationPage from "../pages/notification/notification-page";
import SavedPage from "../pages/saved/saved-page";

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/detail/:id": DetailPage,
  "/add": AddStoryPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/notification": NotificationPage,
  "/saved": SavedPage,
};

export default routes;
