import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { SubmissionsProvider } from './context/SubmissionsContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SubmissionsProvider>
      <App />
    </SubmissionsProvider>
  </React.StrictMode>
);
