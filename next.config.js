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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Timeout',
            value: '100',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;