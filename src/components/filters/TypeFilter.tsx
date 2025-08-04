'use client';

import { MultiSelect } from '@/components/ui/MultiSelect';
import { POKEMON_TYPES } from '@/lib/pokemon-api';

interface TypeFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const getTypeColor = (type: string): string => {
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

export function TypeFilter({ selectedTypes, onTypesChange }: TypeFilterProps) {
  const typeOptions = POKEMON_TYPES.map(type => ({
    value: type,
    label: type,
    color: getTypeColor(type),
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Pokémon Types
      </h3>

      <MultiSelect
        options={typeOptions}
        value={selectedTypes}
        onChange={onTypesChange}
        placeholder="Select types..."
        label="Filter by type"
        maxDisplayedItems={2}
      />

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {selectedTypes.length === 0
          ? 'No type filters applied'
          : `Filtering by ${selectedTypes.length} type${selectedTypes.length > 1 ? 's' : ''}`}
      </div>
    </div>
  );
}
