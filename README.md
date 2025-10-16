# ExpenseTracker - Full Stack Expense Management App# Expense Tracker (Frontend)



[![Deploy to GitHub Pages](https://github.com/klu2300030150/ExpenseTracker/actions/workflows/pages.yml/badge.svg)](https://github.com/klu2300030150/ExpenseTracker/actions/workflows/pages.yml)[![CI](https://github.com/klu2300030150/ExpenseTracker/actions/workflows/ci.yml/badge.svg)](https://github.com/klu2300030150/ExpenseTracker/actions/workflows/ci.yml)



A modern, full-featured expense tracking application with authentication, built with React, Node.js, and MySQL.React + Vite frontend for an Expense Tracker with dashboards, budgets, and insights.



🔗 **Live Demo:** https://klu2300030150.github.io/ExpenseTracker/## Quick start



---1. Install dependencies

	- npm ci

## ✨ Features2. Run the dev server

	- npm run dev

### 💰 Expense Management3. Lint

- ✅ Add, edit, and delete transactions	- npm run lint

- ✅ Categorize expenses (Food, Transport, Bills, Shopping, etc.)4. Build

- ✅ Income and expense tracking	- npm run build

- ✅ Recurring transactions (weekly, monthly, yearly)

- ✅ Search and filter by date, category, merchant## Tech

- React 19 + React Router

### 📊 Analytics & Insights- Vite

- ✅ Visual charts (Pie charts, bar graphs, trend analysis)- ESLint

- ✅ Monthly spending breakdown- Recharts

- ✅ Category-wise spending visualization

- ✅ Budget vs actual comparison## Project structure

- src/pages: Views like Dashboard, Budgets, Transactions, etc.

### 💳 Budget & Bills- src/components: Reusable UI pieces

- ✅ Set monthly budgets per category- src/state: Context, reducer, and storage helpers

- ✅ Budget progress tracking with alerts

- ✅ Recurring bill reminders## CI

- ✅ Due date notificationsGitHub Actions runs lint and build on push and PRs to main.


### 🔐 Authentication System
- ✅ User signup with MySQL storage
- ✅ Secure login with bcrypt password hashing
- ✅ JWT token authentication
- ✅ Protected routes
- ✅ Logout functionality
- ✅ **Hybrid mode:** Works with or without backend
  - **With backend:** Full MySQL database + JWT
  - **Without backend:** localStorage fallback for GitHub Pages

### 🎨 Modern UI
- ✅ Glassmorphism design with gradient effects
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Smooth animations and transitions
- ✅ Beautiful charts powered by Recharts

---

## 🚀 Quick Start

### Option 1: Use Live Demo (No Setup Required)
Visit: https://klu2300030150.github.io/ExpenseTracker/

### Option 2: Run Locally
```bash
git clone https://github.com/klu2300030150/ExpenseTracker.git
cd ExpenseTracker/ExpenseFrontend
npm install
npm run dev
```
Open: http://localhost:5173/ExpenseTracker/

---

## 🏗️ Tech Stack

**Frontend:** React 19, Vite, React Router 7, Recharts  
**Backend:** Node.js, Express, MySQL2, bcrypt, JWT  
**Deployment:** GitHub Pages, GitHub Actions

---

## 📚 Documentation

- **[AUTH_TEST_RESULTS.md](AUTH_TEST_RESULTS.md)** - Authentication flow testing
- **[BACKEND_EXPLAINED.md](BACKEND_EXPLAINED.md)** - Backend code walkthrough
- **[HYBRID_AUTH.md](HYBRID_AUTH.md)** - Hybrid authentication system
- **[TEST_COMPLETE.md](TEST_COMPLETE.md)** - End-to-end test scenarios
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions

---

## 👤 Author

**Sreekar** (klu2300030150)

**⭐ Star this repository if you found it helpful!**
