/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  swcMinify: true,
  // PWA: Service worker registration will be handled in _app.tsx
};

module.exports = nextConfig;
