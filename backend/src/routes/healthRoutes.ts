import { Application, Request, Response } from 'express';

export const registerHealthRoutes = (app: Application): void => {
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });
};
