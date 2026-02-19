const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
   staticPageGenerationTimeout: 120,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Timeout',
            value: '300',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;