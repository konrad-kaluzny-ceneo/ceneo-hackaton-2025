import { AccommodationSearchResult } from './types';
import { AccommodationSimilaritySearchService } from './AccommodationSimilaritySearchService';
import { AccommodationService } from './AccommodationService';

export class AccommodationSearchService {
  private similaritySearchService: AccommodationSimilaritySearchService;
  private accommodationService: AccommodationService;

  constructor() {
    this.similaritySearchService = new AccommodationSimilaritySearchService();
    this.accommodationService = new AccommodationService();
  }

  async searchAccommodations(query: string, limit: number = 3): Promise<AccommodationSearchResult[]> {
    console.log(`Searching for accommodations similar to: "${query}"`);

    const accommodations = await this.accommodationService.loadAccommodations();
    console.log(`Loaded ${accommodations.length} accommodations`);

    if (!this.accommodationService.hasEmbeddings(accommodations)) {
      throw new Error('No embeddings found. Please run generate-embeddings for accommodations first.');
    }

    await this.similaritySearchService.loadAccommodations(accommodations);
    const results = await this.similaritySearchService.searchSimilarAccommodations(query, limit);

    console.log(`Found ${results.length} similar accommodations`);
    return results;
  }
}
