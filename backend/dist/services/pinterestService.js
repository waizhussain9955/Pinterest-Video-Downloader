"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPinterestVideo = void 0;
const axios_1 = __importDefault(require("axios"));
const robots_parser_1 = __importDefault(require("robots-parser"));
const config_1 = require("../config");
const redisService_1 = require("./redisService");
const crypto_1 = __importDefault(require("crypto"));
let robotsCache = null;
const getRobots = async () => {
    if (robotsCache)
        return robotsCache;
    const robotsUrl = 'https://www.pinterest.com/robots.txt';
    const res = await axios_1.default.get(robotsUrl, { timeout: 5000 });
    robotsCache = (0, robots_parser_1.default)(robotsUrl, res.data);
    return robotsCache;
};
const ensureUrlIsPinterestPublic = (url) => {
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        const error = new Error('Invalid URL');
        error.status = 400;
        throw error;
    }
    const hostname = parsed.hostname.toLowerCase();
    const isPinterestMain = /pinterest\.(com|co\.uk|de|fr|it|es|ca|jp|ru|br|in)$/i.test(hostname);
    const isPinterestShort = hostname === 'pin.it';
    if (!isPinterestMain && !isPinterestShort) {
        const error = new Error('Only Pinterest URLs are allowed');
        error.status = 400;
        throw error;
    }
    if (isPinterestMain && parsed.pathname.includes('/pin/') === false) {
        const error = new Error('URL must point to a specific public pin');
        error.status = 400;
        throw error;
    }
    return parsed;
};
const ensureAllowedByRobots = async (url, userAgent) => {
    try {
        const robots = await getRobots();
        const allowed = robots.isAllowed(url, userAgent);
        if (allowed === false) {
            const error = new Error('Access to this URL is disallowed by robots.txt');
            error.status = 403;
            throw error;
        }
    }
    catch (err) {
        console.warn('Failed to check robots.txt, failing closed for safety', err);
        const error = new Error('Unable to verify robots.txt rules');
        error.status = 503;
        throw error;
    }
};
const extractVideoMetadataFromHtml = (html, pageUrl) => {
    // Try to find video URLs with quality information
    const videoUrls = new Map();
    // Pattern 1: Look for video objects with quality info in JSON-LD or embedded data
    const videoObjectPattern = /"video"\s*:\s*\{[^}]*"url"\s*:\s*"([^"]+\.mp4[^"]*)"[^}]*(?:"width"\s*:\s*(\d+))?[^}]*(?:"height"\s*:\s*(\d+))?[^}]*\}/g;
    let match;
    while ((match = videoObjectPattern.exec(html)) !== null) {
        const url = match[1].replace(/\\u0026/g, '&');
        if (!url.includes('.vtt') && !url.includes('/captions/')) {
            const width = match[2] ? parseInt(match[2]) : undefined;
            const height = match[3] ? parseInt(match[3]) : undefined;
            const quality = height ? `${height}p` : 'default';
            videoUrls.set(url, { url, qualityLabel: quality, width, height });
        }
    }
    // Pattern 2: Look for contentUrl in schema
    const contentUrlPattern = /"contentUrl"\s*:\s*"(https:[^"\\]*\.mp4[^"\\]*)"/g;
    while ((match = contentUrlPattern.exec(html)) !== null) {
        const url = match[1].replace(/\\u0026/g, '&');
        if (!url.includes('.vtt') && !url.includes('/captions/')) {
            if (!videoUrls.has(url)) {
                videoUrls.set(url, { url, qualityLabel: 'SD' });
            }
        }
    }
    // Pattern 3: Look for direct video URLs
    const directUrlPattern = /https:\/\/v\d*\.pinimg\.com\/videos\/[^"\s]+\.mp4[^"\s]*/g;
    while ((match = directUrlPattern.exec(html)) !== null) {
        const url = match[0].replace(/\\u0026/g, '&');
        if (!url.includes('.vtt') && !url.includes('/captions/')) {
            if (!videoUrls.has(url)) {
                // Try to detect quality from URL patterns
                const qualityLabel = url.includes('_hd') ? 'HD' :
                    url.includes('_720') ? '720p' :
                        url.includes('_480') ? '480p' :
                            url.includes('_360') ? '360p' : 'SD';
                videoUrls.set(url, { url, qualityLabel });
            }
        }
    }
    if (videoUrls.size === 0) {
        const error = new Error('Unable to find a public video URL on this pin. It may be private or not a video.');
        error.status = 422;
        throw error;
    }
    // Convert to array and sort by quality (highest first)
    const qualities = Array.from(videoUrls.values()).sort((a, b) => {
        const heightA = a.height || (a.qualityLabel?.includes('HD') ? 1080 : a.qualityLabel?.includes('720') ? 720 : 480);
        const heightB = b.height || (b.qualityLabel?.includes('HD') ? 1080 : b.qualityLabel?.includes('720') ? 720 : 480);
        return heightB - heightA;
    });
    const primaryVideoUrl = qualities[0].url;
    const titleMatch = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i);
    const authorMatch = html.match(/"owner"\s*:\s*\{[^}]*"full_name"\s*:\s*"([^"]+)"/i);
    const durationMatch = html.match(/"duration"\s*:\s*"PT([0-9]+)S"/i);
    return {
        sourceUrl: pageUrl,
        videoUrl: primaryVideoUrl,
        qualities: qualities.length > 1 ? qualities : [{ url: primaryVideoUrl, qualityLabel: 'default' }],
        title: titleMatch?.[1],
        author: authorMatch?.[1],
        durationSeconds: durationMatch ? Number(durationMatch[1]) : null,
    };
};
const fetchPinterestVideo = async (url, clientIp, cacheDuration = 3600, includeFileSize = true) => {
    const parsed = ensureUrlIsPinterestPublic(url);
    const normalizedUrl = parsed.toString();
    // Generate cache key
    const cacheKey = `pinterest:video:${crypto_1.default.createHash('md5').update(normalizedUrl).digest('hex')}`;
    // Try to get from cache
    if (redisService_1.redisService.isReady()) {
        const cached = await redisService_1.redisService.get(cacheKey);
        if (cached) {
            console.log('✅ Cache HIT:', normalizedUrl);
            return JSON.parse(cached);
        }
    }
    await ensureAllowedByRobots(normalizedUrl, config_1.config.pinterestUserAgent);
    const response = await axios_1.default.get(normalizedUrl, {
        headers: {
            'User-Agent': config_1.config.pinterestUserAgent,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            Referer: 'https://www.pinterest.com/',
            'X-Client-IP': clientIp || 'unknown',
        },
        responseType: 'text',
        timeout: 10000,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 400,
    });
    if (typeof response.data !== 'string') {
        const error = new Error('Unexpected response from Pinterest');
        error.status = 502;
        throw error;
    }
    const metadata = extractVideoMetadataFromHtml(response.data, normalizedUrl);
    // Fetch file sizes for all qualities if requested
    if (includeFileSize) {
        await Promise.allSettled(metadata.qualities.map(async (quality) => {
            try {
                const headResponse = await axios_1.default.head(quality.url, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': config_1.config.pinterestUserAgent,
                    },
                });
                const contentLength = headResponse.headers['content-length'];
                if (contentLength) {
                    quality.fileSize = parseInt(contentLength, 10);
                }
            }
            catch (err) {
                console.warn(`Failed to fetch file size for ${quality.qualityLabel}:`, err);
            }
        }));
    }
    // Cache the result
    if (redisService_1.redisService.isReady() && cacheDuration > 0) {
        await redisService_1.redisService.set(cacheKey, JSON.stringify(metadata), cacheDuration);
        console.log('💾 Cached:', normalizedUrl);
    }
    return metadata;
};
exports.fetchPinterestVideo = fetchPinterestVideo;
