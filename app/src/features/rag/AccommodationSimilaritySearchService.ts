import { Accommodation } from '@/types/accommodation';
import { AccommodationSearchResult, AccommodationWithEmbeddings } from './types';
import { EmbeddingService } from './EmbeddingService';

interface AccommodationDocument {
    id: string;
    locationId: string;
    name: string;
    description: string;
    price: number;
    beds: number;
    date: string;
    images: string[];
    embedding: number[];
}

/**
 * In-Memory Similarity Search Service for Accommodations
 * Uses vector embeddings to find similar accommodations
 */
export class AccommodationSimilaritySearchService {
    private embeddingService: EmbeddingService;
    private accommodationsCache: AccommodationDocument[] = [];

    constructor() {
        this.embeddingService = EmbeddingService.getInstance();
    }

    /**
     * Load accommodations into memory
     * @param accommodations Array of accommodations with embeddings
     */
    public async loadAccommodations(accommodations: AccommodationWithEmbeddings[]): Promise<void> {
        console.log('Loading accommodations into memory...');

        // Clear existing cache
        this.accommodationsCache = [];
        let accommodationCount = 0;

        for (const accommodation of accommodations) {
            // Skip accommodations without embeddings
            if (!accommodation.embedding || accommodation.embedding.length === 0) {
                continue;
            }

            const doc: AccommodationDocument = {
                id: accommodation.id,
                locationId: accommodation.locationId,
                name: accommodation.name,
                description: accommodation.description,
                price: accommodation.price,
                beds: accommodation.beds,
                date: accommodation.date,
                images: accommodation.images,
                embedding: accommodation.embedding,
            };

            this.accommodationsCache.push(doc);
            accommodationCount++;
        }

        console.log(`Loaded ${accommodationCount} accommodations into memory`);
    }

    /**
     * Search for accommodations similar to the query using cosine similarity
     * @param query The search query text
     * @param limit Number of results to return (default: 3)
     * @returns Array of similar accommodations with scores
     */
    public async searchSimilarAccommodations(
        query: string,
        limit: number = 3
    ): Promise<AccommodationSearchResult[]> {
        if (this.accommodationsCache.length === 0) {
            throw new Error('No accommodations loaded. Call loadAccommodations first.');
        }

        // Generate embedding for the query
        console.log(`Generating embedding for query: "${query}"`);
        const queryEmbedding = await this.embeddingService.generateEmbedding(query);
        console.log(`Query embedding: ${queryEmbedding.length} dimensions`);
        console.log(`Searching through ${this.accommodationsCache.length} accommodations`);

        // Compute similarity scores for all accommodations
        const resultsWithScores = this.accommodationsCache.map((doc) => {
            const similarity = EmbeddingService.cosineSimilarity(queryEmbedding, doc.embedding);
            return {
                accommodation: {
                    id: doc.id,
                    locationId: doc.locationId,
                    name: doc.name,
                    description: doc.description,
                    price: doc.price,
                    beds: doc.beds,
                    date: doc.date,
                    images: doc.images,
                },
                score: similarity,
            };
        });

        // Sort by similarity score (descending) and limit results
        const topResults = resultsWithScores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);

        console.log(`Top ${topResults.length} results:`);
        topResults.forEach((result, idx) => {
            console.log(`  ${idx + 1}. ${result.accommodation.name} (score: ${result.score.toFixed(4)})`);
        });

        return topResults;
    }
}
