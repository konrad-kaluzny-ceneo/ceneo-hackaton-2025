import ChatAiWrapper from "@/components/mapa/ChatAiWrapper";
import activeTrips from "@/local-data/active-trips.json";
import locations from "@/local-data/locations.json";
import { getCityCoordinates } from "@/lib/locationUtils";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationPage({ params }: Props) {
  const { id } = await params;

  const location = locations.find((loc: any) => loc.id === id);

  if (!location) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Lokalizacja nie znaleziona</h1>
      </div>
    );
  }

  const userActiveTrips = activeTrips.filter((trip: any) =>
    trip.destinations.some((dest: any) => {
      const destLocation = dest.accommodation?.location || dest.transport?.destination;
      return destLocation?.city === location.location.city;
    })
  );

  type LocationData = {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
    tripName?: string;
  };

  const locationData: LocationData[] = [];

  for (const trip of userActiveTrips) {
    for (const dest of trip.destinations) {
      const destLocation = dest.accommodation?.location || dest.transport?.destination;
      if (destLocation) {
        const coords = getCityCoordinates(destLocation.city);
        if (coords) {
          locationData.push({
            city: destLocation.city,
            region: destLocation.region,
            country: destLocation.country,
            lat: coords.lat,
            lng: coords.lng,
            tripName: trip.name,
          });
        }
      }
    }
  }

  const uniqueLocations = Array.from(
    new Map(locationData.map((item) => [item.city, item])).values()
  );

  if (uniqueLocations.length === 0) {
    const mainCoords = getCityCoordinates(location.location.city);
    if (mainCoords) {
      uniqueLocations.push({
        city: location.location.city,
        region: location.location.region,
        country: location.location.country,
        lat: mainCoords.lat,
        lng: mainCoords.lng,
      });
    }
  }

  return (
    <div className="h-screen w-full">
      <ChatAiWrapper locationId={id} locations={uniqueLocations} />
    </div>
  );
}
