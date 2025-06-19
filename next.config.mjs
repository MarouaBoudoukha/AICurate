/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET,
    NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET,
  },
  
  // Allow ngrok origins for development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['3823-174-160-246-170.ngrok-free.app'],
  }),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  },

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
