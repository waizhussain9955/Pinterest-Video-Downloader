import React from 'react';

export const ApiDocs: React.FC = () => {
  return (
    <section>
      <h1>API Documentation</h1>

      <h2>Base URL</h2>
      <pre>{`https://your-backend-domain.com`}</pre>

      <h2>Authentication</h2>
      <p>
        Optional API key support is available. When enabled, include your key via the
        <code>X-API-Key</code> header or <code>?api_key=YOUR_KEY</code> query parameter.
      </p>

      <h2>Health Check</h2>
      <p><strong>GET</strong> <code>/api/v1/health</code></p>
      <p>Returns service uptime and status.</p>

      <h2>Download Pinterest Video</h2>
      <p><strong>POST</strong> <code>/api/v1/pinterest/download</code></p>
      <h3>Request Body</h3>
      <pre>{`{
  "url": "https://www.pinterest.com/pin/..."
}`}</pre>

      <h3>Successful Response</h3>
      <pre>{`{
  "success": true,
  "data": {
    "sourceUrl": "https://www.pinterest.com/pin/...",
    "videoUrl": "https://...mp4",
    "qualities": [
      { "url": "https://...mp4", "qualityLabel": "default" }
    ],
    "title": "Optional title",
    "author": "Optional author",
    "durationSeconds": 120
  },
  "disclaimer": "Users are responsible for copyright compliance..."
}`}</pre>

      <h3>Error Responses</h3>
      <ul>
        <li><strong>400</strong>: Invalid or missing URL.</li>
        <li><strong>403</strong>: Disallowed by robots.txt or API key missing/invalid.</li>
        <li><strong>422</strong>: No public video found (non-video or private pin).</li>
        <li><strong>5xx</strong>: Upstream or internal error.</li>
      </ul>
    </section>
  );
};
