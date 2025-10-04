import { Location } from './location';

export interface Transport {
  from: Location;
  fromDate: string;
  destination: Location;
  destinationDate: string;
  price: number;
  name: string;
}
