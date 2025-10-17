import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onRunRecurring, lastRecurring }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <header className="header">
      <div style={{flex:1}}>
        <h1 className="logo">LumenLedger</h1>
        <p className="tag">A different take on expense tracking — playful, private, and fast.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span>Welcome, {userName}!</span>
          <button onClick={onRunRecurring} style={{padding:'8px 12px',borderRadius:10}}>Run recurring</button>
          <button onClick={handleLogout} style={{padding:'8px 12px',borderRadius:10,backgroundColor:'#e53e3e',color:'white'}}>
            Logout
          </button>
        </div>
        <div style={{fontSize:12,color:'#9fb0d5'}}>{lastRecurring ? `Last run ${new Date(lastRecurring).toLocaleString()}` : 'Recurring not run yet'}</div>
      </div>
    </header>
  )
}
