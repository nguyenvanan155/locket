import { ToastContainer, toast, Bounce } from "react-toastify";
import "./styles.css"; // Import file CSS tùy chỉnh
import "react-toastify/dist/ReactToastify.css";

// Hàm hiển thị toast với type trước rồi đến message
export const showToast = (type = "default", message) => toast(message, { type });

// Component ToastProvider để hiển thị ToastContainer
const ToastProvider = () => (
  <ToastContainer
    position="top-right" // Hiển thị toast ở góc trên bên phải
    autoClose={3000} // Tự động đóng sau 3 giây
    hideProgressBar={false} // Hiển thị thanh chạy
    newestOnTop={false} // Không xếp toast mới lên trên cùng
    closeOnClick // Đóng toast khi click
    // draggable // Cho phép kéo toast
    limit={2}
    theme="light" // Giao diện sáng
    transition={Bounce} // Hiệu ứng xuất hiện dạng bật nảy
    style={{
      fontSize: "14px", // Giảm kích thước chữ
      width: "90%", // Toast rộng 90% màn hình trên mobile
      maxWidth: "320px", // Giới hạn tối đa chiều rộng
    }}
  />
);

export default ToastProvider;
