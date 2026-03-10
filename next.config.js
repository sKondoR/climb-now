const nextConfig = {
  output: 'standalone',
  compress: true, // Enable compression
  poweredByHeader: false, // Improve performance
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //   };

  //   return config;
  // },
  transpilePackages: ['mobx', 'mobx-react-lite'],
};

module.exports = nextConfig;