import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./header_components/FinalHeader";
// import Sidebar from "./old_home_components/Sidebar";
import Sidebar from "./sidebar_components/FinalSidebar";
import HydroponicBackground from "./content_components/FinalContentArea";

// Most likely, the className is similar to containers used in 
// .css files which can be used to set up their dimensions
// className can also be used as designs such as hover, bg, and such

function Home() {
  const [navigationText, setNavigationText] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="
        min-w-[680px]   // Ensures the nav bar doesn't shrink below 640px wide
        w-full          // Makes the nav bar span the full available width
        max-w-screen    // Caps width to the screen width (safe on ultra-wide monitors)
        h-20            // Fixed height (80px)
        bg-green-300    // Light green background
        flex            // Enables flexbox layout
        items-center    // Vertically centers child elements
        shadow-md       // Applies medium shadow for depth
        fixed           // Fixes the nav bar to the top of the screen
        top-0 left-0    // Positions it at the very top-left of the page
        z-[1000]        // Ensures it stays on top of other elements
    ">
        <Header navigationText={navigationText} />

      {/**Sidebar */}
      </div>

      <Sidebar
          setNavigationText={setNavigationText}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
      />

      {/**Content Area */}
      <HydroponicBackground collapsed={collapsed} />
    </>
  );
}
  
export default Home;
