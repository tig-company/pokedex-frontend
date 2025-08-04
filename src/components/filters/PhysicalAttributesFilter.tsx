'use client';

import { RangeSlider } from '@/components/ui/RangeSlider';

interface PhysicalAttributesFilterProps {
  height: { min: number; max: number };
  weight: { min: number; max: number };
  onHeightChange: (value: { min: number; max: number }) => void;
  onWeightChange: (value: { min: number; max: number }) => void;
}

export function PhysicalAttributesFilter({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: PhysicalAttributesFilterProps) {
  const formatHeight = (value: number): string => {
    const meters = value / 10;
    const feet = Math.floor(meters * 3.28084);
    const inches = Math.round((meters * 3.28084 - feet) * 12);
    return `${meters.toFixed(1)}m (${feet}'${inches}")`;
  };

  const formatWeight = (value: number): string => {
    const kg = value / 10;
    const lbs = Math.round(kg * 2.20462);
    return `${kg.toFixed(1)}kg (${lbs}lbs)`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Physical Attributes
      </h3>

      <div className="space-y-4">
        <RangeSlider
          min={0}
          max={100}
          value={height}
          label="Height"
          onChange={onHeightChange}
          formatValue={formatHeight}
          step={1}
        />

        <RangeSlider
          min={0}
          max={1000}
          value={weight}
          label="Weight"
          onChange={onWeightChange}
          formatValue={formatWeight}
          step={1}
        />
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>Filter Pokémon by their physical characteristics.</p>
        <p>
          Heights range from {formatHeight(height.min)} to{' '}
          {formatHeight(height.max)}.
        </p>
        <p>
          Weights range from {formatWeight(weight.min)} to{' '}
          {formatWeight(weight.max)}.
        </p>
      </div>
    </div>
  );
}
