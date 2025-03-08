import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import BgLocket from "../../components/Background/BgLocket";
import BgCustome from "../../components/Background/BgCustome";
import BgHeart from "../../components/Background/BgHeart";
import Loading from "../../components/Loading";

const DefaultLayout = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Hiển thị loading khi thay đổi route
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen relative">
      {/* Hiệu ứng nền */}
      {/* <BgCustome /> */}
      {/* <BgHeart /> */}

      {/* Header cố định */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Loading Overlay */}
      {isLoading && (<Loading/>)}

      {/* Nội dung chính */}
      <main className="overflow-auto">{children}</main>
    </div>
  );
};

export default DefaultLayout;
