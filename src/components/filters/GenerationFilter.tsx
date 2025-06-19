'use client';

import { POKEMON_GENERATIONS } from '@/lib/pokemon-api';

interface GenerationFilterProps {
  selectedGeneration: number | null;
  onGenerationChange: (generation: number | null) => void;
}

export function GenerationFilter({ selectedGeneration, onGenerationChange }: GenerationFilterProps) {
  const generations = Object.entries(POKEMON_GENERATIONS).map(([gen, data]) => ({
    value: parseInt(gen),
    label: data.name,
    range: `#${data.range[0]} - #${data.range[1]}`,
  }));

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Generation
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            id="generation-all"
            type="radio"
            name="generation"
            checked={selectedGeneration === null}
            onChange={() => onGenerationChange(null)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                       focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                       focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label 
            htmlFor="generation-all" 
            className="ml-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            All Generations
          </label>
        </div>
        
        {generations.map((gen) => (
          <div key={gen.value} className="flex items-center">
            <input
              id={`generation-${gen.value}`}
              type="radio"
              name="generation"
              checked={selectedGeneration === gen.value}
              onChange={() => onGenerationChange(gen.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                         focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label 
              htmlFor={`generation-${gen.value}`} 
              className="ml-2 text-sm text-gray-900 dark:text-white cursor-pointer flex-1"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{gen.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {gen.range}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {selectedGeneration === null
          ? 'Showing all generations'
          : `Showing only ${POKEMON_GENERATIONS[selectedGeneration as keyof typeof POKEMON_GENERATIONS]?.name || 'Unknown'}`
        }
      </div>
    </div>
  );
}