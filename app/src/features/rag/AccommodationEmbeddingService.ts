import { AccommodationWithEmbeddings } from './types';
import { EmbeddingService } from './EmbeddingService';
import { AccommodationService } from './AccommodationService';

interface EmbeddingGenerationStats {
  accommodationsProcessed: number;
  embeddingsGenerated: number;
  embeddingsSkipped: number;
}

export class AccommodationEmbeddingService {
  private embeddingService: EmbeddingService;
  private accommodationService: AccommodationService;

  constructor() {
    this.embeddingService = EmbeddingService.getInstance();
    this.accommodationService = new AccommodationService();
  }

  async generateAndSaveEmbeddings(): Promise<EmbeddingGenerationStats> {
    console.log('Starting accommodation embedding generation process...');

    const accommodations = await this.accommodationService.loadAccommodations();
    console.log(`Loaded ${accommodations.length} accommodations`);

    let embeddingsGenerated = 0;
    let embeddingsSkipped = 0;
    let processedCount = 0;

    for (const accommodation of accommodations) {
      if (accommodation.embedding && accommodation.embedding.length > 0) {
        embeddingsSkipped++;
        continue;
      }

      const text = `${accommodation.name}. ${accommodation.description}`;
      
      if (processedCount % 100 === 0) {
        console.log(`  → Processing accommodation ${processedCount + 1}/${accommodations.length}...`);
      }

      try {
        const embedding = await this.embeddingService.generateEmbedding(text);
        accommodation.embedding = embedding;
        embeddingsGenerated++;
      } catch (error) {
        console.error(`  ✗ Failed to generate embedding for "${accommodation.name}":`, error);
      }

      processedCount++;
    }

    await this.accommodationService.saveAccommodations(accommodations);
    console.log('Accommodation embedding generation complete!');

    return {
      accommodationsProcessed: accommodations.length,
      embeddingsGenerated,
      embeddingsSkipped,
    };
  }
}
