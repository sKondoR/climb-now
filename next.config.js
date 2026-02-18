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
};

module.exports = nextConfig;