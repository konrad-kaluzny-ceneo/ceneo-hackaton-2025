export interface TripSet {
  id: string;
  userId: string;
  
  name: string;
  description: string;
  image: string;
  fullPrice: number;
  orderOfTransportsAndAccommodations: string[];
}
