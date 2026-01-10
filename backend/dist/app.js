"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const healthRoutes_1 = require("./routes/healthRoutes");
const pinterestRoutes_1 = require("./routes/pinterestRoutes");
const blogRoutes_1 = require("./routes/blogRoutes");
const apiKeyRoutes_1 = require("./routes/apiKeyRoutes");
const rateLimitEnhanced_1 = require("./middleware/rateLimitEnhanced");
const sitemapController_1 = require("./controllers/sitemapController");
const createApp = () => {
    const app = (0, express_1.default)();
    app.set('trust proxy', true);
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    const corsOptions = {
        origin(origin, callback) {
            if (!origin || config_1.config.allowedOrigins.length === 0) {
                return callback(null, true);
            }
            if (config_1.config.allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    if (config_1.config.env !== 'test') {
        app.use((0, morgan_1.default)('combined'));
    }
    // Enhanced rate limiting with tier-based limits
    app.use('/api/', (0, rateLimitEnhanced_1.rateLimitEnhanced)(config_1.config.rateLimitWindowMs));
    (0, healthRoutes_1.registerHealthRoutes)(app);
    (0, pinterestRoutes_1.registerPinterestRoutes)(app);
    (0, blogRoutes_1.registerBlogRoutes)(app);
    (0, apiKeyRoutes_1.registerApiKeyRoutes)(app);
    // Sitemap endpoint
    app.get('/sitemap.xml', sitemapController_1.generateSitemap);
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: 'Not Found',
        });
    });
    app.use((err, _req, res, _next) => {
        console.error(err);
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            error: err.message || 'Internal Server Error',
        });
    });
    return app;
};
exports.createApp = createApp;
