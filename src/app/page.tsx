'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PokemonList } from '@/components/PokemonList';
import { SearchBar } from '@/components/SearchBar';
import { type SearchResult } from '@/lib/pokemon-api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectPokemon = (pokemon: SearchResult) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Pokédex
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover and explore the world of Pokémon
          </p>
        </header>
        
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            onSelectPokemon={handleSelectPokemon}
            placeholder="Search Pokémon..."
          />
        </div>
        
        <main>
          <PokemonList searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}
