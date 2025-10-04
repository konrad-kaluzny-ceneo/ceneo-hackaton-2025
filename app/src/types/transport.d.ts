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
