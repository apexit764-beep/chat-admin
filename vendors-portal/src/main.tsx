import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { useThemeStore } from '@/store/useThemeStore';
import '@/styles/global.css';
import './styles/portal.css';

// apply the saved light/dark choice before the first paint
document.documentElement.classList.toggle('dark', useThemeStore.getState().theme === 'dark');

// HashRouter: the portal is served from a plain static folder, so deep links need no server rewrite
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
