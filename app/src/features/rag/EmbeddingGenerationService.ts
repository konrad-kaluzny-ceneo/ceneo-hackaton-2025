import { LocationWithEmbeddings } from './types';
import { EmbeddingService } from './EmbeddingService';
import { LocationService } from './LocationService';

interface EmbeddingGenerationStats {
  locationsProcessed: number;
  embeddingsGenerated: number;
  embeddingsSkipped: number;
  totalAttractions: number;
}

export class EmbeddingGenerationService {
  private embeddingService: EmbeddingService;
  private locationService: LocationService;

  constructor() {
    this.embeddingService = EmbeddingService.getInstance();
    this.locationService = new LocationService();
  }

  async generateAndSaveEmbeddings(): Promise<EmbeddingGenerationStats> {
    console.log('Starting embedding generation process...');

    const locations = await this.locationService.loadLocations();
    console.log(`Loaded ${locations.length} locations`);

    let embeddingsGenerated = 0;
    let embeddingsSkipped = 0;

    for (const location of locations) {
      console.log(`Processing location: ${location.location.city}`);

      for (const attraction of location.attractions) {
        if (attraction.embedding && attraction.embedding.length > 0) {
          console.log(`  ✓ Skipping "${attraction.name}" - embedding exists`);
          embeddingsSkipped++;
          continue;
        }

        const text = `${attraction.name}. ${attraction.description}`;
        console.log(`  → Generating embedding for "${attraction.name}"...`);

        try {
          const embedding = await this.embeddingService.generateEmbedding(text);
          attraction.embedding = embedding;
          embeddingsGenerated++;
          console.log(`  ✓ Generated embedding (${embedding.length} dimensions)`);
        } catch (error) {
          console.error(`  ✗ Failed to generate embedding for "${attraction.name}":`, error);
        }
      }
    }

    await this.locationService.saveLocations(locations);
    console.log('Embedding generation complete!');

    return {
      locationsProcessed: locations.length,
      embeddingsGenerated,
      embeddingsSkipped,
      totalAttractions: embeddingsGenerated + embeddingsSkipped,
    };
  }
}
