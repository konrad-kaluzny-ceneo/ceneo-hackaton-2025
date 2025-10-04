import { AttractionSearchResult } from './types';
import { SimilaritySearchService } from './SimilaritySearchService';
import { LocationService } from './LocationService';

export class AttractionSearchService {
  private similaritySearchService: SimilaritySearchService;
  private locationService: LocationService;

  constructor() {
    this.similaritySearchService = new SimilaritySearchService();
    this.locationService = new LocationService();
  }

  async searchAttractions(query: string, limit: number = 3): Promise<AttractionSearchResult[]> {
    console.log(`Searching for attractions similar to: "${query}"`);

    const locations = await this.locationService.loadLocations();
    console.log(`Loaded ${locations.length} locations`);

    if (!this.locationService.hasEmbeddings(locations)) {
      throw new Error('No embeddings found. Please run generate-embeddings first.');
    }

    await this.similaritySearchService.loadAttractions(locations);
    const results = await this.similaritySearchService.searchSimilarAttractions(query, limit);

    console.log(`Found ${results.length} similar attractions`);
    return results;
  }
}
