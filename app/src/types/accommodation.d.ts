import { Location } from './location';

export interface Accommodation {
  location: Location;
  date: string;
  price: number;
  beds: number;
  name: string;
  description: string;
  images: string[];
}
