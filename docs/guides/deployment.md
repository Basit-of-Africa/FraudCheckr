# Deployment Guide

Complete guide to deploying EFCC Convictions Explorer to production.

## Pre-Deployment Checklist

- [ ] All tests passing (`python test_api.py`)
- [ ] Code committed to git
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] SSL certificate obtained
- [ ] Domain name configured
- [ ] Server provisioned and ready
- [ ] Monitoring tools set up

## Quick Deployment Steps

### 1. Choose a Hosting Provider

Popular options:
- **Heroku** - Easiest, good for small projects
- **AWS** - Best for scaling, most features
- **DigitalOcean** - Good balance of features and price
- **PythonAnywhere** - Python-specific hosting
- **Fly.io** - Modern deployment, good pricing

### 2. Prepare Your Application

```bash
# Ensure all uncommitted changes are saved
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Configure Production Settings

Edit `main.py`:
```python
# Set to False in production
DEBUG = False
RELOAD = False
CORS_ORIGINS = ["https://yourdomain.com"]
```

### 4. Set Environment Variables

```bash
export BACKEND_HOST=0.0.0.0
export BACKEND_PORT=8000
export DEBUG=False
```

### 5. Run Production Server

```bash
# Install production dependencies
pip install gunicorn

# Run with gunicorn (production-ready)
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

## Deployment to Heroku

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository ready

### Steps

1. **Create `Procfile`** in project root:

```
web: gunicorn main:app
worker: python -m celery -A tasks worker
```

2. **Create `runtime.txt`**:

```
python-3.11.0
```

3. **Deploy to Heroku**:

```bash
heroku login
heroku create your-app-name
git push heroku main
heroku logs --tail
```

4. **Set environment variables**:

```bash
heroku config:set DEBUG=False
heroku config:set DATABASE_URL=postgresql://...
```

## Deployment to AWS

### Using EC2 and RDS

1. **Create EC2 instance**:
   - Ubuntu 22.04 LTS
   - t3.small instance type
   - Security group allowing ports 80, 443

2. **Connect to instance**:

```bash
ssh -i your-key.pem ubuntu@ec2-instance-ip
```

3. **Install dependencies**:

```bash
sudo apt update
sudo apt install python3.11 python3-pip nginx
```

4. **Clone and setup project**:

```bash
git clone https://github.com/yourusername/efcc-convictions-explorer.git
cd efcc-convictions-explorer
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. **Configure Nginx**:

Create `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

6. **Start services**:

```bash
sudo systemctl restart nginx
gunicorn -w 4 -b 127.0.0.1:8000 main:app &
```

## Docker Deployment

### Build Docker Images

**Backend Dockerfile**:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]
```

**Frontend Dockerfile**:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    volumes:
      - ./data/convictions.csv:/app/data/convictions.csv

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

Run:

```bash
docker-compose up -d
```

## SSL/TLS Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Update Nginx for HTTPS

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Database Migration (SQL)

When migrating from CSV to PostgreSQL:

```bash
# Install PostgreSQL driver
pip install psycopg2-binary sqlalchemy

# Update connection string
DATABASE_URL=postgresql://user:password@localhost/efcc_convictions
```

## Monitoring & Logging

### Application Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/app.log'),
        logging.StreamHandler()
    ]
)
```

### Monitoring Services

- **UptimeRobot** - Uptime monitoring (free)
- **Sentry** - Error tracking
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring

## Performance Optimization

### Backend
- Use gunicorn with multiple workers (4-8)
- Enable gzip compression in nginx
- Add Redis caching layer
- Database query optimization

### Frontend
- Minify CSS/JS (done by Vite)
- Enable CDN for static assets
- Lazy load components
- Implement service workers

## Backup Strategy

### Daily Backups

```bash
# Backup CSV data
0 2 * * * tar -czf /backups/efcc-$(date +\%Y\%m\%d).tar.gz /app/data/convictions.csv

# Backup database
0 3 * * * pg_dump efcc_convictions > /backups/db-$(date +\%Y\%m\%d).sql
```

## Cost Estimation

| Provider | Tier | Monthly Cost |
|----------|------|--------------|
| Heroku | Hobby | $7 ($14 with database) |
| AWS | Free tier + t3.small | $10-20 |
| DigitalOcean | Basic | $4-6 |
| PythonAnywhere | Beginner | $5 |

## Troubleshooting Deployment

### Port Already in Use
```bash
lsof -i :8000
kill -9 <PID>
```

### Permission Denied
```bash
sudo chown -R www-data:www-data /app
```

### Database Connection
```bash
# Test connection
python -c "import psycopg2; psycopg2.connect(...)"
```

## Post-Deployment

- [ ] Test all endpoints
- [ ] Verify SSL/HTTPS working
- [ ] Check database backups running
- [ ] Monitor error logs
- [ ] Set up alerts
- [ ] Document hosting details
- [ ] Test disaster recovery

---

**Next Steps**: [Production Checklist](./production-checklist.md)

**Documentation Version**: 1.0.0
