import React from 'react'

// lightweight donut built with SVG
export default function DonutChart({ transactions, size=160 }){
  const groups = transactions.reduce((m, t)=>{
    const k = t.description.split(' ')[0].toLowerCase()
    m[k] = (m[k] || 0) + Math.abs(t.amount)
    return m
  }, {})

  const entries = Object.entries(groups).slice(0,6)
  const total = entries.reduce((s, [_,v])=>s+v,0)
  const colors = ['#ff6b6b','#f59e0b','#10b981','#60a5fa','#7c3aed','#ff7ab6']

  let angle = 0
  const r = size/2
  const cx = r, cy = r
  const radius = r - 12

  function polarToCartesian(cx, cy, r, a){
    const rad = (a-90) * Math.PI/180
    return [cx + r*Math.cos(rad), cy + r*Math.sin(rad)]
  }

  return (
    <div className="card glass chart">
      <h3>Spending snapshot</h3>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {entries.map(([k,v], i)=>{
          const frac = v/total || 0
          const start = angle
          const end = angle + frac*360
          const [sx, sy] = polarToCartesian(cx, cy, radius, end)
          const [ex, ey] = polarToCartesian(cx, cy, radius, start)
          const large = end-start > 180 ? 1:0
          const d = `M ${cx} ${cy} L ${sx} ${sy} A ${radius} ${radius} 0 ${large} 0 ${ex} ${ey} Z`
          angle = end
          return <path key={k} d={d} fill={colors[i%colors.length]} opacity={0.95} />
        })}
        <circle cx={cx} cy={cy} r={radius*0.48} fill="#0f172a" opacity={0.08} />
      </svg>
      <div className="legend">
        {entries.map(([k,v],i)=> (
          <div key={k} className="legend-item"><span className="swatch" style={{background: colors[i%colors.length]}} />{k} <strong>{Math.round((v/total||0)*100)}%</strong></div>
        ))}
      </div>
    </div>
  )
}
