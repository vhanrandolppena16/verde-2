import React from "react";

const CameraFeed = () => {
  return (
    <div
      className="
        flex items-center justify-center
        bg-white rounded-2xl p-4 shadow-md h-[50%] min-h-[240px]
      "
    >
      <img
        src="/camera_feed.png"
        alt="Camera Feed"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default CameraFeed;
