import { Request, Response, NextFunction } from 'express';
import { blogPosts, getBlogPostBySlug, getFeaturedPosts, getAllCategories } from '../data/blogData';

export const listBlogPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, featured } = req.query;

    let posts = blogPosts;

    if (category && typeof category === 'string') {
      posts = posts.filter((post) => post.category === category);
    }

    if (featured === 'true') {
      posts = getFeaturedPosts();
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
        categories: getAllCategories(),
        total: posts.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = getBlogPostBySlug(slug);

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
  } catch (err) {
    next(err);
  }
};
