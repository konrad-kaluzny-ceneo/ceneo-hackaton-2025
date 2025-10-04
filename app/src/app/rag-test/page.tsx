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

interface AccommodationResult {
  accommodation: {
    id: string;
    locationId: string;
    name: string;
    description: string;
    price: number;
    beds: number;
    date: string;
    images: string[];
  };
  score: number;
}

type SearchType = 'attractions' | 'accommodations';

export default function RAGTestPage() {
  const [searchType, setSearchType] = useState<SearchType>('attractions');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(3);
  const [attractionResults, setAttractionResults] = useState<AttractionResult[]>([]);
  const [accommodationResults, setAccommodationResults] = useState<AccommodationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingAccommodation, setGeneratingAccommodation] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [accommodationStats, setAccommodationStats] = useState<any>(null);

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

  const handleGenerateAccommodationEmbeddings = async () => {
    setGeneratingAccommodation(true);
    setError('');
    setAccommodationStats(null);

    try {
      const response = await fetch('/api/rag/generate-accommodation-embeddings', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setAccommodationStats(data.stats);
      } else {
        setError(data.error || 'Failed to generate accommodation embeddings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGeneratingAccommodation(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setAttractionResults([]);
    setAccommodationResults([]);

    try {
      const endpoint = searchType === 'attractions' 
        ? '/api/rag/search-attractions'
        : '/api/rag/search-accommodations';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit }),
      });

      const data = await response.json();

      if (data.success) {
        if (searchType === 'attractions') {
          setAttractionResults(data.results);
        } else {
          setAccommodationResults(data.results);
        }
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
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">RAG Search Test</h1>

      {/* Generate Embeddings Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Step 1: Generate Embeddings</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Attractions</h3>
            <p className="text-sm text-gray-600 mb-2">
              Generate embeddings for all attractions. This only needs to be done once.
            </p>
            <Button onClick={handleGenerateEmbeddings} disabled={generating}>
              {generating ? 'Generating...' : 'Generate Attraction Embeddings'}
            </Button>

            {stats && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
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

          <div>
            <h3 className="font-medium mb-2">Accommodations</h3>
            <p className="text-sm text-gray-600 mb-2">
              Generate embeddings for all accommodations. This only needs to be done once.
            </p>
            <Button onClick={handleGenerateAccommodationEmbeddings} disabled={generatingAccommodation}>
              {generatingAccommodation ? 'Generating...' : 'Generate Accommodation Embeddings'}
            </Button>

            {accommodationStats && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
                <ul className="text-sm text-green-700">
                  <li>Accommodations processed: {accommodationStats.accommodationsProcessed}</li>
                  <li>Embeddings generated: {accommodationStats.embeddingsGenerated}</li>
                  <li>Embeddings skipped: {accommodationStats.embeddingsSkipped}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Step 2: Search</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="attractions"
                  checked={searchType === 'attractions'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="mr-2"
                />
                Attractions
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="accommodations"
                  checked={searchType === 'accommodations'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                  className="mr-2"
                />
                Accommodations
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'attractions' 
                ? 'e.g., medieval castles and historical architecture'
                : 'e.g., luxury hotel with spa and pool'}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Results</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value) || 3)}
              min="1"
              max="20"
              className="w-32 px-3 py-2 border rounded-md"
            />
          </div>

          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Example Queries */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Example queries:</p>
          <div className="flex flex-wrap gap-2">
            {(searchType === 'attractions' ? [
              'medieval castles and historical architecture',
              'beaches and water activities',
              'museums and art galleries',
              'nature and mountain hiking',
              'religious monuments and churches',
            ] : [
              'luxury hotel with spa and pool',
              'budget-friendly hostel near city center',
              'family hotel with multiple beds',
              'modern design boutique hotel',
              'cozy apartment with garden view',
            ]).map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setQuery(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Attraction Results Display */}
      {attractionResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Attraction Results ({attractionResults.length})</h2>
          {attractionResults.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{result.attraction.name}</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Score: {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-600 mb-2">{result.attraction.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📍 {result.city}, {result.country}</span>
                <span>💰 {result.attraction.price === 0 ? 'Free' : `${result.attraction.price} PLN`}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accommodation Results Display */}
      {accommodationResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Accommodation Results ({accommodationResults.length})</h2>
          {accommodationResults.map((result, index) => (
            <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{result.accommodation.name}</h3>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Score: {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-gray-600 mb-2">{result.accommodation.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>💰 {result.accommodation.price.toFixed(2)} PLN</span>
                <span>🛏️ {result.accommodation.beds} beds</span>
                <span>📅 {result.accommodation.date}</span>
              </div>
              {result.accommodation.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {result.accommodation.images.slice(0, 2).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${result.accommodation.name} ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
