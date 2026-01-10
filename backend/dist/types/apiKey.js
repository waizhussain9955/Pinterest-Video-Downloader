"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIER_LIMITS = exports.ApiKeyTier = void 0;
var ApiKeyTier;
(function (ApiKeyTier) {
    ApiKeyTier["FREE"] = "free";
    ApiKeyTier["PRO"] = "pro";
    ApiKeyTier["ENTERPRISE"] = "enterprise";
})(ApiKeyTier || (exports.ApiKeyTier = ApiKeyTier = {}));
exports.TIER_LIMITS = {
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
