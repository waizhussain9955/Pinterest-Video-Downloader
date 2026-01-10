import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        howItWorks: 'How It Works',
        blog: 'Blog',
        about: 'About Us',
        contact: 'Contact',
        disclaimer: 'Disclaimer',
        apiDocs: 'API Docs',
      },
      // Home page
      home: {
        title: 'Pinterest Video Downloader',
        subtitle: 'Download Pinterest videos quickly and easily',
        description:
          'Paste a public Pinterest video URL below. This tool does not bypass private content, login walls, or DRM, and you must only download content you own or have permission to use.',
        urlLabel: 'Pinterest Video URL',
        urlPlaceholder: 'https://www.pinterest.com/pin/...',
        pasteButton: 'Paste',
        clearButton: 'Clear',
        submitButton: 'Get Download Link',
        processing: 'Processing…',
        videoDetails: 'Video Details',
        title_field: 'Title',
        author: 'Author',
        duration: 'Duration',
        seconds: 'seconds',
        source: 'Source',
        openOnPinterest: 'Open on Pinterest',
        downloadTitle: 'Download',
        downloadButton: 'Download {{quality}}',
        fileSize: 'File size: {{size}}',
        proxyDownload: 'Direct download via server proxy',
        selectQuality: 'Select Quality',
      },
      // Footer
      footer: {
        disclaimer:
          'This tool only supports public Pinterest videos. Users are responsible for ensuring they have the legal right to download and use any content.',
        copyright: '© 2026 Pinterest Video Downloader. All rights reserved.',
      },
      // Errors
      errors: {
        emptyUrl: 'Please paste a Pinterest public video URL.',
        invalidUrl: 'Invalid URL format.',
        fetchFailed: 'Failed to fetch video. Please try again.',
        generic: 'Something went wrong.',
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        howItWorks: 'Cómo Funciona',
        blog: 'Blog',
        about: 'Sobre Nosotros',
        contact: 'Contacto',
        disclaimer: 'Descargo',
        apiDocs: 'Docs API',
      },
      home: {
        title: 'Descargador de Videos de Pinterest',
        subtitle: 'Descarga videos de Pinterest rápida y fácilmente',
        description:
          'Pega una URL pública de video de Pinterest a continuación. Esta herramienta no omite contenido privado, paredes de inicio de sesión o DRM, y solo debes descargar contenido que poseas o tengas permiso para usar.',
        urlLabel: 'URL del Video de Pinterest',
        urlPlaceholder: 'https://www.pinterest.com/pin/...',
        pasteButton: 'Pegar',
        clearButton: 'Limpiar',
        submitButton: 'Obtener Enlace de Descarga',
        processing: 'Procesando…',
        videoDetails: 'Detalles del Video',
        title_field: 'Título',
        author: 'Autor',
        duration: 'Duración',
        seconds: 'segundos',
        source: 'Fuente',
        openOnPinterest: 'Abrir en Pinterest',
        downloadTitle: 'Descargar',
        downloadButton: 'Descargar {{quality}}',
        fileSize: 'Tamaño: {{size}}',
        proxyDownload: 'Descarga directa a través del proxy del servidor',
        selectQuality: 'Seleccionar Calidad',
      },
      footer: {
        disclaimer:
          'Esta herramienta solo admite videos públicos de Pinterest. Los usuarios son responsables de asegurarse de tener el derecho legal de descargar y usar cualquier contenido.',
        copyright: '© 2026 Pinterest Video Downloader. Todos los derechos reservados.',
      },
      errors: {
        emptyUrl: 'Por favor pega una URL pública de video de Pinterest.',
        invalidUrl: 'Formato de URL inválido.',
        fetchFailed: 'Error al obtener el video. Por favor intenta de nuevo.',
        generic: 'Algo salió mal.',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
