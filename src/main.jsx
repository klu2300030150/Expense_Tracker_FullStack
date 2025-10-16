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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <RootWithFlags />
    </AppProvider>
  </StrictMode>
);

// Remove boot message once app is mounted/render started
const bm = document.getElementById('boot-msg');
if (bm) bm.remove();
