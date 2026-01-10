"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlogRoutes = void 0;
const blogController_1 = require("../controllers/blogController");
const registerBlogRoutes = (app) => {
    app.get('/api/v1/blog', blogController_1.listBlogPosts);
    app.get('/api/v1/blog/:slug', blogController_1.getBlogPost);
};
exports.registerBlogRoutes = registerBlogRoutes;
