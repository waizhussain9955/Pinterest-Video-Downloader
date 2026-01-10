import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Disclaimer } from './pages/Disclaimer';
import { ApiDocs } from './pages/ApiDocs';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { FooterAd } from './components/AdSlot';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ThemeToggle } from './components/ThemeToggle';
import './i18n';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HelmetProvider>
      <div className="app-root">
      <header className="app-header">
        <div className="container">
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            📌 Pinterest Video Downloader
          </Link>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>

          <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.howItWorks')}</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.blog')}</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</Link>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/api-docs" element={<ApiDocs />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">
          <FooterAd />
          <div className="footer-content">
            <div className="footer-links">
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
              <Link to="/disclaimer">{t('nav.disclaimer')}</Link>
              <Link to="/api-docs">{t('nav.apiDocs')}</Link>
            </div>
            <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
            <p className="footer-copyright">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
    </HelmetProvider>
  );
};

export default App;
