import { ContextItem } from "@/types/context-item";
import { LocationWithDetails } from "@/types/location";
import fs from 'fs';
import OpenAI from 'openai';

interface Transport {
  id: string;
  fromLocationId: string;
  fromDate: string;
  toLocationId: string;
  toDate: string;
  price: number;
  name: string;
  type: string;
}

interface Accommodation {
  id: string;
  locationId: string;
  date: string;
  price: number;
  beds: number;
  name: string;
  description: string;
  images: string[];
}

/**
 * RAG Service - Retrieval-Augmented Generation with Vector Embeddings
 * Używa OpenAI embeddings do semantycznego wyszukiwania najbardziej relevantnych danych
 */
export class RAGService {
  private locations: LocationWithDetails[];
  private transport: Transport[];
  private accommodation: Accommodation[];
  private openai: OpenAI;
  
  // Cache dla embeddingów (żeby nie generować za każdym razem)
  private locationEmbeddings: Map<string, number[]> = new Map();
  private accommodationEmbeddings: Map<string, number[]> = new Map();

  constructor() {
    // Wczytaj dane z plików JSON
    const locationsRaw = fs.readFileSync('./src/local-data/locations.json', 'utf-8');
    const transportRaw = fs.readFileSync('./src/local-data/transport.json', 'utf-8');
    const accommodationRaw = fs.readFileSync('./src/local-data/accomodation.json', 'utf-8');

    this.locations = JSON.parse(locationsRaw);
    this.transport = JSON.parse(transportRaw);
    this.accommodation = JSON.parse(accommodationRaw);
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Pobiera relevantne dane na podstawie kontekstu użytkownika używając vector embeddings
   */
  public async getRelevantData(userContext: ContextItem[], maxItems: number = 20): Promise<{
    locations: LocationWithDetails[];
    transport: Transport[];
    accommodation: Accommodation[];
  }> {
    // Stwórz query embedding z kontekstu użytkownika
    const userQuery = this.buildUserQuery(userContext);
    const queryEmbedding = await this.getEmbedding(userQuery);

    // Generuj embeddingi dla wszystkich lokacji (jeśli nie ma w cache)
    await this.ensureLocationEmbeddings();
    
    // Znajdź najbardziej podobne lokacje używając cosine similarity
    const scoredLocations = await Promise.all(
      this.locations.map(async (location) => {
        const locationEmbedding = this.locationEmbeddings.get(location.id)!;
        const similarity = this.cosineSimilarity(queryEmbedding, locationEmbedding);
        return { location, score: similarity };
      })
    );

    const topLocations = scoredLocations
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(item => item.location);

    // Pobierz IDs wybranych lokacji
    const selectedLocationIds = new Set(topLocations.map(l => l.id));

    // Filtruj transport - tylko dla wybranych lokacji
    const relevantTransport = this.transport
      .filter(t => 
        selectedLocationIds.has(t.fromLocationId) || 
        selectedLocationIds.has(t.toLocationId)
      )
      .slice(0, maxItems * 2);

    // Generuj embeddingi dla zakwaterowania
    await this.ensureAccommodationEmbeddings();
    
    const scoredAccommodation = await Promise.all(
      this.accommodation
        .filter(a => selectedLocationIds.has(a.locationId))
        .map(async (accommodation) => {
          const accEmbedding = this.accommodationEmbeddings.get(accommodation.id)!;
          const similarity = this.cosineSimilarity(queryEmbedding, accEmbedding);
          return { accommodation, score: similarity };
        })
    );

    const topAccommodation = scoredAccommodation
      .sort((a, b) => b.score - a.score)
      .slice(0, maxItems)
      .map(item => item.accommodation);

    return {
      locations: topLocations,
      transport: relevantTransport,
      accommodation: topAccommodation
    };
  }

  /**
   * Buduje query string z kontekstu użytkownika
   */
  private buildUserQuery(userContext: ContextItem[]): string {
    return userContext
      .map(item => `${item.question} ${item.answer}`)
      .join(' ');
  }

  /**
   * Pobiera embedding dla danego tekstu używając OpenAI API
   */
  private async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  }

  /**
   * Upewnia się, że wszystkie lokacje mają embeddingi
   */
  private async ensureLocationEmbeddings(): Promise<void> {
    const locationsToEmbed = this.locations.filter(
      loc => !this.locationEmbeddings.has(loc.id)
    );

    if (locationsToEmbed.length === 0) return;

    console.log(`Generating embeddings for ${locationsToEmbed.length} locations...`);

    // Batch embeddings dla wydajności
    const batchSize = 100;
    for (let i = 0; i < locationsToEmbed.length; i += batchSize) {
      const batch = locationsToEmbed.slice(i, i + batchSize);
      const texts = batch.map(loc => this.getLocationText(loc));
      
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
      });

      batch.forEach((loc, idx) => {
        this.locationEmbeddings.set(loc.id, response.data[idx].embedding);
      });
    }
  }

  /**
   * Upewnia się, że wszystkie zakwaterowania mają embeddingi
   */
  private async ensureAccommodationEmbeddings(): Promise<void> {
    const accommodationsToEmbed = this.accommodation.filter(
      acc => !this.accommodationEmbeddings.has(acc.id)
    );

    if (accommodationsToEmbed.length === 0) return;

    console.log(`Generating embeddings for ${accommodationsToEmbed.length} accommodations...`);

    const batchSize = 100;
    for (let i = 0; i < accommodationsToEmbed.length; i += batchSize) {
      const batch = accommodationsToEmbed.slice(i, i + batchSize);
      const texts = batch.map(acc => this.getAccommodationText(acc));
      
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
      });

      batch.forEach((acc, idx) => {
        this.accommodationEmbeddings.set(acc.id, response.data[idx].embedding);
      });
    }
  }

  /**
   * Tworzy tekst reprezentujący lokację (do embeddingu)
   */
  private getLocationText(location: LocationWithDetails): string {
    const { city, region, country } = location.location;
    const attractionsText = location.attractions
      .map(a => `${a.name}: ${a.description}`)
      .join('. ');
    
    const conditions = location.conditionsInMonth['10'];
    const conditionsText = conditions 
      ? `Temperature: ${conditions.temp}°C, Crowd level: ${conditions.density}/10`
      : '';

    return `${city}, ${region}, ${country}. ${attractionsText}. ${conditionsText}`;
  }

  /**
   * Tworzy tekst reprezentujący zakwaterowanie (do embeddingu)
   */
  private getAccommodationText(accommodation: Accommodation): string {
    return `${accommodation.name}. ${accommodation.description}. Price: ${accommodation.price} PLN. Beds: ${accommodation.beds}`;
  }

  /**
   * Oblicza cosine similarity między dwoma wektorami
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Formatuje dane do JSON dla AI
   */
  public formatForAI(data: {
    locations: LocationWithDetails[];
    transport: Transport[];
    accommodation: Accommodation[];
  }): {
    locations: string;
    transport: string;
    accommodation: string;
  } {
    return {
      locations: JSON.stringify(data.locations, null, 2),
      transport: JSON.stringify(data.transport, null, 2),
      accommodation: JSON.stringify(data.accommodation, null, 2)
    };
  }
}
