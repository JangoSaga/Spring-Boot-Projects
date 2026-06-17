# Medicare HMS - Render Deployment Guide

## Prerequisites
- Render account (https://render.com)
- GitHub repository with this code
- PostgreSQL database (you can use Render's PostgreSQL database)

## Step-by-Step Deployment

### 1. Create a PostgreSQL Database on Render
1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `medicare-db`
   - Database: `medicare_hms`
   - User: `postgres` (or custom)
   - Region: Choose closest to your users
   - Plan: Free tier or suitable plan

4. After creation, copy the **External Database URL** (you'll need this later)

### 2. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3. Create a Web Service on Render
1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `medicare-hms` (or your preferred name)
   - **Environment**: `Java`
   - **Build Command**: 
     ```
     ./mvnw clean package -DskipTests
     ```
   - **Start Command**: 
     ```
     ./Procfile
     ```
   - **Region**: Same as database
   - **Plan**: Suitable plan (free tier available)

### 4. Set Environment Variables
In the Render Web Service settings, add the following environment variables:

#### Database Configuration
- `DATABASE_URL`: Paste your PostgreSQL External Database URL from step 1
  - Format: `jdbc:postgresql://host:port/database?sslmode=require`
  - Make sure it starts with `jdbc:postgresql://`

- `DB_USERNAME`: Your database username
- `DB_PASSWORD`: Your database password

#### Security Configuration
- `SECURITY_USER_NAME`: Username for Spring Security (default: admin)
- `SECURITY_USER_PASSWORD`: Strong password for Spring Security

#### Optional Configuration
- `DDL_AUTO`: `update` (for automatic schema updates) or `validate` (production safer)
- `JAVA_OPTS`: `-Xmx512m -Xms256m` (memory configuration, adjust as needed)

### 5. Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Build the project with Maven
   - Run tests
   - Create a JAR file
   - Deploy and start your application

3. Monitor the deployment in the "Logs" tab

### 6. Verify Deployment
- Once deployed, you'll get a URL like: `https://medicare-hms.onrender.com`
- Test the API: 
  ```
  curl https://medicare-hms.onrender.com/actuator/health
  ```
- Swagger UI: `https://medicare-hms.onrender.com/swagger-ui.html`

## Environment Variable Reference

### Required Variables
| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://host:5432/db?sslmode=require` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `secure_password` | Database password |

### Optional Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Server port (Render sets this automatically) |
| `DDL_AUTO` | `update` | Hibernate DDL strategy: `create`, `update`, `validate`, `none` |
| `SECURITY_USER_NAME` | `admin` | Default Spring Security username |
| `SECURITY_USER_PASSWORD` | `admin123` | Default Spring Security password |
| `JAVA_OPTS` | `` | Additional JVM options |

## Troubleshooting

### Build Failures
- Check if `pom.xml` has all dependencies
- View build logs in Render dashboard
- Ensure Java 21 is supported by Render

### Database Connection Issues
- Verify `DATABASE_URL` format (must include `sslmode=require`)
- Check that DB credentials are correct
- Ensure PostgreSQL server is running on Render
- Database might need time to initialize

### Application Won't Start
- Check environment variables are set correctly
- View application logs in Render dashboard
- Verify Spring Boot version compatibility

### SSL/TLS Issues
- Ensure `DATABASE_URL` includes `?sslmode=require`
- Check PostgreSQL connection string format

## Scaling Considerations

- **Memory**: Adjust `JAVA_OPTS` if needed (e.g., `-Xmx512m`)
- **Database**: Monitor connections and upgrade plan if needed
- **Cold Starts**: Free tier instances sleep after inactivity

## Security Best Practices

1. **Never commit** `.env` files with real credentials
2. **Use strong passwords** for `SECURITY_USER_PASSWORD`
3. **Enable** database backups on Render
4. **Rotate credentials** periodically
5. **Use** HTTPS only (Render provides automatic SSL)
6. **Monitor logs** for suspicious activity

## Next Steps

- Set up monitoring and alerts
- Configure automatic backups for the database
- Set up CI/CD pipelines for automated deployment
- Implement proper authentication/authorization
- Add rate limiting to API endpoints
- Set up database connection pooling optimization

## Support

For issues with:
- **Render**: https://render.com/docs
- **Spring Boot**: https://spring.io/projects/spring-boot
- **PostgreSQL**: https://www.postgresql.org/docs/
