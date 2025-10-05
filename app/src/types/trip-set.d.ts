export interface Destination {
  order: number;
  transportId: string;
  accommodationId: string | null;
}

export interface TripSet {
  state: "future" | "history" | "active";
  id: string;
  userId: string;
  name: string;
  totalPrice: number;
  duration: number;
  image: string | null;
  destinations: Destination[];
  startDate: Date;
}
