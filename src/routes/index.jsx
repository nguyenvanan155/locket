import Login1 from "../hooks/TestLogin";
import Upload from "../hooks/UploadPost";
import AuthHome from "../pages/Auth/Home";
import Post from "../pages/Auth/PostImage";
import PostVideo from "../pages/Auth/PostVideo";
import Profile from "../pages/Auth/Profile";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Timeline from "../pages/Public/Timeline";

const APP_NAME = "Locket Pro";

// Các route dành cho người chưa đăng nhập
const publicRoutes = [
  { path: "/", component: Home, title: `${APP_NAME} Home` },
  { path: "/login", component: Login, title: `${APP_NAME} Login` },
];

// Các route yêu cầu đăng nhập
const authRoutes = [
  { path: "/home", component: AuthHome, title: `${APP_NAME} Home` },
  { path: "/profile", component: Profile, title: `${APP_NAME} Profile` },
  { path: "/post", component: Post, title: `${APP_NAME} Post` },
  { path: "/test", component: PostVideo, title: `${APP_NAME} Test` },
  { path: "/timeline", component: Timeline, title: `${APP_NAME} Timeline` },
];

// Các route dành cho admin (nếu có)
const adminRoutes = [];

export { publicRoutes, authRoutes, adminRoutes };
