export interface LocationInTrip {
  country: string;
  region: string;
  city: string;
}

export interface TransportInTrip {
  from: LocationInTrip;
  fromDate: string;
  destination: LocationInTrip;
  destinationDate: string;
  price: number;
  name: string;
}

export interface AccommodationInTrip {
  location: LocationInTrip;
  date: string;
  price: number;
  beds: number;
  name: string;
  description: string;
  images: string[];
}

export interface Destination {
  order: number;
  transport?: TransportInTrip;
  accommodation?: AccommodationInTrip | null;
  transportId?: string;
  accommodationId?: [string] | null;
}

export interface TripSet {
  id: string;
  userId: string;
  name: string;
  totalPrice: number;
  duration: number;
  image: string | null;
  destinations: Destination[];
  startDate: Date;
}
