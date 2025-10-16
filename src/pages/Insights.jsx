import { useMemo } from 'react';
import { useApp } from '../state/AppContext.jsx';

export default function Insights() {
  const { state } = useApp();
  const stats = useMemo(() => {
    const byMerchant = {};
    for (const t of state.transactions) {
      if (t.type !== 'expense') continue;
      byMerchant[t.merchant || '—'] = (byMerchant[t.merchant || '—'] ?? 0) + t.amount;
    }
    const top = Object.entries(byMerchant).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { topMerchants: top };
  }, [state.transactions]);

  return (
    <div className="page">
      <h2>Insights</h2>
      <div className="card">
        <h3>Top Spending Merchants</h3>
        {stats.topMerchants.length===0 && <p className="muted">Add expenses to see insights.</p>}
        <ul>
          {stats.topMerchants.map(([m, amt]) => (
            <li key={m}>{m}: {state.settings.currency} {amt.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
