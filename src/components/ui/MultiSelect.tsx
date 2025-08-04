'use client';

import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
  color?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  maxDisplayedItems?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  label,
  maxDisplayedItems = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveItem = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(option =>
    value.includes(option.value),
  );
  const displayedItems = selectedOptions.slice(0, maxDisplayedItems);
  const remainingCount = selectedOptions.length - maxDisplayedItems;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full min-h-[42px] px-3 py-2 text-left bg-white dark:bg-gray-800
                     border border-gray-300 dark:border-gray-600 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap gap-1 min-h-[26px] items-center">
            {selectedOptions.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400">
                {placeholder}
              </span>
            ) : (
              <>
                {displayedItems.map(option => (
                  <span
                    key={option.value}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium 
                               text-white rounded-full ${option.color || 'bg-blue-500'}`}
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveItem(option.value);
                      }}
                      className="ml-1 hover:text-gray-200"
                      aria-label={`Remove ${option.label}`}
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span
                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400
                                   bg-gray-100 dark:bg-gray-700 rounded-full"
                  >
                    +{remainingCount} more
                  </span>
                )}
              </>
            )}
          </div>

          <ChevronDownIcon
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 
                       text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800
                          border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg
                          max-h-60 overflow-y-auto"
          >
            {options.map(option => {
              const isSelected = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleToggleOption(option.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
                             transition-colors flex items-center justify-between
                             ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-2">
                    {option.color && (
                      <div
                        className={`w-4 h-4 rounded-full ${option.color}`}
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-gray-900 dark:text-white capitalize">
                      {option.label}
                    </span>
                  </div>

                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500
                                    flex items-center justify-center"
                    >
                      <svg
                        className="w-2 h-2 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
