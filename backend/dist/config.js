"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const toNumber = (value, fallback) => {
    if (!value)
        return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
const toBoolean = (value, fallback) => {
    if (value === undefined)
        return fallback;
    return value === 'true' || value === '1';
};
exports.config = {
    env: process.env.NODE_ENV || 'development',
    port: toNumber(process.env.PORT, 8080),
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    rateLimitWindowMs: toNumber(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS, 60000),
    rateLimitMax: toNumber(process.env.GLOBAL_RATE_LIMIT_MAX, 60),
    apiKeyRequired: toBoolean(process.env.API_KEY_REQUIRED, false),
    apiKeys: (process.env.API_KEYS || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    pinterestUserAgent: process.env.PINTEREST_USER_AGENT ||
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    redisUrl: process.env.REDIS_URL || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
