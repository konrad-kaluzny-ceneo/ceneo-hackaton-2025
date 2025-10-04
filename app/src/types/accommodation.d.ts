export interface Location {
  country: string;
  region: string;
  city: string;
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
