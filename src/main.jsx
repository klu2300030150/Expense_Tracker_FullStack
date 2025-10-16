import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AppProvider, useApp } from './state/AppContext.jsx';

function RootWithFlags() {
  const { state } = useApp();
  return (
    <div data-panic={state?.settings?.panicHide ? 'true' : 'false'}>
      <App />
    </div>
  );
}

// Remove boot message IMMEDIATELY before rendering
const bootMsg = document.getElementById('boot-msg');
if (bootMsg) {
  bootMsg.style.display = 'none';
  setTimeout(() => bootMsg.remove(), 100);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <RootWithFlags />
    </AppProvider>
  </StrictMode>
);
