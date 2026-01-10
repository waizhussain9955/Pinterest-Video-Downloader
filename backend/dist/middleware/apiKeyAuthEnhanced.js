"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTier = exports.apiKeyAuthEnhanced = void 0;
const config_1 = require("../config");
const redisService_1 = require("../services/redisService");
const apiKey_1 = require("../types/apiKey");
// In-memory fallback for API key data (if Redis unavailable)
const apiKeyStore = new Map();
const parseApiKeyData = (key) => {
    // Parse from config.apiKeys format: "key:tier:name"
    // Example: "abc123:pro:Company A"
    const keyConfig = config_1.config.apiKeys.find((k) => k.startsWith(key));
    if (!keyConfig)
        return null;
    const parts = keyConfig.split(':');
    const tier = (parts[1] || 'free');
    const name = parts[2] || 'Unknown';
    return {
        key,
        tier,
        name,
        requestsPerDay: 0,
        requestsToday: 0,
        lastResetDate: new Date().toISOString().split('T')[0],
        active: true,
        createdAt: new Date().toISOString(),
    };
};
const getApiKeyData = async (key) => {
    // Try Redis first
    if (redisService_1.redisService.isReady()) {
        const cached = await redisService_1.redisService.get(`apikey:${key}`);
        if (cached) {
            return JSON.parse(cached);
        }
    }
    // Fallback to in-memory
    if (apiKeyStore.has(key)) {
        return apiKeyStore.get(key);
    }
    // Parse from config
    const keyData = parseApiKeyData(key);
    if (keyData) {
        apiKeyStore.set(key, keyData);
        if (redisService_1.redisService.isReady()) {
            await redisService_1.redisService.set(`apikey:${key}`, JSON.stringify(keyData), 86400);
        }
    }
    return keyData;
};
const checkDailyLimit = async (keyData) => {
    const today = new Date().toISOString().split('T')[0];
    const limits = apiKey_1.TIER_LIMITS[keyData.tier];
    // Reset counter if new day
    if (keyData.lastResetDate !== today) {
        keyData.requestsToday = 0;
        keyData.lastResetDate = today;
    }
    // Increment counter
    keyData.requestsToday++;
    // Save updated data
    if (redisService_1.redisService.isReady()) {
        await redisService_1.redisService.set(`apikey:${keyData.key}`, JSON.stringify(keyData), 86400);
    }
    else {
        apiKeyStore.set(keyData.key, keyData);
    }
    return keyData.requestsToday <= limits.requestsPerDay;
};
const apiKeyAuthEnhanced = async (req, res, next) => {
    // Skip if not required
    if (!config_1.config.apiKeyRequired) {
        next();
        return;
    }
    // Extract API key
    const apiKey = req.headers['x-api-key'] ||
        req.query.api_key ||
        req.query.apiKey;
    if (!apiKey) {
        res.status(401).json({
            success: false,
            error: 'Missing API key',
            message: 'Provide API key via x-api-key header or api_key query parameter',
        });
        return;
    }
    // Validate and get key data
    const keyData = await getApiKeyData(apiKey);
    if (!keyData || !keyData.active) {
        res.status(401).json({
            success: false,
            error: 'Invalid API key',
        });
        return;
    }
    // Check if expired
    if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
        res.status(401).json({
            success: false,
            error: 'API key expired',
        });
        return;
    }
    // Check daily limit
    const withinLimit = await checkDailyLimit(keyData);
    if (!withinLimit) {
        res.status(429).json({
            success: false,
            error: 'Daily request limit exceeded',
            limit: apiKey_1.TIER_LIMITS[keyData.tier].requestsPerDay,
        });
        return;
    }
    // Attach key data to request
    req.apiKeyData = keyData;
    req.rateLimitKey = `ratelimit:${keyData.tier}:${apiKey}`;
    next();
};
exports.apiKeyAuthEnhanced = apiKeyAuthEnhanced;
// Middleware to check tier-specific features
const requireTier = (minTier) => {
    return (req, res, next) => {
        if (!req.apiKeyData) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }
        const tierOrder = [apiKey_1.ApiKeyTier.FREE, apiKey_1.ApiKeyTier.PRO, apiKey_1.ApiKeyTier.ENTERPRISE];
        const userTierIndex = tierOrder.indexOf(req.apiKeyData.tier);
        const requiredTierIndex = tierOrder.indexOf(minTier);
        if (userTierIndex < requiredTierIndex) {
            res.status(403).json({
                success: false,
                error: 'Insufficient API tier',
                required: minTier,
                current: req.apiKeyData.tier,
            });
            return;
        }
        next();
    };
};
exports.requireTier = requireTier;
