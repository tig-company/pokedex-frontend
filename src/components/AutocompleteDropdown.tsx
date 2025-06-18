'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type SearchResult } from '@/lib/pokemon-api';

interface AutocompleteDropdownProps {
  suggestions: SearchResult[];
  onSelect: (pokemon: SearchResult) => void;
  query: string;
}

export function AutocompleteDropdown({ suggestions, onSelect, query }: AutocompleteDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-white">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, suggestions, onSelect]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      id="autocomplete-dropdown"
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg 
                 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
      role="listbox"
      aria-label="Search suggestions"
    >
      {suggestions.map((pokemon, index) => (
        <button
          key={pokemon.id}
          onClick={() => onSelect(pokemon)}
          className={`w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 
                     dark:hover:bg-gray-700 transition-colors duration-150 text-left
                     ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                     ${index === 0 ? '' : 'border-t border-gray-100 dark:border-gray-700'}`}
          role="option"
          aria-selected={selectedIndex === index}
          tabIndex={-1}
        >
          <div className="flex-shrink-0 w-12 h-12 relative">
            {pokemon.image && (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                className="object-contain"
                sizes="48px"
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {highlightMatch(pokemon.name, query)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-1 ml-2">
                {pokemon.types.slice(0, 2).map((type) => (
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
        </button>
      ))}
    </div>
  );
}