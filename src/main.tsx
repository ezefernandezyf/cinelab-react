import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initAxios } from './services';

initAxios();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
