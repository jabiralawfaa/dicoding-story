import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/login/login-page";
import DetailPage from "../pages/detail/detail-page";
import RegisterPage from "../pages/register/register-page";
import AddStoryPage from "../pages/add/add-story-page";
import NotificationPage from "../pages/notification/notification-page";

const routes = {
  "/": new HomePage(),
  "/about": new AboutPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/add": new AddStoryPage(),
  "/detail/:id": new DetailPage(),
  "/notification": new NotificationPage(),
};

export default routes;
