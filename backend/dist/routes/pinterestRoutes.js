"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPinterestRoutes = void 0;
const pinterestController_1 = require("../controllers/pinterestController");
const apiKeyAuthEnhanced_1 = require("../middleware/apiKeyAuthEnhanced");
const validation_1 = require("../middleware/validation");
const registerPinterestRoutes = (app) => {
    app.post('/api/v1/pinterest/download', apiKeyAuthEnhanced_1.apiKeyAuthEnhanced, validation_1.validatePinterestUrl, validation_1.handleValidationErrors, pinterestController_1.downloadPinterestVideo);
    app.get('/api/v1/pinterest/proxy-download', pinterestController_1.proxyDownloadVideo);
};
exports.registerPinterestRoutes = registerPinterestRoutes;
