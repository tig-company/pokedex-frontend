'use client';

import { useState, useMemo } from 'react';
import {
  type PokemonFilters,
  type PokemonWithDetails,
  defaultFilters,
  filterPokemon,
} from '@/lib/pokemon-api';

export function useFilters(pokemon: PokemonWithDetails[]) {
  const [filters, setFilters] = useState<PokemonFilters>(defaultFilters);

  const filteredPokemon = useMemo(() => {
    return filterPokemon(pokemon, filters);
  }, [pokemon, filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const updateFilters = (newFilters: PokemonFilters) => {
    setFilters(newFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.types.length > 0 ||
      filters.generation !== null ||
      JSON.stringify(filters.stats) !== JSON.stringify(defaultFilters.stats) ||
      JSON.stringify(filters.height) !==
        JSON.stringify(defaultFilters.height) ||
      JSON.stringify(filters.weight) !== JSON.stringify(defaultFilters.weight)
    );
  }, [filters]);

  return {
    filters,
    filteredPokemon,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    resultsCount: filteredPokemon.length,
  };
}
