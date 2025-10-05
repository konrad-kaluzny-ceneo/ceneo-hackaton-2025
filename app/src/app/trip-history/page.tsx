import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import TripHistory from "@/components/trip-history/TripHistory";
import { TripSet } from "@/types/trip-set";

async function getTripHistory() {
  const ourUser = require("@/local-data/our-user.json");
  const tripPropositions = require("@/local-data/trip-propositions.json");
  
  const userTripIds = ourUser[0].historyOfTripSetIds;
  const userTrips = tripPropositions.filter((trip: TripSet) => 
    userTripIds.includes(trip.id)
  );
  
  return userTrips;
}

async function getFutureTrips() {
  const futureTrips = require("@/local-data/future-trips.json");
  return futureTrips;
}

export default async function TripHistoryPage() {
  const trips = await getTripHistory();
  const futureTrips = await getFutureTrips();
  
  return (
    <div className="container mx-auto px-4">
      <MaxWidthWrapper className="w-full">
        <h1 className="text-3xl font-bold text-primary mb-8">Historia Wycieczek</h1>
        <TripHistory trips={trips} futureTrips={futureTrips} />
      </MaxWidthWrapper>
    </div>
  );
}
