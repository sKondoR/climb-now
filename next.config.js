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
  transpilePackages: ['mobx', 'mobx-react-lite'],
};

module.exports = nextConfig;