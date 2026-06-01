import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import { DirectoryPage } from './pages/DirectoryPage';
import { GuestPage } from './pages/GuestPage';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DirectoryPage />} />
          <Route path="/g/:id" element={<GuestPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);
