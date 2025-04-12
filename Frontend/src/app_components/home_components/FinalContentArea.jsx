// FinalContentArea.jsx
import { Outlet } from "react-router-dom";
import React from "react";

const HydroponicBackground = ({ collapsed }) => {
  return (
    <div
      className={`
        h-screen
        w-full
        pl-[105px] ${!collapsed ? "pl-[250px]" : ""}
        transition-all duration-300 ease-in-out
        relative
      `}
    >
      <div
        className={`
          absolute top-0 left-0 h-full w-full
          bg-cover bg-center bg-no-repeat
        `}
        style={{
          backgroundImage: "url('/src/assets/images/hydroponics2.jpg')",
        }}
      />

      {/* ✅ Reduced Outlet container height */}
      <div className="relative items-center top-15 z-20 w-full max-h-[640px] h-full p-6 overflow-y-auto xl:overflow-hidden">
          <Outlet />
      </div>

    </div>
  );
};

export default HydroponicBackground;
