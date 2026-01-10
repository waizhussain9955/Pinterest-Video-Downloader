import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, BlogPost } from '../lib/api';
import { SEO } from '../components/SEO';
import { BlogPageSchema } from '../components/SchemaMarkup';
import { TopBannerAd } from '../components/AdSlot';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogPosts(
        selectedCategory ? { category: selectedCategory } : undefined
      );
      if (response.data) {
        setPosts(response.data.posts);
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Learn about Pinterest video downloading, best practices, API usage, and technical guides."
        canonical={`${window.location.origin}/blog`}
      />
      <BlogPageSchema />

      <section>
        <TopBannerAd />

        <h1>Blog</h1>
        <p>
          Discover tips, tricks, and best practices for downloading Pinterest videos legally and
          efficiently.
        </p>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <label htmlFor="category-filter">Filter by Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccc',
                marginTop: '0.5rem',
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card">
            <p>Loading blog posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Blog Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            {posts.map((post) => (
              <article key={post.id} className="card" style={{ height: '100%' }}>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '0.5rem 0.5rem 0 0',
                      marginBottom: '1rem',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <div style={{ padding: '1rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: '#e60023',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {post.category}
                    </span>
                    {post.featured && (
                      <span
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <h2 style={{ marginTop: '0.5rem', fontSize: '1.25rem' }}>
                    <Link
                      to={`/blog/${post.slug}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.5rem 0' }}>
                    By {post.author} • {formatDate(post.publishedAt)}
                  </p>

                  <p style={{ marginTop: '1rem' }}>{post.excerpt}</p>

                  <Link
                    to={`/blog/${post.slug}`}
                    style={{
                      display: 'inline-block',
                      marginTop: '1rem',
                      color: '#e60023',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                    }}
                  >
                    Read More →
                  </Link>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            backgroundColor: '#f0f0f0',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            color: '#666',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="card">
            <p>No blog posts found.</p>
          </div>
        )}
      </section>
    </>
  );
};
