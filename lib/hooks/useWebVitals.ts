import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  startTime: number;
  label: 'web-vital' | 'custom';
  attribution?: any;
}

export function useWebVitalsReporting() {
  // Rapporter les métriques à votre service d'analytics
  useReportWebVitals((metric: WebVitalsMetric) => {
    // Envoyer à Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Envoyer à votre propre endpoint d'analytics
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true') {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      }).catch(err => console.error('Failed to send analytics:', err));
    }

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vital] ${metric.name}:`, metric.value);

      // Alertes pour les métriques critiques
      switch (metric.name) {
        case 'FCP':
          if (metric.value > 1800) {
            console.warn('⚠️ FCP is above 1.8s - Consider optimizing initial render');
          }
          break;
        case 'LCP':
          if (metric.value > 2500) {
            console.warn('⚠️ LCP is above 2.5s - Consider optimizing largest content');
          }
          break;
        case 'FID':
          if (metric.value > 100) {
            console.warn('⚠️ FID is above 100ms - Consider optimizing interactivity');
          }
          break;
        case 'CLS':
          if (metric.value > 0.1) {
            console.warn('⚠️ CLS is above 0.1 - Consider fixing layout shifts');
          }
          break;
        case 'TTFB':
          if (metric.value > 800) {
            console.warn('⚠️ TTFB is above 800ms - Consider optimizing server response');
          }
          break;
      }
    }
  });
}

// Hook pour optimiser les performances
export function usePerformanceOptimization() {
  useEffect(() => {
    // Préconnexion aux domaines externes
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      // Ajoutez vos CDN ici
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch des pages critiques
    const prefetchPages = [
      '/projects',
      '/experience',
    ];

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        prefetchPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      });
    }
  }, []);
}

// Type pour window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}