export interface Transport {
  id: string;
  fromLocationId: string;
  fromDate: Date;
  toLocationId: string;
  toDate: Date;
  price: number;
  name: string;
}
