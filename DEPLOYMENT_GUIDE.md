# Full-Stack Deployment Guide

## Overview
Your Expense Tracker application is now configured for integrated deployment where:
- Spring Boot serves the React frontend as static files
- Single deployment URL for both frontend and backend
- MySQL database integration
- No CORS issues (same-origin)

## Architecture
```
User → https://your-app.com → Spring Boot (Port 4000)
                                    ├── Serves React App (/, /dashboard, etc.)
                                    ├── API Endpoints (/auth/*, /health)
                                    └── Connects to MySQL Database
```

## Deployment Options

### Option 1: Render.com (Recommended - Free Tier)

#### Prerequisites
1. Create a free account at https://render.com
2. Have your GitHub repository ready

#### Steps
1. **Push your code to GitHub** (already done!)
   
2. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select repository: `klu2300030150/ExpenseTracker`
   - Click "Connect"

3. **Configure the Web Service**
   - Name: `expense-tracker`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: Leave empty
   - Runtime: `Docker`
   - Instance Type: `Free`

4. **Create MySQL Database**
   - In Render Dashboard, click "New +" → "PostgreSQL" or use external MySQL
   - OR use Railway.app for MySQL (free tier)
   - Note down: Connection String, Username, Password

5. **Add Environment Variables**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/expense_tracker
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   PORT=4000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for build and deployment
   - Your app will be live at: `https://expense-tracker-xxxx.onrender.com`

### Option 2: Railway.app (Easier MySQL Setup)

#### Steps
1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `klu2300030150/ExpenseTracker`

3. **Add MySQL Database**
   - In your project, click "New"
   - Select "Database" → "Add MySQL"
   - Railway will auto-create and link the database

4. **Configure Variables** (Railway auto-detects some)
   - Click on your service
   - Go to "Variables" tab
   - Add if not auto-detected:
   ```
   PORT=4000
   ```

5. **Generate Domain**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Your app will be live at: `https://your-app.up.railway.app`

### Option 3: Local Integrated Deployment (Testing)

#### Steps
1. **Build the frontend and backend together**
   ```bash
   cd SpringBootApp
   mvn clean package
   ```

2. **Run the integrated application**
   ```bash
   java -jar target/springboot-app-0.0.1-SNAPSHOT.jar
   ```

3. **Access the app**
   - Open browser: `http://localhost:4000`
   - Frontend and backend run together!

## Testing Deployment

After deploying:
1. Visit your deployment URL
2. You should see the Expense Tracker login page
3. Sign up for a new account
4. Test all features:
   - Sign up / Login
   - Dashboard
   - Transactions
   - Bills
   - Budgets
   - Insights

## Troubleshooting

### Build Fails
- Check that Node.js and Maven are properly configured
- Ensure all dependencies are correct in pom.xml
- Check Render/Railway build logs

### Database Connection Error
- Verify MySQL host, port, username, password
- Check if database `expense_tracker` exists
- Verify network connectivity to database

### Frontend Not Loading
- Check if React build completed successfully
- Verify static files are copied to `target/classes/static`
- Check Spring Boot logs for errors

### API Not Working
- Verify CORS is properly configured
- Check endpoint paths match frontend API calls
- Verify authentication token handling

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `SPRING_DATASOURCE_URL` | MySQL connection string | `jdbc:mysql://host:3306/expense_tracker` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `expense_user` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your_secure_password` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Schema generation | `update` |

## Next Steps

1. **Push all changes to GitHub**
2. **Choose a deployment platform** (Render or Railway recommended)
3. **Follow the deployment steps** above
4. **Test your deployed application**
5. **Share the URL** with users!

## Support

If you encounter issues:
- Check deployment platform logs
- Verify environment variables
- Test locally first with `mvn clean package`
- Ensure MySQL is accessible from your deployment

## Cost

- **Render Free Tier**: Free (with limitations, sleeps after inactivity)
- **Railway Free Tier**: $5 credit/month (usually sufficient)
- **Heroku**: Requires credit card verification

For production use, consider upgrading to paid tiers for better performance and uptime.
