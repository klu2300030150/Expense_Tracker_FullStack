# 🧪 Complete Testing Guide
## Test Your Full-Stack Integration

---

## 🎯 Test Checklist

### ✅ Pre-Integration Tests (Before Connecting)

#### MySQL Database Test
```cmd
# Test 1: Check if MySQL is running
mysql --version

# Test 2: Login to MySQL
mysql -u root -p

# Test 3: Check databases
SHOW DATABASES;

# Test 4: Create/verify expense_tracker database
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;
SHOW TABLES;
```

**Expected:** 
- MySQL version displayed
- Can login successfully
- Database `expense_tracker` exists (or gets created)

---

#### Spring Boot Backend Test

```cmd
# Start backend
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseTrackerSpringBoot"
mvnw.cmd spring-boot:run
```

**Test 1: Health Check**
- Open browser: `http://localhost:4000/health`
- Expected: `{"status":"ok","message":"Expense Tracker API is running"}`

**Test 2: Register via API (Postman or curl)**
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"backend@test.com\",\"name\":\"Backend Test\",\"password\":\"test123\"}"
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "backend@test.com",
    "name": "Backend Test"
  }
}
```

**Test 3: Verify in Database**
```sql
mysql -u root -p
USE expense_tracker;
SELECT * FROM users;
```

**Expected:** See the user with email `backend@test.com` and hashed password

**Test 4: Login via API**
```bash
curl -X POST http://localhost:4000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"backend@test.com\",\"password\":\"test123\"}"
```

**Expected:** Same response format with token and user data

---

#### React Frontend Test

```cmd
# Start frontend
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseFrontend"
npm run dev
```

**Test 1: Frontend Loads**
- Open browser: `http://localhost:5173`
- Expected: Login page displays with nice UI

**Test 2: Check Browser Console**
- Press F12 → Console tab
- Expected: No red errors

**Test 3: Check Network Tab**
- Press F12 → Network tab
- Refresh page
- Expected: All assets load successfully (status 200)

---

### ✅ Full Integration Tests (All Connected)

#### Test 1: Complete Registration Flow

**Steps:**
1. Start MySQL (if not running)
2. Start Spring Boot backend
3. Start React frontend
4. Open `http://localhost:5173`
5. Click "Sign up"
6. Fill form:
   - Email: `integration@test.com`
   - Name: `Integration Test`
   - Password: `password123`
7. Click "Sign up" button

**What to Check:**

**Frontend (Browser):**
- [ ] Form validates input
- [ ] Loading indicator shows briefly
- [ ] Redirects to dashboard after success
- [ ] User name appears in header

**Frontend Console (F12 → Console):**
- [ ] No errors
- [ ] Should see API request to `http://localhost:4000/auth/register`

**Frontend Network Tab (F12 → Network):**
- [ ] POST request to `/auth/register` with status 200
- [ ] Response contains `token` and `user` object

**Backend Console:**
- [ ] Log shows: `POST /auth/register`
- [ ] No errors
- [ ] SQL: `INSERT INTO users...`

**MySQL Database:**
```sql
SELECT * FROM users WHERE email='integration@test.com';
```
- [ ] User exists
- [ ] Password is hashed (not plain text)
- [ ] `created_at` timestamp is set

---

#### Test 2: Complete Login Flow

**Steps:**
1. Click "Logout" (if logged in)
2. Click "Sign in"
3. Enter:
   - Email: `integration@test.com`
   - Password: `password123`
4. Click "Sign in"

**What to Check:**

**Frontend:**
- [ ] Form validates input
- [ ] Loading indicator shows
- [ ] Redirects to dashboard
- [ ] User data appears in header

**Frontend Console:**
- [ ] No errors
- [ ] API call to `/auth/login` successful

**Frontend Network Tab:**
- [ ] POST to `/auth/login` returns 200
- [ ] Response has JWT token

**Backend Console:**
- [ ] Log shows: `POST /auth/login`
- [ ] No errors

**Browser LocalStorage:**
```javascript
// In console:
localStorage.getItem('auth_token')
```
- [ ] JWT token is stored

---

#### Test 3: Wrong Password

**Steps:**
1. Try to login with wrong password
2. Email: `integration@test.com`
3. Password: `wrongpassword`

**Expected:**
- [ ] Backend returns 401 Unauthorized
- [ ] Frontend shows error message: "Invalid credentials"
- [ ] User stays on login page
- [ ] No redirect

---

#### Test 4: Duplicate Registration

**Steps:**
1. Try to register with existing email
2. Email: `integration@test.com`
3. Any name and password

**Expected:**
- [ ] Backend returns 400 Bad Request
- [ ] Frontend shows error: "User already exists"
- [ ] User stays on registration page

---

#### Test 5: Session Persistence

**Steps:**
1. Login successfully
2. Close browser tab
3. Open `http://localhost:5173` again

**Expected:**
- [ ] Automatically logged in
- [ ] Dashboard shows immediately
- [ ] User data in header
- [ ] Token still in localStorage

---

#### Test 6: Logout

**Steps:**
1. Click "Logout" button

**Expected:**
- [ ] Redirects to login page
- [ ] Token removed from localStorage
- [ ] Can't access dashboard without logging in again

---

#### Test 7: Backend Down (Hybrid Auth)

**Steps:**
1. Stop Spring Boot backend (Ctrl+C)
2. Open frontend `http://localhost:5173`
3. Try to register new user:
   - Email: `offline@test.com`
   - Name: `Offline Test`
   - Password: `test123`

**Expected:**
- [ ] Frontend detects backend is down
- [ ] Falls back to localStorage authentication
- [ ] Registration succeeds (stored locally)
- [ ] Can login with local account
- [ ] Works offline

---

### ✅ Database Tests

#### Test 1: View All Users
```sql
mysql -u root -p
USE expense_tracker;
SELECT id, email, name, created_at FROM users;
```

#### Test 2: Check Password Hashing
```sql
SELECT email, password_hash FROM users LIMIT 1;
```
- [ ] Password hash starts with `$2a$` or `$2b$` (BCrypt)
- [ ] Hash is 60 characters long
- [ ] Not plain text password

#### Test 3: Count Users
```sql
SELECT COUNT(*) as total_users FROM users;
```

#### Test 4: Recent Users
```sql
SELECT email, name, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
```

---

### ✅ API Endpoint Tests (Using Postman or curl)

#### Test 1: Health Check
```bash
curl http://localhost:4000/health
```
Expected: `{"status":"ok"}`

#### Test 2: Register
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"api@test.com\",\"name\":\"API User\",\"password\":\"test123\"}"
```
Expected: 200 OK with token

#### Test 3: Login
```bash
curl -X POST http://localhost:4000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"api@test.com\",\"password\":\"test123\"}"
```
Expected: 200 OK with token

#### Test 4: Invalid Email Format
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"notanemail\",\"name\":\"Test\",\"password\":\"test123\"}"
```
Expected: 400 Bad Request with validation error

#### Test 5: Short Password
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@email.com\",\"name\":\"Test\",\"password\":\"123\"}"
```
Expected: 400 Bad Request (password must be at least 4 characters)

---

### ✅ Security Tests

#### Test 1: CORS
1. Open browser console
2. Try to make request from different origin:
```javascript
fetch('http://localhost:4000/health', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(d => console.log(d));
```

- [ ] Should work from `localhost:5173`
- [ ] Should work from allowed origins

#### Test 2: JWT Token Validation
1. Login and copy JWT token
2. Try to use expired or invalid token
3. Backend should reject with 401

#### Test 3: Password Hashing
1. Check database - passwords must be hashed
2. Same password should produce different hashes (BCrypt salt)

---

### ✅ Performance Tests

#### Test 1: Response Time
- Health check: < 100ms
- Login: < 500ms
- Register: < 1000ms

#### Test 2: Concurrent Users
1. Open 3 browser tabs
2. Login with different users in each
3. All should work independently

---

### ✅ Error Handling Tests

#### Test 1: Missing Fields
Try to register without email:
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test\",\"password\":\"test123\"}"
```
Expected: 400 Bad Request with error message

#### Test 2: MySQL Connection Lost
1. Stop MySQL: `net stop mysql`
2. Try to register
3. Backend should show connection error
4. Frontend should show error message

#### Test 3: Invalid JSON
```bash
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "invalid json"
```
Expected: 400 Bad Request

---

## 🎯 Quick Test Script

Save as `test_integration.bat`:

```batch
@echo off
echo Testing Integration...
echo.

echo Test 1: Backend Health
curl http://localhost:4000/health
echo.
echo.

echo Test 2: Register User
curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{\"email\":\"auto@test.com\",\"name\":\"Auto Test\",\"password\":\"test123\"}"
echo.
echo.

echo Test 3: Login
curl -X POST http://localhost:4000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"auto@test.com\",\"password\":\"test123\"}"
echo.
echo.

pause
```

---

## ✅ Final Integration Checklist

### Before Declaring Success:

- [ ] MySQL service is running
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Health endpoint returns OK
- [ ] Can register new user from UI
- [ ] User appears in database
- [ ] Can login with registered user
- [ ] JWT token is generated
- [ ] Token is stored in localStorage
- [ ] Dashboard loads after login
- [ ] Logout works properly
- [ ] Can't access dashboard when logged out
- [ ] Wrong password shows error
- [ ] Duplicate email shows error
- [ ] Session persists after browser refresh
- [ ] Hybrid auth works when backend is down
- [ ] No console errors in browser
- [ ] No errors in backend logs
- [ ] CORS allows frontend requests
- [ ] Passwords are hashed in database

---

## 🎉 Success Criteria

✅ **All tests pass**
✅ **No errors in console**
✅ **User flow is smooth**
✅ **Data persists in MySQL**
✅ **Security is working**

---

## 📝 Testing Notes

Keep track of your test results:

```
Date: __________
Tester: __________

✅ MySQL Test: PASS / FAIL
✅ Backend Test: PASS / FAIL
✅ Frontend Test: PASS / FAIL
✅ Registration Flow: PASS / FAIL
✅ Login Flow: PASS / FAIL
✅ Database Verification: PASS / FAIL
✅ Security Tests: PASS / FAIL

Notes:
_____________________________
_____________________________
_____________________________
```

---

**Happy Testing! 🧪**

Your full-stack integration is ready when all tests pass!
