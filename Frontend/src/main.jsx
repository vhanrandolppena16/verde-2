// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { VideoProvider } from './app_components/home_components/content_components/livestream_components/VideoContext.jsx'; // 👈 import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VideoProvider> {/* 👈 wrap App with provider */}
        <App />
      </VideoProvider>
    </BrowserRouter>
  </StrictMode>
);
