import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Bills from './pages/Bills.jsx';
import Insights from './pages/Insights.jsx';
import Settings from './pages/Settings.jsx';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <div style={{height:'5px',background:'linear-gradient(90deg,#7c3aed,#3b82f6)',marginBottom:'-5px'}} />
      <header className="app-header">
        <h1 style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <span style={{fontWeight:900,fontSize:'1.7rem',color:'#7c3aed'}}>💸</span> Xpense Pilot
        </h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/bills">Bills</NavLink>
          <NavLink to="/insights">Insights</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">Local-only demo  No backend required</footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
