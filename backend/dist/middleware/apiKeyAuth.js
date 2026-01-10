"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = void 0;
const config_1 = require("../config");
const apiKeyAuth = (req, res, next) => {
    if (!config_1.config.apiKeyRequired) {
        next();
        return;
    }
    const apiKey = req.headers['x-api-key'] ||
        req.query.api_key ||
        req.query.apiKey;
    if (!apiKey || !config_1.config.apiKeys.includes(apiKey)) {
        res.status(401).json({
            success: false,
            error: 'Invalid or missing API key',
        });
        return;
    }
    next();
};
exports.apiKeyAuth = apiKeyAuth;
