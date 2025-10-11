import { useState } from 'react';
import { useApp } from '../state/AppContext.jsx';
import { Action } from '../state/reducer.js';

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function Bills() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({ name: '', amount: '', dueDay: 1, category: state.categories[0] ?? 'Bills', notes: '' });

  const add = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    dispatch({ type: Action.ADD_BILL, payload: { id: uid(), ...form, amount: parseFloat(form.amount) } });
    setForm({ name: '', amount: '', dueDay: 1, category: state.categories[0] ?? 'Bills', notes: '' });
  };

  const del = (id) => dispatch({ type: Action.DELETE_BILL, payload: id });

  return (
    <div className="page">
      <h2>Bills & Subscriptions</h2>
      <form className="card row" onSubmit={add}>
        <label>Name <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></label>
        <label>Amount <input type="number" step="0.01" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required/></label>
        <label>Due Day <input type="number" min="1" max="28" value={form.dueDay} onChange={e=>setForm({...form, dueDay:Number(e.target.value)})} /></label>
        <label>Category
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
            {state.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="grow">Notes <input value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} /></label>
        <button className="primary" type="submit">Add</button>
      </form>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Due Day</th><th>Amount</th><th>Category</th><th>Notes</th><th></th></tr></thead>
          <tbody>
            {state.bills.length===0 && (<tr><td colSpan={6} className="muted">No bills yet</td></tr>)}
            {state.bills.map(b => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.dueDay}</td>
                <td>{state.settings.currency} {b.amount.toFixed(2)}</td>
                <td>{b.category}</td>
                <td>{b.notes}</td>
                <td><button className="danger" onClick={()=>del(b.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
