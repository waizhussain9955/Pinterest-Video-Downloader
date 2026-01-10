export enum ApiKeyTier {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface ApiKeyData {
  key: string;
  tier: ApiKeyTier;
  name: string;
  requestsPerDay: number;
  requestsToday: number;
  lastResetDate: string;
  active: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface ApiKeyLimits {
  requestsPerMinute: number;
  requestsPerDay: number;
  cacheDuration: number; // seconds
  allowBulkDownload: boolean;
  allowHighQuality: boolean;
}

export const TIER_LIMITS: Record<ApiKeyTier, ApiKeyLimits> = {
  [ApiKeyTier.FREE]: {
    requestsPerMinute: 10,
    requestsPerDay: 100,
    cacheDuration: 3600, // 1 hour
    allowBulkDownload: false,
    allowHighQuality: false,
  },
  [ApiKeyTier.PRO]: {
    requestsPerMinute: 60,
    requestsPerDay: 5000,
    cacheDuration: 7200, // 2 hours
    allowBulkDownload: true,
    allowHighQuality: true,
  },
  [ApiKeyTier.ENTERPRISE]: {
    requestsPerMinute: 300,
    requestsPerDay: 50000,
    cacheDuration: 14400, // 4 hours
    allowBulkDownload: true,
    allowHighQuality: true,
  },
};
