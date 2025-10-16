import Papa from 'papaparse';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';

function uid() { return Math.random().toString(36).slice(2, 10); }

export function ImportExport() {
  const { state, dispatch } = useApp();

  const exportJson = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'xpense-data.json';
    a.click();
  };

  const exportCsv = () => {
    const csv = Papa.unparse(state.transactions);
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.csv';
    a.click();
  };

  const importCsv = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const rows = results.data.filter(r=>r.amount && r.date).map(r => ({
          ...r,
          id: uid(),
          amount: Number(r.amount),
          date: new Date(r.date).toISOString(),
          type: r.type === 'income' ? 'income' : 'expense',
          tags: r.tags ? String(r.tags).split(',').map(s=>s.trim()).filter(Boolean) : [],
        }));
        for (const tx of rows) {
          dispatch({ type: Action.ADD_TX, payload: tx });
        }
      }
    });
  };

  return (
    <div className="card row" style={{justifyContent:'space-between'}}>
      <div className="row" style={{gap:'0.5rem'}}>
        <button onClick={exportJson}>Export JSON</button>
        <button onClick={exportCsv}>Export CSV</button>
      </div>
      <label className="row" style={{gap:'0.5rem'}}>
        Import CSV
        <input type="file" accept=".csv" onChange={e=>e.target.files && importCsv(e.target.files[0])} />
      </label>
    </div>
  );
}

export function SnapshotTool() {
  const { state, dispatch } = useApp();
  const take = () => {
    const totalExpense = state.transactions.filter(t=>t.type==='expense').reduce((a,b)=>a+b.amount,0);
    const totalIncome = state.transactions.filter(t=>t.type==='income').reduce((a,b)=>a+b.amount,0);
    dispatch({ type: Action.SNAPSHOT, payload: {
      id: Date.now().toString(36),
      name: `Snapshot ${new Date().toLocaleString()}`,
      createdAt: new Date().toISOString(),
      dataSummary: { totalExpense, totalIncome, txCount: state.transactions.length }
    }});
  };
  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <strong>Snapshots</strong>
        <button onClick={take}>Take Snapshot</button>
      </div>
      <ul>
        {state.snapshots.map(s => (
          <li key={s.id}>{s.name} — {new Date(s.createdAt).toLocaleString()} — tx: {s.dataSummary.txCount}</li>
        ))}
        {state.snapshots.length===0 && <li className="muted">No snapshots yet.</li>}
      </ul>
    </div>
  );
}

export function KeyboardShortcuts() {
  const { state, dispatch } = useApp();
  // Toggle panic hide with Shift + P
  // Focus search in future with / etc.
  return (
    <div className="card">
      <strong>Shortcuts</strong>
      <ul>
        <li>Shift + P → Toggle Panic Hide</li>
        <li>Ctrl/Cmd + S → Take Snapshot</li>
      </ul>
    </div>
  );
}
