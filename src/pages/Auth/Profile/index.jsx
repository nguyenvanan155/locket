import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthLocket";
import { showToast } from "../../../components/Toast";
import * as locketService from "../../../services/locketService";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userinfo, setUserinfo] = useState({});

  // Convert timestamp thành ngày giờ đọc được
  const formatDate = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";
    return new Date(parseInt(timestamp)).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  useEffect(() => {
    const fetchLatestMoment = async () => {
      try {
        console.log("start get");
        const response = await locketService.getLatestMoment();
        console.log(user)
        console.log(response);
        return response.data;
      } catch (error) {
        console.error("❌ Lỗi khi gọi API latest moment:", error.response?.data.success || error.message);
        return null;
      }
    };
  
    fetchLatestMoment();
  }, []);  // ✅ Dependency array rỗng => chỉ chạy khi component mount
  
  return (
    <div className="flex flex-col items-center min-h-screen w-full px-6 py-10">
      <div className="h-16"></div>
      <h1 className="text-3xl font-bold pb-6 text-white">
        Chào mừng, "<span className="text-blue-600">{user?.displayName || "Người dùng"}</span>" đến
        với tài khoản của bạn!
      </h1>

      {/* Thông tin cơ bản */}
      <div className="flex flex-row items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl disable-select">
        <img
          src={user?.photoUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full shadow-md outline-4 outline-amber-400"
        />
        <div className="flex flex-col pl-5 text-center items-start">
          <h2 className="text-2xl font-semibold text-gray-900">{user?.displayName || "Không có tên"}</h2>
          <p className="text-lg text-gray-600">{user?.email || "Không có email"}</p>
        </div>
      </div>

      {/* Thông tin tài khoản chi tiết */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="UID" value={user?.localId} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Tên hiển thị" value={user?.displayName} />
          <InfoRow label="Số điện thoại" value={user?.phoneNumber} />
          <InfoRow label="Đăng nhập lần cuối" value={formatDate(user?.lastLoginAt)} />
          <InfoRow label="Tạo tài khoản" value={formatDate(user?.createdAt)} />
          <InfoRow label="Cập nhật lần cuối" value={formatDate(user?.lastRefreshAt)} />
          <InfoRow label="Xác thực tùy chỉnh" value={user?.customAuth ? "Có" : "Không"} />
        </div>
      </div>
    </div>
  );
}

// Component hiển thị từng dòng thông tin
const InfoRow = ({ label, value }) => (
  <div className="border-b pb-2">
    <span className="font-semibold text-gray-700">{label}:</span>{" "}
    <span className="text-blue-600 font-extrabold">{value || "Không có dữ liệu"}</span>
  </div>
);
