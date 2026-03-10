const nextConfig = {
  output: 'export',
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
  // Add headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;