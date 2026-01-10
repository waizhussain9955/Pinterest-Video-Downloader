"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsageStats = exports.deactivateApiKey = exports.canMakeRequest = exports.incrementUsage = exports.validateApiKey = exports.createApiKey = exports.generateApiKey = void 0;
const apiKey_1 = require("../types/apiKey");
const redisService_1 = require("./redisService");
const nanoid_1 = require("nanoid");
const API_KEY_PREFIX = 'apikey:';
const USAGE_PREFIX = 'usage:';
/**
 * Generate a new API key
 */
const generateApiKey = (prefix = 'pvd') => {
    return `${prefix}_${(0, nanoid_1.nanoid)(32)}`;
};
exports.generateApiKey = generateApiKey;
/**
 * Create a new API key
 */
const createApiKey = async (name, tier = apiKey_1.ApiKeyTier.FREE, expiresInDays) => {
    const key = (0, exports.generateApiKey)();
    const now = new Date().toISOString();
    const limits = apiKey_1.TIER_LIMITS[tier];
    const apiKeyData = {
        key,
        tier,
        name,
        requestsPerDay: limits.requestsPerDay,
        requestsToday: 0,
        lastResetDate: now.split('T')[0],
        active: true,
        createdAt: now,
        expiresAt: expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
    };
    if (redisService_1.redisService.isReady()) {
        await redisService_1.redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData), expiresInDays ? expiresInDays * 24 * 60 * 60 : 0 // 0 = no expiry
        );
    }
    return apiKeyData;
};
exports.createApiKey = createApiKey;
/**
 * Validate and get API key data
 */
const validateApiKey = async (key) => {
    if (!redisService_1.redisService.isReady()) {
        return null;
    }
    const data = await redisService_1.redisService.get(`${API_KEY_PREFIX}${key}`);
    if (!data) {
        return null;
    }
    const apiKeyData = JSON.parse(data);
    // Check if expired
    if (apiKeyData.expiresAt && new Date(apiKeyData.expiresAt) < new Date()) {
        return null;
    }
    // Check if active
    if (!apiKeyData.active) {
        return null;
    }
    // Reset daily counter if needed
    const today = new Date().toISOString().split('T')[0];
    if (apiKeyData.lastResetDate !== today) {
        apiKeyData.requestsToday = 0;
        apiKeyData.lastResetDate = today;
        await redisService_1.redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));
    }
    return apiKeyData;
};
exports.validateApiKey = validateApiKey;
/**
 * Increment API key usage
 */
const incrementUsage = async (key) => {
    if (!redisService_1.redisService.isReady()) {
        return;
    }
    const apiKeyData = await (0, exports.validateApiKey)(key);
    if (!apiKeyData) {
        return;
    }
    apiKeyData.requestsToday += 1;
    await redisService_1.redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));
    // Also track in a separate usage log for analytics
    const usageKey = `${USAGE_PREFIX}${key}:${new Date().toISOString().split('T')[0]}`;
    const currentUsage = await redisService_1.redisService.get(usageKey);
    const count = currentUsage ? parseInt(currentUsage) + 1 : 1;
    await redisService_1.redisService.set(usageKey, count.toString(), 30 * 24 * 60 * 60); // Keep for 30 days
};
exports.incrementUsage = incrementUsage;
/**
 * Check if API key can make a request
 */
const canMakeRequest = async (key) => {
    const apiKeyData = await (0, exports.validateApiKey)(key);
    if (!apiKeyData) {
        return false;
    }
    return apiKeyData.requestsToday < apiKeyData.requestsPerDay;
};
exports.canMakeRequest = canMakeRequest;
/**
 * Deactivate an API key
 */
const deactivateApiKey = async (key) => {
    if (!redisService_1.redisService.isReady()) {
        return;
    }
    const apiKeyData = await (0, exports.validateApiKey)(key);
    if (apiKeyData) {
        apiKeyData.active = false;
        await redisService_1.redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));
    }
};
exports.deactivateApiKey = deactivateApiKey;
/**
 * Get API key usage statistics
 */
const getUsageStats = async (key) => {
    const apiKeyData = await (0, exports.validateApiKey)(key);
    if (!apiKeyData) {
        throw new Error('Invalid API key');
    }
    return {
        requestsToday: apiKeyData.requestsToday,
        requestsPerDay: apiKeyData.requestsPerDay,
        remaining: apiKeyData.requestsPerDay - apiKeyData.requestsToday,
        tier: apiKeyData.tier,
    };
};
exports.getUsageStats = getUsageStats;
