import React from 'react'

function monthKey(d){
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`
}

export default function MonthlySummary({ transactions = [], budgets = {} }){
  // aggregate by month
  const months = {}
  for(const t of transactions){
    const k = monthKey(t.date)
    months[k] = months[k] || 0
    months[k] += Number(t.amount || 0)
  }
  const entries = Object.entries(months).sort()
  const values = entries.map(([k,v])=>v)
  const max = Math.max(...values, 1)

  return (
    <div className="card glass monthly-summary">
      <h3>Monthly summary</h3>
      <div style={{display:'flex',gap:12,alignItems:'flex-end',height:120}}>
        {entries.map(([k,v],i)=> (
          <div key={k} style={{width:28,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{height: Math.max(6, (Math.abs(v)/max)*100) + 'px', width:16, background: v<0 ? '#ff7b7b' : '#8ef0b9', borderRadius:6}} />
            <div style={{fontSize:11,marginTop:6}}>{k.split('-')[1]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
