const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Wrocław": { lat: 51.1079, lng: 17.0385 },
  "Kraków": { lat: 50.0647, lng: 19.9450 },
  "Warszawa": { lat: 52.2297, lng: 21.0122 },
  "Gdańsk": { lat: 54.3520, lng: 18.6466 },
  "Poznań": { lat: 52.4064, lng: 16.9252 },
  "Zakopane": { lat: 49.2992, lng: 19.9496 },
};

export function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  return cityCoordinates[city] || null;
}
