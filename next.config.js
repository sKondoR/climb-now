const nextConfig = {
  output: 'standalone',
  optimizeFonts: true, // Optimize font loading
  compress: true, // Enable compression
  poweredByHeader: false, // Improve performance
  swcMinify: true, // Use SWC minification
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //   };

  //   return config;
  // },
  transpilePackages: ['mobx', 'mobx-react-lite'],
};

module.exports = nextConfig;