import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export function CategorySpendChart({ transactions, currency }) {
  const data = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      map[t.category] = (map[t.category] ?? 0) + t.amount;
    }
    return Object.entries(map).map(([category, amount]) => ({ category, amount: Number(amount.toFixed(2)) }));
  }, [transactions]);

  if (data.length === 0) return null;
  return (
    <div className="card">
      <h3>Spend by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
          <XAxis dataKey="category" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip formatter={(v)=>`${currency} ${v}`}/>
          <Legend />
          <Bar dataKey="amount" name="Amount" fill="#7c3aed" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyTrendChart({ transactions, currency }) {
  const data = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const entry = (map[key] ?? { month: key, expense: 0, income: 0 });
      entry[t.type] += t.amount;
      map[key] = entry;
    }
    return Object.values(map).sort((a,b)=>a.month.localeCompare(b.month)).map(e=>({ ...e, net: Number((e.income - e.expense).toFixed(2)) }));
  }, [transactions]);

  if (data.length === 0) return null;
  return (
    <div className="card">
      <h3>Monthly Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
          <XAxis dataKey="month" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip formatter={(v)=>`${currency} ${Number(v).toFixed(2)}`}/>
          <Legend />
          <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
          <Area type="monotone" dataKey="net" name="Net" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ExpensePieChart({ transactions, currency }) {
  const data = useMemo(() => {
    const map = {};
    let total = 0;
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      map[t.category] = (map[t.category] ?? 0) + t.amount;
      total += t.amount;
    }
    const arr = Object.entries(map).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));
    arr.sort((a,b)=>b.value-a.value);
    return { data: arr, total: Number(total.toFixed(2)) };
  }, [transactions]);

  if (data.data.length === 0) return null;
  const colors = ['#7c3aed','#ef4444','#10b981','#f59e0b','#3b82f6','#ec4899','#22d3ee','#84cc16','#f97316'];

  return (
    <div className="card">
      <h3>Expense Distribution</h3>
      <div className="muted" style={{marginBottom:'0.5rem'}}>Total: {currency} {data.total.toFixed(2)}</div>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v)=>`${currency} ${Number(v).toFixed(2)}`}/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
