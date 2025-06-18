/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce compilation overhead
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },

  // Development mode optimizations
  ...(process.env.NODE_ENV === 'development' && {
    // Skip type checking in development for faster builds
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};

export default nextConfig;
