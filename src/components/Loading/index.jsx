import { useEffect, useState } from "react";
import { mirage } from "ldrs";

const themeColors = {
  light: "black",
  dark: "white",
  retro: "#ff9800", // Cam
  cyberpunk: "#ff0077", // Hồng Neon
  valentine: "oklch(52% .223 3.958)", // Đỏ Hồng
  aqua: "#00d4ff", // Xanh Biển
};

const Loading = ({ isLoading }) => {
  mirage.register();
  const [color, setColor] = useState(themeColors.light);

  useEffect(() => {
    const getTheme = () => localStorage.getItem("theme") || "light";

    const updateColor = () => {
      const currentTheme = getTheme();
      setColor(themeColors[currentTheme] || themeColors.light);
    };

    updateColor();

    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 bg-base-100 text-base-content transition-opacity duration-700 ${
        isLoading ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <l-mirage size="90" speed="2.5" stroke={color}></l-mirage>
    </div>
  );
};

export default Loading;
