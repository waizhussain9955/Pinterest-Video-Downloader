import { Application } from 'express';
import { downloadPinterestVideo, proxyDownloadVideo } from '../controllers/pinterestController';
import { apiKeyAuthEnhanced } from '../middleware/apiKeyAuthEnhanced';
import { validatePinterestUrl, handleValidationErrors } from '../middleware/validation';

export const registerPinterestRoutes = (app: Application): void => {
  app.post(
    '/api/v1/pinterest/download',
    apiKeyAuthEnhanced,
    validatePinterestUrl,
    handleValidationErrors,
    downloadPinterestVideo
  );
  app.get('/api/v1/pinterest/proxy-download', proxyDownloadVideo);
};
