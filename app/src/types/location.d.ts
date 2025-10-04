export interface LocationInApp {
  id: string;
  country: string;
  region: string;
  city: string;
}

export interface Attraction {
  name: string;
  description: string;
  price: number;
  images: string[];
}

export interface MonthConditions {
  density: number;
  temp: number;
}

export interface LocationWithDetails {
  id: string;
  location: LocationInApp;
  attractions: Attraction[];
  conditionsInMonth: Record<string, MonthConditions>;
}
