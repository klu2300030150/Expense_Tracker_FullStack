import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';

export default function Budgets() {
  const { state, dispatch } = useApp();
  const [category, setCategory] = useState(state.categories[0] ?? 'Other');
  const [amount, setAmount] = useState('');

  const set = (e) => {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a) return;
    dispatch({ type: Action.SET_BUDGET, payload: { category, amount: a } });
    setAmount('');
  };

  const usage = useMemo(() => {
    const map = {};
    for (const c of state.categories) map[c] = 0;
    for (const t of state.transactions) {
      if (t.type === 'expense') map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
    return map;
  }, [state.transactions, state.categories]);

  return (
    <div className="page">
      <h2>Budgets</h2>
      <form className="card row" onSubmit={set}>
        <label>Category
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>Monthly Budget
          <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} required/>
        </label>
        <button className="primary" type="submit">Save</button>
      </form>

      <div className="card">
        <table>
          <thead><tr><th>Category</th><th>Spent</th><th>Budget</th><th>Progress</th></tr></thead>
          <tbody>
            {state.categories.map(c => {
              const spent = usage[c] ?? 0;
              const budget = state.budgets[c] ?? 0;
              const pct = budget ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
              return (
                <tr key={c}>
                  <td>{c}</td>
                  <td>{state.settings.currency} {spent.toFixed(2)}</td>
                  <td>{budget ? `${state.settings.currency} ${budget.toFixed(2)}` : '—'}</td>
                  <td>
                    <div className="bar"><div className={`fill ${pct>100?'over':''}`} style={{width: `${pct}%`}}/></div>
                    <span className={`badge ${pct>=90?'warn':''}`}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
