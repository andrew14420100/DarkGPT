import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './ai.css';

const nativeFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';

  if (url.endsWith('/api/chat') && typeof init.body === 'string') {
    try {
      const payload = JSON.parse(init.body);
      const webButton = Array.from(document.querySelectorAll('button.tool-chip'))
        .find((button) => button.textContent?.trim() === 'Web');

      payload.web = Boolean(webButton?.classList.contains('active'));
      init = { ...init, body: JSON.stringify(payload) };
    } catch {
      // Keep the original request if the body is not JSON.
    }
  }

  return nativeFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
