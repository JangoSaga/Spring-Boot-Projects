@echo off
REM Pre-deployment verification script for Render (Windows version)
REM This script validates your project is ready for deployment

echo.
echo ==========================================
echo Medicare HMS - Render Deployment Checker
echo ==========================================
echo.

REM Check if all required deployment files exist
echo Checking deployment files...
setlocal enabledelayedexpansion
set missing_files=0

for %%F in (
    "Procfile"
    "system.properties"
    "render.yaml"
    "DEPLOYMENT.md"
    "QUICKSTART_RENDER.md"
    "SETUP_SUMMARY.md"
    ".env.example"
    "src\main\resources\application.properties"
    "src\main\resources\application-prod.properties"
    "pom.xml"
) do (
    if exist %%F (
        echo [OK] %%F
    ) else (
        echo [MISSING] %%F
        set /a missing_files=!missing_files!+1
    )
)

echo.
echo ==========================================
if %missing_files% equ 0 (
    echo [OK] All deployment files are present!
) else (
    echo [ERROR] Missing %missing_files% file(s).
    exit /b 1
)

echo.
echo Checking pom.xml for required plugins...
findstr /C:"spring-boot-maven-plugin" pom.xml >nul
if %errorlevel% equ 0 (
    echo [OK] Spring Boot Maven plugin found
) else (
    echo [ERROR] Spring Boot Maven plugin not found
    exit /b 1
)

findstr /C:"postgresql" pom.xml >nul
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL driver found
) else (
    echo [ERROR] PostgreSQL driver not found
    exit /b 1
)

echo.
echo Checking application.properties...
findstr /C:"${DATABASE_URL}" "src\main\resources\application.properties" >nul
if %errorlevel% equ 0 (
    echo [OK] DATABASE_URL environment variable configured
) else (
    echo [ERROR] DATABASE_URL not configured
    exit /b 1
)

echo.
echo Checking .gitignore...
findstr /C:".env" .gitignore >nul
if %errorlevel% equ 0 (
    echo [OK] .env files are ignored
) else (
    echo [WARNING] .env files not in .gitignore
)

echo.
echo ==========================================
echo Pre-deployment checks complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Push to GitHub: git push origin main
echo 2. Go to Render dashboard: https://dashboard.render.com
echo 3. Create PostgreSQL database
echo 4. Create Web Service and link to this repo
echo 5. Set environment variables
echo 6. Deploy!
echo.
echo For detailed instructions, read QUICKSTART_RENDER.md
echo.
pause
