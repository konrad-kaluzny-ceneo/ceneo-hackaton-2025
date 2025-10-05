import ChatAiWrapper from "@/components/mapa/ChatAiWrapper";
import userSets from "@/local-data/sample-sets.json";
import locations from "@/local-data/locations.json";
import { getCityCoordinates } from "@/lib/locationUtils";
import accommodations from "@/local-data/accommodations.json";
import transports from "@/local-data/transport.json";

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

  const userActiveTrips = userSets.filter((trip: any) =>
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
      let destLocation = null;
      if (dest.accommodationId) {
        const accommodation = accommodations.find((a: any) => a.id === dest.accommodationId);
        if (accommodation?.locationId) {
          destLocation = locations.find((loc: any) => loc.id === accommodation.locationId)?.location;
        }
      } else if (dest.transportId) {
        const transport = transports.find((t: any) => t.id === dest.transportId);
        if (transport?.toLocationId) {
          destLocation = locations.find((loc: any) => loc.id === transport.toLocationId)?.location;
        }
      }
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
    <div className="h-screen w-full max-h-screen overflow-y-auto">
      <ChatAiWrapper locationId={id} locations={uniqueLocations} />
    </div>
  );
}
