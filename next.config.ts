import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * ✅ Turbopack explicitement configuré
   * (vide = OK, évite l’erreur)
   */
  turbopack: {},

  /** Images */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },

  /** Headers sécurité */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  /** Variables publiques */
  env: {
    NEXT_PUBLIC_APP_NAME: "Portfolio John",
    NEXT_PUBLIC_APP_DESCRIPTION: "Développeur Full-Stack & IA",
  },

  /** Webpack custom (autorisé maintenant) */
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.usedExports = true;
    }
    return config;
  },

  /** Experimental */
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  poweredByHeader: false,
  compress: true,
};

export default withNextIntl(nextConfig);
