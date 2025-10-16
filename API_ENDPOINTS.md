# Spring Boot Backend API Endpoints

## Base URL
- **Local Development**: `http://localhost:4000`

## Available Endpoints

### Root
- **GET /** - API information
  ```json
  {
    "message": "Spring Boot Backend API",
    "status": "running",
    "endpoints": ["/health", "/auth/login", "/auth/register", "/auth/me"]
  }
  ```

### Health Check
- **GET /health** - Check if backend is running
  ```json
  {
    "status": "UP",
    "service": "SpringBootApp"
  }
  ```

### Authentication

#### Register New User
- **POST /auth/register**
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "yourpassword"
  }
  ```
- Response (200 OK):
  ```json
  {
    "token": "base64-encoded-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- Error Response (400):
  ```json
  {
    "error": "Email already in use"
  }
  ```

#### Login
- **POST /auth/login**
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- Response (200 OK):
  ```json
  {
    "token": "base64-encoded-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- Error Response (400):
  ```json
  {
    "error": "User not exists" | "Invalid credentials"
  }
  ```

#### Get Current User
- **GET /auth/me**
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Response (200 OK):
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
  ```
- Error Response (401):
  ```json
  {
    "error": "No token" | "Invalid token"
  }
  ```

## Database Configuration
- **Database**: MySQL
- **Database Name**: `expense_tracker`
- **Host**: localhost:3306
- **Username**: root
- **Password**: Sreekar@8297

## CORS Configuration
- Allowed Origin: `http://localhost:5173` and `http://localhost:5174`
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: Enabled

## Frontend Integration
Your React frontend at `http://localhost:5174` is configured to call this backend via:
- API Base URL: `http://localhost:4000` (configured in `.env` as `VITE_API_BASE`)

## Testing Endpoints

### Using curl (PowerShell):
```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:4000/health

# Register
Invoke-WebRequest -Uri http://localhost:4000/auth/register -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
Invoke-WebRequest -Uri http://localhost:4000/auth/login -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
```

## How to Restart Backend
If you made code changes and need to restart:
```powershell
# Set environment variables
$env:JAVA_HOME="C:\Users\DACHARLASREEKAR\tools\jdk-21"
$env:Path += ";$env:JAVA_HOME\bin;C:\Users\DACHARLASREEKAR\tools\apache-maven-3.9.9\bin"

# Navigate to project directory
cd "D:\D Drive\OneDrive - K L University\Desktop\ef1\SpringBootApp"

# Run Spring Boot
mvn spring-boot:run
```

## Common Issues

### 404 Error
If you see "Whitelabel Error Page" with 404:
- Make sure you're accessing a valid endpoint listed above
- Check that the backend is running on port 4000
- Verify the URL path is correct (e.g., `/health` not `/healths`)

### Connection Refused
- Ensure MySQL is running
- Check that port 4000 is not blocked by firewall
- Verify JAVA_HOME and Maven are set correctly

### Database Errors
- Ensure MySQL database `expense_tracker` exists
- Check MySQL credentials in `application.properties`
- Verify MySQL is running on port 3306
