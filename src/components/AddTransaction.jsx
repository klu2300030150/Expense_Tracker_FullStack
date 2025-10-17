import React, { useState } from 'react'
import RecurrenceEditor from './RecurrenceEditor'

function parseQuick(text){
  // very small natural-language parser: "coffee -3" or "paycheck 1500"
  const m = text.match(/(.+)\s+(-?\d+(?:\.\d+)?)/)
  if(!m) return null
  const [,desc, amt] = m
  return { description: desc.trim(), amount: parseFloat(amt) }
}

export default function AddTransaction({ onAdd }){
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [rule, setRule] = useState(null)

  function submit(e){
    e.preventDefault()
    let tx = null
    if(!description && !amount) return
    if(description && !amount){
      const parsed = parseQuick(description)
      if(parsed) tx = parsed
    }
    if(!tx){
      tx = { description, amount: parseFloat(amount || 0), recurrence: rule }
    }
    onAdd(tx)
    setDescription('')
    setAmount('')
    setRecurring(false)
  }

  function quickExample(){
    setDescription('Lunch -12.5')
  }

  return (
    <form className="card glass add-tx" onSubmit={submit}>
      <h3>Add transaction</h3>
      <input placeholder="Description or quick: 'coffee -3'" value={description} onChange={e=>setDescription(e.target.value)} />
      <input placeholder="Amount (use negative for expense)" value={amount} onChange={e=>setAmount(e.target.value)} />
      <label style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}><input type="checkbox" checked={recurring} onChange={e=>setRecurring(e.target.checked)} /> Mark recurring</label>
      {recurring && (
        <div style={{marginTop:8}}>
          <RecurrenceEditor value={rule} onChange={r=>setRule(r)} />
        </div>
      )}
      <div className="actions">
        <button type="button" onClick={quickExample} className="ghost">Example</button>
        <button type="submit">Add</button>
      </div>
      <small className="hint">Tip: type "Rent -1200" in the first field and leave amount empty.</small>
    </form>
  )
}
