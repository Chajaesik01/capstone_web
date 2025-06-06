import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/css/reset.css';
import App from './App.tsx';
import './firebase-config.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
