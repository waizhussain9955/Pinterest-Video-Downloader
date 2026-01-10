"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPost = exports.listBlogPosts = void 0;
const blogData_1 = require("../data/blogData");
const listBlogPosts = async (req, res, next) => {
    try {
        const { category, featured } = req.query;
        let posts = blogData_1.blogPosts;
        if (category && typeof category === 'string') {
            posts = posts.filter((post) => post.category === category);
        }
        if (featured === 'true') {
            posts = (0, blogData_1.getFeaturedPosts)();
        }
        res.status(200).json({
            success: true,
            data: {
                posts: posts.map((post) => ({
                    id: post.id,
                    slug: post.slug,
                    title: post.title,
                    excerpt: post.excerpt,
                    author: post.author,
                    publishedAt: post.publishedAt,
                    category: post.category,
                    tags: post.tags,
                    featured: post.featured,
                    imageUrl: post.imageUrl,
                })),
                categories: (0, blogData_1.getAllCategories)(),
                total: posts.length,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.listBlogPosts = listBlogPosts;
const getBlogPost = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const post = (0, blogData_1.getBlogPostBySlug)(slug);
        if (!post) {
            res.status(404).json({
                success: false,
                error: 'Blog post not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogPost = getBlogPost;
