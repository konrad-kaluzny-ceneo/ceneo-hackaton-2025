import { GetUserTripsHandler } from "@/features/trips/GetUserTrips";
import { inject } from "@/infrastructure/DIContainer";
import { TripSet } from "@/types/trip-set";
import TripPropositionsClient from "@/app/trip-propositions/TripPropositionsClient";

async function getTripPropositions(): Promise<TripSet[]> {
  const getTripsHandler = inject(GetUserTripsHandler);
  const trips = await getTripsHandler.handle("default-user");
  return trips as unknown as TripSet[];
}

export default async function TripPropositionsPage() {
  const trips = await getTripPropositions();

  return <TripPropositionsClient initialTrips={trips} />;
}
