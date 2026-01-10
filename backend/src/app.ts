import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { registerHealthRoutes } from './routes/healthRoutes';
import { registerPinterestRoutes } from './routes/pinterestRoutes';
import { registerBlogRoutes } from './routes/blogRoutes';
import { registerApiKeyRoutes } from './routes/apiKeyRoutes';
import { rateLimitEnhanced } from './middleware/rateLimitEnhanced';
import { generateSitemap } from './controllers/sitemapController';

export const createApp = (): Application => {
  const app = express();

  app.set('trust proxy', true);

  app.use(helmet());
  app.use(express.json());

  const corsOptions: cors.CorsOptions = {
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin || config.allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };

  app.use(cors(corsOptions));

  if (config.env !== 'test') {
    app.use(morgan('combined'));
  }

  // Enhanced rate limiting with tier-based limits
  app.use('/api/', rateLimitEnhanced(config.rateLimitWindowMs));

  registerHealthRoutes(app);
  registerPinterestRoutes(app);
  registerBlogRoutes(app);
  registerApiKeyRoutes(app);

  // Sitemap endpoint
  app.get('/sitemap.xml', generateSitemap);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
    });
  });

  app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err);
      const status = err.status || 500;
      res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
      });
    }
  );

  return app;
};
