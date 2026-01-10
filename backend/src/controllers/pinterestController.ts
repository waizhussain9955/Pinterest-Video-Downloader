import { Request, Response, NextFunction } from 'express';
import { fetchPinterestVideo } from '../services/pinterestService';
import axios from 'axios';
import { TIER_LIMITS } from '../types/apiKey';

interface DownloadRequestBody {
  url?: string;
}

export const downloadPinterestVideo = async (
  req: Request<unknown, unknown, DownloadRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url } = req.body || {};

    if (!url) {
      res.status(400).json({
        success: false,
        error: 'Missing required field: url',
      });
      return;
    }

    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip;

    // Determine cache duration based on API key tier
    let cacheDuration = 3600; // default 1 hour
    if (req.apiKeyData) {
      cacheDuration = TIER_LIMITS[req.apiKeyData.tier].cacheDuration;
    }

    const video = await fetchPinterestVideo(url, clientIp, cacheDuration);

    res.status(200).json({
      success: true,
      data: video,
      disclaimer:
        'This tool is for downloading public Pinterest videos only. Users are responsible for copyright compliance and must only download content they own or have permission to use.',
    });
  } catch (err) {
    next(err);
  }
};

export const proxyDownloadVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { videoUrl } = req.query;

    if (!videoUrl || typeof videoUrl !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Missing required query parameter: videoUrl',
      });
      return;
    }

    // Verify it's a Pinterest video URL
    if (!videoUrl.includes('pinimg.com/videos/')) {
      res.status(400).json({
        success: false,
        error: 'Invalid video URL',
      });
      return;
    }

    // Fetch the video from Pinterest
    const response = await axios.get(videoUrl, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });

    // Set headers to force download
    const filename = `pinterest-video-${Date.now()}.mp4`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'video/mp4');
    
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }

    // Pipe the video stream to response
    response.data.pipe(res);
  } catch (err: any) {
    console.error('Proxy download error:', err.message);
    if (!res.headersSent) {
      next(err);
    }
  }
};
