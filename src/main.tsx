import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/css/reset.css';
import App from './App.tsx';
import './firebase-config.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </QueryClientProvider>
);
