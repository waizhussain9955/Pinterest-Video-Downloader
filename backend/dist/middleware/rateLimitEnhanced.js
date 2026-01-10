"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitEnhanced = void 0;
const redisService_1 = require("../services/redisService");
const apiKey_1 = require("../types/apiKey");
// In-memory fallback if Redis is unavailable
const inMemoryStore = {};
const cleanupOldEntries = () => {
    const now = Date.now();
    Object.keys(inMemoryStore).forEach((key) => {
        if (inMemoryStore[key].resetTime < now) {
            delete inMemoryStore[key];
        }
    });
};
// Run cleanup every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);
const rateLimitEnhanced = (windowMs = 60000) => {
    return async (req, res, next) => {
        try {
            // Determine rate limit based on API key tier
            let maxRequests = 60; // default
            let window = windowMs;
            if (req.apiKeyData) {
                const limits = apiKey_1.TIER_LIMITS[req.apiKeyData.tier];
                maxRequests = limits.requestsPerMinute;
            }
            // Create unique key (IP + API key if available)
            const clientIp = req.headers['x-forwarded-for'] || req.ip || 'unknown';
            const keyIdentifier = req.rateLimitKey || `ratelimit:ip:${clientIp}`;
            // Check rate limit
            if (redisService_1.redisService.isReady()) {
                // Use Redis
                const current = await redisService_1.redisService.incr(keyIdentifier);
                if (current === 1) {
                    await redisService_1.redisService.expire(keyIdentifier, Math.floor(window / 1000));
                }
                if (current > maxRequests) {
                    res.status(429).json({
                        success: false,
                        error: 'Too many requests',
                        retryAfter: Math.ceil(window / 1000),
                    });
                    return;
                }
                // Set rate limit headers
                res.setHeader('X-RateLimit-Limit', maxRequests);
                res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
                res.setHeader('X-RateLimit-Reset', new Date(Date.now() + window).toISOString());
            }
            else {
                // Fallback to in-memory
                const now = Date.now();
                const resetTime = now + window;
                if (!inMemoryStore[keyIdentifier] || inMemoryStore[keyIdentifier].resetTime < now) {
                    inMemoryStore[keyIdentifier] = {
                        count: 1,
                        resetTime,
                    };
                }
                else {
                    inMemoryStore[keyIdentifier].count++;
                }
                const current = inMemoryStore[keyIdentifier].count;
                if (current > maxRequests) {
                    res.status(429).json({
                        success: false,
                        error: 'Too many requests',
                        retryAfter: Math.ceil((inMemoryStore[keyIdentifier].resetTime - now) / 1000),
                    });
                    return;
                }
                // Set rate limit headers
                res.setHeader('X-RateLimit-Limit', maxRequests);
                res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));
                res.setHeader('X-RateLimit-Reset', new Date(inMemoryStore[keyIdentifier].resetTime).toISOString());
            }
            next();
        }
        catch (err) {
            console.error('Rate limit error:', err.message);
            // On error, allow request but log
            next();
        }
    };
};
exports.rateLimitEnhanced = rateLimitEnhanced;
