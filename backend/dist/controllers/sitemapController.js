"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = void 0;
const blogData_1 = require("../data/blogData");
const config_1 = require("../config");
const generateSitemap = async (req, res, next) => {
    try {
        const baseUrl = config_1.config.frontendUrl || 'https://yourdomain.com';
        const currentDate = new Date().toISOString().split('T')[0];
        // Static pages
        const staticPages = [
            { url: '/', changefreq: 'daily', priority: '1.0' },
            { url: '/how-it-works', changefreq: 'monthly', priority: '0.8' },
            { url: '/blog', changefreq: 'weekly', priority: '0.9' },
            { url: '/api-docs', changefreq: 'monthly', priority: '0.7' },
            { url: '/disclaimer', changefreq: 'yearly', priority: '0.5' },
            { url: '/contact', changefreq: 'yearly', priority: '0.5' },
        ];
        // Generate XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        // Add static pages
        staticPages.forEach((page) => {
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
            xml += `    <lastmod>${currentDate}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        });
        // Add blog posts
        blogData_1.blogPosts.forEach((post) => {
            const publishDate = new Date(post.publishedAt).toISOString().split('T')[0];
            xml += '  <url>\n';
            xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
            xml += `    <lastmod>${post.updatedAt ? new Date(post.updatedAt).toISOString().split('T')[0] : publishDate}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += '  </url>\n';
        });
        xml += '</urlset>';
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(xml);
    }
    catch (err) {
        next(err);
    }
};
exports.generateSitemap = generateSitemap;
