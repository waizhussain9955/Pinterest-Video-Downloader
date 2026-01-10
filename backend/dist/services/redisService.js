"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("../config");
class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        if (config_1.config.redisUrl) {
            try {
                this.client = new ioredis_1.default(config_1.config.redisUrl, {
                    maxRetriesPerRequest: 3,
                    retryStrategy: (times) => {
                        if (times > 3) {
                            console.error('Redis connection failed after 3 retries');
                            return null;
                        }
                        return Math.min(times * 200, 1000);
                    },
                });
                this.client.on('connect', () => {
                    console.log('✅ Redis connected');
                    this.isConnected = true;
                });
                this.client.on('error', (err) => {
                    console.error('Redis error:', err.message);
                    this.isConnected = false;
                });
            }
            catch (err) {
                console.warn('Redis initialization failed:', err.message);
            }
        }
        else {
            console.warn('⚠️  Redis not configured - caching disabled');
        }
    }
    isReady() {
        return this.isConnected && this.client !== null;
    }
    async get(key) {
        if (!this.isReady())
            return null;
        try {
            return await this.client.get(key);
        }
        catch (err) {
            console.error('Redis GET error:', err.message);
            return null;
        }
    }
    async set(key, value, expirySeconds) {
        if (!this.isReady())
            return false;
        try {
            if (expirySeconds) {
                await this.client.setex(key, expirySeconds, value);
            }
            else {
                await this.client.set(key, value);
            }
            return true;
        }
        catch (err) {
            console.error('Redis SET error:', err.message);
            return false;
        }
    }
    async incr(key) {
        if (!this.isReady())
            return 0;
        try {
            return await this.client.incr(key);
        }
        catch (err) {
            console.error('Redis INCR error:', err.message);
            return 0;
        }
    }
    async expire(key, seconds) {
        if (!this.isReady())
            return false;
        try {
            await this.client.expire(key, seconds);
            return true;
        }
        catch (err) {
            console.error('Redis EXPIRE error:', err.message);
            return false;
        }
    }
    async del(key) {
        if (!this.isReady())
            return false;
        try {
            await this.client.del(key);
            return true;
        }
        catch (err) {
            console.error('Redis DEL error:', err.message);
            return false;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
}
exports.redisService = new RedisService();
