import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as apiKeyService from '../services/apiKeyService';
import { ApiKeyTier } from '../types/apiKey';

const router = Router();

/**
 * GET /api/v1/keys/usage
 * Get usage statistics for an API key
 */
router.get(
  '/usage',
  async (req: Request, res: Response) => {
    try {
      const apiKey = req.headers['x-api-key'] as string;
      
      if (!apiKey) {
        return res.status(401).json({
          success: false,
          error: 'API key is required',
        });
      }

      const stats = await apiKeyService.getUsageStats(apiKey);
      
      res.json({
        success: true,
        data: stats,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Failed to fetch usage statistics',
      });
    }
  }
);

/**
 * POST /api/v1/keys/create
 * Create a new API key (admin endpoint - should be protected)
 */
router.post(
  '/create',
  [
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('tier')
      .optional()
      .isIn([ApiKeyTier.FREE, ApiKeyTier.PRO, ApiKeyTier.ENTERPRISE])
      .withMessage('Invalid tier'),
    body('expiresInDays').optional().isInt({ min: 1 }).withMessage('Invalid expiration'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg,
      });
    }

    try {
      const { name, tier, expiresInDays } = req.body;
      
      const apiKey = await apiKeyService.createApiKey(
        name,
        tier || ApiKeyTier.FREE,
        expiresInDays
      );

      res.status(201).json({
        success: true,
        data: apiKey,
        message: 'API key created successfully. Store it securely - it cannot be retrieved again.',
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to create API key',
      });
    }
  }
);

/**
 * GET /api/v1/keys/tiers
 * Get information about available API tiers
 */
router.get('/tiers', (_req: Request, res: Response) => {
  const { TIER_LIMITS } = require('../types/apiKey');
  
  res.json({
    success: true,
    data: {
      tiers: Object.entries(TIER_LIMITS).map(([tier, limits]: any) => ({
        tier,
        ...limits,
      })),
    },
  });
});

export const registerApiKeyRoutes = (app: any) => {
  app.use('/api/v1/keys', router);
};
