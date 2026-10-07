import withBundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

const nextConfig = {
  reactStrictMode: true,
  compress: true, // Enable compression
  outputFileTracingRoot: path.join(process.cwd()),
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false, // Improve performance
  // Карты нужны только для загрузки в Hawk: scripts/hawk-sourcemaps.mjs при npm run start отправляет и удаляет их
  productionBrowserSourceMaps: true,
  experimental: {
    // Webpack memory optimizations
    memoryBasedWorkersCount: true,
    // Static generation improvements
    staticGenerationRetryCount: 3,
    staticGenerationMaxConcurrency: 8,
    optimizePackageImports: ['@fortawesome/free-solid-svg-icons'],
  },
  transpilePackages: ['mobx', 'mobx-react-lite'],
  // HTTP headers for better caching
  async headers() {
    return [];
  }
}

export default bundleAnalyzer(nextConfig)