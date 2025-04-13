// LiveStream.jsx

import React, {useEffect, useRef, useState} from 'react';

const LiveStreamPage = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // Get list of video input devices
  useEffect(() => {
    const getDevices = async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    };
    getDevices();
  }, []);

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
      stream.getTracks().forEach((track) => track.stop());
      setIsCameraOn(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera(selectedDeviceId);
    }
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
      <h1>📷 Select & Toggle Camera</h1>

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
}

export default LiveStreamPage;
