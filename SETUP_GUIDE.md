# ExpenseTracker - Complete Setup & Test Guide

## Quick Start (Local Testing)

### 1. Start MySQL Server
Make sure your MySQL server is running and accessible.

### 2. Load the Database Schema (ONE TIME ONLY)
Open MySQL client and run:
```sql
SOURCE "D:/D Drive/OneDrive - K L University/Desktop/ef1/ExpenseAPI/schema.sql";
```

This creates:
- Database: `expense_tracker`
- Table: `users` (id, email, name, password_hash, created_at)

### 3. Start the Backend API
```powershell
cd "D:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseAPI"
node index.js
```
You should see: `API listening on :4000`

### 4. Start the Frontend
In a new terminal:
```powershell
cd "D:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseFrontend"
npm run dev
```
Or run both together:
```powershell
npm run dev:all
```

Frontend opens at: http://localhost:5173

---

## Testing the Complete Flow

### Test 1: New User Signup → Database Storage
1. Open http://localhost:5173/#/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test1234
3. Click "Sign up"
4. ✅ Should show "Account created! You can now sign in."
5. ✅ Should redirect to sign-in page after 1 second

**Verify in MySQL:**
```sql
USE expense_tracker;
SELECT * FROM users WHERE email = 'test@example.com';
```
You should see your new user with hashed password.

---

### Test 2: Sign In with Correct Credentials → Home Page
1. On the sign-in page (http://localhost:5173/#/login)
2. Enter:
   - Email: test@example.com
   - Password: test1234
3. Click "Sign in"
4. ✅ Should redirect to home page/dashboard
5. ✅ Should show your name and avatar in the header

---

### Test 3: Sign In with Non-Existent User → Error Popup
1. On the sign-in page
2. Enter:
   - Email: nonexistent@example.com
   - Password: anything
3. Click "Sign in"
4. ✅ Should show red error: "User not exists — Create an account"
5. ✅ Should stay on sign-in page

---

### Test 4: Sign In with Wrong Password → Error Popup
1. On the sign-in page
2. Enter:
   - Email: test@example.com (existing user)
   - Password: wrongpassword
3. Click "Sign in"
4. ✅ Should show red error: "Invalid credentials"
5. ✅ Should stay on sign-in page

---

## How It Works

### Signup Flow:
```
User fills form → Frontend calls POST /auth/register
→ Backend hashes password with bcrypt
→ Backend inserts (email, name, password_hash) into MySQL users table
→ Frontend shows success and redirects to /login
```

### Sign-In Flow:
```
User enters credentials → Frontend calls POST /auth/login
→ Backend queries MySQL: SELECT * FROM users WHERE email=?
→ If no rows: return 404 "User not exists"
→ If found: compare password with bcrypt
   → Wrong password: return 401 "Invalid credentials"
   → Correct: generate JWT token, return { token, user }
→ Frontend stores token in localStorage
→ Frontend dispatches LOGIN action
→ Redirects to home page
```

---

## Deployment to Production

### Backend (API):
1. Deploy to Render/Railway/Azure/your VPS
2. Set environment variables:
   - PORT=4000
   - MYSQL_HOST=your-db-host
   - MYSQL_USER=your-db-user
   - MYSQL_PASSWORD=your-db-password
   - MYSQL_DB=expense_tracker
   - JWT_SECRET=long_random_string_here
   - CORS_ORIGIN=https://klu2300030150.github.io
3. Note your API URL (e.g., https://your-api.onrender.com)

### Frontend:
1. Create `ExpenseFrontend/.env.production`:
   ```
   VITE_API_BASE=https://your-api.onrender.com
   ```
2. Commit and push to main
3. GitHub Actions will build and deploy to Pages with the correct API URL

Your live site: https://klu2300030150.github.io/ExpenseTracker

---

## Security Notes

- Passwords are hashed with bcrypt (never stored plaintext)
- JWT tokens expire after 7 days
- Backend validates all inputs
- CORS restricts API access to your domain
- Never commit .env files with real credentials

---

## Troubleshooting

**Problem:** "User not exists" even after signing up
- Check MySQL: `SELECT * FROM users;` to verify user was inserted
- Check API console for errors
- Verify MYSQL_* env vars in ExpenseAPI/.env match your database

**Problem:** API won't start
- Ensure MySQL is running
- Check credentials in .env are correct
- Test connection: `mysql -h localhost -u root -p`

**Problem:** CORS errors in browser
- Check CORS_ORIGIN in API .env matches your frontend URL
- For local dev, API allows all origins by default

**Problem:** Frontend shows blank page
- Check browser console for errors
- Verify API is running and reachable
- Check VITE_API_BASE is correct

---

## What's Next?

Your app now has:
✅ Complete signup with MySQL storage
✅ Sign-in with database verification
✅ Protected routes (require login)
✅ JWT authentication
✅ Clear error messages

Optional enhancements:
- Email verification
- Password reset flow
- Remember me / refresh tokens
- Rate limiting on login attempts
- Profile page to edit user info
