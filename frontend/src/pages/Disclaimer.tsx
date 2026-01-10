import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <section>
      <h1>Disclaimer & Copyright Policy</h1>
      <p>
        This tool is provided solely for downloading public Pinterest videos. It does not bypass
        private content, login walls, DRM, or any security mechanism.
      </p>
      <p>
        By using this service, you agree that you are fully responsible for ensuring that you have
        the legal right (ownership or explicit permission) to download, store, and reuse any
        content obtained via this site.
      </p>
      <ul>
        <li>Do not use this service to infringe copyright or violate Pinterest’s Terms of Service.</li>
        <li>Do not attempt to download private, paywalled, or otherwise restricted content.</li>
        <li>We do not store or redistribute videos; links are fetched per request from Pinterest.</li>
      </ul>
      <p>
        This site is not affiliated with Pinterest. All trademarks and copyrights belong to their
        respective owners.
      </p>
    </section>
  );
};
