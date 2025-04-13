// FinalContentArea.jsx

// Importing Libraries
  import React from "react";
  import { Outlet } from "react-router-dom"; // Allows for overlaying or fitting other components

// Checking if the sidebar is collapsed or not
const ContentArea = ({ collapsed }) => {
  return (
    // Adjust the dimensions based on collapsed variable
    <div
      className={`
        h-screen
        w-full
        pl-[105px] ${!collapsed ? "pl-[250px]" : ""}
        transition-all duration-300 ease-in-out
        relative
      `}
    >
      {/**Background for Content Area */}
      <div
        className={`
          absolute top-0 left-0 h-full w-full
          bg-cover bg-center bg-no-repeat
        `}
        style={{
          backgroundImage: "url('https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/482204297_967463285454316_5317289252653549018_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=VIB9Fneoxm0Q7kNvwHmyqCh&_nc_oc=AdnD554PWBkuVsu2jJKkl0XwzEiaCz8d7gbpKO7fxHInmQxEMEIh9H2-_jKZ-RA6MVdE6xIeHp1hjYKlI8C14t8T&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=vgeFnQEUbyMqCEQl7RNUDw&oh=00_AfG3lcAU8fnvdVnuUScSKVL_TgUQxRpvVPOar69fntctfQ&oe=6800A4B8')",
        }}
      />

      {/* Outlet Container */}
      <div className="relative items-center top-15 z-20 w-full max-h-[640px] h-full p-6 overflow-y-auto xl:overflow-hidden">
          <Outlet />
      </div>
    </div>
  );
};

export default ContentArea;
