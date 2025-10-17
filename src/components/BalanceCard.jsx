import React from 'react'

function format(n){
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

export default function BalanceCard({ transactions }){
  const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  const balance = income + expense

  return (
    <section className="balance-card glass">
      <div className="balance-left">
        <h2>Balance</h2>
        <div className="balance-amount">{format(balance)}</div>
        <div className="sub">Income {format(income)} · Expense {format(Math.abs(expense))}</div>
      </div>
      <div className="balance-right">
        <div className="spark" />
      </div>
    </section>
  )
}
