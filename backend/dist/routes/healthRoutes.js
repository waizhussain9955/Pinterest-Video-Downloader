"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHealthRoutes = void 0;
const registerHealthRoutes = (app) => {
    app.get('/api/v1/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        });
    });
};
exports.registerHealthRoutes = registerHealthRoutes;
