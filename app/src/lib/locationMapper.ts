import locations from "@/local-data/locations.json";

export function getLocationIdByCity(city: string): string | null {
  const location = locations.find(
    (loc: any) => loc.location.city.toLowerCase() === city.toLowerCase()
  );
  return location?.id || null;
}
