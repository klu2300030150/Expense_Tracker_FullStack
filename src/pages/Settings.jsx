import { useEffect } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';

export default function Settings() {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.settings.theme === 'dark') document.documentElement.dataset.theme = 'dark';
    else if (state.settings.theme === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
  }, [state.settings.theme]);

  return (
    <div className="page">
      <h2>Settings</h2>
      <div className="card grid">
        <label>Currency
          <input value={state.settings.currency} onChange={e=>dispatch({ type: Action.UPDATE_SETTINGS, payload: { currency: e.target.value } })} />
        </label>
        <label>Theme
          <select value={state.settings.theme} onChange={e=>dispatch({ type: Action.UPDATE_SETTINGS, payload: { theme: e.target.value } })}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="row">Panic Hide
          <input type="checkbox" checked={state.settings.panicHide} onChange={e=>dispatch({ type: Action.UPDATE_SETTINGS, payload: { panicHide: e.target.checked } })} />
        </label>
      </div>
    </div>
  );
}
