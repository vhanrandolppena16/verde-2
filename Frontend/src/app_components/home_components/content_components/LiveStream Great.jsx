import React, { useEffect, useRef, useState } from 'react';

const LiveStreamPage = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const previousDeviceIds = useRef(new Set());

  const getDevices = async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter((device) => device.kind === "videoinput");

    const currentDeviceIds = new Set(videoDevices.map(d => d.deviceId));
    const newDevice = videoDevices.find(d => !previousDeviceIds.current.has(d.deviceId));

    setDevices(videoDevices);
    previousDeviceIds.current = currentDeviceIds;

    if (newDevice) {
      // New camera detected, switch to it
      setSelectedDeviceId(newDevice.deviceId);
      if (isCameraOn) {
        stopCamera();
        startCamera(newDevice.deviceId);
      }
    } else if (!videoDevices.find(d => d.deviceId === selectedDeviceId)) {
      // Selected device removed, fallback to first available
      const fallback = videoDevices[0];
      if (fallback) {
        setSelectedDeviceId(fallback.deviceId);
        if (isCameraOn) {
          stopCamera();
          startCamera(fallback.deviceId);
        }
      } else {
        // No cameras left
        stopCamera();
        setSelectedDeviceId("");
      }
    }
  };

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [isCameraOn, selectedDeviceId]);

  const startCamera = async (deviceId) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOn(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const toggleCamera = () => {
    isCameraOn ? stopCamera() : startCamera(selectedDeviceId);
  };

  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    if (isCameraOn) {
      stopCamera();
      startCamera(deviceId);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>📷 Auto-Switch Camera</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>Select Camera: </label>
        <select onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "80%", maxWidth: "500px", borderRadius: "12px", backgroundColor: "#000" }}
      />
      <br />
      <button
        onClick={toggleCamera}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
    </div>
  );
};

export default LiveStreamPage;
