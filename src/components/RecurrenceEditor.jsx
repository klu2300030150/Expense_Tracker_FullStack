import React, { useState } from 'react'

export default function RecurrenceEditor({ value, onChange }){
  // value: { freq:'monthly'|'weekly'|'daily', interval:1, startDate, endDate, count }
  const v = value || { freq: 'monthly', interval: 1, startDate: (new Date()).toISOString().slice(0,10), endDate: '', count: '' }
  const [freq, setFreq] = useState(v.freq)
  const [interval, setInterval] = useState(v.interval)
  const [startDate, setStartDate] = useState(v.startDate)
  const [endDate, setEndDate] = useState(v.endDate||'')
  const [count, setCount] = useState(v.count||'')

  function apply(){
    onChange && onChange({ freq, interval: Number(interval)||1, startDate, endDate: endDate||null, count: count?Number(count):null })
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',gap:8}}>
        <select value={freq} onChange={e=>setFreq(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <input type="number" min={1} value={interval} onChange={e=>setInterval(e.target.value)} style={{width:80}} />
        <div style={{alignSelf:'center'}}>interval</div>
      </div>
      <div style={{display:'flex',gap:8}}>
        <label>Start <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} /></label>
        <label>End <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} /></label>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <label>Count <input type="number" min={1} value={count} onChange={e=>setCount(e.target.value)} style={{width:90}} /></label>
        <button onClick={apply}>Apply</button>
      </div>
    </div>
  )
}
