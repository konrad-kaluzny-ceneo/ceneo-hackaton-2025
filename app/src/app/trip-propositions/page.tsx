import { GetUserTripsHandler } from "@/features/trips/GetUserTrips";
import { inject } from "@/infrastructure/DIContainer";
import { TripSet } from "@/types/trip-set";
import TripPropositionsClient from "@/components/trip/TripPropositionsClient";
import { useUserId } from "@/infrastructure/UserAccessor";

async function getTripPropositions(): Promise<TripSet[]> {
  const userId = await useUserId();
  const getTripsHandler = inject(GetUserTripsHandler);
  const trips = await getTripsHandler.handle(userId);
  console.log(trips);
  return trips as unknown as TripSet[];
}

export default async function TripPropositionsPage() {
  const trips = await getTripPropositions();

  return <TripPropositionsClient initialTrips={trips} />;
}
