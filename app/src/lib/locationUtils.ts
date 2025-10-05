const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    "Kraków": { lat: 50.0647, lng: 19.9450 },
    "Warszawa": { lat: 52.2297, lng: 21.0122 },
    "Gdańsk": { lat: 54.3520, lng: 18.6466 },
    "Zakopane": { lat: 49.2992, lng: 19.9496 },
    "Wrocław": { lat: 51.1079, lng: 17.0385 },
    "Kazimierz Dolny": { lat: 51.3194, lng: 21.9631 },
    "Praga": { lat: 50.0755, lng: 14.4378 },
    "Český Krumlov": { lat: 48.8127, lng: 14.3175 },
    "Brno": { lat: 49.1951, lng: 16.6068 },
    "Karlowe Wary": { lat: 50.2322, lng: 12.8712 },
    "Telč": { lat: 49.1844, lng: 15.4526 },
    "Kutná Hora": { lat: 49.9484, lng: 15.2681 }
};

export function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  return cityCoordinates[city] || null;
}
