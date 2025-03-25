import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

const AuthHome = () => {
  const [iframeUrl, setIframeUrl] = useState("https://locket-dio.web.app");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "default"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-base-200">
      <div className="h-16"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-extrabold leading-tight">
            Chia sẻ khoảnh khắc <br /> với Locket!
          </h1>
          <p className="mt-4 text-lg text-base-content">
            Lưu giữ và chia sẻ những kỷ niệm đáng nhớ của bạn với bạn bè và gia
            đình.
          </p>
          <Link
            to="/profile"
            className="mt-6 px-6 py-4 rounded-lg shadow btn btn-primary text-lg font-semibold hover:bg-primary-focus transition"
          >
            Khám phá ngay
          </Link>
        </div>
        <div className="flex justify-center disable-select">
          <div className="mockup-browser border border-base-300 w-full">
            <div className="mockup-browser-toolbar">
              <div className="input p-1">{iframeUrl}</div>
            </div>
            <div className="h-80 w-full relative overflow-hidden select-none">
              <iframe
                src="https://locket-pro.vercel.app"
                sandbox="allow-scripts allow-same-origin"
                className="absolute top-0 left-0 w-[125%] h-[125%] border-0 rounded-b-lg scale-[0.8] origin-top-left pointer-events-none"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-12">
        <div className="p-6 bg-base-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-3">📷 Chia sẻ dễ dàng</h2>
          <p className="text-base-content">
            Tải ảnh và video lên chỉ trong vài giây.
          </p>
        </div>
        <div className="p-6 bg-base-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-3">💬 Kết nối bạn bè</h2>
          <p className="text-base-content">
            Xem hoạt động của bạn bè theo thời gian thực.
          </p>
        </div>
        <div className="p-6 bg-base-100 shadow-lg rounded-xl text-center">
          <h2 className="text-xl font-semibold mb-3">🔒 Bảo mật an toàn</h2>
          <p className="text-base-content">
            Dữ liệu của bạn được bảo vệ với công nghệ tiên tiến.
          </p>
        </div>
      </div>

      {/* Theme Selector with Preview */}
      <fieldset className="mt-10 p-4 border rounded-lg shadow w-full max-w-6xl">
        <legend className="font-semibold text-lg">🎨 Chọn Giao Diện:</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
          {themes.map((t) => (
            <label
              key={t}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg shadow transition tooltip
              bg-base-100 hover:bg-base-300 
              ${
                theme === t
                  ? "outline-3 outline-dotted outline-primary opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              data-theme={t}
              data-tip={t}
            >
              <div className="grid grid-cols-5 grid-rows-3 w-30 h-12 rounded-lg overflow-hidden border border-gray-300">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>
                <div className="bg-base-300 col-start-1 row-start-3"></div>
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-1">
                  <div className="font-bold text-xs">{t}</div>
                  <div className="flex flex-wrap gap-1">
                    <div className="bg-primary flex aspect-square w-3 items-center justify-center rounded">
                      <div className="text-primary-content text-xs font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-secondary flex aspect-square w-3 items-center justify-center rounded">
                      <div className="text-secondary-content text-xs font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-accent flex aspect-square w-3 items-center justify-center rounded">
                      <div className="text-accent-content text-xs font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-neutral flex aspect-square w-3 items-center justify-center rounded">
                      <div className="text-neutral-content text-xs font-bold">
                        A
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <input
                type="radio"
                name="theme-radios"
                className="radio radio-sm hidden"
                value={t}
                checked={theme === t}
                onChange={() => setTheme(t)}
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default AuthHome;
