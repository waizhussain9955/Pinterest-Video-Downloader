import { ApiKeyData, ApiKeyTier, TIER_LIMITS } from '../types/apiKey';
import { redisService } from './redisService';
import { nanoid } from 'nanoid';

const API_KEY_PREFIX = 'apikey:';
const USAGE_PREFIX = 'usage:';

/**
 * Generate a new API key
 */
export const generateApiKey = (prefix: string = 'pvd'): string => {
  return `${prefix}_${nanoid(32)}`;
};

/**
 * Create a new API key
 */
export const createApiKey = async (
  name: string,
  tier: ApiKeyTier = ApiKeyTier.FREE,
  expiresInDays?: number
): Promise<ApiKeyData> => {
  const key = generateApiKey();
  const now = new Date().toISOString();
  const limits = TIER_LIMITS[tier];

  const apiKeyData: ApiKeyData = {
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

  if (redisService.isReady()) {
    await redisService.set(
      `${API_KEY_PREFIX}${key}`,
      JSON.stringify(apiKeyData),
      expiresInDays ? expiresInDays * 24 * 60 * 60 : 0 // 0 = no expiry
    );
  }

  return apiKeyData;
};

/**
 * Validate and get API key data
 */
export const validateApiKey = async (key: string): Promise<ApiKeyData | null> => {
  if (!redisService.isReady()) {
    return null;
  }

  const data = await redisService.get(`${API_KEY_PREFIX}${key}`);
  if (!data) {
    return null;
  }

  const apiKeyData: ApiKeyData = JSON.parse(data);

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
    await redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));
  }

  return apiKeyData;
};

/**
 * Increment API key usage
 */
export const incrementUsage = async (key: string): Promise<void> => {
  if (!redisService.isReady()) {
    return;
  }

  const apiKeyData = await validateApiKey(key);
  if (!apiKeyData) {
    return;
  }

  apiKeyData.requestsToday += 1;
  await redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));

  // Also track in a separate usage log for analytics
  const usageKey = `${USAGE_PREFIX}${key}:${new Date().toISOString().split('T')[0]}`;
  const currentUsage = await redisService.get(usageKey);
  const count = currentUsage ? parseInt(currentUsage) + 1 : 1;
  await redisService.set(usageKey, count.toString(), 30 * 24 * 60 * 60); // Keep for 30 days
};

/**
 * Check if API key can make a request
 */
export const canMakeRequest = async (key: string): Promise<boolean> => {
  const apiKeyData = await validateApiKey(key);
  if (!apiKeyData) {
    return false;
  }

  return apiKeyData.requestsToday < apiKeyData.requestsPerDay;
};

/**
 * Deactivate an API key
 */
export const deactivateApiKey = async (key: string): Promise<void> => {
  if (!redisService.isReady()) {
    return;
  }

  const apiKeyData = await validateApiKey(key);
  if (apiKeyData) {
    apiKeyData.active = false;
    await redisService.set(`${API_KEY_PREFIX}${key}`, JSON.stringify(apiKeyData));
  }
};

/**
 * Get API key usage statistics
 */
export const getUsageStats = async (key: string): Promise<{
  requestsToday: number;
  requestsPerDay: number;
  remaining: number;
  tier: ApiKeyTier;
}> => {
  const apiKeyData = await validateApiKey(key);
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
