import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, BlogPost as BlogPostType } from '../lib/api';
import { SEO } from '../components/SEO';
import { SchemaMarkup } from '../components/SchemaMarkup';
import { InContentAd } from '../components/AdSlot';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogPost(postSlug);
      if (response.data) {
        setPost(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Blog post not found');
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

  if (loading) {
    return (
      <section>
        <div className="card">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section>
        <div className="alert alert-error">{error || 'Blog post not found'}</div>
        <Link to="/blog">← Back to Blog</Link>
      </section>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`${window.location.origin}/blog/${post.slug}`}
        ogType="article"
        ogImage={post.imageUrl}
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt,
          author: post.author,
          section: post.category,
          tags: post.tags,
        }}
      />
      <SchemaMarkup
        type="article"
        title={post.title}
        description={post.excerpt}
        author={post.author}
        publishedDate={post.publishedAt}
        modifiedDate={post.updatedAt}
        url={`${window.location.origin}/blog/${post.slug}`}
        imageUrl={post.imageUrl}
      />

      <section>
        {/* Breadcrumbs */}
        <nav style={{ marginBottom: '2rem', fontSize: '0.875rem' }}>
          <Link to="/" style={{ color: '#e60023' }}>
            Home
          </Link>
          {' > '}
          <Link to="/blog" style={{ color: '#e60023' }}>
            Blog
          </Link>
          {' > '}
          <span>{post.title}</span>
        </nav>

        <article className="card">
          {/* Featured Image */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '0.5rem',
                marginBottom: '2rem',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Title & Meta */}
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{post.title}</h1>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e5e5e5',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span
                style={{
                  backgroundColor: '#e60023',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
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
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  Featured
                </span>
              )}
            </div>
            <span style={{ color: '#666', fontSize: '0.875rem' }}>
              By {post.author} • {formatDate(post.publishedAt)}
            </span>
          </div>

          {/* Content */}
          <div
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: '#333',
            }}
          >
            {/* Simple markdown rendering - split by newlines */}
            {post.content?.split('\n').map((line, index) => {
              // Headers
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} style={{ fontSize: '2rem', marginTop: '2rem', marginBottom: '1rem' }}>
                    {line.replace(/^# /, '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                    {line.replace(/^## /, '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} style={{ fontSize: '1.25rem', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                    {line.replace(/^### /, '')}
                  </h3>
                );
              }
              // Lists
              if (line.startsWith('- ')) {
                return (
                  <li key={index} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    {line.replace(/^- /, '')}
                  </li>
                );
              }
              // Numbered lists
              if (/^\d+\. /.test(line)) {
                return (
                  <li key={index} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                    {line.replace(/^\d+\. /, '')}
                  </li>
                );
              }
              // Bold text
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={index} style={{ marginBottom: '1rem' }}>
                    {parts.map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                );
              }
              // Regular paragraph
              if (line.trim()) {
                return (
                  <p key={index} style={{ marginBottom: '1rem' }}>
                    {line}
                  </p>
                );
              }
              return <br key={index} />;
            })}
          </div>

          {/* In-content Ad */}
          <div style={{ margin: '3rem 0' }}>
            <InContentAd />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid #e5e5e5',
              }}
            >
              <strong style={{ display: 'block', marginBottom: '1rem' }}>Tags:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#666',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Back to Blog */}
        <div style={{ marginTop: '2rem' }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e60023',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              fontWeight: 'bold',
            }}
          >
            ← Back to Blog
          </Link>
        </div>
      </section>
    </>
  );
};
