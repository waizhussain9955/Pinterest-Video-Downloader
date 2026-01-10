import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadPinterestVideo, PinterestDownloadResponse } from '../lib/api';
import { SEO } from '../components/SEO';

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PinterestDownloadResponse | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<number>(0);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleClear = () => {
    setUrl('');
    setError(null);
    setResult(null);
  };

  const handleDownload = (videoUrl: string, qualityLabel?: string) => {
    const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
    const proxyUrl = `${API_BASE_URL}/api/v1/pinterest/proxy-download?videoUrl=${encodeURIComponent(videoUrl)}`;
    
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.download = `pinterest-video-${qualityLabel || 'default'}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setSelectedQuality(0);

    if (!url.trim()) {
      setError(t('errors.emptyUrl'));
      return;
    }

    setLoading(true);
    try {
      const response = await downloadPinterestVideo(url.trim());
      setResult(response.data || null);
    } catch (err: any) {
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Pinterest Video Downloader - Download Pinterest Videos Free"
        description="Download Pinterest videos quickly and easily. Free online tool to save Pinterest videos in high quality. No registration required."
        ogType="website"
      />
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('home.title')}</h1>
          <p className="hero-subtitle">{t('home.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="download-form card">
          <div className="form-header">
            <label htmlFor="url" className="form-label">
              {t('home.urlLabel')}
            </label>
            <p className="form-description">{t('home.description')}</p>
          </div>

          <div className="input-group">
            <input
              id="url"
              type="url"
              className="url-input"
              placeholder={t('home.urlPlaceholder')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
            />
            <div className="input-actions">
              <button
                type="button"
                className="btn-secondary btn-icon"
                onClick={handlePaste}
                disabled={loading}
                title={t('home.pasteButton')}
              >
                📋 {t('home.pasteButton')}
              </button>
              {url && (
                <button
                  type="button"
                  className="btn-secondary btn-icon"
                  onClick={handleClear}
                  disabled={loading}
                  title={t('home.clearButton')}
                >
                  ✕ {t('home.clearButton')}
                </button>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary btn-large" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {t('home.processing')}
              </>
            ) : (
              t('home.submitButton')
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-error fade-in">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        {result && (
          <div className="result-container fade-in">
            <div className="card result-card">
              <h2 className="result-title">🎬 {t('home.videoDetails')}</h2>
              
              <div className="video-metadata">
                {result.title && (
                  <div className="metadata-item">
                    <span className="metadata-label">{t('home.title_field')}:</span>
                    <span className="metadata-value">{result.title}</span>
                  </div>
                )}
                {result.author && (
                  <div className="metadata-item">
                    <span className="metadata-label">{t('home.author')}:</span>
                    <span className="metadata-value">{result.author}</span>
                  </div>
                )}
                {typeof result.durationSeconds === 'number' && (
                  <div className="metadata-item">
                    <span className="metadata-label">{t('home.duration')}:</span>
                    <span className="metadata-value">
                      {result.durationSeconds} {t('home.seconds')}
                    </span>
                  </div>
                )}
                <div className="metadata-item">
                  <span className="metadata-label">{t('home.source')}:</span>
                  <a
                    href={result.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="source-link"
                  >
                    {t('home.openOnPinterest')} ↗
                  </a>
                </div>
              </div>
            </div>

            {result.qualities.length > 1 && (
              <div className="card quality-selector">
                <h3 className="quality-title">🎬 {t('home.selectQuality')}</h3>
                <div className="quality-options">
                  {result.qualities.map((quality, index) => (
                    <button
                      key={index}
                      className={`quality-option ${selectedQuality === index ? 'active' : ''}`}
                      onClick={() => setSelectedQuality(index)}
                      type="button"
                    >
                      <span className="quality-label">
                        {quality.qualityLabel || `Option ${index + 1}`}
                      </span>
                      {quality.width && quality.height && (
                        <span className="quality-resolution">
                          {quality.width}x{quality.height}
                        </span>
                      )}
                      {quality.fileSize && (
                        <span className="quality-size">{formatFileSize(quality.fileSize)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="card download-card">
              <h3 className="download-title">📥 {t('home.downloadTitle')}</h3>
              <button
                onClick={() =>
                  handleDownload(
                    result.qualities[selectedQuality].url,
                    result.qualities[selectedQuality].qualityLabel
                  )
                }
                className="btn-download"
                type="button"
              >
                <span className="download-icon">💾</span>
                {t('home.downloadButton', {
                  quality: result.qualities[selectedQuality].qualityLabel || 'video',
                })}
              </button>
              {result.qualities[selectedQuality].fileSize && (
                <p className="download-info">
                  {t('home.fileSize', {
                    size: formatFileSize(result.qualities[selectedQuality].fileSize),
                  })}
                </p>
              )}
              <p className="download-note">🔒 {t('home.proxyDownload')}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
