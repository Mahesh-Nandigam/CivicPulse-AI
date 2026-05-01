/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cloud Run specific optimizations
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
