// main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Imports BrowserRouter for application navigation
import { BrowserRouter } from 'react-router-dom';
// Import VideoProvider for video sharing purpose 
import { VideoProvider } from './app_components/home_components/content_components/LiveStream/livestream_components/VideoContext.jsx'; // 👈 import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/**Allows application navigation within the system */}
    <BrowserRouter>
      {/**Allows access for video sharing purposes */}
      <VideoProvider>
        <App />
      </VideoProvider>
    </BrowserRouter>
  </StrictMode>
);
