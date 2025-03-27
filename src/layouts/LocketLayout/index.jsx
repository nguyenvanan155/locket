import React from "react";

const LocketLayout = ({ children }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-screen relative w-full h-screen overflow-hidden">
      {/* Nội dung chính */}
      <main className="w-full h-full bg-base-200 text-base-content">{children}</main>
    </div>
  );
};

export default LocketLayout;
