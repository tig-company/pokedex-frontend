import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/pokedex-frontend' : '',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/pokedex-frontend' : '',
};

export default nextConfig;
