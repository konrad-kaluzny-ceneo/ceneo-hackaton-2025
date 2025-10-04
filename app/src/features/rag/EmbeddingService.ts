import { pipeline, env } from '@xenova/transformers';

// Disable local model storage in browser-like environments
env.allowLocalModels = false;

/**
 * Embedding Service using Hugging Face's all-MiniLM-L6-v2 model
 * This service generates embeddings for text to enable semantic search
 */
export class EmbeddingService {
  private static instance: EmbeddingService;
  private embedder: any = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Initialize the embedding model
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('Loading all-MiniLM-L6-v2 model...');
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    this.isInitialized = true;
    console.log('Model loaded successfully');
  }

  /**
   * Generate embedding for a given text
   * @param text The text to embed
   * @returns An array of numbers representing the embedding
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    await this.initialize();

    const output = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });

    // Convert tensor to array
    const embedding = Array.from(output.data) as number[];
    return embedding;
  }

  /**
   * Generate embeddings for multiple texts in batch
   * @param texts Array of texts to embed
   * @returns Array of embeddings
   */
  public async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }

    return embeddings;
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param embedding1 First embedding vector
   * @param embedding2 Second embedding vector
   * @returns Similarity score between 0 and 1
   */
  public static cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}
