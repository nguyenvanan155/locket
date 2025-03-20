import Login1 from "../hooks/TestLogin";
import Upload from "../hooks/UploadPost";
import AuthHome from "../pages/Auth/Home";
import Post from "../pages/Auth/PostImage";
import PostVideo from "../pages/Auth/PostVideo";
import Profile from "../pages/Auth/Profile";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Timeline from "../pages/Public/Timeline";

const APP_NAME = "Locket - Đăng ảnh & Video lên Locket";

// 📌 Các route dành cho người chưa đăng nhập
const publicRoutes = [
  { path: "/", component: Home, title: `${APP_NAME} | Trang Chủ` },
  { path: "/test", component: AuthHome, title: `Test` },
  { path: "/login", component: Login, title: `Đăng Nhập | ${APP_NAME}` },
];

// 📌 Các route yêu cầu đăng nhập
const authRoutes = [
  { path: "/home", component: AuthHome, title: `Trang chủ | ${APP_NAME}` },
  { path: "/profile", component: Profile, title: `Hồ sơ | ${APP_NAME}` },
  { path: "/post", component: Post, title: `Đăng Ảnh Mới | ${APP_NAME}` },
  { path: "/test", component: PostVideo, title: `Đăng Video Mới | ${APP_NAME}` },
  { path: "/timeline", component: Timeline, title: `Dòng Thời Gian | ${APP_NAME}` },
];

// 📌 Các route dành cho admin (nếu có)
const adminRoutes = [];

export { publicRoutes, authRoutes, adminRoutes };
