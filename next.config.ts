
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: true,
      },
    ]
  },
  typescript: {
    // This will prevent TypeScript errors from failing the build.
    ignoreBuildErrors: true,
  },
  eslint: {
    // This will prevent ESLint errors from failing the build.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['@radix-ui/react-dialog'],
  webpack: (config) => {
    config.externals.push('handlebars');
    return config;
  },
};

export default nextConfig;
