import React from 'react'

function format(n){
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default function TransactionList({ transactions, onRemove, onExport, onImport, onToggleRecurring, categories = [], onAssignCategory }){
  if(!transactions || transactions.length === 0) return (
    <div className="card glass tx-list empty">
      <h3>Transactions</h3>
      <p className="muted">No transactions yet. Add one from the left.</p>
      <div style={{marginTop:10}}>
        <button onClick={onExport}>Export CSV</button>
        <label style={{marginLeft:8}} className="ghost">
          <input type="file" accept="text/csv" style={{display:'none'}} onChange={e=>{
            const f = e.target.files && e.target.files[0]
            if(!f) return
            const reader = new FileReader()
            reader.onload = ()=> onImport && onImport(reader.result)
            reader.readAsText(f)
          }} />Import CSV
        </label>
      </div>
    </div>
  )

  return (
    <div className="card glass tx-list">
      <h3>Transactions</h3>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={onExport}>Export CSV</button>
        <label className="ghost" style={{padding:'6px 10px',borderRadius:8,display:'inline-flex',alignItems:'center',cursor:'pointer'}}>
          <input type="file" accept="text/csv" style={{display:'none'}} onChange={e=>{
            const f = e.target.files && e.target.files[0]
            if(!f) return
            const reader = new FileReader()
            reader.onload = ()=> onImport && onImport(reader.result)
            reader.readAsText(f)
          }} />Import CSV
        </label>
      </div>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id} className={tx.amount < 0 ? 'neg' : 'pos'}>
            <div className="left">
              <div className="desc">{tx.description}</div>
              <div className="meta">{new Date(tx.date).toLocaleString()}</div>
              <div style={{marginTop:6}}>
                <select value={tx.category||''} onChange={e=> onAssignCategory && onAssignCategory(tx.id, e.target.value)}>
                  <option value="">uncategorized</option>
                  {categories.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="right">
              <div className="amount">{format(tx.amount)}</div>
              {typeof onToggleRecurring === 'function' && (
                <button title="Toggle recurring" className="del" onClick={()=>onToggleRecurring(tx.id)} style={{marginRight:8}}>{tx.recurring ? '∞' : '⤴'}</button>
              )}
              <button className="del" onClick={()=>onRemove(tx.id)}>✕</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
