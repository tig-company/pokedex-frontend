const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonSprites {
  front_default: string | null;
  back_default: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: PokemonSprites;
  stats: PokemonStat[];
  types: PokemonType[];
}

export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
}

export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
  }
  return response.json();
}

export function getPokemonIdFromUrl(url: string): number {
  const matches = url.match(/\/pokemon\/(\d+)\//);
  return matches ? parseInt(matches[1], 10) : 0;
}

export interface SearchResult {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const searchCache = new Map<string, SearchResult[]>();
let abortController: AbortController | null = null;

export async function searchPokemon(query: string, limit = 5): Promise<SearchResult[]> {
  if (query.length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  if (searchCache.has(normalizedQuery)) {
    return searchCache.get(normalizedQuery)!.slice(0, limit);
  }

  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();

  try {
    const listResponse = await fetch(`${BASE_URL}/pokemon?limit=1000`, {
      signal: abortController.signal
    });
    
    if (!listResponse.ok) {
      throw new Error('Failed to fetch Pokemon list for search');
    }
    
    const { results } = await listResponse.json() as PokemonListResponse;
    
    const matchingPokemon = results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(normalizedQuery)
    ).slice(0, limit);

    const searchResults = await Promise.all(
      matchingPokemon.map(async (pokemon) => {
        const id = getPokemonIdFromUrl(pokemon.url);
        const details = await getPokemon(id);
        return {
          id,
          name: pokemon.name,
          image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default || '',
          types: details.types.map(t => t.type.name)
        };
      })
    );

    searchCache.set(normalizedQuery, searchResults);
    return searchResults;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return [];
    }
    throw error;
  }
}

export function debounce<T extends unknown[]>(
  func: (...args: T) => void | Promise<void>,
  delay: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function clearSearchCache(): void {
  searchCache.clear();
}