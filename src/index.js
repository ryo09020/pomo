import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Webカメラとブラウザ通知の権限を要求
async function requestPermissions() {
  try {
    // カメラの権限要求
    await navigator.mediaDevices.getUserMedia({ video: true });
    
    // 通知の権限要求
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  } catch (error) {
    console.error('Permission error:', error);
  }
}

// アプリケーションの起動時に権限を要求
requestPermissions();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
