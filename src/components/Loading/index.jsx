import { useEffect, useState } from "react";
import { mirage } from "ldrs";

const Loading = () => {
  mirage.register();
  const [color, setColor] = useState("black");

  useEffect(() => {
    const checkDarkMode = () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setColor(checkDarkMode() ? "white" : "black");

    const listener = (e) => setColor(e.matches ? "white" : "black");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 transition-colors bg-white dark:bg-black">
      <l-mirage size="60" speed="2.5" color={color}></l-mirage>
      {/* <p className="mt-4 text-black dark:text-white">Đang tải...</p> */}
    </div>
  );
};

export default Loading;
