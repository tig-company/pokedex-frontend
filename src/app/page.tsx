import { PokemonList } from '@/components/PokemonList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Pokédex
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover and explore the world of Pokémon
          </p>
        </header>
        
        <main>
          <PokemonList />
        </main>
      </div>
    </div>
  );
}
