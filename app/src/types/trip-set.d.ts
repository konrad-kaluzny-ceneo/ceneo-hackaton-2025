export interface TripSet {
  id: number;
  name: string;
  description: string;
  image: string;
  fullPrice: number;

  transport: Transport[];
  orderOfTransport: string[];
  
  accommodation: Accommodation[];
  orderOfAccommodation: string[];
}
