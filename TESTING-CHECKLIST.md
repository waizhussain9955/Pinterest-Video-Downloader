# 🧪 Testing Checklist

Use this checklist to verify all features are working correctly before deploying to production.

---

## ✅ Backend API Testing

### Health & Basic Endpoints
```bash
# Health check
curl http://localhost:8080/health
# Expected: {"status":"ok"}

# Blog listing
curl http://localhost:8080/api/v1/blog
# Expected: JSON with posts array

# Single blog post
curl http://localhost:8080/api/v1/blog/how-to-download-pinterest-videos
# Expected: JSON with full blog post

# Sitemap
curl http://localhost:8080/sitemap.xml
# Expected: XML sitemap with all pages
```

### Pinterest Download (No API Key Required)
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Expected: JSON with video metadata and download URL
# Check: videoUrl should be .mp4 (NOT .vtt)
```

### Rate Limiting
```bash
# Make 70 requests in 1 minute
for i in {1..70}; do
  curl http://localhost:8080/health
done

# Expected: First 60 succeed, rest return 429 Too Many Requests
# Check response headers: X-RateLimit-Limit, X-RateLimit-Remaining
```

### Redis Caching (if Redis is running)
```bash
# First request
time curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Second request (should be faster - cached)
time curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Check backend logs for: "✅ Cache HIT"
```

---

## ✅ Frontend Testing

### Basic Navigation
- [ ] Open http://localhost:5173
- [ ] Click "Home" - should load homepage
- [ ] Click "How It Works" - should load guide
- [ ] Click "Blog" - should load blog listing
- [ ] Click "Disclaimer" - should load disclaimer
- [ ] Click "API Docs" - should load API documentation
- [ ] Click "Contact" - should load contact page

### Homepage - Video Download
- [ ] Paste Pinterest URL: `https://pin.it/3ofN0UqjG`
- [ ] Click "Get Download Link"
- [ ] Should show loading state
- [ ] Should display video metadata (title, author, duration)
- [ ] Should show green "📥 Download default" button
- [ ] Click download button
- [ ] Video should download (check Downloads folder)
- [ ] Check browser network tab: should call `/api/v1/pinterest/download`

### Blog Listing Page
- [ ] Navigate to /blog
- [ ] Should display 3 blog posts
- [ ] Should show category badges
- [ ] Should show featured badge on featured post
- [ ] Should show excerpt and tags
- [ ] Should display "Read More" links
- [ ] Click category filter dropdown
- [ ] Select "Tutorials" category
- [ ] Should filter to show only Tutorial posts
- [ ] Select "All Categories"
- [ ] Should show all posts again

### Blog Detail Page
- [ ] Click on first blog post
- [ ] Should navigate to /blog/how-to-download-pinterest-videos
- [ ] Should display full blog content
- [ ] Should show breadcrumbs (Home > Blog > Post Title)
- [ ] Should show author and published date
- [ ] Should show category and featured badges
- [ ] Should show tags at bottom
- [ ] Should display "Back to Blog" button
- [ ] Markdown should render correctly:
  - [ ] Headers (H1, H2, H3)
  - [ ] Paragraphs
  - [ ] Bold text
  - [ ] Lists (bullet and numbered)
- [ ] Ad placeholder should appear mid-content

### SEO Meta Tags
- [ ] Open browser DevTools > Elements
- [ ] Check `<head>` section contains:
  - [ ] `<title>` tag
  - [ ] `<meta name="description">`
  - [ ] `<meta property="og:title">`
  - [ ] `<meta property="og:description">`
  - [ ] `<meta property="twitter:card">`
  - [ ] `<script type="application/ld+json">` (Schema.org)

### Ad Placeholders
- [ ] Header ad appears after navigation (Top Banner)
- [ ] Content ad appears on blog listing (between posts)
- [ ] Footer ad appears above disclaimer
- [ ] Ads show placeholder text (not enabled yet)
- [ ] Check browser console: should log "Ad loaded: [ad-id]" when scrolling to ad

### Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Navigation should adapt
- [ ] Blog grid should stack vertically
- [ ] All content should be readable
- [ ] Download button should be accessible
- [ ] Ads should resize appropriately

---

## ✅ SEO Testing

### robots.txt
```bash
curl http://localhost:5173/robots.txt

# Expected: Should show robots.txt content
# Check: Allow /, Disallow /api/, Sitemap references
```

### sitemap.xml
```bash
curl http://localhost:8080/sitemap.xml

# Expected: XML with all pages
# Check: Should include:
# - / (homepage)
# - /blog
# - /blog/how-to-download-pinterest-videos
# - /blog/pinterest-video-formats-explained
# - /blog/pinterest-api-best-practices
# - /how-it-works
# - /api-docs
# - /disclaimer
# - /contact
```

### Structured Data Validation
1. Open blog post in browser
2. View page source (Ctrl+U)
3. Search for `application/ld+json`
4. Copy JSON-LD content
5. Go to https://search.google.com/test/rich-results
6. Paste and test
7. Should pass validation with Article schema

### OpenGraph Testing
1. Open any page
2. Copy URL
3. Go to https://www.opengraph.xyz/
4. Paste URL
5. Should show preview with image, title, description

---

## ✅ Performance Testing

### Lighthouse Audit
1. Open http://localhost:5173 in Chrome
2. Open DevTools > Lighthouse
3. Select "Desktop" or "Mobile"
4. Click "Analyze page load"
5. Check scores:
   - [ ] Performance > 80
   - [ ] Accessibility > 90
   - [ ] Best Practices > 90
   - [ ] SEO > 90

### Cache Testing
```bash
# First request (should take ~1-2s)
time curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Second request (should take <500ms)
time curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'
```

### Load Testing (Optional)
```bash
# Install Apache Bench
# Windows: Download from https://www.apachelounge.com/
# Mac: brew install apache2
# Linux: sudo apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8080/health

# Expected: All requests should succeed
# Check: Requests per second > 100
```

---

## ✅ Docker Testing

### Build and Run
```bash
# Build
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
# Expected: api and redis services running

# Check logs
docker-compose logs api
docker-compose logs redis

# Test API
curl http://localhost:8080/health

# Stop
docker-compose down
```

---

## ✅ Error Handling Testing

### Invalid Pinterest URL
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://youtube.com/watch?v=123"}'

# Expected: 400 Bad Request
# Error: "Only Pinterest URLs are allowed"
```

### Missing URL
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: 400 Bad Request
# Error: "Missing required field: url"
```

### Private/Invalid Pinterest URL
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.pinterest.com/pin/invalid-pin/"}'

# Expected: 422 Unprocessable Entity
# Error: "Unable to find a public video URL"
```

### Rate Limit Exceeded
```bash
# Make 65 requests quickly
for i in {1..65}; do
  curl http://localhost:8080/health &
done
wait

# Expected: Last 5 should return 429
# Response: "Too many requests"
```

---

## ✅ API Key Testing (Enable in .env)

### Setup
```bash
# Edit backend/.env
API_KEY_REQUIRED=true
API_KEYS=testkey123:free:Test User,prokey456:pro:Company A

# Restart backend
npm run dev
```

### Test Without API Key
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Expected: 401 Unauthorized
# Error: "Missing API key"
```

### Test With Valid API Key
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -H "x-api-key: testkey123" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Expected: 200 Success
# Response: Video metadata
```

### Test With Invalid API Key
```bash
curl -X POST http://localhost:8080/api/v1/pinterest/download \
  -H "Content-Type: application/json" \
  -H "x-api-key: invalid-key" \
  -d '{"url":"https://pin.it/3ofN0UqjG"}'

# Expected: 401 Unauthorized
# Error: "Invalid API key"
```

### Test Tier Limits
```bash
# Make 11 requests in 1 minute with free tier (limit: 10/min)
for i in {1..11}; do
  curl -X POST http://localhost:8080/api/v1/pinterest/download \
    -H "Content-Type: application/json" \
    -H "x-api-key: testkey123" \
    -d '{"url":"https://pin.it/3ofN0UqjG"}'
  sleep 1
done

# Expected: First 10 succeed, 11th returns 429
# Check response headers: X-RateLimit-Limit, X-RateLimit-Remaining
```

---

## ✅ Cross-Browser Testing

Test on multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (Chrome Mobile, Safari Mobile)

For each browser, verify:
- [ ] Homepage loads correctly
- [ ] Video download works
- [ ] Blog pages render properly
- [ ] Navigation works
- [ ] SEO meta tags present (view source)

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

### Backend
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Redis connected (or in-memory fallback working)
- [ ] CORS settings correct
- [ ] API keys generated (if using)
- [ ] Logs are clean (no errors)
- [ ] Docker image builds successfully

### Frontend
- [ ] All tests passing
- [ ] Build completes: `npm run build`
- [ ] No console errors
- [ ] API_BASE_URL configured
- [ ] SEO meta tags on all pages
- [ ] All links work
- [ ] Images load (or fallback gracefully)

### SEO
- [ ] robots.txt accessible
- [ ] sitemap.xml generates correctly
- [ ] Schema.org markup valid
- [ ] OpenGraph tags correct
- [ ] Lighthouse scores > 80

### Documentation
- [ ] README.md up to date
- [ ] UPGRADE-SUMMARY.md complete
- [ ] QUICKSTART.md tested
- [ ] Environment variable docs complete

---

## 🎉 All Tests Pass?

If all checkboxes are marked, you're ready for production deployment!

**Next Steps:**
1. Deploy backend to Railway/Render
2. Deploy frontend to Vercel/Netlify
3. Configure custom domain
4. Monitor for 24 hours
5. Enable Google AdSense
6. Launch! 🚀

---

**Testing Completed**: ___/___/______  
**Tested By**: _____________  
**Ready for Production**: [ ] YES  [ ] NO  

**Notes:**
```
[Add any issues or observations here]
```
