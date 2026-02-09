import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initAxios } from './services';
import FavoritesProvider from './context/FavoritesProvider';

initAxios();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);
