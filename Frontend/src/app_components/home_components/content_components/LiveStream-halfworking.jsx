import React, { useEffect, useRef, useState } from "react";

const LiveStream = () => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [cameraAvailable, setCameraAvailable] = useState(null);

  // Get available cameras
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = mediaDevices.filter(device => device.kind === "videoinput");
        setDevices(videoInputs);

        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        } else {
          setCameraAvailable(false);
        }
      } catch (err) {
        console.error("Error fetching camera devices:", err);
        setCameraAvailable(false);
      }
    };

    getDevices();
  }, []);

  // Start camera stream based on selected device
  useEffect(() => {
    let currentStream;

    const startStream = async () => {
      if (!selectedDeviceId) return;

      try {
        // Stop previous stream
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } },
        });

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraAvailable(true);
      } catch (err) {
        console.error("Camera stream error:", err);
        setCameraAvailable(false);
      }
    };

    startStream();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId]);

  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 items-center justify-center">
      {/* Header + Camera Selection */}
      <div className="flex items-center gap-4 w-full max-w-6xl justify-between">
        <h2 className="text-2xl font-bold text-green-800">Live Camera Feed</h2>
        <select
          value={selectedDeviceId || ""}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm"
        >
          {devices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Live Camera Stream */}
      <div className="w-full max-w-7xl aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-lg">
        {cameraAvailable === null && (
          <p className="text-center text-gray-400 pt-24">Checking camera access...</p>
        )}
        {cameraAvailable ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/camera_feed.png"
            alt="Camera Placeholder"
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default LiveStream;
