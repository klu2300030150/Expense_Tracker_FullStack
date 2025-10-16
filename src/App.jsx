import { HashRouter, NavLink, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import './App.css';

import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Bills from './pages/Bills.jsx';
import Insights from './pages/Insights.jsx';
import Settings from './pages/Settings.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import { useApp } from './state/AppContext.jsx';
import { Action } from './state/reducer.js';
import { clearToken } from './lib/api.js';

function RequireAuth() {
  const { state } = useApp();
  if (!state?.auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function Layout() {
  const { state, dispatch } = useApp();
  return (
    <div className="app-shell">
      <div style={{height:'5px',background:'linear-gradient(90deg,#7c3aed,#3b82f6)',marginBottom:'-5px'}} />
      <header className="app-header">
        <h1 style={{display:'flex',alignItems:'center',gap:'0.5rem'}}><span style={{fontWeight:900,fontSize:'1.7rem',color:'#7c3aed'}}>💸</span> Xpense Pilot</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/bills">Bills</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        {state.auth?.isAuthenticated && (
          <div className="row" style={{marginLeft:'auto'}}>
            <img src={state.auth.user?.avatar} alt="avatar" width="28" height="28" style={{borderRadius:'50%'}} />
            <span className="muted" style={{fontWeight:600}}>{state.auth.user?.name}</span>
            <button onClick={()=>{ clearToken(); dispatch({type: Action.LOGOUT}); window.location.hash = '#/login'; }}>Logout</button>
          </div>
        )}
      </header>
      <main className="app-main"><Outlet /></main>
      <footer className="app-footer">Local-only demo  No backend required</footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="bills" element={<Bills />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}
