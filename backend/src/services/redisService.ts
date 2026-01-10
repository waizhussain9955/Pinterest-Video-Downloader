import Redis from 'ioredis';
import { config } from '../config';

class RedisService {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    if (config.redisUrl) {
      try {
        this.client = new Redis(config.redisUrl, {
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
      } catch (err: any) {
        console.warn('Redis initialization failed:', err.message);
      }
    } else {
      console.warn('⚠️  Redis not configured - caching disabled');
    }
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  async get(key: string): Promise<string | null> {
    if (!this.isReady()) return null;
    try {
      return await this.client!.get(key);
    } catch (err: any) {
      console.error('Redis GET error:', err.message);
      return null;
    }
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      if (expirySeconds) {
        await this.client!.setex(key, expirySeconds, value);
      } else {
        await this.client!.set(key, value);
      }
      return true;
    } catch (err: any) {
      console.error('Redis SET error:', err.message);
      return false;
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.isReady()) return 0;
    try {
      return await this.client!.incr(key);
    } catch (err: any) {
      console.error('Redis INCR error:', err.message);
      return 0;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await this.client!.expire(key, seconds);
      return true;
    } catch (err: any) {
      console.error('Redis EXPIRE error:', err.message);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      await this.client!.del(key);
      return true;
    } catch (err: any) {
      console.error('Redis DEL error:', err.message);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

export const redisService = new RedisService();
