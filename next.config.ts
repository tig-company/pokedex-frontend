import type { NextConfig } from "next";

// Function to determine the correct base path based on environment
function getBasePath(): string {
  // For PR preview deployments
  if (process.env.PR_PREVIEW === 'true' && process.env.PR_NUMBER) {
    return `/pokedex-frontend/pr-${process.env.PR_NUMBER}`;
  }
  
  // For production GitHub Pages deployment
  if (process.env.GITHUB_PAGES === 'true') {
    return '/pokedex-frontend';
  }
  
  // For local development
  return '';
}

const basePath = getBasePath();

const nextConfig: NextConfig = {
  images: {
    domains: ['raw.githubusercontent.com'],
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  assetPrefix: basePath,
  basePath: basePath,
};

export default nextConfig;
