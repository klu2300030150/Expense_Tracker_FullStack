import React from 'react'

export default function Sidebar({ view, onNavigate }){
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'add', label: 'Add Transaction' },
    { id: 'categories', label: 'Categories' },
    { id: 'backup', label: 'Backup' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <div className="brand">LumenLedger</div>
      </div>
      <ul className="menu">
        {items.map(it=> (
          <li key={it.id} className={view===it.id? 'active':''} onClick={()=>onNavigate(it.id)}>{it.label}</li>
        ))}
      </ul>
      <div className="sidebar-bottom">
        <small>v0.1</small>
      </div>
    </nav>
  )
}
