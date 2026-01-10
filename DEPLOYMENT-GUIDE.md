# 🚀 PINTEREST VIDEO DOWNLOADER - PRODUCTION DEPLOYMENT GUIDE

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database & Redis Setup](#database--redis-setup)
5. [Domain & SSL Configuration](#domain--ssl-configuration)
6. [Environment Variables](#environment-variables)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Scaling & Performance](#scaling--performance)

---

## Prerequisites

- Node.js v18+ and npm
- Docker & Docker Compose (optional but recommended)
- Redis instance (local or cloud)
- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)
- Git for version control

---

## Backend Deployment

### Option 1: Deploy to Railway

1. **Create Railway Account**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

3. **Configure Environment**
   - Add Redis service in Railway dashboard
   - Set environment variables (see [Environment Variables](#environment-variables))

4. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Deploy to Render

1. **Create `render.yaml` in project root**
   ```yaml
   services:
     - type: web
       name: pinterest-downloader-api
       env: node
       buildCommand: cd backend && npm install && npm run build
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: REDIS_URL
           fromService:
             type: redis
             name: pinterest-redis
             property: connectionString
   
     - type: redis
       name: pinterest-redis
       plan: starter
       maxmemoryPolicy: allkeys-lru
   ```

2. **Deploy**
   - Connect your GitHub repo to Render
   - Render will auto-deploy on push

### Option 3: Deploy to VPS (Ubuntu/Debian)

1. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install Redis
   sudo apt install redis-server -y
   sudo systemctl enable redis-server
   sudo systemctl start redis-server
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone & Build**
   ```bash
   git clone <your-repo-url> /var/www/pinterest-downloader
   cd /var/www/pinterest-downloader/backend
   npm install --production
   npm run build
   ```

3. **Configure PM2**
   ```bash
   # Create ecosystem file
   pm2 init
   ```
   
   Edit `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'pinterest-api',
       script: './dist/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env_production: {
         NODE_ENV: 'production',
         PORT: 8080,
         REDIS_URL: 'redis://localhost:6379'
       }
     }]
   }
   ```

4. **Start Application**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx Reverse Proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/pinterest-api
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/pinterest-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment**
   Create `.env.production` in frontend directory:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Configure Custom Domain**
   - Go to Vercel Dashboard
   - Add custom domain
   - Update DNS records as instructed

### Option 2: Deploy to Netlify

1. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [build.environment]
     VITE_API_BASE_URL = "https://api.yourdomain.com"
   ```

2. **Deploy**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Option 3: Deploy to VPS with Nginx

1. **Build Frontend**
   ```bash
   cd /var/www/pinterest-downloader/frontend
   npm install
   npm run build
   ```

2. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/pinterest-frontend
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/pinterest-downloader/frontend/dist;
       index index.html;
       
       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_types text/plain text/css text/xml text/javascript 
                  application/x-javascript application/xml+rss 
                  application/json application/javascript;
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       
       # Cache static assets
       location ~* \\.(?:css|js|jpg|jpeg|gif|png|ico|woff2?|eot|ttf|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
       
       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Enable and Restart**
   ```bash
   sudo ln -s /etc/nginx/sites-available/pinterest-frontend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## Database & Redis Setup

### Redis Cloud (Recommended for Production)

1. **Upstash Redis** (Free tier available)
   - Visit https://upstash.com
   - Create Redis database
   - Copy connection URL
   - Add to backend environment: `REDIS_URL=redis://...`

2. **Redis Labs**
   - Visit https://redis.com/try-free/
   - Create free account
   - Copy connection string

### Local Redis Setup

```bash
# Ubuntu/Debian
sudo apt install redis-server -y
sudo systemctl enable redis
sudo systemctl start redis

# Configure for production
sudo nano /etc/redis/redis.conf
# Set: maxmemory 256mb
# Set: maxmemory-policy allkeys-lru
sudo systemctl restart redis
```

---

## Domain & SSL Configuration

### SSL with Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### DNS Configuration

Add these records to your DNS provider:

```
Type    Name    Value                   TTL
A       @       <your-server-ip>        3600
A       api     <your-server-ip>        3600
CNAME   www     yourdomain.com          3600
```

---

## Environment Variables

### Backend `.env`

```bash
# Application
NODE_ENV=production
PORT=8080

# Security
API_KEY_REQUIRED=true
API_KEYS=your-secret-key-1,your-secret-key-2

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Redis
REDIS_URL=redis://localhost:6379
# or for cloud: redis://username:password@host:port

# Rate Limiting
GLOBAL_RATE_LIMIT_WINDOW_MS=60000
GLOBAL_RATE_LIMIT_MAX=100

# Pinterest
PINTEREST_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

### Frontend `.env.production`

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs pinterest-api

# Monitor performance
pm2 monit

# Restart application
pm2 restart pinterest-api

# View metrics
pm2 describe pinterest-api
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Redis Monitoring

```bash
# Connect to Redis CLI
redis-cli

# Monitor commands
MONITOR

# Get info
INFO

# Check memory
INFO memory
```

### Health Checks

Set up monitoring with:
- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com
- **New Relic**: https://newrelic.com

Monitor these endpoints:
- `https://api.yourdomain.com/health`
- `https://yourdomain.com`

---

## Scaling & Performance

### Backend Scaling

1. **Horizontal Scaling**
   ```bash
   # Increase PM2 instances
   pm2 scale pinterest-api +2
   ```

2. **Load Balancing**
   ```nginx
   upstream api_backend {
       least_conn;
       server localhost:8080;
       server localhost:8081;
       server localhost:8082;
   }
   
   server {
       location / {
           proxy_pass http://api_backend;
       }
   }
   ```

3. **CDN Integration**
   - Use Cloudflare (free tier) for:
     - DDoS protection
     - CDN caching
     - SSL/TLS
     - Analytics

### Redis Optimization

```redis
# Set memory policy
CONFIG SET maxmemory-policy allkeys-lru

# Set max memory
CONFIG SET maxmemory 512mb

# Enable compression
CONFIG SET save ""
```

### Performance Tips

1. **Enable HTTP/2**
   ```nginx
   listen 443 ssl http2;
   ```

2. **Enable Brotli Compression**
   ```bash
   sudo apt install libbrotli-dev -y
   # Add to nginx.conf
   brotli on;
   brotli_types text/plain text/css application/json application/javascript;
   ```

3. **Database Connection Pooling**
   - Already implemented in Redis service

4. **Caching Strategy**
   - Pinterest URLs: 1 hour (3600s)
   - Blog posts: 24 hours (86400s)
   - Static assets: 1 year

---

## Security Checklist

- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set security headers
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Monitor for abuse
- [ ] Implement API key rotation
- [ ] Enable firewall (UFW)
- [ ] Disable root SSH login
- [ ] Use fail2ban for brute force protection

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm run build          # Build TypeScript
npm start             # Start production server
npm run dev           # Development mode

# Frontend
cd frontend
npm run build         # Build for production
npm run preview       # Preview production build
npm run dev           # Development mode

# PM2
pm2 start ecosystem.config.js
pm2 stop all
pm2 restart all
pm2 logs
pm2 monit

# Nginx
sudo nginx -t          # Test configuration
sudo systemctl reload nginx
sudo systemctl restart nginx

# SSL Renewal
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Backend Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :8080
   sudo kill -9 <PID>
   ```

2. **Redis connection failed**
   ```bash
   redis-cli ping  # Should return PONG
   sudo systemctl status redis
   ```

3. **Memory issues**
   ```bash
   pm2 restart pinterest-api --max-memory-restart 500M
   ```

### Frontend Issues

1. **API not reachable**
   - Check VITE_API_BASE_URL
   - Verify CORS settings
   - Check firewall rules

2. **Build fails**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

---

## Support & Resources

- **Documentation**: Check README.md files
- **Issues**: GitHub Issues
- **Updates**: Follow semantic versioning
- **Backups**: Setup automated backups for Redis data

---

**Last Updated**: 2026-01-11
**Version**: 1.0.0
