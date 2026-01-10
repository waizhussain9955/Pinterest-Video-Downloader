import React from 'react';
import { SEO } from '../components/SEO';

export const HowItWorks: React.FC = () => {
  return (
    <>
      <SEO
        title="How It Works - Pinterest Video Downloader"
        description="Learn how to download Pinterest videos in 3 easy steps. Fast, free, and secure video downloading process explained."
        ogType="website"
      />
      <section className="how-it-works-page">
        <div className="hero-section">
          <h1 className="page-title">How It Works</h1>
          <p className="page-subtitle">
            Download Pinterest videos in just 3 simple steps. No registration, no software installation required!
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">🔗</div>
            <h2 className="step-title">Copy Pinterest Video URL</h2>
            <p className="step-description">
              Find the Pinterest video you want to download. Click on the video to open it, then copy the URL from your browser's address bar.
            </p>
            <div className="step-example">
              <code>https://www.pinterest.com/pin/123456789/</code>
            </div>
          </div>

          <div className="step-arrow">↓</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">📋</div>
            <h2 className="step-title">Paste URL & Choose Quality</h2>
            <p className="step-description">
              Paste the URL in our downloader on the home page. Click "Get Download Link" and select your preferred video quality (SD, HD, 1080p).
            </p>
            <div className="step-features">
              <span className="feature-tag">✓ Multiple Qualities</span>
              <span className="feature-tag">✓ File Size Info</span>
              <span className="feature-tag">✓ Fast Processing</span>
            </div>
          </div>

          <div className="step-arrow">↓</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">💾</div>
            <h2 className="step-title">Download Video</h2>
            <p className="step-description">
              Click the download button and your video will be saved directly to your device. Fast, secure, and hassle-free!
            </p>
            <div className="step-features">
              <span className="feature-tag">✓ Direct Download</span>
              <span className="feature-tag">✓ No Watermarks</span>
              <span className="feature-tag">✓ Original Quality</span>
            </div>
          </div>
        </div>

        <div className="technical-details">
          <h2 className="section-title">🔧 How Our Technology Works</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <div className="tech-icon">🌐</div>
              <h3>1. URL Analysis</h3>
              <p>
                When you submit a URL, our system validates it to ensure it's a legitimate Pinterest link pointing to a public video.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">🤖</div>
              <h3>2. robots.txt Check</h3>
              <p>
                We respect Pinterest's robots.txt rules and only access content that is publicly available and allowed for crawling.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">🔍</div>
              <h3>3. Metadata Extraction</h3>
              <p>
                Our backend fetches the public HTML of the pin page and extracts video URLs, quality options, title, author, and duration.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">⚡</div>
              <h3>4. Quality Detection</h3>
              <p>
                We detect all available video qualities (360p, 480p, 720p, HD, 1080p) and fetch file sizes so you can choose what works best.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">💾</div>
              <h3>5. Secure Proxy</h3>
              <p>
                Videos are streamed through our secure proxy server directly from Pinterest's CDN to your device - no storage on our servers.
              </p>
            </div>

            <div className="tech-card">
              <div className="tech-icon">🚀</div>
              <h3>6. Fast Delivery</h3>
              <p>
                With Redis caching and optimized servers, repeated downloads are instant. Our CDN-ready architecture ensures fast delivery worldwide.
              </p>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2 className="section-title">✨ Why Choose Our Downloader?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🆓</div>
              <h3>100% Free</h3>
              <p>No hidden costs, no subscriptions. Download as many videos as you want, completely free.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Advanced caching technology ensures videos load in seconds, not minutes.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Safe & Secure</h3>
              <p>HTTPS encryption, no malware, no ads asking for permissions. Your security is our priority.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Works perfectly on phones, tablets, and desktops. Download anywhere, anytime.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3>High Quality</h3>
              <p>Download in original quality - HD, 1080p, or whatever quality Pinterest provides.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🚫</div>
              <h3>No Registration</h3>
              <p>No sign-up required. Just paste the URL and download. Simple as that!</p>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2 className="section-title">❓ Frequently Asked Questions</h2>
          
          <div className="faq-item">
            <h3>Is this service really free?</h3>
            <p>
              Yes! Our basic service is 100% free with no limits. We also offer a paid API for developers who need higher rate limits.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do I need to create an account?</h3>
            <p>
              No account needed! Simply paste the Pinterest URL and start downloading immediately.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I download private Pinterest videos?</h3>
            <p>
              No. We can only download publicly accessible Pinterest videos. Private or restricted content cannot be accessed.
            </p>
          </div>

          <div className="faq-item">
            <h3>What video qualities are available?</h3>
            <p>
              We provide all qualities that Pinterest makes available - typically SD (480p), HD (720p), and sometimes 1080p depending on the original upload.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is it legal to download Pinterest videos?</h3>
            <p>
              Our tool only accesses public content that Pinterest makes available. However, you are responsible for ensuring you have the right to download and use any content. Always respect copyright laws and creator rights.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do you store the videos I download?</h3>
            <p>
              No! Videos are streamed directly from Pinterest to your device through our proxy. We don't store any video content on our servers.
            </p>
          </div>

          <div className="faq-item">
            <h3>Why did my download fail?</h3>
            <p>
              Common reasons: The video is private, the pin was deleted, the URL is incorrect, or Pinterest is temporarily blocking requests. Try again in a few minutes.
            </p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Download?</h2>
          <p>Start downloading Pinterest videos in seconds!</p>
          <a href="/" className="cta-button">
            Try It Now →
          </a>
        </div>
      </section>
    </>
  );
};
