'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPokemonList, getPokemon, getPokemonIdFromUrl, type PokemonListItem } from '@/lib/pokemon-api';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface PokemonWithDetails extends PokemonListItem {
  id: number;
  image: string;
  types: string[];
}

interface PokemonListProps {
  searchQuery?: string;
}

export function PokemonList({ searchQuery = '' }: PokemonListProps) {
  const [pokemon, setPokemon] = useState<PokemonWithDetails[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPokemon = async (currentOffset: number) => {
    try {
      setLoading(true);
      const listResponse = await getPokemonList(20, currentOffset);
      
      const pokemonWithDetails = await Promise.all(
        listResponse.results.map(async (item: PokemonListItem) => {
          const id = getPokemonIdFromUrl(item.url);
          const details = await getPokemon(id);
          return {
            ...item,
            id,
            image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default || '',
            types: details.types.map(t => t.type.name)
          };
        })
      );

      if (currentOffset === 0) {
        setPokemon(pokemonWithDetails);
      } else {
        setPokemon(prev => [...prev, ...pokemonWithDetails]);
      }
      
      setHasMore(listResponse.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Pokemon');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPokemon(0);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter(poke => 
        poke.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poke.types.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPokemon(filtered);
    }
  }, [searchQuery, pokemon]);

  const loadMore = () => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    loadPokemon(newOffset);
  };

  const sentinelRef = useInfiniteScroll(loadMore, {
    hasMore: hasMore && !searchQuery.trim(),
    loading,
    threshold: 100,
  });

  const displayPokemon = filteredPokemon;
  const isSearchActive = searchQuery.trim().length > 0;
  const showInfiniteScroll = !isSearchActive && hasMore;

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg">Error: {error}</p>
        <button 
          onClick={() => loadPokemon(0)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {isSearchActive && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {displayPokemon.length === 0 ? (
              `No Pokémon found matching "${searchQuery}"`
            ) : (
              `Found ${displayPokemon.length} Pokémon matching "${searchQuery}"`
            )}
          </p>
        </div>
      )}

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        role="grid"
        aria-label="Pokemon list"
      >
        {displayPokemon.map((poke) => (
          <Link
            key={poke.id}
            href={`/pokemon/${poke.id}`}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-4">
              <div className="relative h-32 mb-3">
                {poke.image && (
                  <Image
                    src={poke.image}
                    alt={poke.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  #{poke.id.toString().padStart(3, '0')}
                </p>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize mb-2">
                  {poke.name}
                </h3>
                
                <div className="flex flex-wrap justify-center gap-1">
                  {poke.types.map((type) => (
                    <span
                      key={type}
                      className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getTypeColor(type)}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showInfiniteScroll && (
        <div 
          ref={sentinelRef}
          className="flex justify-center items-center py-12"
          aria-label="Loading more Pokemon"
          role="status"
          aria-live="polite"
        >
          {loading && (
            <>
              <div 
                className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                aria-hidden="true"
              ></div>
              <p className="ml-4 text-gray-600 dark:text-gray-400">Loading more Pokémon...</p>
            </>
          )}
        </div>
      )}

      {!loading && !hasMore && !isSearchActive && (
        <div 
          className="text-center mt-12"
          role="status"
          aria-live="polite"
        >
          <p className="text-gray-600 dark:text-gray-400">
            You&apos;ve seen all the Pokémon! 🎉
          </p>
        </div>
      )}
    </div>
  );
}