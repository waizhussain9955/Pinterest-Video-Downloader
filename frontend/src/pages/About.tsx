import React from 'react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Pinterest Video Downloader"
        description="Learn about our mission to provide a free, fast, and ethical Pinterest video downloading service."
        ogType="website"
      />
      <section className="about-page">
        <h1>About Us</h1>
        
        <div className="card">
          <h2>Our Mission</h2>
          <p>
            Pinterest Video Downloader is a free online tool designed to help users download
            publicly available Pinterest videos quickly, safely, and ethically. We believe in
            making web content accessible while respecting copyright laws and content creators' rights.
          </p>
        </div>

        <div className="card">
          <h2>What We Do</h2>
          <p>
            Our service allows you to save Pinterest videos that are publicly accessible. We do not:
          </p>
          <ul>
            <li>Bypass login walls or private content restrictions</li>
            <li>Circumvent DRM (Digital Rights Management) protections</li>
            <li>Enable downloading of copyrighted content without permission</li>
            <li>Store or redistribute content on our servers</li>
          </ul>
        </div>

        <div className="card">
          <h2>Ethical Usage</h2>
          <p>
            We are committed to ethical practices and expect our users to:
          </p>
          <ul>
            <li>Only download content they own or have permission to use</li>
            <li>Respect intellectual property and copyright laws</li>
            <li>Credit original creators when sharing downloaded content</li>
            <li>Use downloads for personal, educational, or legally permitted purposes</li>
          </ul>
        </div>

        <div className="card">
          <h2>Technology</h2>
          <p>
            Our platform is built with modern, scalable technology to provide fast and reliable
            service. We use Redis caching, async processing, and CDN-ready architecture to
            ensure optimal performance for our users worldwide.
          </p>
        </div>

        <div className="card">
          <h2>Privacy</h2>
          <p>
            We respect your privacy. We do not:
          </p>
          <ul>
            <li>Store URLs you submit</li>
            <li>Track your downloads</li>
            <li>Sell your data to third parties</li>
            <li>Require account creation or personal information</li>
          </ul>
        </div>

        <div className="card">
          <h2>Legal Compliance</h2>
          <p>
            Our service operates within the bounds of applicable laws. We comply with robots.txt
            rules, respect rate limits, and only access publicly available content. Users are
            solely responsible for ensuring their use of downloaded content complies with all
            applicable laws and regulations.
          </p>
        </div>
      </section>
    </>
  );
};
