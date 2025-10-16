# 🚀 Quick Start - Integrated Deployment

## ✅ What's Been Configured

Your Expense Tracker is now set up for **integrated full-stack deployment**:

- ✅ Spring Boot serves React frontend as static files
- ✅ Single URL for frontend + backend
- ✅ MySQL database integration
- ✅ Docker ready
- ✅ Render.com & Railway.app deployment ready

## 🎯 Test Locally (Integrated Mode)

**Option 1: Using the batch file (Recommended)**
```bash
START_INTEGRATED.bat
```
Then open: http://localhost:4000

**Option 2: Manual build**
```bash
# 1. Build frontend
cd ExpenseFrontend
npm install
npm run build
cd ..

# 2. Build backend with frontend
cd SpringBootApp
mvn clean package
java -jar target/springboot-app-0.0.1-SNAPSHOT.jar
```

## ☁️ Deploy to Cloud

### Render.com (Free - Recommended)

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub: `klu2300030150/ExpenseTracker`
4. Settings:
   - Runtime: **Docker**
   - Branch: **main**
   - Instance: **Free**
5. Add MySQL database:
   - Use Railway.app MySQL (easier)
   - OR External MySQL service
6. Set environment variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-host:3306/expense_tracker
   SPRING_DATASOURCE_USERNAME=your_user
   SPRING_DATASOURCE_PASSWORD=your_password
   ```
7. Click "Create Web Service"
8. Wait 10 minutes → Your app is live! 🎉

### Railway.app (Easiest MySQL)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select: `klu2300030150/ExpenseTracker`
4. Add MySQL: "New" → "Database" → "MySQL"
5. Railway auto-connects everything!
6. "Settings" → "Generate Domain"
7. Done! App is live! 🎉

## 📂 Project Structure

```
ExpenseTracker/
├── ExpenseFrontend/          # React app (Vite)
│   └── dist/                 # Built files (copied to Spring Boot)
├── SpringBootApp/            # Spring Boot backend
│   ├── src/main/resources/
│   │   └── static/          # React build served from here
│   └── pom.xml              # Includes frontend build plugin
├── Dockerfile               # For cloud deployment
├── render.yaml              # Render.com config
└── DEPLOYMENT_GUIDE.md      # Detailed deployment guide
```

## 🔧 How It Works

1. **Build Process**:
   - Maven builds React frontend first
   - Copies React `dist/` to Spring Boot `static/`
   - Packages everything into a single JAR

2. **Runtime**:
   - Spring Boot runs on port 4000
   - Serves React app for all routes (/, /dashboard, etc.)
   - API endpoints at /auth/*, /health
   - Connects to MySQL database

3. **No CORS Issues**: Same origin = no cross-origin problems!

## 📖 Full Documentation

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for:
- Detailed deployment steps
- Troubleshooting guide
- Environment variables reference
- Multiple deployment options

## 🎯 Next Steps

1. ✅ Code is ready and pushed to GitHub
2. ⏭️ Choose deployment platform (Render or Railway)
3. ⏭️ Create MySQL database
4. ⏭️ Deploy following steps above
5. ✅ Your app is live!

## 💡 Tips

- **Local testing**: Use `START_INTEGRATED.bat`
- **Quick deploy**: Railway.app (auto MySQL)
- **Free tier**: Both Render and Railway offer free tiers
- **Database**: Railway's MySQL is easiest to set up

## 🐛 Troubleshooting

**Build fails?**
- Run `mvn clean package` and check errors
- Ensure Node.js and Maven are installed

**App doesn't load?**
- Check if port 4000 is free
- Verify MySQL is running
- Check application logs

**Need help?**
- See DEPLOYMENT_GUIDE.md
- Check deployment platform logs
- Test locally first!

---

**Your app is ready to deploy! 🚀**

Choose Render.com or Railway.app and follow the steps above!
