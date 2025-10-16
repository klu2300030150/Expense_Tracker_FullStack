# Spring Boot Application with MySQL Integration

This is a Spring Boot application that integrates with MySQL database and is configured to allow connections from a front-end application.

## Features

- RESTful API for User management
- MySQL database integration
- CORS enabled for front-end connections
- JPA/Hibernate for ORM

## Prerequisites

- Java 17 or higher
- MySQL Server
- Maven

## Setup

1. **Install MySQL and create database:**
   - Install MySQL Server
   - Create a database named `expense_db` (or update the URL in `application.properties`)

2. **Update database credentials:**
   - Edit `src/main/resources/application.properties`
   - Change `spring.datasource.username` and `spring.datasource.password` to your MySQL credentials

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Front-end Integration

The application is configured with CORS to allow requests from `http://localhost:3000`. Update the allowed origins in `application.properties` if your front-end runs on a different port.

## Example API Usage

### Create a User
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### Get All Users
```bash
curl http://localhost:8080/api/users
