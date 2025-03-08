import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Upload,
  User,
  LogOut,
  LogIn,
  LucideTimer,
} from "lucide-react";
import "./styles.css";
import { AuthContext } from "../../context/AuthLocket";
import { showToast } from "../Toast";
import * as locketService from "../../services/locketService";

const themes = ["light", "retro", "cyberpunk", "valentine", "aqua"];

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  // Khi component mount, lấy theme từ localStorage và áp dụng
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  // Xử lý đổi theme: Lưu vào localStorage trước, sau đó reload trang
  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme) {
      localStorage.setItem("theme", newTheme);
      window.location.reload(); // Reload để theme được áp dụng
    }
  };

  const handleLogout = async () => {
    try {
      await locketService.logout();
      showToast("success", "Đăng xuất thành công!");
      setUser(null);
      navigate("/login");
    } catch (error) {
      showToast("error", "Đăng xuất thất bại!");
      console.error("❌ Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <>
      <header className="navbar fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-xsm bg-base-100 text-base-content border-base-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold gradient-text disable-select">
            Locket Pro
          </span>
          <img
            src="/icons8-heart-100.png"
            alt="Locket icon"
            className="w-7 h-7 object-contain -ml-1 disable-select"
            draggable="false"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Dropdown chọn Theme */}
          <div className="dropdown">
            <button tabIndex={0} className="btn">
              Theme
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-10 p-2 shadow-2xl"
            >
              {themes.map((t) => (
                <li key={t}>
                  <label className="flex btn btn-sm btn-block btn-ghost gap-2 cursor-pointer items-center justify-center text-primary">
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller justify-start"
                      checked={theme === t}
                      onChange={() => handleThemeChange(t)}
                    />
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md transition cursor-pointer btn"
          >
            <Menu size={28} strokeWidth={2} />
          </button>
        </div>

        {/* Sidebar menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 shadow-xsm transform transition-transform duration-300 bg-base-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center py-3 px-6 border-b-base-300">
            <div className="flex items-center gap-2">
              <img
                src="/icons8-heart-100.png"
                alt="Locket icon"
                className="w-7 h-7 object-contain -ml-5 disable-select"
                draggable="false"
              />
              <span className="font-semibold gradient-text disable-select">
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

          <ul>
            <li>
              <Link
                to="/home"
                className="flex items-center px-4 py-3 cursor-pointer text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Home size={22} className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/timeline"
                className="flex items-center px-4 py-3 cursor-pointer text-primary"
                onClick={() => setIsOpen(false)}
              >
                <LucideTimer size={22} className="mr-2" /> Timeline
              </Link>
            </li>
            <li>
              <Link
                to="/post"
                className="flex items-center px-4 py-3 cursor-pointer text-primary"
                onClick={() => setIsOpen(false)}
              >
                <Upload size={22} className="mr-2" /> Post
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center px-4 py-3 cursor-pointer text-primary"
                onClick={() => setIsOpen(false)}
              >
                <User size={22} className="mr-2" /> Profile
              </Link>
            </li>

            {user ? (
              <li>
                <button
                  className="flex items-center w-full px-4 py-3 btn-info cursor-pointer text-primary"
                  style={{ backgroundColor: "var(--hover-bg)" }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={22} className="mr-2" /> Đăng xuất
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 btn-info cursor-pointer text-primary"
                  style={{ backgroundColor: "var(--hover-bg)" }}
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={22} className="mr-2" /> Đăng nhập
                </Link>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
