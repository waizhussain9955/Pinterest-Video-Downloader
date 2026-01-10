"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyDownloadVideo = exports.downloadPinterestVideo = void 0;
const pinterestService_1 = require("../services/pinterestService");
const axios_1 = __importDefault(require("axios"));
const apiKey_1 = require("../types/apiKey");
const downloadPinterestVideo = async (req, res, next) => {
    try {
        const { url } = req.body || {};
        if (!url) {
            res.status(400).json({
                success: false,
                error: 'Missing required field: url',
            });
            return;
        }
        const clientIp = req.headers['x-forwarded-for'] || req.ip;
        // Determine cache duration based on API key tier
        let cacheDuration = 3600; // default 1 hour
        if (req.apiKeyData) {
            cacheDuration = apiKey_1.TIER_LIMITS[req.apiKeyData.tier].cacheDuration;
        }
        const video = await (0, pinterestService_1.fetchPinterestVideo)(url, clientIp, cacheDuration);
        res.status(200).json({
            success: true,
            data: video,
            disclaimer: 'This tool is for downloading public Pinterest videos only. Users are responsible for copyright compliance and must only download content they own or have permission to use.',
        });
    }
    catch (err) {
        next(err);
    }
};
exports.downloadPinterestVideo = downloadPinterestVideo;
const proxyDownloadVideo = async (req, res, next) => {
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
        const response = await axios_1.default.get(videoUrl, {
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
    }
    catch (err) {
        console.error('Proxy download error:', err.message);
        if (!res.headersSent) {
            next(err);
        }
    }
};
exports.proxyDownloadVideo = proxyDownloadVideo;
