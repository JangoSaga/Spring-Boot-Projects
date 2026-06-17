#!/bin/bash

# Pre-deployment verification script for Render
# This script validates your project is ready for deployment

echo "=========================================="
echo "Medicare HMS - Render Deployment Checker"
echo "=========================================="
echo ""

# Check if all required deployment files exist
echo "Checking deployment files..."
files_to_check=(
    "Procfile"
    "system.properties"
    "render.yaml"
    "DEPLOYMENT.md"
    "QUICKSTART_RENDER.md"
    "SETUP_SUMMARY.md"
    ".env.example"
    "src/main/resources/application.properties"
    "src/main/resources/application-prod.properties"
    "pom.xml"
)

missing_files=0
for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file (MISSING)"
        ((missing_files++))
    fi
done

echo ""
echo "=========================================="
if [ $missing_files -eq 0 ]; then
    echo "✓ All deployment files are present!"
else
    echo "✗ Missing $missing_files file(s). Check above."
    exit 1
fi

echo ""
echo "Checking pom.xml structure..."
if grep -q "spring-boot-maven-plugin" pom.xml; then
    echo "✓ Spring Boot Maven plugin found"
else
    echo "✗ Spring Boot Maven plugin not found"
    exit 1
fi

if grep -q "postgresql" pom.xml; then
    echo "✓ PostgreSQL driver found"
else
    echo "✗ PostgreSQL driver not found"
    exit 1
fi

echo ""
echo "Checking application.properties for environment variables..."
if grep -q "\${DATABASE_URL" src/main/resources/application.properties; then
    echo "✓ DATABASE_URL environment variable configured"
else
    echo "✗ DATABASE_URL not configured for environment variables"
    exit 1
fi

if grep -q "\${PORT" src/main/resources/application.properties; then
    echo "✓ PORT environment variable configured"
else
    echo "✗ PORT not configured for environment variables"
fi

echo ""
echo "Checking .gitignore..."
if grep -q "\.env" .gitignore; then
    echo "✓ .env files are ignored (prevents credential leaks)"
else
    echo "⚠ .env files not in .gitignore - remember not to commit credentials!"
fi

echo ""
echo "Checking system.properties..."
if grep -q "java.runtime.version" system.properties; then
    java_version=$(grep "java.runtime.version" system.properties | cut -d= -f2)
    echo "✓ Java version specified: $java_version"
else
    echo "✗ Java version not specified in system.properties"
fi

echo ""
echo "=========================================="
echo "Pre-deployment checks complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to Render dashboard: https://dashboard.render.com"
echo "3. Create PostgreSQL database"
echo "4. Create Web Service and link to this repo"
echo "5. Set environment variables"
echo "6. Deploy!"
echo ""
echo "For detailed instructions, read QUICKSTART_RENDER.md"
