import { Attraction, LocationWithDetails } from '@/types/location';
import { AttractionSearchResult, LocationWithEmbeddings } from './types';
import { EmbeddingService } from './EmbeddingService';

interface AttractionDocument {
    id: string;
    name: string;
    description: string;
    price: number;
    locationId: string;
    city: string;
    country: string;
    embedding: number[];
}

/**
 * In-Memory Similarity Search Service
 * Uses vector embeddings to find similar attractions without external dependencies
 */
export class SimilaritySearchService {
    private embeddingService: EmbeddingService;
    private attractionsCache: AttractionDocument[] = [];

    constructor() {
        this.embeddingService = EmbeddingService.getInstance();
    }

    /**
     * Load attractions from locations data into memory
     * @param locations Array of locations with attractions
     */
    public async loadAttractions(locations: LocationWithEmbeddings[]): Promise<void> {
        console.log('Loading attractions into memory...');

        // Clear existing cache
        this.attractionsCache = [];
        let attractionCount = 0;

        for (const location of locations) {
            for (const attraction of location.attractions) {
                // Skip attractions without embeddings
                if (!attraction.embedding || attraction.embedding.length === 0) {
                    console.warn(`Skipping attraction "${attraction.name}" - no embedding`);
                    continue;
                }

                const doc: AttractionDocument = {
                    id: `${location.id}-${attractionCount}`,
                    name: attraction.name,
                    description: attraction.description,
                    price: attraction.price,
                    locationId: location.id,
                    city: location.location.city,
                    country: location.location.country,
                    embedding: attraction.embedding,
                };

                this.attractionsCache.push(doc);
                attractionCount++;
            }
        }

        console.log(`Loaded ${attractionCount} attractions into memory`);
    }

    /**
     * Search for attractions similar to the query using cosine similarity
     * @param query The search query text
     * @param limit Number of results to return (default: 3)
     * @returns Array of similar attractions with scores
     */
    public async searchSimilarAttractions(
        query: string,
        limit: number = 3
    ): Promise<AttractionSearchResult[]> {
        if (this.attractionsCache.length === 0) {
            throw new Error('No attractions loaded. Call loadAttractions first.');
        }

        // Generate embedding for the query
        console.log(`Generating embedding for query: "${query}"`);
        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
        console.log(`Query embedding: ${queryEmbedding.length} dimensions`);
        console.log(`Searching through ${this.attractionsCache.length} attractions`);

        // Compute similarity scores for all attractions
        const resultsWithScores = this.attractionsCache.map((doc) => {
            const similarity = EmbeddingService.cosineSimilarity(queryEmbedding, doc.embedding);
            return {
                attraction: {
                    name: doc.name,
                    description: doc.description,
                    price: doc.price,
                    images: [],
                },
                locationId: doc.locationId,
                city: doc.city,
                country: doc.country,
                score: similarity,
            };
        });

        // Sort by similarity score (highest first) and return top N
        const sortedResults = resultsWithScores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        console.log(`Top ${sortedResults.length} results:`);
        sortedResults.forEach((r, i) => {
            console.log(`  ${i + 1}. ${r.attraction.name} (${r.city}) - score: ${r.score.toFixed(4)}`);
        });

        return sortedResults;
    }

    /**
     * Clear the cache
     */
    public clear(): void {
        this.attractionsCache = [];
        console.log('Cache cleared');
    }
}
