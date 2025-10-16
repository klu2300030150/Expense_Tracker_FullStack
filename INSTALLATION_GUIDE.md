# 🚀 Automatic Installation Scripts

## Quick Setup Guide

### Option 1: One-Click Full Setup (Recommended)
**Double-click:** `SETUP_REQUIREMENTS.bat`

This will:
- ✅ Check if Java 17+ is installed
- ✅ Check if Node.js is installed  
- ✅ Check if MySQL is installed
- ✅ Automatically install missing software
- ✅ Verify all installations

---

### Option 2: Individual Installers

#### Install Java Only
**Double-click:** `INSTALL_JDK.bat`

- Downloads JDK 17 from Eclipse Adoptium
- Installs automatically
- Sets JAVA_HOME environment variable
- Adds Java to PATH

#### Install Everything & Start
**Double-click:** `START_ALL.bat`

- Checks requirements
- Offers to install Java if missing
- Starts MySQL, Backend, and Frontend
- Opens browser automatically

---

## 📋 What Gets Installed

### Java JDK 17
- **Source:** Eclipse Adoptium (Temurin)
- **URL:** https://adoptium.net/
- **Size:** ~180 MB
- **Installation:** Automatic
- **Location:** `C:\Program Files\Eclipse Adoptium\jdk-17.x.x\`

### Node.js 20 LTS
- **Source:** nodejs.org
- **URL:** https://nodejs.org/
- **Size:** ~30 MB
- **Installation:** Automatic
- **Location:** `C:\Program Files\nodejs\`

### MySQL 8
- **Source:** MySQL Community Server
- **URL:** https://dev.mysql.com/downloads/
- **Size:** ~400 MB
- **Installation:** Manual (guided)
- **Note:** Too large to auto-download, opens download page

---

## 🎯 Installation Process

### SETUP_REQUIREMENTS.bat Flow:

```
1. Check Java → If missing → Download & Install JDK 17
2. Check Node.js → If missing → Download & Install Node.js 20
3. Check MySQL → If missing → Open download page & guide user
4. Verify installations
5. Ready to run START_ALL.bat
```

### INSTALL_JDK.bat Flow:

```
1. Check if Java is installed
2. If yes and version >= 17 → Exit (already good!)
3. If no or version < 17 → Ask to install
4. Download JDK 17 from Adoptium
5. Run MSI installer
6. Set JAVA_HOME environment variable
7. Add to PATH
8. Verify installation
```

### START_ALL.bat Flow:

```
1. Check Java → If missing → Offer to run INSTALL_JDK.bat
2. Check Node.js → Show warning if missing
3. Check MySQL → Show warning if missing
4. Start MySQL service
5. Start Spring Boot Backend (port 4000)
6. Start React Frontend (port 5173)
7. Open browser to http://localhost:5173
```

---

## ⚙️ Environment Variables Set

### JAVA_HOME
```
C:\Program Files\Eclipse Adoptium\jdk-17.x.x
```

### PATH Additions
```
C:\Program Files\Eclipse Adoptium\jdk-17.x.x\bin
C:\Program Files\nodejs\
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

---

## ✅ Verification Commands

After installation, verify with:

```cmd
# Check Java
java -version

# Check Node.js
node --version

# Check npm
npm --version

# Check MySQL
mysql --version

# Check environment variables
echo %JAVA_HOME%
echo %PATH%
```

---

## 🔧 Troubleshooting

### Java not found after installation
1. **Restart Command Prompt** - Environment variables need refresh
2. **Restart Computer** - If still not working
3. **Manual verification:**
   - Check if Java installed: `C:\Program Files\Eclipse Adoptium\`
   - Check JAVA_HOME: Windows → System Properties → Environment Variables

### Node.js not found after installation
1. **Restart Command Prompt**
2. **Check installation:** `C:\Program Files\nodejs\`
3. **Reinstall** if needed from: https://nodejs.org/

### MySQL not in PATH
1. After MySQL installation, find: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
2. Add to PATH manually:
   - Windows → System Properties → Environment Variables
   - Edit "Path" variable
   - Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

### Installation requires admin rights
- **Right-click** the .bat file → **Run as Administrator**

---

## 📝 Manual Installation (If Scripts Fail)

### Java JDK 17
1. Go to: https://adoptium.net/
2. Download: JDK 17 (LTS) for Windows x64
3. Run installer
4. Check "Set JAVA_HOME" and "Add to PATH"
5. Verify: `java -version`

### Node.js
1. Go to: https://nodejs.org/
2. Download: LTS version (20.x)
3. Run installer
4. Check "Add to PATH"
5. Verify: `node --version`

### MySQL
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download: mysql-installer-community
3. Run installer
4. Choose "Developer Default"
5. Set root password (remember it!)
6. Verify: `mysql --version`

---

## 🎉 After Installation

### Update Backend Configuration
Edit: `ExpenseTrackerSpringBoot/src/main/resources/application.properties`

```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

### Start Everything
```cmd
START_ALL.bat
```

### Test It
1. Backend: http://localhost:4000/health
2. Frontend: http://localhost:5173
3. Register & Login

---

## 🆘 Support

If automatic installation fails:

1. **Check logs** - Scripts show detailed error messages
2. **Try manual installation** - Links provided above
3. **Check system requirements:**
   - Windows 10/11
   - 4GB RAM minimum
   - 2GB free disk space
   - Internet connection
4. **Run as Administrator** - Some installations need elevated privileges

---

## 📦 Script Files

| File | Purpose |
|------|---------|
| `SETUP_REQUIREMENTS.bat` | Check & install all requirements |
| `INSTALL_JDK.bat` | Install Java JDK 17 only |
| `START_ALL.bat` | Start all services (checks Java first) |
| `STOP_ALL.bat` | Stop all services |

---

## ✨ Features

✅ **Automatic Detection** - Checks what's already installed  
✅ **Version Checking** - Ensures correct versions  
✅ **Automatic Download** - From official sources  
✅ **Silent Installation** - Minimal user interaction  
✅ **Environment Setup** - Sets all required variables  
✅ **Verification** - Confirms successful installation  
✅ **Error Handling** - Clear error messages  
✅ **Rollback Safe** - Won't break existing installations  

---

## 🔒 Security

- **Official Sources Only** - Downloads from verified repositories
- **No Third-Party** - Eclipse Adoptium, nodejs.org, mysql.com
- **Open Source** - All scripts are readable
- **No Malware** - Pure batch scripts, no executables

---

**Happy Installing! 🚀**

Just run `SETUP_REQUIREMENTS.bat` and you're good to go!
