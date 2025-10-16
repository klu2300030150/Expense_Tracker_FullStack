# 🔗 Complete Integration Guide
## Spring Boot Backend + React Frontend + MySQL

This guide shows you how to connect all three parts of your Expense Tracker application.

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend                                │
│              http://localhost:5173 (dev)                         │
│     https://klu2300030150.github.io/ExpenseTracker/ (prod)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests (JSON)
                         │ Authorization: Bearer <JWT_TOKEN>
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                Spring Boot Backend API                           │
│              http://localhost:4000                               │
│                                                                  │
│  Endpoints:                                                      │
│  - POST /auth/register                                           │
│  - POST /auth/login                                              │
│  - GET  /health                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ JDBC Connection
                         │ MySQL Connector
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                │
│              localhost:3306                                      │
│              Database: expense_tracker                           │
│              Table: users                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Integration

### PART 1: Setup MySQL Database

#### Step 1: Start MySQL Service
```cmd
net start mysql
```

#### Step 2: Create Database (Optional - Spring Boot will auto-create)
```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE IF NOT EXISTS expense_tracker;

-- Verify
SHOW DATABASES;
USE expense_tracker;
```

The database and table will be auto-created by Spring Boot when you run it.

---

### PART 2: Configure Spring Boot Backend

#### Step 1: Update MySQL Password

Open: `ExpenseTrackerSpringBoot/src/main/resources/application.properties`

Update these lines:
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD_HERE
```

**Important:** Replace `YOUR_MYSQL_ROOT_PASSWORD_HERE` with your actual MySQL password.

#### Step 2: Verify CORS Configuration

Ensure your frontend URLs are allowed (already configured):
```properties
# CORS Configuration (Allow frontend)
cors.allowed.origins=http://localhost:5173,http://localhost:3000,https://klu2300030150.github.io
```

#### Step 3: Start Spring Boot Backend

**Option A: Using IDE (IntelliJ/Eclipse/VS Code)**
1. Import the `ExpenseTrackerSpringBoot` folder
2. Wait for Maven dependencies to download
3. Right-click `ExpenseTrackerApplication.java` → Run

**Option B: Using Command Line**
```cmd
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseTrackerSpringBoot"
mvnw.cmd spring-boot:run
```

**Option C: Using START.bat**
```cmd
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseTrackerSpringBoot"
START.bat
```

#### Step 4: Verify Backend is Running

Open browser: `http://localhost:4000/health`

Should see:
```json
{
  "status": "ok",
  "message": "Expense Tracker API is running"
}
```

---

### PART 3: Configure React Frontend

#### Step 1: Update API Base URL

Your frontend already has the configuration! Just verify:

**File:** `ExpenseFrontend/.env` (create if doesn't exist)
```env
VITE_API_BASE=http://localhost:4000
```

#### Step 2: Verify API Configuration

Your frontend's `src/lib/api.js` should already have:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
```

This is already set up with hybrid authentication (works with or without backend).

#### Step 3: Start React Frontend

```cmd
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseFrontend"
npm run dev
```

Open browser: `http://localhost:5173`

---

## 🧪 Testing the Complete Integration

### Test 1: Backend Health Check

```bash
curl http://localhost:4000/health
```

Expected: `{"status":"ok",...}`

### Test 2: Register a New User from Frontend

1. Open `http://localhost:5173` in browser
2. Click "Sign up" 
3. Fill in:
   - Email: `test@example.com`
   - Name: `Test User`
   - Password: `password123`
4. Click "Sign up"

**What happens:**
- Frontend sends POST request to `http://localhost:4000/auth/register`
- Backend validates input
- Backend hashes password with BCrypt
- Backend saves user to MySQL `expense_tracker.users` table
- Backend generates JWT token
- Backend returns token + user data to frontend
- Frontend stores token in localStorage
- Frontend redirects to dashboard

### Test 3: Verify User in Database

```sql
-- Login to MySQL
mysql -u root -p

-- Check user was created
USE expense_tracker;
SELECT * FROM users;
```

Should see your test user with hashed password!

### Test 4: Login with Created User

1. If logged in, logout
2. Click "Sign in"
3. Enter email: `test@example.com`
4. Enter password: `password123`
5. Click "Sign in"

Should login successfully and see dashboard!

### Test 5: Check Browser Console

Open browser DevTools (F12) → Console

Should see:
- No errors
- API requests to `http://localhost:4000/auth/login`
- Successful responses with status 200

### Test 6: Check Network Tab

1. Open DevTools (F12) → Network tab
2. Perform login
3. Check the `/auth/login` request:
   - Status: 200 OK
   - Response contains `token` and `user` object

---

## 🔐 Authentication Flow (How It Works)

### Registration Flow:

```
1. User fills signup form
   ↓
2. Frontend validates input locally
   ↓
3. Frontend sends POST to http://localhost:4000/auth/register
   Request Body: { email, name, password }
   ↓
4. Backend validates input (Spring Validation)
   ↓
5. Backend checks if email already exists (MySQL)
   ↓
6. Backend hashes password with BCrypt
   ↓
7. Backend saves to MySQL: INSERT INTO users...
   ↓
8. Backend generates JWT token (expires in 24 hours)
   ↓
9. Backend responds with:
   {
     "token": "eyJhbGciOiJI...",
     "user": { "id": 1, "email": "...", "name": "..." }
   }
   ↓
10. Frontend stores token in localStorage
    ↓
11. Frontend updates Redux state (auth.isAuthenticated = true)
    ↓
12. Frontend redirects to dashboard
```

### Login Flow:

```
1. User enters credentials
   ↓
2. Frontend sends POST to http://localhost:4000/auth/login
   Request Body: { email, password }
   ↓
3. Backend finds user by email (MySQL query)
   ↓
4. Backend compares password hash
   ↓
5. If valid: Generate new JWT token
   If invalid: Return 401 error
   ↓
6. Backend responds with token + user
   ↓
7. Frontend stores token
   ↓
8. Frontend redirects to dashboard
```

### Protected Request Flow:

```
1. Frontend makes API call (e.g., get transactions)
   ↓
2. Frontend adds header:
   Authorization: Bearer eyJhbGciOiJI...
   ↓
3. Backend JwtAuthenticationFilter intercepts
   ↓
4. Backend validates JWT token
   - Check signature
   - Check expiration
   - Extract user email
   ↓
5. If valid: Allow request
   If invalid: Return 401 Unauthorized
```

---

## 📝 Frontend API Integration Code

Your frontend already has this! Here's how it works:

### api.js (Already Configured)

```javascript
// Your existing api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// Check if backend is available
async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

// Login request
export async function loginRequest(email, password) {
  const hasBackend = await checkBackend();
  
  if (hasBackend) {
    // Use real backend API
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
  
  // Fallback: Local authentication (if backend is down)
  // ... your existing fallback code
}
```

This means:
- ✅ If Spring Boot is running → Uses real backend
- ✅ If Spring Boot is down → Uses localStorage fallback
- ✅ Works on GitHub Pages → Uses localStorage
- ✅ Works locally → Uses real backend

---

## 🚀 Running Everything Together

### Complete Startup Sequence:

#### Terminal 1: Start MySQL
```cmd
net start mysql
```

#### Terminal 2: Start Spring Boot Backend
```cmd
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseTrackerSpringBoot"
mvnw.cmd spring-boot:run
```

Wait for: "Started ExpenseTrackerApplication in X.XXX seconds"

#### Terminal 3: Start React Frontend
```cmd
cd "d:\D Drive\OneDrive - K L University\Desktop\ef1\ExpenseFrontend"
npm run dev
```

Wait for: "Local: http://localhost:5173/"

#### Terminal 4 (Optional): Monitor MySQL
```cmd
mysql -u root -p
USE expense_tracker;
SELECT * FROM users;
```

### Quick Test Commands:

```bash
# Test backend health
curl http://localhost:4000/health

# Test registration
curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"api@test.com\",\"name\":\"API Test\",\"password\":\"test123\"}"

# Test login
curl -X POST http://localhost:4000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"api@test.com\",\"password\":\"test123\"}"
```

---

## 🔧 Configuration Files Summary

### Spring Boot: application.properties
```properties
# Server
server.port=4000

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JPA
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000

# CORS
cors.allowed.origins=http://localhost:5173,https://klu2300030150.github.io
```

### React Frontend: .env
```env
VITE_API_BASE=http://localhost:4000
```

### MySQL: Database
```sql
Database: expense_tracker
Table: users
  - id (BIGINT, AUTO_INCREMENT, PRIMARY KEY)
  - email (VARCHAR(255), UNIQUE)
  - name (VARCHAR(100))
  - password_hash (VARCHAR(255))
  - created_at (TIMESTAMP)
```

---

## 🐛 Troubleshooting

### Issue 1: Frontend Can't Connect to Backend

**Symptom:** Login fails with "Failed to fetch" error

**Solutions:**
1. Verify backend is running: `http://localhost:4000/health`
2. Check CORS configuration in `application.properties`
3. Check browser console for CORS errors
4. Verify `VITE_API_BASE` in frontend `.env`

### Issue 2: Backend Can't Connect to MySQL

**Symptom:** Backend crashes with "Connection refused" or "Access denied"

**Solutions:**
1. Start MySQL: `net start mysql`
2. Verify MySQL password in `application.properties`
3. Test MySQL connection: `mysql -u root -p`
4. Check MySQL port is 3306: `SHOW VARIABLES LIKE 'port';`

### Issue 3: User Registration Fails

**Symptom:** Backend returns "User already exists"

**Solutions:**
1. User might already be registered
2. Check database: `SELECT * FROM users WHERE email='test@example.com';`
3. Use different email or delete existing user

### Issue 4: JWT Token Expired

**Symptom:** 401 Unauthorized after some time

**Solutions:**
1. Token expires after 24 hours (default)
2. User needs to login again
3. Change expiration in `application.properties`: `jwt.expiration=86400000`

### Issue 5: Password Not Matching

**Symptom:** Login fails with "Invalid credentials"

**Solutions:**
1. Verify correct password
2. Check password in database is hashed (not plain text)
3. Try registering new user

---

## ✅ Integration Checklist

### MySQL Setup:
- [ ] MySQL service is running
- [ ] Can login with `mysql -u root -p`
- [ ] Database `expense_tracker` exists (or will be auto-created)

### Spring Boot Backend:
- [ ] MySQL password updated in `application.properties`
- [ ] Maven dependencies downloaded
- [ ] Application starts without errors
- [ ] Health endpoint returns OK: `http://localhost:4000/health`
- [ ] CORS includes frontend URL

### React Frontend:
- [ ] `.env` file has `VITE_API_BASE=http://localhost:4000`
- [ ] Frontend starts on `http://localhost:5173`
- [ ] Browser console shows no errors
- [ ] Can access login/signup pages

### Integration Tests:
- [ ] Can register new user from frontend
- [ ] User appears in MySQL database
- [ ] Can login with created user
- [ ] JWT token is stored in localStorage
- [ ] Dashboard loads after login
- [ ] Logout works

---

## 🎉 Success!

If all checks pass, your integration is complete!

You now have:
- ✅ MySQL database storing users
- ✅ Spring Boot backend handling authentication
- ✅ React frontend with beautiful UI
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ CORS properly configured
- ✅ Hybrid authentication (works with or without backend)

---

## 📚 Next Steps

1. **Add More Features:**
   - Transaction CRUD operations
   - Budget tracking
   - Bill reminders
   - Charts and insights

2. **Add More Entities to Backend:**
   - Transaction.java
   - Budget.java
   - Bill.java
   - Category.java

3. **Deploy to Production:**
   - Frontend: GitHub Pages (already done!)
   - Backend: AWS, Azure, Heroku
   - Database: RDS, Azure DB, etc.

4. **Security Enhancements:**
   - Email verification
   - Password reset
   - Two-factor authentication
   - Refresh tokens

---

## 🆘 Need Help?

1. Check backend logs in IDE console
2. Check frontend console in browser DevTools (F12)
3. Check MySQL logs
4. Read error messages carefully
5. Test each component separately first

---

**Happy Coding! 🚀**

Your full-stack Expense Tracker is now integrated and ready to use!
