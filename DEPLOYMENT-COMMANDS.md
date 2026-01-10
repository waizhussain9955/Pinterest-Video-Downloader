# 🚀 Quick Deployment Commands

Copy-paste commands for quick deployment to production.

---

## 📦 Backend Deployment

### Option 1: Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd backend

# Initialize project
railway init

# Deploy
railway up

# Add Redis addon via Railway dashboard:
# 1. Go to your project dashboard
# 2. Click "+ New"
# 3. Select "Database"
# 4. Choose "Redis"

# Set environment variables via dashboard:
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
API_KEY_REQUIRED=false
PINTEREST_USER_AGENT=Mozilla/5.0...

# Get deployed URL
railway domain
```

### Option 2: Docker + VPS

```bash
# SSH into your VPS
ssh user@your-server-ip

# Clone repository
git clone https://github.com/yourusername/pinterest-video-downloader.git
cd pinterest-video-downloader

# Create .env file
cp backend/.env.example backend/.env
nano backend/.env
# Edit values, then Ctrl+X, Y, Enter

# Start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f

# Your API is now running at: http://your-server-ip:8080
```

### Option 3: Render

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to render.com
# 3. Click "New +" > "Web Service"
# 4. Connect your GitHub repository
# 5. Configure:
#    - Name: pinterest-downloader-api
#    - Root Directory: backend
#    - Environment: Node
#    - Build Command: npm install && npm run build
#    - Start Command: npm start
#    - Instance Type: Free
# 6. Add environment variables (see .env.example)
# 7. Click "Create Web Service"

# Add Redis:
# 1. In your service dashboard, click "New +" > "Redis"
# 2. Name: pinterest-redis
# 3. Copy connection URL
# 4. Add to your service as REDIS_URL environment variable
```

---

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: pinterest-video-downloader
# - Directory: ./
# - Override settings? N

# Set environment variable via Vercel dashboard:
# 1. Go to project settings
# 2. Environment Variables
# 3. Add: VITE_API_BASE_URL = https://your-backend-url.railway.app

# Deploy to production
vercel --prod

# Get URL
# Vercel will output: https://pinterest-video-downloader.vercel.app
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend

# Build
npm run build

# Login
netlify login

# Initialize
netlify init

# Follow prompts:
# - Create new site
# - Build command: npm run build
# - Publish directory: dist

# Set environment variable:
netlify env:set VITE_API_BASE_URL https://your-backend-url.railway.app

# Deploy
netlify deploy --prod

# Get URL
# Netlify will output: https://your-site-name.netlify.app
```

### Option 3: Manual Build + Static Hosting

```bash
# Build frontend
cd frontend
npm run build

# This creates a 'dist' folder
# Upload the contents of 'dist' to:
# - GitHub Pages
# - AWS S3 + CloudFront
# - DigitalOcean Spaces
# - Any static host

# Before uploading, create .env.production:
echo "VITE_API_BASE_URL=https://your-backend-url.com" > .env.production

# Rebuild with production env
npm run build

# Upload dist/* to your hosting provider
```

---

## 🌐 Custom Domain Setup

### Vercel
```bash
# Via CLI
vercel domains add yourdomain.com

# Or via dashboard:
# 1. Project Settings > Domains
# 2. Add: yourdomain.com
# 3. Follow DNS instructions
# 4. Wait for SSL (automatic)
```

### Netlify
```bash
# Via CLI
netlify domains:add yourdomain.com

# Or via dashboard:
# 1. Site Settings > Domain Management
# 2. Add custom domain
# 3. Update DNS records
# 4. SSL auto-configured
```

### Update Backend CORS
```bash
# After domain setup, update backend .env:
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com

# Redeploy backend:
railway up  # or docker-compose restart
```

---

## 📊 Redis Setup

### Railway Redis
```bash
# In Railway dashboard:
# 1. Click "+ New"
# 2. Select "Database" > "Redis"
# 3. Copy connection URL
# 4. Add to backend environment variables:
#    REDIS_URL=redis://default:password@hostname:port
```

### Redis Cloud (Free Tier)
```bash
# 1. Go to redis.com/try-free
# 2. Sign up
# 3. Create database (30MB free)
# 4. Copy connection string
# 5. Add to backend .env:
#    REDIS_URL=redis://user:pass@host:port
```

### Docker Redis (Self-Hosted)
```bash
# Already included in docker-compose.yml
# Just run:
docker-compose up -d

# Redis will be available at:
# redis://redis:6379 (internal)
# redis://localhost:6379 (external)
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=8080

# Frontend
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com

# Redis (optional)
REDIS_URL=redis://user:pass@host:port

# API Keys (optional)
API_KEY_REQUIRED=true
API_KEYS=key1:free:User1,key2:pro:User2

# Rate Limiting
GLOBAL_RATE_LIMIT_WINDOW_MS=60000
GLOBAL_RATE_LIMIT_MAX=60

# User Agent
PINTEREST_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend.railway.app
```

---

## 🧪 Test Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.railway.app/health

# Blog API
curl https://your-backend.railway.app/api/v1/blog

# Sitemap
curl https://your-backend.railway.app/sitemap.xml

# Download test
curl -X POST https://your-backend.railway.app/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'
```

### Test Frontend
```bash
# Open in browser
open https://yourdomain.com

# Or use curl
curl https://yourdomain.com

# Test blog
open https://yourdomain.com/blog

# Test specific post
open https://yourdomain.com/blog/how-to-download-pinterest-videos
```

---

## 🔄 Update/Redeploy

### Backend (Railway)
```bash
cd backend
railway up
```

### Backend (Docker)
```bash
git pull origin main
docker-compose down
docker-compose build
docker-compose up -d
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Frontend (Netlify)
```bash
cd frontend
npm run build
netlify deploy --prod
```

---

## 📈 Monitoring

### View Logs

**Railway:**
```bash
railway logs
```

**Docker:**
```bash
docker-compose logs -f api
docker-compose logs -f redis
```

**Vercel:**
```bash
vercel logs
```

**Netlify:**
```bash
netlify logs
```

### Health Checks

Add to your monitoring tool (UptimeRobot, Pingdom, etc.):
```
https://your-backend.railway.app/health
```

---

## 🚨 Rollback

### Railway
```bash
# View deployments
railway deployments

# Rollback to previous
railway rollback
```

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

### Docker
```bash
# Revert code
git revert HEAD

# Rebuild and redeploy
docker-compose down
docker-compose up -d --build
```

---

## 🎉 Launch Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic)
- [ ] Environment variables set
- [ ] Redis connected (or in-memory working)
- [ ] CORS configured correctly
- [ ] Test video download works
- [ ] Test blog pages load
- [ ] Sitemap accessible
- [ ] robots.txt accessible
- [ ] Rate limiting working
- [ ] Error pages show correctly
- [ ] Mobile responsive
- [ ] Lighthouse score > 80
- [ ] SEO meta tags present
- [ ] Analytics added (optional)
- [ ] Monitoring set up (optional)
- [ ] Backup strategy (optional)

**🚀 ALL SYSTEMS GO!**

Your Pinterest Video Downloader is now live and ready to serve users!

---

**Deployment Date**: ___/___/______  
**Backend URL**: _________________________________  
**Frontend URL**: ________________________________  
**Domain**: ______________________________________  
**Deployed By**: _________________________________  
