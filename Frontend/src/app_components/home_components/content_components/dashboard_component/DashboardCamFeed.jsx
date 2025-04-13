import React, { useContext } from 'react';
import { VideoContext } from '../livestream_components/VideoContext';

const CameraFeed = () => {
  // Access the shared videoRef via context
  const videoRef = useContext(VideoContext);

  return (
    <div className="bg-black rounded-lg p-4 shadow-md w-full h-[240px] flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded"
      />
      {!videoRef?.current?.srcObject && (
        <span className="absolute text-white text-lg font-semibold">Camera is Off</span>
      )}
    </div>
  );
};

export default CameraFeed;
