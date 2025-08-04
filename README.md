# Pokédex Frontend

[![CI](https://github.com/tig-company/pokedex-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/tig-company/pokedex-frontend/actions/workflows/ci.yml)
[![Deploy](https://github.com/tig-company/pokedex-frontend/actions/workflows/deploy.yml/badge.svg)](https://github.com/tig-company/pokedex-frontend/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue)](https://tig-company.github.io/pokedex-frontend/)

A modern, responsive Pokédex application built with Next.js 15, featuring search functionality and infinite scroll. This project showcases a complete CI/CD pipeline with automated testing and GitHub Pages deployment.

## Features

- 🔍 **Real-time Search** - Search Pokémon by name or type with autocomplete suggestions
- ♾️ **Infinite Scroll** - Seamless browsing experience with automatic content loading
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Automatic theme switching based on system preferences
- ⚡ **Fast Performance** - Optimized images and efficient API calls with caching
- ♿ **Accessibility** - Full keyboard navigation and screen reader support

## Live Demo

Visit the live application: [https://tig-company.github.io/pokedex-frontend/](https://tig-company.github.io/pokedex-frontend/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## CI/CD Pipeline

This project includes a complete CI/CD pipeline with GitHub Actions:

### Continuous Integration (CI)

- **Triggers**: On all pull requests to main branch
- **Node.js Versions**: Tests on Node.js 18.x and 20.x
- **Steps**:
  - Dependency installation with caching
  - ESLint code quality checks
  - Application build verification
  - Artifact upload for successful builds

### Continuous Deployment (CD)

- **Triggers**: On pushes to main branch
- **Target**: GitHub Pages
- **Process**:
  - Automated build with Next.js static export
  - Quality checks (linting)
  - Deployment to GitHub Pages with proper permissions

### Status Monitoring

- Build status badges show current pipeline health
- Failed builds prevent deployment
- Automated rollback on deployment failures

## Deployment

This application is automatically deployed to GitHub Pages via GitHub Actions. Every push to the main branch triggers a new deployment after successful CI checks.

**Live URL**: [https://tig-company.github.io/pokedex-frontend/](https://tig-company.github.io/pokedex-frontend/)

### Manual Deployment

To deploy manually or to other platforms:

```bash
npm run build  # Creates static export in 'out' directory
```

The generated `out` directory can be deployed to any static hosting service.
