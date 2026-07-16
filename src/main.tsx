import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ConfirmProvider } from './components/ui';
import './styles/global.css';

declare const __BUILD_ID__: string;

(function checkForNewBuild() {
  fetch('/version.txt?t=' + Date.now(), { cache: 'no-store' })
    .then((r) => (r.ok ? r.text() : null))
    .then((v) => {
      if (!v) return;
      const remote = v.trim();
      if (remote && remote !== __BUILD_ID__) {
        const reloadedKey = '__build_reload_' + remote;
        if (!sessionStorage.getItem(reloadedKey)) {
          sessionStorage.setItem(reloadedKey, '1');
          window.location.reload();
        }
      }
    })
    .catch(() => {});
})();

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </BrowserRouter>
  </React.StrictMode>
);
