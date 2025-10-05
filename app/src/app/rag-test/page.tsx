'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AttractionResult {
  attraction: {
    name: string;
    description: string;
    price: number;
  };
  locationId: string;
  city: string;
  country: string;
  score: number;
}

export default function RAGTestPage() {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(3);
  const [results, setResults] = useState<AttractionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleGenerateEmbeddings = async () => {
    setGenerating(true);
    setError('');
    setStats(null);

    try {
      const response = await fetch('/api/rag/generate-embeddings', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to generate embeddings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch('/api/rag/search-attractions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">RAG Attraction Search Test</h1>

      {/* Generate Embeddings Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Step 1: Generate Embeddings</h2>
        <p className="text-sm text-gray-600 mb-4">
          First, generate embeddings for all attractions. This only needs to be done once.
        </p>
        <Button 
          onClick={handleGenerateEmbeddings} 
          disabled={generating}
          aria-label={generating ? 'Generowanie osadzeń w toku...' : 'Generuj osadzenia dla wszystkich atrakcji'}
        >
          {generating ? 'Generating...' : 'Generate Embeddings'}
        </Button>

        {stats && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded" role="status" aria-live="polite">
            <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
            <ul className="text-sm text-green-700">
              <li>Locations processed: {stats.locationsProcessed}</li>
              <li>Embeddings generated: {stats.embeddingsGenerated}</li>
              <li>Embeddings skipped: {stats.embeddingsSkipped}</li>
              <li>Total attractions: {stats.totalAttractions}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Step 2: Search for Similar Attractions</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="search-query" className="block text-sm font-medium mb-2">Search Query</label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., medieval castles and historical architecture"
              className="w-full px-3 py-2 border rounded-md"
              aria-describedby="search-query-help"
            />
            <p id="search-query-help" className="text-xs text-gray-500 mt-1">
              Wpisz opis atrakcji, które chcesz znaleźć
            </p>
          </div>

          <div>
            <label htmlFor="results-limit" className="block text-sm font-medium mb-2">Number of Results</label>
            <input
              id="results-limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 3)}
              min="1"
              max="20"
              className="w-32 px-3 py-2 border rounded-md"
              aria-describedby="results-limit-help"
            />
            <p id="results-limit-help" className="text-xs text-gray-500 mt-1">
              Liczba wyników do wyświetlenia (1-20)
            </p>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading || !query.trim()}
            aria-label={loading ? 'Wyszukiwanie w toku...' : 'Wyszukaj podobne atrakcje'}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Example Queries */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Example queries:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'medieval castles and historical architecture',
              'beaches and water activities',
              'museums and art galleries',
              'nature and mountain hiking',
              'religious monuments and churches',
            ].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setQuery(example)}
                aria-label={`Użyj przykładowego zapytania: ${example}`}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded" role="alert" aria-live="polite">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results.length > 0 && (
        <section className="space-y-4" aria-label="Wyniki wyszukiwania">
          <h2 className="text-xl font-semibold">Results ({results.length})</h2>
          {results.map((result, index) => (
            <article key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{result.attraction.name}</h3>
                <span 
                  className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  aria-label={`Dopasowanie: ${(result.score * 100).toFixed(1)} procent`}
                >
                  Score: {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-600 mb-2">{result.attraction.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span aria-label={`Lokalizacja: ${result.city}, ${result.country}`}>
                  📍 {result.city}, {result.country}
                </span>
                <span aria-label={`Cena: ${result.attraction.price === 0 ? 'Darmowe' : `${result.attraction.price} PLN`}`}>
                  💰 {result.attraction.price === 0 ? 'Free' : `${result.attraction.price} PLN`}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
