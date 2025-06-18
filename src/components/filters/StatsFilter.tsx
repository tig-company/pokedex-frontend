'use client';

import { RangeSlider } from '@/components/ui/RangeSlider';

interface StatsFilterProps {
  stats: {
    hp: { min: number; max: number };
    attack: { min: number; max: number };
    defense: { min: number; max: number };
    specialAttack: { min: number; max: number };
    specialDefense: { min: number; max: number };
    speed: { min: number; max: number };
    total: { min: number; max: number };
  };
  onStatsChange: (statName: string, value: { min: number; max: number }) => void;
}

export function StatsFilter({ stats, onStatsChange }: StatsFilterProps) {
  const statConfigs = [
    { key: 'hp', label: 'HP', min: 0, max: 255 },
    { key: 'attack', label: 'Attack', min: 0, max: 255 },
    { key: 'defense', label: 'Defense', min: 0, max: 255 },
    { key: 'specialAttack', label: 'Sp. Attack', min: 0, max: 255 },
    { key: 'specialDefense', label: 'Sp. Defense', min: 0, max: 255 },
    { key: 'speed', label: 'Speed', min: 0, max: 255 },
    { key: 'total', label: 'Total Stats', min: 0, max: 780 },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Base Stats
      </h3>
      
      <div className="space-y-4">
        {statConfigs.map((config) => (
          <RangeSlider
            key={config.key}
            min={config.min}
            max={config.max}
            value={stats[config.key as keyof typeof stats]}
            label={config.label}
            onChange={(value) => onStatsChange(config.key, value)}
            step={1}
          />
        ))}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>Adjust ranges to filter Pokémon by their base stats.</p>
        <p>Total stats range from {stats.total.min} to {stats.total.max}.</p>
      </div>
    </div>
  );
}