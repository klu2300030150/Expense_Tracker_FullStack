import { initialState } from './types';

export const Action = {
  ADD_TX: 'ADD_TX',
  UPDATE_TX: 'UPDATE_TX',
  DELETE_TX: 'DELETE_TX',
  SET_BUDGET: 'SET_BUDGET',
  DELETE_BUDGET: 'DELETE_BUDGET',
  ADD_BILL: 'ADD_BILL',
  UPDATE_BILL: 'UPDATE_BILL',
  DELETE_BILL: 'DELETE_BILL',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SNAPSHOT: 'SNAPSHOT',
  IMPORT_DATA: 'IMPORT_DATA',
  RESET: 'RESET',
};

export function reducer(state, action) {
  switch (action.type) {
    case Action.ADD_TX:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case Action.UPDATE_TX: {
      const { id, patch } = action.payload;
      return {
        ...state,
        transactions: state.transactions.map(t => t.id === id ? { ...t, ...patch } : t)
      };
    }
    case Action.DELETE_TX:
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case Action.SET_BUDGET: {
      const { category, amount } = action.payload;
      return { ...state, budgets: { ...state.budgets, [category]: amount } };
    }
    case Action.DELETE_BUDGET: {
      const { [action.payload]: _, ...rest } = state.budgets;
      return { ...state, budgets: rest };
    }
    case Action.ADD_BILL:
      return { ...state, bills: [action.payload, ...state.bills] };
    case Action.UPDATE_BILL: {
      const { id, patch } = action.payload;
      return { ...state, bills: state.bills.map(b => b.id === id ? { ...b, ...patch } : b) };
    }
    case Action.DELETE_BILL:
      return { ...state, bills: state.bills.filter(b => b.id !== action.payload) };
    case Action.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case Action.SNAPSHOT: {
      const snap = action.payload; // { id, name, createdAt, dataSummary }
      return { ...state, snapshots: [snap, ...state.snapshots] };
    }
    case Action.IMPORT_DATA:
      return { ...state, ...action.payload };
    case Action.RESET:
      return initialState;
    default:
      return state;
  }
}
