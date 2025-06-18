# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 Pokédex application using the App Router with the following structure:

### Core Components
- **Pokemon API Layer** (`src/lib/pokemon-api.ts`): Centralized API client for PokeAPI with TypeScript interfaces
- **Pokemon List** (`src/components/PokemonList.tsx`): Client-side component with infinite scroll, type badges, and image optimization
- **Pokemon Detail** (`src/app/pokemon/[id]/page.tsx`): Server-side rendered individual Pokemon pages with stats visualization

### Key Architecture Patterns
- **API Integration**: Uses PokeAPI (https://pokeapi.co/api/v2) for Pokemon data
- **Image Optimization**: Next.js Image component configured for GitHub raw content (pokemon sprites)
- **Type System**: Comprehensive TypeScript interfaces for Pokemon data structures
- **UI Framework**: Tailwind CSS with dark mode support and responsive design
- **State Management**: React hooks for client-side state (no external state library)

### Data Flow
1. `PokemonList` fetches paginated Pokemon list from PokeAPI
2. For each Pokemon, fetches detailed data including sprites and types
3. Pokemon cards link to dynamic routes `/pokemon/[id]`
4. Detail pages server-render individual Pokemon data with stats and imagery

### Styling Conventions
- Tailwind CSS classes with dark mode variants
- Type-based color coding system for Pokemon types
- Responsive grid layouts (1-5 columns based on screen size)
- Gradient backgrounds and card-based UI components