import { useEffect, useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { CategorySpendChart, MonthlyTrendChart, ExpensePieChart } from '../components/Charts.jsx';
import { ImportExport, SnapshotTool, KeyboardShortcuts } from '../components/Utilities.jsx';
import { Action } from '../state/reducer.js';

export default function Dashboard() {
  const { state } = useApp();
  const totals = useMemo(() => {
    let expense = 0, income = 0;
    for (const t of state.transactions) {
      if (t.type === 'expense') expense += t.amount;
      else income += t.amount;
    }
    return { expense, income, net: income - expense };
  }, [state.transactions]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        state.settings.panicHide
          ? dispatch({ type: Action.UPDATE_SETTINGS, payload: { panicHide: false } })
          : dispatch({ type: Action.UPDATE_SETTINGS, payload: { panicHide: true } });
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        dispatch({ type: Action.SNAPSHOT, payload: {
          id: Date.now().toString(36), name: `Snapshot ${new Date().toLocaleString()}`, createdAt: new Date().toISOString(),
          dataSummary: { txCount: state.transactions.length }
        }});
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.settings.panicHide, state.transactions.length]);

  return (
    <div className="page">
      <h2>Overview</h2>
      <div className="cards">
        <div className="card stat">
          <div className="label">Total Income</div>
          <div className="value">{state.settings.currency} {totals.income.toFixed(2)}</div>
        </div>
        <div className="card stat">
          <div className="label">Total Expense</div>
          <div className="value">{state.settings.currency} {totals.expense.toFixed(2)}</div>
        </div>
        <div className="card stat">
          <div className="label">Net</div>
          <div className="value">{state.settings.currency} {totals.net.toFixed(2)}</div>
        </div>
      </div>
      <div className="cards" style={{marginTop:'1rem'}}>
        <CategorySpendChart transactions={state.transactions} currency={state.settings.currency} />
        <MonthlyTrendChart transactions={state.transactions} currency={state.settings.currency} />
        <ExpensePieChart transactions={state.transactions} currency={state.settings.currency} />
      </div>
      <div className="cards" style={{marginTop:'1rem'}}>
        <ImportExport />
        <SnapshotTool />
        <KeyboardShortcuts />
      </div>
    </div>
  );
}
