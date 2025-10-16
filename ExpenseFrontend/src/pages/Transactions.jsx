import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';
import { TransactionType } from '../state/types.js';
import { ExpensePieChart } from '../components/Charts.jsx';

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function Transactions() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    amount: '',
    type: TransactionType.EXPENSE,
    category: state.categories[0] ?? 'Other',
    merchant: '',
    notes: '',
    tags: '',
  });
  const [range, setRange] = useState('all'); // all | month | year

  const addTx = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.date || !amount || !form.category) return;
    dispatch({
      type: Action.ADD_TX,
      payload: {
        id: uid(),
        date: new Date(form.date).toISOString(),
        amount,
        type: form.type,
        category: form.category,
        merchant: form.merchant,
        notes: form.notes,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      }
    });
    setForm(f => ({ ...f, amount: '', merchant: '', notes: '', tags: '' }));
  };

  const remove = (id) => dispatch({ type: Action.DELETE_TX, payload: id });

  const list = useMemo(() => {
    if (range === 'all') return state.transactions;
    const now = new Date();
    return state.transactions.filter(t => {
      const d = new Date(t.date);
      if (range === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (range === 'year') {
        return d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [state.transactions, range]);

  return (
    <div className="page">
      <h2>Transactions</h2>
      <div className="row" style={{marginBottom:'0.75rem'}}>
        <div className="card row" style={{gap:'0.5rem'}}>
          <strong>Period</strong>
          <button onClick={()=>setRange('all')} className={range==='all'?'primary':''}>All</button>
          <button onClick={()=>setRange('month')} className={range==='month'?'primary':''}>This Month</button>
          <button onClick={()=>setRange('year')} className={range==='year'?'primary':''}>This Year</button>
        </div>
      </div>
      <div className="cards" style={{marginBottom:'1rem'}}>
        <ExpensePieChart transactions={list} currency={state.settings.currency} />
      </div>
      <form className="tx-form card" onSubmit={addTx}>
        <div className="row">
          <label>Date <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required/></label>
          <label>Amount <input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required/></label>
          <label>Type
            <select value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </select>
          </label>
          <label>Category
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
              {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <div className="row">
          <label>Merchant <input value={form.merchant} onChange={e=>setForm({...form, merchant:e.target.value})} /></label>
          <label>Tags (comma) <input value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} /></label>
          <label className="grow">Notes <input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} /></label>
          <button className="primary" type="submit">Add</button>
        </div>
      </form>

      <div className="card">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th><th>Type</th><th>Category</th><th>Merchant</th><th>Amount</th><th>Tags</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={7} className="muted">No transactions yet</td></tr>
            )}
            {list.map(t => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td className={t.type}>{t.type}</td>
                <td>{t.category}</td>
                <td>{t.merchant}</td>
                <td>{state.settings.currency} {t.amount.toFixed(2)}</td>
                <td>{t.tags?.join(', ')}</td>
                <td><button className="danger" onClick={()=>remove(t.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
