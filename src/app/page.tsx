'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { PokemonList } from '@/components/PokemonList';
import { SearchBar } from '@/components/SearchBar';
import { FilterSidepanel } from '@/components/filters/FilterSidepanel';
import { useFilters } from '@/hooks/useFilters';
import { type SearchResult, type PokemonWithDetails, getPokemonList, getPokemonWithDetails, getPokemonIdFromUrl } from '@/lib/pokemon-api';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allPokemon, setAllPokemon] = useState<PokemonWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const router = useRouter();

  const { filters, filteredPokemon, updateFilters, hasActiveFilters, resultsCount } = useFilters(allPokemon);

  // Load all Pokemon for filtering (first 151 for performance)
  useEffect(() => {
    const loadAllPokemon = async () => {
      try {
        setLoading(true);
        const listResponse = await getPokemonList(151, 0); // Load first 151 Pokemon
        
        const pokemonWithDetails = await Promise.all(
          listResponse.results.map(async (item) => {
            const id = getPokemonIdFromUrl(item.url);
            return await getPokemonWithDetails(id);
          })
        );
        
        setAllPokemon(pokemonWithDetails);
      } catch (error) {
        console.error('Failed to load Pokemon for filtering:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllPokemon();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectPokemon = (pokemon: SearchResult) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Filter Sidepanel */}
        <FilterSidepanel
          filters={filters}
          onFiltersChange={updateFilters}
          isOpen={isFilterPanelOpen}
          onClose={() => setIsFilterPanelOpen(false)}
          resultsCount={resultsCount}
        />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Pokédex
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Discover and explore the world of Pokémon
              </p>
            </header>
            
            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <SearchBar 
                    onSearch={handleSearch}
                    onSelectPokemon={handleSelectPokemon}
                    placeholder="Search Pokémon..."
                  />
                </div>
                
                <button
                  onClick={() => setIsFilterPanelOpen(true)}
                  className={`lg:hidden px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                             hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                             flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-blue-500' : ''}`}
                  aria-label="Open filters"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {resultsCount}
                    </span>
                  )}
                </button>
              </div>
              
              {hasActiveFilters && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {resultsCount} Pokémon match your current filters
                  </p>
                </div>
              )}
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className="ml-4 text-gray-600 dark:text-gray-400">Loading Pokémon...</p>
              </div>
            ) : (
              <main>
                <PokemonList 
                  searchQuery={searchQuery}
                  filteredPokemon={hasActiveFilters ? filteredPokemon : undefined}
                  isFiltering={hasActiveFilters}
                />
              </main>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
