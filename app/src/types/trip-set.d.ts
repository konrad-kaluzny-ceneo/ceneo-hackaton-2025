export interface TripSet {
  id: number;
  name: string;
  description: string;
  image: string;
  fullPrice: number;

  orderOfTransportsAndAccommodations: string[];
}
