import React, { useState, useEffect } from 'react';
import { SpendingCharts } from './SpendingCharts';
import { api } from '../services/api';
import Header from './Header';
import TransactionList from './TransactionList';
import BalanceCard from './BalanceCard';
import AddTransaction from './AddTransaction';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txData, catData, budgetData] = await Promise.all([
          api.getAllTransactions(),
          api.getAllCategories(),
          api.getAllBudgets()
        ]);
        setTransactions(txData);
        setCategories(catData);
        setBudgets(budgetData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = transactions.reduce((s,t)=>s + Number(t.amount||0),0);
  const income = transactions.filter(t=>t.amount>0).reduce((s,t)=>s + Number(t.amount||0),0);
  const expense = transactions.filter(t=>t.amount<0).reduce((s,t)=>s + Number(t.amount||0),0);

  const recent = transactions.slice(0,6);

  // Prepare data for SpendingCharts
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[monthYear] = (acc[monthYear] || 0) + Math.abs(Number(transaction.amount));
    return acc;
  }, {});

  const categoryData = categories.map(category => {
    const total = transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    return {
      name: category,
      value: total,
      color: budgets[category]?.color || '#4ECDC4'
    };
  }).filter(cat => cat.value > 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <div className="dash-row">
          <div className="dash-card glass">
            <h4>Balance</h4>
            <div className="dash-num">
              {total.toLocaleString(undefined,{style:'currency',currency:'USD'})}
            </div>
            <div className="muted">
              Income {income.toLocaleString(undefined,{style:'currency',currency:'USD'})} · 
              Expense {Math.abs(expense).toLocaleString(undefined,{style:'currency',currency:'USD'})}
            </div>
          </div>
          <div className="dash-card glass">
            <h4>Categories</h4>
            <div>{categories.join(', ')}</div>
          </div>
          <div className="dash-card glass">
            <h4>Budgets</h4>
            <div>{Object.keys(budgets).length} set</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card glass" style={{flex: 1}}>
            <AddTransaction 
              onAdd={async (tx) => {
                const newTx = await api.createTransaction(tx);
                setTransactions(prev => [newTx, ...prev]);
              }}
              categories={categories}
            />
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card glass" style={{flex: 1}}>
            <SpendingCharts 
              monthlyData={Object.entries(monthlyData).map(([month, amount]) => ({ month, amount }))}
              categoryData={categoryData}
            />
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-card glass" style={{flex: 2}}>
            <h4>Recent transactions</h4>
            <TransactionList
              transactions={recent}
              categories={categories}
              onDelete={async (id) => {
                await api.deleteTransaction(id);
                setTransactions(prev => prev.filter(t => t.id !== id));
              }}
            />
          </div>
          <div className="dash-card glass" style={{flex: 1}}>
            <h4>Quick actions</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <button onClick={() => {
                navigator.clipboard && navigator.clipboard.writeText(JSON.stringify({ balance: total }));
              }}>Copy balance JSON</button>
              <button onClick={() => alert('Not implemented: export report')}>Export report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
