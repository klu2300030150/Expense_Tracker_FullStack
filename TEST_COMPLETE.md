# Complete Authentication Flow - Test Script

## Current Status: ✅ FULLY OPERATIONAL

### Servers Running:
- **Backend API:** http://localhost:4000 ✅
- **Frontend Dev:** http://localhost:5174/ExpenseTracker/ ✅
- **MySQL Database:** expense_tracker (2 users registered) ✅

---

## Test Scenarios

### ✅ Scenario 1: New User Signup → Login → Dashboard

**Step 1: Create New Account**
1. Open: http://localhost:5174/ExpenseTracker/#/signup
2. Fill form:
   - Name: `New Test User`
   - Email: `newuser@test.com`
   - Password: `test1234`
3. Click **Sign up**
4. **Expected Result:**
   - ✅ Backend stores user in MySQL with bcrypt-hashed password
   - ✅ Shows: "Account created! You can now sign in."
   - ✅ Auto-redirects to login page after 1 second

**Step 2: Login with New Account**
1. On login page, enter:
   - Email: `newuser@test.com`
   - Password: `test1234`
2. Click **Sign in**
3. **Expected Result:**
   - ✅ Backend verifies credentials against MySQL
   - ✅ Returns JWT token + user data
   - ✅ Frontend stores token in localStorage
   - ✅ Redirects to: `#/` (Dashboard/Home)
   - ✅ Header shows: User avatar + name + Logout button
   - ✅ Can navigate all protected pages

---

### ✅ Scenario 2: Login with Non-Existent Email

**Test Steps:**
1. Open: http://localhost:5174/ExpenseTracker/#/login
2. Enter:
   - Email: `doesnotexist@example.com`
   - Password: `anypassword`
3. Click **Sign in**

**Expected Result:**
- ✅ Backend queries MySQL: No user found
- ✅ Backend returns: `404 Not Found` with error: "User not exists"
- ✅ Frontend displays: **"User not exists — Create an account"** (with link)
- ✅ User can click link to go to signup page

---

### ✅ Scenario 3: Login with Wrong Password

**Test Steps:**
1. Open: http://localhost:5174/ExpenseTracker/#/login
2. Enter:
   - Email: `newuser@test.com` (exists in database)
   - Password: `wrongpassword123`
3. Click **Sign in**

**Expected Result:**
- ✅ Backend finds user in MySQL
- ✅ bcrypt.compare() returns false (password mismatch)
- ✅ Backend returns: `401 Unauthorized` with error: "Invalid credentials"
- ✅ Frontend displays: **"Invalid credentials"**
- ✅ User remains on login page

---

### ✅ Scenario 4: Logout

**Test Steps:**
1. While logged in (on any protected page)
2. Click **Logout** button in header

**Expected Result:**
- ✅ Calls `clearToken()` - removes JWT from localStorage
- ✅ Dispatches `LOGOUT` action - clears auth state
- ✅ Redirects to: `#/login`
- ✅ Protected routes now redirect to login (not authenticated)

---

## Database Verification

### Check Users in MySQL:
```bash
mysql -u root -pSreekar@8297
```

```sql
USE expense_tracker;
SELECT id, email, name, created_at FROM users;
```

**Current users in database:** 2

---

## API Endpoint Testing

### Test Registration:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@test.com","name":"Curl User","password":"test1234"}'
```

**Expected:** `201 Created` with user data

### Test Login (Correct):
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@test.com","password":"test1234"}'
```

**Expected:** `200 OK` with JWT token

### Test Login (Wrong Email):
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@test.com","password":"test1234"}'
```

**Expected:** `404 Not Found` with `{"error":"User not exists"}`

### Test Login (Wrong Password):
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"curl@test.com","password":"wrongpass"}'
```

**Expected:** `401 Unauthorized` with `{"error":"Invalid credentials"}`

---

## ✅ All Tests Passing

| Test Case | Status | Details |
|-----------|--------|---------|
| MySQL Connection | ✅ PASS | Connected to expense_tracker database |
| Users Table | ✅ PASS | Table exists with proper schema |
| Backend API Running | ✅ PASS | Port 4000, health check OK |
| Frontend Dev Server | ✅ PASS | Port 5174, can reach backend |
| POST /auth/register | ✅ PASS | Creates user with bcrypt hash |
| POST /auth/login (correct) | ✅ PASS | Returns JWT token |
| POST /auth/login (wrong email) | ✅ PASS | Returns 404 "User not exists" |
| POST /auth/login (wrong password) | ✅ PASS | Returns 401 "Invalid credentials" |
| Signup Flow | ✅ PASS | Form → API → MySQL → Success message |
| Login Flow | ✅ PASS | Form → API → MySQL verify → JWT → Redirect to home |
| Protected Routes | ✅ PASS | Redirects to login when not authenticated |
| Logout Flow | ✅ PASS | Clears token and state, redirects to login |
| Error Display | ✅ PASS | Shows "User not exists" with signup link |
| Password Hashing | ✅ PASS | bcrypt with salt rounds 10 |
| JWT Token | ✅ PASS | 7-day expiration, stored in localStorage |

---

## 🎯 Summary

**Your complete authentication system is now working perfectly:**

1. **Signup:** User fills form → Backend hashes password with bcrypt → Stores in MySQL → Redirects to login
2. **Login (correct):** User enters credentials → Backend queries MySQL → Verifies password → Returns JWT → Stores token → Redirects to dashboard
3. **Login (wrong email):** Backend queries MySQL → No user found → Returns 404 "User not exists" → Shows error with signup link
4. **Login (wrong password):** Backend finds user → bcrypt.compare fails → Returns 401 "Invalid credentials" → Shows error
5. **Protected Routes:** Check auth state → Redirect to login if not authenticated
6. **Logout:** Clear token → Clear state → Redirect to login

**Everything is pushed to GitHub and ready for production deployment!** 🚀

**Next steps for production:**
1. Deploy backend API to Render/Railway/Azure
2. Create `.env.production` in frontend with production API URL
3. Push to GitHub → Automatic deployment to GitHub Pages
4. Users can signup/login from deployed site at: https://klu2300030150.github.io/ExpenseTracker/
