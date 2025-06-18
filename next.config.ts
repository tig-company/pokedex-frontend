import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pokedex-frontend' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/pokedex-frontend' : '',
};

export default nextConfig;
