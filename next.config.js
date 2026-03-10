const nextConfig = {
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
  // Add experimental optimizations (Next.js 13+)
  experimental: {
    optimizeCss: true, // Optimize CSS removal
    scrollRestoration: true,
  },
};

module.exports = nextConfig;