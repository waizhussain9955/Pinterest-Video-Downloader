import React, { useEffect, useRef } from 'react';

export type AdSlotType = 'banner' | 'in-content' | 'footer';

interface AdSlotProps {
  type: AdSlotType;
  id: string;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ type, id, className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lazy load ads only when they're in viewport
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load ad when visible
            loadAd(id);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, [id]);

  const loadAd = (adId: string) => {
    // Google AdSense integration placeholder
    // In production, replace with:
    /*
    if (window.adsbygoogle && !window.adsbygoogle.loaded) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
    */
    console.log(`Ad loaded: ${adId}`);
  };

  const getAdStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#f0f0f0',
      border: '1px dashed #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px',
      fontFamily: 'monospace',
    };

    switch (type) {
      case 'banner':
        return {
          ...baseStyles,
          minHeight: '90px',
          width: '100%',
          maxWidth: '728px',
          margin: '0 auto',
        };
      case 'in-content':
        return {
          ...baseStyles,
          minHeight: '250px',
          width: '100%',
          maxWidth: '300px',
          margin: '1rem auto',
        };
      case 'footer':
        return {
          ...baseStyles,
          minHeight: '60px',
          width: '100%',
          maxWidth: '468px',
          margin: '0 auto',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={adRef} className={`ad-slot ad-slot-${type} ${className}`} style={getAdStyles()}>
      {/* Google AdSense Placeholder */}
      {/* Replace with actual AdSense code in production */}
      <div style={{ textAlign: 'center' }}>
        <div>Ad Slot: {type.toUpperCase()}</div>
        <div style={{ fontSize: '11px', marginTop: '4px' }}>
          (AdSense integration pending)
        </div>
      </div>
    </div>
  );
};

// Pre-configured ad slots
export const TopBannerAd: React.FC = () => (
  <AdSlot type="banner" id="top-banner-ad" className="top-ad" />
);

export const InContentAd: React.FC = () => (
  <AdSlot type="in-content" id="in-content-ad" className="content-ad" />
);

export const FooterAd: React.FC = () => (
  <AdSlot type="footer" id="footer-ad" className="footer-ad" />
);

// Type declaration for AdSense (add to global.d.ts in production)
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}
