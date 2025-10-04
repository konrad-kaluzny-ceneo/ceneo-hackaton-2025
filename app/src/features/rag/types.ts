import { Attraction, LocationWithDetails } from '@/types/location';

export interface AttractionWithEmbedding extends Attraction {
  embedding?: number[];
}

export interface LocationWithEmbeddings extends Omit<LocationWithDetails, 'attractions'> {
  attractions: AttractionWithEmbedding[];
}

export interface AttractionSearchResult {
  attraction: Attraction;
  locationId: string;
  city: string;
  country: string;
  score: number;
}
