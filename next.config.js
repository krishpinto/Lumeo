/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true, // Enable React strict mode
  poweredByHeader: false, // Disable the "X-Powered-By" header for security
  productionBrowserSourceMaps: true, // Generate source maps for production
};

module.exports = nextConfig;
