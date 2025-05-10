import withNextIntl from 'next-intl/plugin';

const withNextIntlConfig = withNextIntl('./i18n.ts');

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paddy.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/order_products',
        destination: 'http://localhost:5000/api/order_products',
      },
      {
        source: '/api/order_products/:path*',
        destination: 'http://localhost:5000/api/order_products/:path*',
      },
      {
        source: '/api/products',
        destination: 'http://localhost:5000/api/products',
      },
      {
        source: '/chatbot', // Thêm rule cho /chatbot
        destination: 'http://localhost:5000/chatbot', // Chuyển tiếp tới backend
      },
    ];
  },
};

export default withNextIntlConfig(nextConfig);