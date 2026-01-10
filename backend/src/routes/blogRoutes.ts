import { Application } from 'express';
import { listBlogPosts, getBlogPost } from '../controllers/blogController';

export const registerBlogRoutes = (app: Application): void => {
  app.get('/api/v1/blog', listBlogPosts);
  app.get('/api/v1/blog/:slug', getBlogPost);
};
