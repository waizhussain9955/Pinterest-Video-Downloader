# 🚀 Quick Start Guide

Get your Pinterest Video Downloader running in 5 minutes!

## ⚡ Option 1: Docker (Fastest - Recommended)

```bash
# 1. Clone or navigate to project
cd pinterest-video-downloader

# 2. Start everything (API + Redis)
docker-compose up -d

# 3. Check if running
curl http://localhost:8080/health

# 4. Start frontend (in another terminal)
cd frontend
npm install
npm run dev

# 5. Open browser
# http://localhost:5173
```

**Done!** Your app is running with Redis caching enabled.

---

## 💻 Option 2: Local Development (No Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run build
npm run dev
```

### Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

**Done!** App running without Redis (uses in-memory fallback).

---

## 🧪 Test It

### Test API Directly
```bash
# Health check
curl http://localhost:8080/health

# Download video
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Blog posts
curl http://localhost:8080/api/v1/blog
```

### Test Frontend
1. Open http://localhost:5173
2. Paste a Pinterest URL
3. Click "Get Download Link"
4. Click green download button

---

## 🔑 Enable API Keys (Optional)

```bash
# Edit backend/.env
API_KEY_REQUIRED=true
API_KEYS=testkey123:free:Test User

# Restart backend
# Test with key
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -H "x-api-key: testkey123" \
  -d '{"url":"https://pin.it/xxxxx"}'
```

---

## 🚀 Deploy to Production

### Backend (Railway - Free Tier)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & deploy
cd backend
railway login
railway init
railway up

# Add Redis in Railway dashboard
# Set env vars in Railway dashboard
```

### Frontend (Vercel - Free Tier)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set env var in Vercel dashboard:
# VITE_API_BASE_URL = https://your-railway-url.up.railway.app
```

---

## 📊 Check What's Running

```bash
# Docker
docker-compose ps

# Logs
docker-compose logs -f

# Redis check
docker-compose exec redis redis-cli ping
# Should return: PONG
```

---

## 🐛 Common Issues

### Port already in use
```bash
# Change in backend/.env
PORT=3000

# Or kill process
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill
```

### Can't connect to API
```bash
# Check backend is running
curl http://localhost:8080/health

# Check CORS in backend/.env
ALLOWED_ORIGINS=http://localhost:5173

# Check frontend .env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📚 Next Steps

1. ✅ Read [README.md](./README.md) for full documentation
2. ✅ Read [UPGRADE-SUMMARY.md](./UPGRADE-SUMMARY.md) for technical details
3. ✅ Configure API keys for production
4. ✅ Set up Redis for better performance
5. ✅ Deploy to production
6. ✅ Add monitoring & analytics

---

## 🎯 Key Features to Explore

### Backend
- `/api/v1/pinterest/download` - Download videos
- `/api/v1/pinterest/proxy-download` - Proxy streaming
- `/api/v1/blog` - Blog system
- `/health` - Health check

### Configuration
- Tiered API keys (Free/Pro/Enterprise)
- Redis caching (1-4 hour TTL based on tier)
- Rate limiting (10-300 req/min based on tier)
- Request validation

### Monitoring
- Check Redis hit rate in logs: "✅ Cache HIT" vs "💾 Cached"
- Check rate limit headers: X-RateLimit-*
- Monitor API usage per tier

---

## 💡 Pro Tips

1. **Development**: Use `API_KEY_REQUIRED=false` for easier testing
2. **Production**: Always enable `API_KEY_REQUIRED=true`
3. **Performance**: Enable Redis for 60-80% faster responses
4. **Security**: Set strong API keys: `openssl rand -hex 32`
5. **Scaling**: Use docker-compose for easy horizontal scaling

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:8080
- [ ] Frontend running on http://localhost:5173
- [ ] Can download Pinterest videos
- [ ] Blog API returns posts
- [ ] Redis connected (or in-memory fallback working)
- [ ] Rate limiting working (check response headers)

---

**Need Help?** Check [README.md](./README.md) or [UPGRADE-SUMMARY.md](./UPGRADE-SUMMARY.md)

🎉 **You're Ready to Go!**
