import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { initialState } from './types';
import { reducer } from './reducer';
import { loadState, saveState } from './storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const persisted = loadState();
  const [state, dispatch] = useReducer(reducer, persisted ?? initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
