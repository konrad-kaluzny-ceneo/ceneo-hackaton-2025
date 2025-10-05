// Funkcja do konwersji współrzędnych na nazwę miasta (reverse geocoding)
export async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    // Używamy darmowego API OpenStreetMap Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pl`
    );
    
    if (!response.ok) {
      throw new Error('Błąd podczas pobierania danych lokalizacji');
    }
    
    const data = await response.json();
    
    // Wyciągamy miasto, powiat lub region
    const city = data.address?.city || 
                 data.address?.town || 
                 data.address?.village || 
                 data.address?.county ||
                 data.address?.state ||
                 'Nieznane miejsce';
    
    const country = data.address?.country || '';
    
    return country ? `${city}, ${country}` : city;
  } catch (error) {
    console.error('Błąd podczas geokodowania:', error);
    return 'Nieznane miejsce';
  }
}

// Funkcja do obliczania odległości między dwoma punktami (w km)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Promień Ziemi w km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Zaokrąglenie do 2 miejsc po przecinku
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Funkcja do znajdowania najbliższego miasta z naszej bazy danych
export function findNearestCity(
  userLat: number, 
  userLon: number, 
  cities: Record<string, { lat: number; lng: number }>
): { city: string; distance: number } | null {
  let nearestCity = null;
  let minDistance = Infinity;
  
  for (const [cityName, coords] of Object.entries(cities)) {
    const distance = calculateDistance(userLat, userLon, coords.lat, coords.lng);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = { city: cityName, distance };
    }
  }
  
  return nearestCity;
}