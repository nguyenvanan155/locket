import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AuthHome = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Lưu theme vào localStorage để giữ lại sau khi reload
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-primary">Welcome to Home Page</h1>
      <p className="mt-4 text-base-content">
        This is a simple Home page built with React & Vite.
      </p>
      <Link
        to="/profile"
        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-focus"
      >
        Go to Profile
      </Link>

      {/* Theme Controller */}
      <fieldset className="mt-6 p-4 border rounded-lg shadow">
        <legend className="font-semibold text-base-content">Select Theme:</legend>
        <div className="flex flex-wrap gap-4 mt-2">
          {["light", "dark", "retro", "cyberpunk", "valentine", "aqua"].map((t) => (
            <label key={t} className="flex gap-2 cursor-pointer items-center text-base-content">
              <input
                type="radio"
                name="theme-radios"
                className="radio radio-sm"
                value={t}
                checked={theme === t}
                onChange={() => handleThemeChange(t)}
              />
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default AuthHome;
