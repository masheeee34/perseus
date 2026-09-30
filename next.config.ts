import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: 'https', hostname: 'perseusshopp.duckdns.org' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  async headers() {
    return [
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/boutique.html', destination: '/boutique', permanent: true },
      { source: '/panier.html', destination: '/panier', permanent: true },
      { source: '/profil.html', destination: '/profil', permanent: true },
      { source: '/login.html', destination: '/login', permanent: true },
      { source: '/checkout.html', destination: '/checkout', permanent: true },
      { source: '/lookbook.html', destination: '/lookbook', permanent: true },
      { source: '/univers.html', destination: '/univers', permanent: true },
    ];
  },
  serverExternalPackages: ['bcryptjs', '@libsql/client'],
};

export default nextConfig;
