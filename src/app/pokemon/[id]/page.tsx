import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPokemon, type Pokemon } from '@/lib/pokemon-api';

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Generate static params for the first 151 Pokemon (original set)
  return Array.from({ length: 151 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Test

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;

  let pokemon: Pokemon;

  try {
    pokemon = await getPokemon(id);
  } catch {
    notFound();
  }

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

  const getStatColor = (stat: number) => {
    if (stat >= 100) return 'bg-green-500';
    if (stat >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-8 transition-colors"
        >
          ← Back to Pokédex
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
              <div className="text-center">
                <div className="relative h-64 w-64 mx-auto mb-6">
                  <Image
                    src={
                      pokemon.sprites.other['official-artwork'].front_default ||
                      pokemon.sprites.front_default ||
                      ''
                    }
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <h1 className="text-4xl font-bold text-gray-800 dark:text-white capitalize mb-2">
                  {pokemon.name}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                  #{pokemon.id.toString().padStart(3, '0')}
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {pokemon.types.map(type => (
                    <span
                      key={type.type.name}
                      className={`px-4 py-2 text-sm font-semibold text-white rounded-full ${getTypeColor(type.type.name)}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Height
                      </p>
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">
                        {(pokemon.height / 10).toFixed(1)} m
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Weight
                      </p>
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Base Experience
                      </p>
                      <p className="text-xl font-semibold text-gray-800 dark:text-white">
                        {pokemon.base_experience} XP
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    Base Stats
                  </h2>
                  <div className="space-y-3">
                    {pokemon.stats.map(stat => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {stat.stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getStatColor(stat.base_stat)} transition-all duration-500`}
                            style={{
                              width: `${Math.min((stat.base_stat / 255) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
