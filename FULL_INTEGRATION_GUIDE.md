# 🔗 Complete Integration Guide: Frontend + Spring Boot + MySQL

## 📊 Your Current Setup

```
ef1/
├── ExpenseFrontend/          # React frontend (port 3000 or deployed)
├── ExpenseTrackerSpringBoot/ # Spring Boot backend (port 4000)
└── MySQL Database            # Running on localhost:3306
```

These are **3 separate components** that need to be **connected**, not merged into one project.

---

## 🎯 Integration Strategy

### Option 1: Keep Separate (Recommended) ⭐
- Frontend: Deployed to GitHub Pages
- Backend: Run Spring Boot locally or deploy separately
- Database: MySQL locally or cloud

### Option 2: Serve Frontend from Spring Boot
- Bundle React build into Spring Boot
- Single deployment (backend serves frontend)
- Simpler deployment but less flexible

### Option 3: Docker (Most Professional)
- All services in containers
- Easy deployment anywhere
- Production-ready

---

## 🚀 Quick Start: Connect Frontend to Spring Boot

### Step 1: Configure Frontend API URL

Edit `ExpenseFrontend/src/config.js` (create if doesn't exist):

```javascript
// src/config.js
const config = {
  // Local development
  API_URL: 'http://localhost:4000',
  
  // Or production (when you deploy Spring Boot)
  // API_URL: 'https://your-backend.com',
};

export default config;
```

Then update your frontend API calls to use this URL:

```javascript
// Example: src/services/api.js
import config from '../config';

export const login = async (email, password) => {
  const response = await fetch(`${config.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

### Step 2: Start Spring Boot Backend

```powershell
cd "ExpenseTrackerSpringBoot"
.\mvnw.cmd spring-boot:run
```

Backend will run on: `http://localhost:4000`

### Step 3: Start Frontend (for local development)

```powershell
cd "ExpenseFrontend"
npm run dev
```

Frontend will run on: `http://localhost:5173` (or 3000)

### Step 4: Test the Connection

Open browser: `http://localhost:5173`
- Register a new user
- Login
- Backend will handle authentication
- MySQL will store the data

---

## 📦 Option 2: Bundle Frontend INTO Spring Boot

This makes Spring Boot serve both frontend and API.

### Step 1: Build React Frontend

```powershell
cd "ExpenseFrontend"
npm run build
```

This creates `dist/` folder with production build.

### Step 2: Copy Frontend Build to Spring Boot

```powershell
# Create static folder in Spring Boot
New-Item -Path "ExpenseTrackerSpringBoot\src\main\resources\static" -ItemType Directory -Force

# Copy React build to Spring Boot
Copy-Item -Path "ExpenseFrontend\dist\*" -Destination "ExpenseTrackerSpringBoot\src\main\resources\static" -Recurse -Force
```

### Step 3: Configure Spring Boot to Serve Frontend

Edit `ExpenseTrackerSpringBoot/src/main/resources/application.properties`:

```properties
# Existing MySQL config...
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# JWT config...
jwt.secret=your-secret-key-here

# Server config
server.port=4000

# Serve frontend from /
spring.web.resources.static-locations=classpath:/static/
spring.mvc.static-path-pattern=/**
```

### Step 4: Update Frontend API URL for Production

Before building, update `ExpenseFrontend/src/config.js`:

```javascript
const config = {
  // When bundled into Spring Boot, API is on same origin
  API_URL: '',  // Empty string = same server
  
  // Or explicitly:
  // API_URL: 'http://localhost:4000',
};

export default config;
```

### Step 5: Rebuild and Run

```powershell
# Rebuild frontend
cd "ExpenseFrontend"
npm run build

# Copy to Spring Boot again
Copy-Item -Path "dist\*" -Destination "..\ExpenseTrackerSpringBoot\src\main\resources\static" -Recurse -Force

# Run Spring Boot
cd "..\ExpenseTrackerSpringBoot"
.\mvnw.cmd spring-boot:run
```

Now everything runs on: `http://localhost:4000`

---

## 🐳 Option 3: Docker Integration (Best for Production)

Create `docker-compose.yml` in `ef1/` folder:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: expense-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: expense_tracker
      MYSQL_USER: expense_user
      MYSQL_PASSWORD: expense_password
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - expense-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./ExpenseTrackerSpringBoot
    container_name: expense-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/expense_tracker
      SPRING_DATASOURCE_USERNAME: expense_user
      SPRING_DATASOURCE_PASSWORD: expense_password
    ports:
      - "4000:4000"
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - expense-network

  frontend:
    build: ./ExpenseFrontend
    container_name: expense-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - expense-network

volumes:
  mysql-data:

networks:
  expense-network:
    driver: bridge
```

### Create Dockerfile for Frontend

`ExpenseFrontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create Nginx config for Frontend

`ExpenseFrontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://backend:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Run Everything with Docker

```powershell
# From ef1/ directory
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

Access: `http://localhost` (frontend) → Backend at `http://localhost:4000` → MySQL

---

## 🔧 Configuration Summary

### Frontend Needs to Know:
- **Backend URL**: Where is the Spring Boot API?
  - Local: `http://localhost:4000`
  - Production: `https://your-api.com`

### Backend Needs to Know:
- **Database URL**: `jdbc:mysql://localhost:3306/expense_tracker`
- **Database credentials**: username, password
- **CORS**: Allow frontend origin

### Database Needs:
- **Running MySQL** on port 3306
- **Database created**: `expense_tracker`
- **User with permissions**

---

## ✅ Integration Checklist

### 1. MySQL Setup
- [ ] MySQL installed and running
- [ ] Database `expense_tracker` created
- [ ] User credentials configured

### 2. Spring Boot Backend
- [ ] MySQL connection in `application.properties`
- [ ] CORS configured for frontend URL
- [ ] JWT secret set
- [ ] Running on port 4000

### 3. Frontend
- [ ] API URL configured to point to backend
- [ ] CORS headers handled
- [ ] Authentication tokens stored properly

### 4. Test Integration
- [ ] Frontend can reach backend API
- [ ] Registration works
- [ ] Login works
- [ ] Data saves to MySQL

---

## 🧪 Testing the Integration

### 1. Start MySQL
```powershell
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"
```

### 2. Start Backend
```powershell
cd "ExpenseTrackerSpringBoot"
.\mvnw.cmd spring-boot:run
```

### 3. Test Backend API
```powershell
# Health check
curl http://localhost:4000/health

# Should return: {"status":"UP"}
```

### 4. Start Frontend
```powershell
cd "ExpenseFrontend"
npm run dev
```

### 5. Test Full Flow
1. Open browser: `http://localhost:5173`
2. Register new user
3. Check MySQL: User should be in database
```sql
USE expense_tracker;
SELECT * FROM users;
```
4. Login with user
5. Should get JWT token and access app

---

## 📝 Common Integration Issues

### Issue 1: CORS Error
**Error**: "Access to fetch blocked by CORS policy"

**Fix**: Backend CORS already configured in `SecurityConfig.java`
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
    // ...
}
```

Add your frontend URL if different.

### Issue 2: Connection Refused
**Error**: "Failed to fetch" or "ERR_CONNECTION_REFUSED"

**Fix**: 
1. Make sure backend is running: `curl http://localhost:4000/health`
2. Check frontend API URL is correct
3. Check firewall isn't blocking port 4000

### Issue 3: MySQL Connection Error
**Error**: "Communications link failure"

**Fix**:
1. MySQL is running: `mysql -u root -p`
2. Database exists: `SHOW DATABASES;`
3. Credentials in `application.properties` are correct

### Issue 4: 401 Unauthorized
**Error**: API returns 401 after login

**Fix**:
1. Check JWT token is being sent in Authorization header
2. Token format: `Bearer <token>`
3. JWT secret matches between login and verification

---

## 🎯 Recommended Setup for You

Based on your setup, I recommend:

### For Development (Right Now)
1. **Keep them separate**
   - Frontend: Run with `npm run dev` (port 5173)
   - Backend: Run with Spring Boot (port 4000)
   - MySQL: Local installation (port 3306)

2. **Connect via API calls**
   - Configure API URL in frontend
   - CORS already set up in backend
   - Test with browser DevTools

### For Production (When Deploying)
1. **Frontend**: Deploy to GitHub Pages (already done!)
2. **Backend**: Deploy to cloud (AWS, Azure, Heroku, Railway)
3. **MySQL**: Use cloud database (AWS RDS, Azure MySQL, PlanetScale)

---

## 🚀 Next Steps

Would you like me to:

1. **Create the integration files** for your current setup?
2. **Bundle frontend into Spring Boot** (single deployment)?
3. **Set up Docker** integration?
4. **Help deploy** backend and database to cloud?

Let me know which approach you prefer, and I'll create all the necessary files and scripts! 🎯
