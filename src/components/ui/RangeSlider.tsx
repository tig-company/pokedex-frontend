'use client';

import { useState, useEffect } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  step?: number;
  label: string;
  onChange: (value: { min: number; max: number }) => void;
  formatValue?: (value: number) => string;
}

export function RangeSlider({
  min,
  max,
  value,
  step = 1,
  label,
  onChange,
  formatValue = (val) => val.toString(),
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (newMin: number) => {
    const updatedValue = {
      min: Math.min(newMin, localValue.max),
      max: localValue.max,
    };
    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  const handleMaxChange = (newMax: number) => {
    const updatedValue = {
      min: localValue.min,
      max: Math.max(newMax, localValue.min),
    };
    setLocalValue(updatedValue);
    onChange(updatedValue);
  };

  const minPercent = ((localValue.min - min) / (max - min)) * 100;
  const maxPercent = ((localValue.max - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatValue(localValue.min)} - {formatValue(localValue.max)}
        </span>
      </div>
      
      <div className="relative">
        <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-lg">
          {/* Track highlight */}
          <div
            className="absolute h-6 bg-blue-500 rounded-lg"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          />
          
          {/* Min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue.min}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer range-slider"
            style={{ zIndex: 1 }}
            aria-label={`${label} minimum value`}
          />
          
          {/* Max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue.max}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute w-full h-6 bg-transparent appearance-none cursor-pointer range-slider"
            style={{ zIndex: 2 }}
            aria-label={`${label} maximum value`}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      
      <style jsx global>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
        }
        
        .range-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          border: none;
        }
        
        .range-slider::-webkit-slider-track {
          background: transparent;
        }
        
        .range-slider::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}