# Quick Start Guide - Render Deployment

## Option 1: Using Render Dashboard (Recommended for Beginners)

### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create a Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `medicare-hms`
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/medicare-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free (or suitable plan)

### Step 3: Create Database
1. Click **"New +"** → **"PostgreSQL"**
2. Name it `medicare-db`
3. Copy the **External Database URL** (External Connection String)

### Step 4: Set Environment Variables in Web Service
Navigate to your web service → **Environment** tab and add:

```
DATABASE_URL=jdbc:postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
DB_USERNAME=<your-db-username>
DB_PASSWORD=<your-db-password>
SECURITY_USER_NAME=admin
SECURITY_USER_PASSWORD=<strong-password>
DDL_AUTO=update
```

### Step 5: Deploy
Click **"Create Web Service"** and watch the deployment in the Logs tab.

---

## Option 2: Using render.yaml (Infrastructure as Code)

### Step 1: Push with render.yaml
```bash
git add .
git commit -m "Add render.yaml for automated deployment"
git push origin main
```

### Step 2: Deploy from Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Select your GitHub repository
4. Render will detect and deploy from `render.yaml`

### Step 3: Update Environment Variables
After deployment, update sensitive environment variables:
- `DB_PASSWORD`
- `SECURITY_USER_PASSWORD`

---

## Testing Your Deployment

Once deployed, test with these endpoints:

### Health Check
```bash
curl https://<your-app-name>.onrender.com/actuator/health
```

### API Documentation
```
https://<your-app-name>.onrender.com/swagger-ui.html
```

### Sample API Call (with auth)
```bash
curl -X GET https://<your-app-name>.onrender.com/api/departments \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM="
```

---

## Important Notes

### Security
⚠️ **DO NOT** commit `.env` or real credentials to GitHub
- Use `.env.example` as a template only
- Set real values in Render environment variables

### Build Time
- First build: 5-10 minutes
- Subsequent builds: 2-5 minutes
- Free tier may have longer build times

### Database
- Free tier database sleeps after 7 days of inactivity
- For production, use paid database plan
- Regular backups are available in Render dashboard

### Hibernation
- Free tier web services go to sleep after 15 minutes of inactivity
- First request after sleep takes 30+ seconds
- Use paid plan for production to avoid this

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs, ensure `pom.xml` is valid |
| Connection timeout | Verify `DATABASE_URL` format includes `sslmode=require` |
| Port issues | Render automatically sets `$PORT` env variable |
| Application crashes | Check application logs for errors |
| Database connection refused | Ensure DB credentials match |

---

## Next Steps

1. ✅ Deploy application
2. ✅ Set up database
3. 🔲 Configure domain name (optional)
4. 🔲 Enable auto-deploy on push
5. 🔲 Set up monitoring
6. 🔲 Configure database backups

---

## Useful Links

- [Render Docs](https://render.com/docs)
- [Spring Boot Deployment](https://spring.io/projects/spring-boot)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)
- [Java on Render](https://render.com/docs/deploy-java)

---

## Support

Need help? Check:
1. Application logs: Render Dashboard → Logs tab
2. Build logs: Render Dashboard → Events tab
3. Database status: PostgreSQL service details
