import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Home,
  Upload,
  User,
  LogOut,
  LogIn,
  LucideTimer,
} from "lucide-react";
import { showToast } from "../Toast";
import * as locketService from "../../services/locketService";
import * as ultils from "../../utils";

const Sidebar = ({ isOpen, setIsOpen, user, setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Chặn cuộn trang
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden"); // Cleanup khi component unmount
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await locketService.logout();
      setUser(null);
      ultils.clearAuthData();
      ultils.removeUser();
      showToast("success", "Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      showToast("error", "Đăng xuất thất bại!");
      console.error("❌ Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <>
      {/* Lớp phủ mờ khi Sidebar mở */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 transition-opacity duration-300 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 right-0 h-full w-64 shadow-lg transform transition-transform duration-300 bg-base-100 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center py-3 px-6">
          <div className="flex items-center gap-2">
            <img
              src="/icons8-heart-100.png"
              alt="Locket icon"
              className="w-7 h-7 object-contain -ml-5 select-none"
              draggable="false"
            />
            <span className="font-semibold gradient-text select-none">
              Menu
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md cursor-pointer btn"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nội dung sidebar có thanh cuộn */}
        <div className="h-[calc(100vh-56px)] overflow-y-auto bg-base-100 border-base-300 text-base-content">
          <ul>
            {user ? (
              <>
                <li>
                  <Link
                    to="/home"
                    className="flex items-center px-4 py-3 text-base-content"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home size={22} className="mr-2" /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/timeline"
                    className="flex items-center px-4 py-3 text-base-content"
                    onClick={() => setIsOpen(false)}
                  >
                    <LucideTimer size={22} className="mr-2" /> Timeline
                  </Link>
                </li>
                <li>
                  <Link
                    to="/post"
                    className="flex items-center px-4 py-3 text-base-content"
                    onClick={() => setIsOpen(false)}
                  >
                    <Upload size={22} className="mr-2" /> Post
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-base-content"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={22} className="mr-2" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-4 py-3 btn mt-3 text-base-content cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={22} className="mr-2" /> Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 btn mt-3 text-base-content cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={22} className="mr-2" /> Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
