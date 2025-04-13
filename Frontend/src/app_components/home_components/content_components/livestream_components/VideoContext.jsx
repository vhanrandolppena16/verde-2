// src/context/VideoContext.jsx
import React, { createContext, useRef } from 'react';

const VideoContext = createContext();

const VideoProvider = ({ children }) => {
  const videoRef = useRef(null);

  return (
    <VideoContext.Provider value={videoRef}>
      {children}
    </VideoContext.Provider>
  );
};

export {VideoContext, VideoProvider};