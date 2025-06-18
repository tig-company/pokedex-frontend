'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { debounce, searchPokemon, type SearchResult } from '@/lib/pokemon-api';
import { AutocompleteDropdown } from './AutocompleteDropdown';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectPokemon: (pokemon: SearchResult) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onSelectPokemon, placeholder = "Search Pokémon..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchPokemon(searchQuery, 5);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
    
    if (newQuery.length >= 2) {
      setIsLoading(true);
      debouncedSearch(newQuery);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setIsLoading(false);
    onSearch('');
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (pokemon: SearchResult) => {
    setQuery(pokemon.name);
    setShowDropdown(false);
    onSelectPokemon(pokemon);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-sm hover:shadow-md transition-shadow duration-200"
          aria-label="Search Pokémon"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="autocomplete-dropdown"
          role="combobox"
        />
        
        {(query || isLoading) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isLoading ? (
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                aria-hidden="true"
                role="status"
                aria-label="Searching"
              />
            ) : (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                           transition-colors duration-200 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 rounded-full p-1"
                aria-label="Clear search"
                type="button"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      {showDropdown && (
        <AutocompleteDropdown
          suggestions={suggestions}
          onSelect={handleSelectSuggestion}
          query={query}
        />
      )}
    </div>
  );
}