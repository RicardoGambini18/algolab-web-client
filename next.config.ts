import type { NextConfig } from 'next'

import './src/env'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        port: '',
        protocol: 'https',
        pathname: '/t/p/**',
        hostname: 'image.tmdb.org',
      },
    ],
  },
}

export default nextConfig
