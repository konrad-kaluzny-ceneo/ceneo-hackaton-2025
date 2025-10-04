import { Attraction, LocationWithDetails } from '@/types/location';
import { Accommodation } from '@/types/accommodation';

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

export interface AccommodationWithEmbeddings extends Accommodation {
  embedding?: number[];
}

export interface AccommodationSearchResult {
  accommodation: Accommodation;
  score: number;
}
