# 📋 QUICK REFERENCE GUIDE

## 🚀 Start Development

```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 📦 Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

---

## 🔑 Key Endpoints

### Public
- `POST /api/v1/pinterest/download` - Download video
- `GET /api/v1/blog` - List blog posts
- `GET /health` - Health check
- `GET /sitemap.xml` - Sitemap

### API Management
- `POST /api/v1/keys/create` - Create API key
- `GET /api/v1/keys/usage` - Get usage (with X-API-Key header)
- `GET /api/v1/keys/tiers` - Get tier info

---

## 🌍 Pages

- `/` - Home (downloader)
- `/about` - About Us
- `/contact` - Contact
- `/how-it-works` - How It Works
- `/blog` - Blog listing
- `/blog/:slug` - Blog post
- `/api-docs` - API Documentation
- `/disclaimer` - Disclaimer

---

## ⚙️ Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=8080
REDIS_URL=redis://localhost:6379
ALLOWED_ORIGINS=https://yourdomain.com
API_KEY_REQUIRED=false
PINTEREST_USER_AGENT=Mozilla/5.0...
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

## 🎨 Key Files

### Backend
- `src/app.ts` - Express app
- `src/services/pinterestService.ts` - Video fetching
- `src/services/apiKeyService.ts` - API key management
- `src/services/redisService.ts` - Caching

### Frontend
- `src/App.tsx` - Main app
- `src/pages/Home.tsx` - Downloader
- `src/i18n.ts` - Translations
- `src/styles.css` - Premium CSS

---

## 📊 API Tiers

| Tier | Requests/Day | Price |
|------|--------------|-------|
| Free | 100 | $0 |
| Pro | 5,000 | $9.99/mo |
| Enterprise | 50,000 | $49.99/mo |

---

## 🔧 Troubleshooting

### Port in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Redis connection failed
```bash
redis-cli ping  # Should return PONG
```

### Build fails
```bash
rm -rf node_modules
npm install
npm run build
```

---

## 📚 Documentation

- **Full Deployment**: [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
- **Implementation Details**: [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)
- **Production Info**: [PRODUCTION-README.md](PRODUCTION-README.md)

---

## ✅ Pre-Deployment Checklist

- [ ] Redis instance configured
- [ ] Environment variables set
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Custom domain configured
- [ ] SSL certificate enabled
- [ ] Sitemap submitted to search engines
- [ ] Monitoring enabled
- [ ] CORS configured correctly
- [ ] Rate limiting tested

---

**Quick Access**: Keep this file handy for daily development!
