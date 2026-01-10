import React, { useState } from 'react';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <SEO
        title="Contact Us - Pinterest Video Downloader"
        description="Get in touch with us for support, feedback, or inquiries about our Pinterest video downloading service."
        ogType="website"
      />
      <section className="contact-page">
        <h1>Contact Us</h1>
        <p className="subtitle">
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>

        <div className="contact-grid">
          <div className="card contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-item">
              <h3>📧 Email</h3>
              <p>
                <a href="mailto:support@pinterestvideodownloader.com">
                  support@pinterestvideodownloader.com
                </a>
              </p>
            </div>

            <div className="contact-item">
              <h3>🕒 Response Time</h3>
              <p>We typically respond within 24-48 hours</p>
            </div>

            <div className="contact-item">
              <h3>🛡️ Anti-Abuse Notice</h3>
              <p>
                We take abuse of our service seriously. Any attempts to bypass rate limits,
                scrape content at scale, or violate our terms of service will result in immediate
                IP blocking and potential legal action.
              </p>
            </div>

            <div className="contact-item">
              <h3>📝 Legal Inquiries</h3>
              <p>
                For copyright claims or legal matters, please include "LEGAL" in your subject line
                and provide detailed information about your concern.
              </p>
            </div>
          </div>

          <div className="card contact-form-card">
            <h2>Send Us a Message</h2>
            {submitted && (
              <div className="alert alert-success">
                ✅ Thank you! Your message has been sent successfully.
              </div>
            )}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="api">API Inquiry</option>
                  <option value="legal">Legal Matter</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="How can we help you?"
                />
              </div>

              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="card faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>Why isn't my video downloading?</h3>
            <p>
              Make sure the video is publicly accessible and not private. Our service only works
              with public Pinterest videos.
            </p>
          </div>
          <div className="faq-item">
            <h3>Is this service free?</h3>
            <p>
              Yes! Our basic service is completely free. We also offer API access with different
              tiers for developers who need higher rate limits.
            </p>
          </div>
          <div className="faq-item">
            <h3>Do you store my downloads?</h3>
            <p>
              No, we do not store any videos or URLs. Downloads are streamed directly from
              Pinterest to your device.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
