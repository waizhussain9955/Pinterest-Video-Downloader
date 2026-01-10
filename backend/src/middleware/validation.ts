import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validatePinterestUrl = [
  body('url')
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
      } catch (err: any) {
        throw new Error(err.message || 'Invalid Pinterest URL');
      }
    }),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.type === 'field' ? (err as any).path : 'unknown',
        message: err.msg,
      })),
    });
    return;
  }
  
  next();
};
