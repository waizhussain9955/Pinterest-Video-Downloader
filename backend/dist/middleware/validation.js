"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validatePinterestUrl = void 0;
const express_validator_1 = require("express-validator");
exports.validatePinterestUrl = [
    (0, express_validator_1.body)('url')
        .trim()
        .notEmpty()
        .withMessage('URL is required')
        .isURL({
        protocols: ['http', 'https'],
        require_protocol: true,
    })
        .withMessage('Invalid URL format')
        .custom((value) => {
        try {
            const url = new URL(value);
            const hostname = url.hostname.toLowerCase();
            const isPinterestMain = /pinterest\.(com|co\.uk|de|fr|it|es|ca|jp|ru|br|in)$/i.test(hostname);
            const isPinterestShort = hostname === 'pin.it';
            if (!isPinterestMain && !isPinterestShort) {
                throw new Error('Only Pinterest URLs are allowed');
            }
            return true;
        }
        catch (err) {
            throw new Error(err.message || 'Invalid Pinterest URL');
        }
    }),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
            })),
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
