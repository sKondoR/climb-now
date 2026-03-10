import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  compress: true, // Enable compression
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false, // Improve performance
  productionBrowserSourceMaps: false, // Production disable source maps
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //   };

  //   return config;
  // },
  experimental: {    
    // reactCompiler: true, 
    // Turbopack for dev (faster)
    // turbopack: {
    //   rules: {
    //   },
    // },
    // Webpack memory optimizations
    memoryBasedWorkersCount: true,
    // Static generation improvements
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 8,
  },
  transpilePackages: ['mobx', 'mobx-react-lite'],
  // HTTP headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default bundleAnalyzer(nextConfig)