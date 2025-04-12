import React, { useEffect, useRef, useState } from "react";

const CameraFeed = () => {
  const videoRef = useRef(null);
  const [cameraAvailable, setCameraAvailable] = useState(null); // null = unknown, false = fallback

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraAvailable(true);
      } catch (err) {
        console.warn("Camera access error:", err);
        setCameraAvailable(false);
      }
    };

    checkCamera();

    return () => {
      // Stop video stream on unmount
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-white rounded-2xl p-4 shadow-md h-[50%] min-h-[240px]">
      {cameraAvailable === null && (
        <p className="text-gray-500">Checking camera access...</p>
      )}

      {cameraAvailable ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-[90%] object-contain rounded-lg"
        />
      ) : cameraAvailable === false ? (
        <img
          src="/camera_feed.png"
          alt="Static Camera Placeholder"
          className="w-full h-[90%] object-contain rounded-lg"
        />
      ) : null}
    </div>
  );
};

export default CameraFeed;
