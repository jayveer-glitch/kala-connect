/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
  },
  // Optimize chunk loading and prevent timeout issues
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack: (config, { dev, isServer }) => {
    // Prevent chunk loading timeouts in development
    if (dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig