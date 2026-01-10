import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { redisService } from '../services/redisService';
import { ApiKeyTier, TIER_LIMITS, ApiKeyData } from '../types/apiKey';

// Extend Express Request to include apiKeyData
declare global {
  namespace Express {
    interface Request {
      apiKeyData?: ApiKeyData;
      rateLimitKey?: string;
    }
  }
}

// In-memory fallback for API key data (if Redis unavailable)
const apiKeyStore = new Map<string, ApiKeyData>();

const parseApiKeyData = (key: string): ApiKeyData | null => {
  // Parse from config.apiKeys format: "key:tier:name"
  // Example: "abc123:pro:Company A"
  const keyConfig = config.apiKeys.find((k) => k.startsWith(key));
  if (!keyConfig) return null;

  const parts = keyConfig.split(':');
  const tier = (parts[1] || 'free') as ApiKeyTier;
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

const getApiKeyData = async (key: string): Promise<ApiKeyData | null> => {
  // Try Redis first
  if (redisService.isReady()) {
    const cached = await redisService.get(`apikey:${key}`);
    if (cached) {
      return JSON.parse(cached);
    }
  }

  // Fallback to in-memory
  if (apiKeyStore.has(key)) {
    return apiKeyStore.get(key)!;
  }

  // Parse from config
  const keyData = parseApiKeyData(key);
  if (keyData) {
    apiKeyStore.set(key, keyData);
    if (redisService.isReady()) {
      await redisService.set(`apikey:${key}`, JSON.stringify(keyData), 86400);
    }
  }

  return keyData;
};

const checkDailyLimit = async (keyData: ApiKeyData): Promise<boolean> => {
  const today = new Date().toISOString().split('T')[0];
  const limits = TIER_LIMITS[keyData.tier];

  // Reset counter if new day
  if (keyData.lastResetDate !== today) {
    keyData.requestsToday = 0;
    keyData.lastResetDate = today;
  }

  // Increment counter
  keyData.requestsToday++;

  // Save updated data
  if (redisService.isReady()) {
    await redisService.set(`apikey:${keyData.key}`, JSON.stringify(keyData), 86400);
  } else {
    apiKeyStore.set(keyData.key, keyData);
  }

  return keyData.requestsToday <= limits.requestsPerDay;
};

export const apiKeyAuthEnhanced = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Skip if not required
  if (!config.apiKeyRequired) {
    next();
    return;
  }

  // Extract API key
  const apiKey =
    (req.headers['x-api-key'] as string) ||
    (req.query.api_key as string | undefined) ||
    (req.query.apiKey as string | undefined);

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
      limit: TIER_LIMITS[keyData.tier].requestsPerDay,
    });
    return;
  }

  // Attach key data to request
  req.apiKeyData = keyData;
  req.rateLimitKey = `ratelimit:${keyData.tier}:${apiKey}`;

  next();
};

// Middleware to check tier-specific features
export const requireTier = (minTier: ApiKeyTier) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.apiKeyData) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const tierOrder = [ApiKeyTier.FREE, ApiKeyTier.PRO, ApiKeyTier.ENTERPRISE];
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
