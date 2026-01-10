import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!config.apiKeyRequired) {
    next();
    return;
  }

  const apiKey =
    (req.headers['x-api-key'] as string) ||
    (req.query.api_key as string | undefined) ||
    (req.query.apiKey as string | undefined);

  if (!apiKey || !config.apiKeys.includes(apiKey)) {
    res.status(401).json({
      success: false,
      error: 'Invalid or missing API key',
    });
    return;
  }

  next();
};
