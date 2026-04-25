import { useEffect } from 'react';

interface JsonLdProps {
  data: any;
}

export function useJsonLd(data: any) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}

// Composant pour les données structurées côté client
export function JsonLd({ data }: JsonLdProps) {
  useJsonLd(data);
  return null;
}