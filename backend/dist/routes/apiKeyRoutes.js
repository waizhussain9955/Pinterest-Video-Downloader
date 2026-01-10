"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApiKeyRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const apiKeyService = __importStar(require("../services/apiKeyService"));
const apiKey_1 = require("../types/apiKey");
const router = (0, express_1.Router)();
/**
 * GET /api/v1/keys/usage
 * Get usage statistics for an API key
 */
router.get('/usage', async (req, res) => {
    try {
        const apiKey = req.headers['x-api-key'];
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
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message || 'Failed to fetch usage statistics',
        });
    }
});
/**
 * POST /api/v1/keys/create
 * Create a new API key (admin endpoint - should be protected)
 */
router.post('/create', [
    (0, express_validator_1.body)('name').isString().trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('tier')
        .optional()
        .isIn([apiKey_1.ApiKeyTier.FREE, apiKey_1.ApiKeyTier.PRO, apiKey_1.ApiKeyTier.ENTERPRISE])
        .withMessage('Invalid tier'),
    (0, express_validator_1.body)('expiresInDays').optional().isInt({ min: 1 }).withMessage('Invalid expiration'),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg,
        });
    }
    try {
        const { name, tier, expiresInDays } = req.body;
        const apiKey = await apiKeyService.createApiKey(name, tier || apiKey_1.ApiKeyTier.FREE, expiresInDays);
        res.status(201).json({
            success: true,
            data: apiKey,
            message: 'API key created successfully. Store it securely - it cannot be retrieved again.',
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            error: err.message || 'Failed to create API key',
        });
    }
});
/**
 * GET /api/v1/keys/tiers
 * Get information about available API tiers
 */
router.get('/tiers', (_req, res) => {
    const { TIER_LIMITS } = require('../types/apiKey');
    res.json({
        success: true,
        data: {
            tiers: Object.entries(TIER_LIMITS).map(([tier, limits]) => ({
                tier,
                ...limits,
            })),
        },
    });
});
const registerApiKeyRoutes = (app) => {
    app.use('/api/v1/keys', router);
};
exports.registerApiKeyRoutes = registerApiKeyRoutes;
