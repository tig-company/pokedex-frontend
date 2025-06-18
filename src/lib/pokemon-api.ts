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

// Extended Pokemon interface for filtering
export interface PokemonWithDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  image: string;
  types: string[];
  stats: PokemonStat[];
  generation: number;
  totalStats: number;
}

// Filter interfaces
export interface PokemonFilters {
  types: string[];
  generation: number | null;
  stats: {
    hp: { min: number; max: number };
    attack: { min: number; max: number };
    defense: { min: number; max: number };
    specialAttack: { min: number; max: number };
    specialDefense: { min: number; max: number };
    speed: { min: number; max: number };
    total: { min: number; max: number };
  };
  height: { min: number; max: number };
  weight: { min: number; max: number };
}

export const defaultFilters: PokemonFilters = {
  types: [],
  generation: null,
  stats: {
    hp: { min: 0, max: 255 },
    attack: { min: 0, max: 255 },
    defense: { min: 0, max: 255 },
    specialAttack: { min: 0, max: 255 },
    specialDefense: { min: 0, max: 255 },
    speed: { min: 0, max: 255 },
    total: { min: 0, max: 780 },
  },
  height: { min: 0, max: 100 },
  weight: { min: 0, max: 1000 },
};

// Generation mappings (based on Pokemon ID ranges)
export const POKEMON_GENERATIONS = {
  1: { name: 'Generation I', range: [1, 151] },
  2: { name: 'Generation II', range: [152, 251] },
  3: { name: 'Generation III', range: [252, 386] },
  4: { name: 'Generation IV', range: [387, 493] },
  5: { name: 'Generation V', range: [494, 649] },
  6: { name: 'Generation VI', range: [650, 721] },
  7: { name: 'Generation VII', range: [722, 809] },
  8: { name: 'Generation VIII', range: [810, 905] },
  9: { name: 'Generation IX', range: [906, 1025] },
};

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function getPokemonGeneration(id: number): number {
  for (const [gen, data] of Object.entries(POKEMON_GENERATIONS)) {
    const [min, max] = data.range;
    if (id >= min && id <= max) {
      return parseInt(gen);
    }
  }
  return 1; // Default to Generation I
}

export function calculateTotalStats(stats: PokemonStat[]): number {
  return stats.reduce((total, stat) => total + stat.base_stat, 0);
}

export function getStatByName(stats: PokemonStat[], statName: string): number {
  const stat = stats.find(s => s.stat.name === statName);
  return stat ? stat.base_stat : 0;
}

// Enhanced Pokemon fetching with full details for filtering
export async function getPokemonWithDetails(id: number): Promise<PokemonWithDetails> {
  const pokemon = await getPokemon(id);
  
  return {
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    base_experience: pokemon.base_experience,
    image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || '',
    types: pokemon.types.map(t => t.type.name),
    stats: pokemon.stats,
    generation: getPokemonGeneration(pokemon.id),
    totalStats: calculateTotalStats(pokemon.stats),
  };
}

// Filtering function
export function filterPokemon(pokemon: PokemonWithDetails[], filters: PokemonFilters): PokemonWithDetails[] {
  return pokemon.filter(poke => {
    // Type filter
    if (filters.types.length > 0) {
      const hasMatchingType = filters.types.some(filterType => 
        poke.types.includes(filterType)
      );
      if (!hasMatchingType) return false;
    }

    // Generation filter
    if (filters.generation !== null && poke.generation !== filters.generation) {
      return false;
    }

    // Stats filters
    const hp = getStatByName(poke.stats, 'hp');
    const attack = getStatByName(poke.stats, 'attack');
    const defense = getStatByName(poke.stats, 'defense');
    const specialAttack = getStatByName(poke.stats, 'special-attack');
    const specialDefense = getStatByName(poke.stats, 'special-defense');
    const speed = getStatByName(poke.stats, 'speed');

    if (hp < filters.stats.hp.min || hp > filters.stats.hp.max) return false;
    if (attack < filters.stats.attack.min || attack > filters.stats.attack.max) return false;
    if (defense < filters.stats.defense.min || defense > filters.stats.defense.max) return false;
    if (specialAttack < filters.stats.specialAttack.min || specialAttack > filters.stats.specialAttack.max) return false;
    if (specialDefense < filters.stats.specialDefense.min || specialDefense > filters.stats.specialDefense.max) return false;
    if (speed < filters.stats.speed.min || speed > filters.stats.speed.max) return false;
    if (poke.totalStats < filters.stats.total.min || poke.totalStats > filters.stats.total.max) return false;

    // Physical attributes
    if (poke.height < filters.height.min || poke.height > filters.height.max) return false;
    if (poke.weight < filters.weight.min || poke.weight > filters.weight.max) return false;

    return true;
  });
}