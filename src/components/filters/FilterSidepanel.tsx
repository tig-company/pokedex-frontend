'use client';

import { useState } from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { type PokemonFilters, defaultFilters } from '@/lib/pokemon-api';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';
import { StatsFilter } from './StatsFilter';
import { PhysicalAttributesFilter } from './PhysicalAttributesFilter';

interface FilterSidepanelProps {
  filters: PokemonFilters;
  onFiltersChange: (filters: PokemonFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  resultsCount?: number;
}

export function FilterSidepanel({
  filters,
  onFiltersChange,
  isOpen,
  onClose,
  resultsCount,
}: FilterSidepanelProps) {
  const [activeSection, setActiveSection] = useState<string | null>('types');

  const handleTypesChange = (types: string[]) => {
    onFiltersChange({ ...filters, types });
  };

  const handleGenerationChange = (generation: number | null) => {
    onFiltersChange({ ...filters, generation });
  };

  const handleStatsChange = (statName: string, value: { min: number; max: number }) => {
    onFiltersChange({
      ...filters,
      stats: { ...filters.stats, [statName]: value },
    });
  };

  const handleHeightChange = (height: { min: number; max: number }) => {
    onFiltersChange({ ...filters, height });
  };

  const handleWeightChange = (weight: { min: number; max: number }) => {
    onFiltersChange({ ...filters, weight });
  };

  const resetFilters = () => {
    onFiltersChange(defaultFilters);
    setActiveSection('types');
  };

  const hasActiveFilters = () => {
    return (
      filters.types.length > 0 ||
      filters.generation !== null ||
      JSON.stringify(filters.stats) !== JSON.stringify(defaultFilters.stats) ||
      JSON.stringify(filters.height) !== JSON.stringify(defaultFilters.height) ||
      JSON.stringify(filters.weight) !== JSON.stringify(defaultFilters.weight)
    );
  };

  const sections = [
    { id: 'types', label: 'Types', component: TypeFilter },
    { id: 'generation', label: 'Generation', component: GenerationFilter },
    { id: 'stats', label: 'Stats', component: StatsFilter },
    { id: 'physical', label: 'Physical', component: PhysicalAttributesFilter },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidepanel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 
                   shadow-xl transform transition-transform duration-300 ease-in-out z-50
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                   lg:relative lg:translate-x-0 lg:shadow-none lg:border-r 
                   lg:border-gray-200 lg:dark:border-gray-700`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {resultsCount !== undefined && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {resultsCount} results
              </span>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 
                         dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close filters"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters()}
            className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                       bg-gray-100 dark:bg-gray-800 rounded-lg
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          >
            Reset All Filters
          </button>
        </div>

        {/* Filter sections */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Section navigation */}
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(
                    activeSection === section.id ? null : section.id
                  )}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors
                             ${activeSection === section.id
                               ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                               : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                             }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Active section content */}
            <div className="space-y-6">
              {activeSection === 'types' && (
                <TypeFilter
                  selectedTypes={filters.types}
                  onTypesChange={handleTypesChange}
                />
              )}
              
              {activeSection === 'generation' && (
                <GenerationFilter
                  selectedGeneration={filters.generation}
                  onGenerationChange={handleGenerationChange}
                />
              )}
              
              {activeSection === 'stats' && (
                <StatsFilter
                  stats={filters.stats}
                  onStatsChange={handleStatsChange}
                />
              )}
              
              {activeSection === 'physical' && (
                <PhysicalAttributesFilter
                  height={filters.height}
                  weight={filters.weight}
                  onHeightChange={handleHeightChange}
                  onWeightChange={handleWeightChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters() && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Active Filters:
            </h4>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              {filters.types.length > 0 && (
                <div>Types: {filters.types.join(', ')}</div>
              )}
              {filters.generation !== null && (
                <div>Generation: {filters.generation}</div>
              )}
              {resultsCount !== undefined && (
                <div className="font-medium text-blue-600 dark:text-blue-400 mt-2">
                  {resultsCount} Pokémon match your filters
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}