export interface Location {
  country: string;
  region: string;
  city: string;
}

export interface Transport {
  from: Location;
  fromDate: string;
  destination: Location;
  destinationDate: string;
  price: number;
  name: string;
}

export interface Accommodation {
  location: Location;
  date: string;
  price: number;
  beds: number;
  name: string;
  description: string;
  images: string[];
}

export interface Destination {
  order: number;
  transport: Transport;
  accommodation: Accommodation | null;
}

export interface TripSet {
  id: string;
  name: string;
  totalPrice: number;
  duration: number;
  image: string | null;
  destinations: Destination[];
  startDate: Date;
}
