# Authentication Flow Test Results

## ✅ Database Setup - VERIFIED

**MySQL Database:** `expense_tracker`
**Table:** `users`
**Current Users:** 2 registered users

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## ✅ Backend API Endpoints - WORKING

**Base URL:** `http://localhost:4000`

### POST /auth/register
- **Purpose:** Create new user account
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepass123"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```
- **Error Responses:**
  - `409 Conflict`: "Email already in use"
  - `400 Bad Request`: "Invalid input"
  - `500 Internal Server Error`: "Server error"

### POST /auth/login
- **Purpose:** Authenticate user and get JWT token
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepass123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- **Error Responses:**
  - `404 Not Found`: "User not exists" ← **When email doesn't exist in database**
  - `401 Unauthorized`: "Invalid credentials" ← **When password is wrong**
  - `500 Internal Server Error`: "Server error"

## ✅ Complete Authentication Flow

### Scenario 1: New User Signup → Login → Dashboard

1. **User visits:** `http://localhost:5174/ExpenseTracker/#/signup`
2. **User fills form:**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test1234"
3. **Click "Sign up":**
   - Frontend calls: `POST /auth/register`
   - Backend stores: User data with bcrypt-hashed password in MySQL
   - Success: Shows "Account created! You can now sign in."
   - Auto-redirects to: `#/login` after 1 second

4. **User enters credentials on login page:**
   - Email: "test@example.com"
   - Password: "test1234"
5. **Click "Sign in":**
   - Frontend calls: `POST /auth/login`
   - Backend queries: MySQL for user by email
   - Backend verifies: Password with bcrypt.compare()
   - Success: Returns JWT token + user data
   - Frontend stores: Token in localStorage
   - Frontend dispatches: LOGIN action to update auth state
   - Redirects to: `#/` (Dashboard/Home page)

6. **Dashboard loads:**
   - Protected route checks: `state.auth.isAuthenticated === true`
   - Shows: User avatar and name in header
   - User can: Navigate all protected pages

### Scenario 2: Login with Non-Existent User

1. **User enters:**
   - Email: "nonexistent@example.com"
   - Password: "anypassword"
2. **Backend response:** `404 Not Found`
   ```json
   { "error": "User not exists" }
   ```
3. **Frontend displays:**
   - Error message: "User not exists — Create an account" (with link to signup)

### Scenario 3: Login with Wrong Password

1. **User enters:**
   - Email: "test@example.com" (exists in DB)
   - Password: "wrongpassword"
2. **Backend response:** `401 Unauthorized`
   ```json
   { "error": "Invalid credentials" }
   ```
3. **Frontend displays:**
   - Error message: "Invalid credentials"

### Scenario 4: Logout

1. **User clicks "Logout" button in header**
2. **Frontend:**
   - Calls: `clearToken()` to remove token from localStorage
   - Dispatches: LOGOUT action to clear auth state
   - Redirects: `window.location.hash = '#/login'`
3. **Protected routes:** Now redirect to login page

## 🔒 Security Features

- **Password Hashing:** bcrypt with salt rounds = 10
- **JWT Authentication:** 7-day expiration
- **Protected Routes:** RequireAuth guard redirects unauthenticated users
- **CORS:** Configured for localhost and GitHub Pages origin
- **SQL Injection Protection:** Parameterized queries with mysql2

## 🧪 How to Test Locally

### 1. Start Backend API
```bash
cd ExpenseAPI
node index.js
# Output: API listening on :4000
```

### 2. Start Frontend Dev Server
```bash
cd ExpenseFrontend
npm run dev
# Output: Local: http://localhost:5174/ExpenseTracker/
```

### 3. Test the Flow

#### Test New Signup:
1. Open: http://localhost:5174/ExpenseTracker/#/signup
2. Fill form with new email
3. Submit → Should see success + redirect to login
4. Enter same credentials on login page
5. Submit → Should redirect to dashboard

#### Test Wrong Email:
1. Open: http://localhost:5174/ExpenseTracker/#/login
2. Enter: nonexistent999@example.com
3. Submit → Should show "User not exists"

#### Test Wrong Password:
1. Login page with existing email
2. Enter wrong password
3. Submit → Should show "Invalid credentials"

## 📝 Database Verification

Check users in MySQL:
```bash
mysql -u root -p
# Password: Sreekar@8297

USE expense_tracker;
SELECT id, email, name, created_at FROM users;
```

## ✅ Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| MySQL Database | ✅ Working | `expense_tracker` database with `users` table |
| Backend API | ✅ Running | Port 4000, all endpoints functional |
| Frontend Dev Server | ✅ Running | Port 5174, can reach backend |
| Signup Flow | ✅ Working | Stores users in MySQL with hashed passwords |
| Login Flow | ✅ Working | Verifies credentials, returns JWT, redirects to home |
| Error Handling | ✅ Working | "User not exists" vs "Invalid credentials" |
| Protected Routes | ✅ Working | Redirects to login when not authenticated |
| Logout | ✅ Working | Clears token and auth state |

## 🚀 Ready for Production

To deploy:
1. Host backend API on Render/Railway/Azure
2. Update frontend `.env.production` with production API URL
3. Push to GitHub → GitHub Pages auto-deploys frontend
4. Users can signup/login from deployed site
