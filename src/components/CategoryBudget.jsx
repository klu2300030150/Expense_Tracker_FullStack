import React, { useState } from 'react'

export default function CategoryBudget({ categories, budgets, onAddCategory, onSetBudget }){
  const [name, setName] = useState('')
  const [amt, setAmt] = useState('')

  return (
    <div className="card glass cat-budget">
      <h3>Categories & Budgets</h3>
      <div style={{display:'flex',gap:8,marginBottom:8}}>
        <input placeholder="New category" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={()=>{ if(name) { onAddCategory(name); setName('') } }}>Add</button>
      </div>
      <div style={{marginTop:8}}>
        <h4>Budgets</h4>
        {categories.map(c=> (
          <div key={c} style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
            <div style={{flex:1}}>{c}</div>
            <input placeholder="Monthly" value={budgets[c]||''} onChange={e=>onSetBudget(c, e.target.value)} style={{width:100}} />
          </div>
        ))}
      </div>
    </div>
  )
}
