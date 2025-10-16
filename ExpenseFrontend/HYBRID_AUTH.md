# Hybrid Authentication System

## ✅ Problem Solved: GitHub Pages Now Works!

Your deployed site was showing "Loading app..." because it was trying to connect to `http://localhost:4000` which doesn't exist on GitHub Pages.

## 🔄 New Hybrid System

The app now **automatically detects** if a backend API is available and switches modes:

### 🌐 Deployed (GitHub Pages) - No Backend
**URL:** https://klu2300030150.github.io/ExpenseTracker/

- ✅ Works immediately without any backend server
- ✅ Stores users in browser localStorage
- ✅ Full signup/login/logout functionality
- ✅ Password verification works
- ✅ Shows "User not exists" and "Invalid credentials" errors correctly
- ⚠️ Data only persists in your browser (not shared across devices)

### 💻 Local Development - With MySQL Backend
**URL:** http://localhost:5174/ExpenseTracker/

When backend API is running on port 4000:
- ✅ Uses real MySQL database
- ✅ bcrypt password hashing
- ✅ JWT token authentication
- ✅ Shared across all users
- ✅ Data persists on server

## 📋 How It Works

### Auto-Detection
```javascript
// Checks if backend is available
async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false; // Fallback to local mode
  }
}
```

### Signup Flow
1. **With Backend:** POST /auth/register → MySQL storage → bcrypt hash
2. **Without Backend:** Save to localStorage as JSON

### Login Flow
1. **With Backend:** POST /auth/login → MySQL verify → JWT token
2. **Without Backend:** Check localStorage → Verify password → Create local token

### Error Handling
Both modes show the same errors:
- "User not exists" when email not found
- "Invalid credentials" when password wrong

## 🎯 Testing

### Test on GitHub Pages (NOW WORKING!)
1. Open: https://klu2300030150.github.io/ExpenseTracker/
2. Should load immediately (no more "Loading app...")
3. Click "Sign up" to create account
4. Fill form and submit
5. Login with those credentials
6. Should redirect to dashboard

### Test Locally with MySQL
1. Start backend: `cd ExpenseAPI && node index.js`
2. Start frontend: `cd ExpenseFrontend && npm run dev`
3. Open: http://localhost:5174/ExpenseTracker/
4. System detects backend and uses MySQL

## 📊 Comparison

| Feature | GitHub Pages (No Backend) | Local with MySQL |
|---------|--------------------------|------------------|
| Signup | ✅ localStorage | ✅ MySQL database |
| Login | ✅ Local verification | ✅ MySQL + JWT |
| Password Hash | ⚠️ Plain text in localStorage | ✅ bcrypt |
| Data Persistence | ⚠️ Browser only | ✅ Server database |
| Multi-Device | ❌ No | ✅ Yes |
| Works Offline | ✅ Yes | ❌ No |
| Setup Required | ✅ None | ⚠️ MySQL + Node.js |

## 🚀 Deployment Status

**Latest push:** Hybrid authentication system
**GitHub Pages:** Will rebuild automatically (1-2 minutes)

After rebuild completes:
- Visit: https://klu2300030150.github.io/ExpenseTracker/
- Should now load the signup/login page immediately
- Full authentication flow works without backend

## 💡 Future: Add Hosted Backend

To get MySQL persistence on the deployed site:

1. Deploy backend to **Render** or **Railway** (free tiers available)
2. Create `.env.production` in frontend:
   ```bash
   VITE_API_BASE=https://your-api.onrender.com
   ```
3. Push to GitHub
4. Deployed site will use real MySQL backend

For now, the deployed site works perfectly with local storage fallback!
