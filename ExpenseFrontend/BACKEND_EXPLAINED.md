# Backend Code Explanation - ExpenseAPI

## 🏗️ Architecture Overview

```
ExpenseAPI/
├── index.js              ← Main server file
├── db.js                 ← MySQL connection
├── routes/
│   └── auth.js          ← Signup/Login endpoints
├── middleware/
│   └── auth.js          ← JWT verification
├── .env                  ← Configuration (MySQL credentials)
└── package.json          ← Dependencies
```

---

## 📄 File-by-File Explanation

### 1️⃣ **index.js** - Main Server (Entry Point)

```javascript
import 'dotenv/config';        // Load .env file
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();

app.use(express.json());       // Parse JSON requests
app.use(cors({                 // Allow requests from frontend
  origin: (origin, cb) => cb(null, true),
}));

app.get('/health', (_, res) => res.json({ ok: true }));  // Health check
app.use('/auth', authRoutes);  // Mount auth routes at /auth

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
```

**What it does:**
- Starts Express server on port 4000
- Enables CORS (so frontend can call it)
- Routes all `/auth/*` requests to auth.js
- Health check endpoint at `/health`

---

### 2️⃣ **db.js** - MySQL Connection

```javascript
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,      // localhost
  user: process.env.MYSQL_USER,      // root
  database: process.env.MYSQL_DB,    // expense_tracker
  password: process.env.MYSQL_PASSWORD, // Sreekar@8297
  connectionLimit: 10,               // Max 10 connections
});
```

**What it does:**
- Creates a connection pool to your MySQL database
- Reads credentials from `.env` file
- Connects to `localhost:3306` (default MySQL port)
- Pool = reusable connections (efficient)

---

### 3️⃣ **routes/auth.js** - Authentication Logic

#### 🔐 **POST /auth/register** - Signup

```javascript
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    // 1. Validate input
    if (!email || !name || !password || password.length < 4) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    // 2. Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already in use' });

    // 3. Hash password with bcrypt (secure)
    const hash = await bcrypt.hash(password, 10);
    
    // 4. Insert user into MySQL
    const [result] = await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
      [email, name, hash]
    );
    
    // 5. Return success
    return res.status(201).json({ id: result.insertId, email, name });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});
```

**Flow:**
1. User submits: `{ email, name, password }`
2. Backend validates input
3. Checks if email already registered
4. Hashes password (can't be reversed!)
5. Stores in MySQL: `users` table
6. Returns user data (without password)

---

#### 🔑 **POST /auth/login** - Signin

```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(404).json({ error: 'User not exists' });

    const user = rows[0];
    
    // 2. Compare password with hashed password
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // 3. Create JWT token (expires in 7 days)
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // 4. Return token + user data
    return res.json({ token, user: payload });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});
```

**Flow:**
1. User submits: `{ email, password }`
2. Backend queries MySQL for user
3. If no user → **"User not exists"** (404)
4. If user exists → Compare passwords with bcrypt
5. If password wrong → **"Invalid credentials"** (401)
6. If correct → Create JWT token
7. Return token + user data

**JWT Token Example:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwNjA0ODAwfQ.signature
```
This encodes: `{ id: 1, email: "test@example.com", name: "Test User" }`

---

#### 👤 **GET /auth/me** - Get Current User

```javascript
router.get('/me', auth, async (req, res) => {
  return res.json({ user: req.user });
});
```

**What it does:**
- Protected endpoint (requires JWT token)
- `auth` middleware verifies token first
- Returns logged-in user data

---

### 4️⃣ **middleware/auth.js** - JWT Verification

```javascript
export function auth(req, res, next) {
  // 1. Extract token from header
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  
  // 2. Check if token exists
  if (!token) return res.status(401).json({ error: 'Missing token' });
  
  try {
    // 3. Verify token signature
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user data to request
    next(); // Continue to route handler
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

**What it does:**
- Checks if request has `Authorization: Bearer <token>` header
- Verifies token is valid and not expired
- Decodes token to get user data
- Protects routes from unauthorized access

---

## 🔒 Security Features

### 1. **Password Hashing (bcrypt)**
```javascript
const hash = await bcrypt.hash(password, 10);
```
- Passwords are **never stored in plain text**
- Uses bcrypt with 10 salt rounds
- Example: `password123` → `$2b$10$abcdefg...` (irreversible)

### 2. **JWT Authentication**
```javascript
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
```
- Stateless (no session storage needed)
- Token expires after 7 days
- Signed with secret key (can't be forged)

### 3. **SQL Injection Protection**
```javascript
pool.query('SELECT * FROM users WHERE email=?', [email]);
```
- Uses parameterized queries (`?` placeholder)
- MySQL2 escapes special characters
- Prevents: `'; DROP TABLE users; --`

### 4. **CORS Protection**
```javascript
app.use(cors({ origin: (origin, cb) => cb(null, true) }));
```
- Controls which websites can call your API
- Currently allows all (for development)
- Should be restricted in production

---

## 📊 Database Schema

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Auto-incrementing user ID
- `email` - Unique, used for login
- `name` - User's display name
- `password_hash` - bcrypt hashed password
- `created_at` - Registration timestamp

---

## 🧪 Testing with cURL

### Test Signup:
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"test1234\"}"
```

### Test Login:
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test1234\"}"
```

### Test Protected Endpoint:
```bash
curl http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ POST /auth/register
       │ { email, name, password }
       ↓
┌─────────────┐
│   Express   │ ← routes/auth.js
│   Server    │
└──────┬──────┘
       │ 1. Validate input
       │ 2. Check email exists
       │ 3. Hash password (bcrypt)
       ↓
┌─────────────┐
│    MySQL    │ ← db.js
│  (port 3306)│
└──────┬──────┘
       │ INSERT INTO users...
       ↓
┌─────────────┐
│  Response   │ ← { id, email, name }
└─────────────┘

---

Login Flow:
Frontend → POST /auth/login → MySQL query → bcrypt.compare() 
  → JWT token → Response { token, user }
```

---

## ⚙️ Configuration (.env)

```properties
PORT=4000                           # API server port
MYSQL_HOST=localhost                # MySQL host
MYSQL_USER=root                     # MySQL username
MYSQL_PASSWORD=Sreekar@8297         # MySQL password
MYSQL_DB=expense_tracker            # Database name
JWT_SECRET=please_change_me...      # Secret for JWT signing
CORS_ORIGIN=https://klu2300030150.github.io  # Allowed origin
```

---

## 🚀 How to Run

1. **Start MySQL** (already running on port 3306)
2. **Start Backend:**
   ```bash
   cd ExpenseAPI
   node index.js
   ```
   Output: `API listening on :4000`
3. **Backend is ready!** Frontend can now call:
   - POST /auth/register
   - POST /auth/login
   - GET /auth/me

---

## 📝 Summary

Your backend is **super simple** and does exactly what you need:

| Feature | How It Works |
|---------|-------------|
| **Signup** | Hash password → Store in MySQL |
| **Login** | Query MySQL → Verify password → Return JWT |
| **Authentication** | JWT token in localStorage → Verify on protected routes |
| **Security** | bcrypt hashing + JWT + SQL injection protection |
| **Database** | MySQL connection pool to localhost:3306 |

**No Spring Boot complexity needed!** Just Node.js + Express + MySQL. Simple and effective! 🎯
