"use client";

import { useState, useEffect, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { AudioLines, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getLocationName, findNearestCity } from "@/lib/geoUtils";

export default function RatingPage() {
  const [rating, setRating] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { latitude, longitude, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();

  // Funkcja do aktualizacji nazwy lokalizacji
  const updateLocationName = async (lat: number, lng: number) => {
    setLoadingLocation(true);
    try {
      const locationName = await getLocationName(lat, lng);
      setCurrentLocation(locationName);
      
      // Znajdź najbliższe miasto z naszej bazy danych
    
    } catch (error) {
      console.error("Błąd podczas pobierania nazwy lokalizacji:", error);
      setCurrentLocation("Nieznane miejsce");
    } finally {
      setLoadingLocation(false);
    }
  };

  // Automatycznie pobierz nazwę lokalizacji gdy dostępne są współrzędne
  useEffect(() => {
    if (latitude && longitude) {
      updateLocationName(latitude, longitude);
    }
  }, [latitude, longitude]);

  const handleShare = () => {
    const locationInfo = currentLocation ? ` w ${currentLocation}` : '';
    console.log(`Podzielenie się oceną: ${rating}%${locationInfo}`);
    // Tutaj można dodać logikę udostępniania z informacją o lokalizacji
  };

  const handleRefreshLocation = () => {
    getCurrentPosition();
  };

  // Funkcje do obsługi przytrzymania ikony drzewa
  const startRating = () => {
    setIsPressed(true);
    setRating(0);
    
    // Czekaj 500ms przed rozpoczęciem zwiększania
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setRating(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 2; // Zwiększ o 2% co 50ms (zajmie 2.5s do osiągnięcia 100%)
        });
      }, 50);
    }, 500);
  };

  const stopRating = () => {
    setIsPressed(false);
    
    // Wyczyść timery
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Wyczyść timery przy unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Tytuł z informacją o lokalizacji */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Jak spokojne jest to miejsce?
          </h1>
          
          {/* Sekcja lokalizacji */}
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
            
            {geoLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Pobieranie lokalizacji...</span>
              </div>
            ) : geoError ? (
              <div className="text-red-00 text-sm">
                {geoError}
              </div>
            ) : loadingLocation ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rozpoznawanie miejsca...</span>
              </div>
            ) : currentLocation ? (
              <div className="text-2xl font-bold">
                {currentLocation}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Lokalizacja niedostępna
              </div>
            )}
              <button
                onClick={handleRefreshLocation}
                disabled={geoLoading || loadingLocation}
                className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
                title="Odśwież lokalizację"
              >
                <RefreshCw className={cn("w-3 h-3", (geoLoading || loadingLocation) && "animate-spin")} />
              </button>
          </div>
          
          <p className="text-gray-600">
            Przytrzymaj ikonę drzewa, aby ocenić poziom spokoju.
          </p>
        </div>

        {/* Ikona drzewa z kółkiem */}
        <div className="relative flex justify-center">
          <div 
            className={cn(
              "w-40 h-40 rounded-full bg-green-100 bg-opacity-50 flex items-center justify-center transition-all duration-200 cursor-pointer select-none",
              isPressed && "scale-95 bg-green-200"
            )}
            onMouseDown={startRating}
            onMouseUp={stopRating}
            onMouseLeave={stopRating}
            onTouchStart={startRating}
            onTouchEnd={stopRating}
          >
            <div 
              className={cn(
                "w-32 h-32 rounded-full bg-green-200 bg-opacity-70 flex items-center justify-center transition-all duration-200",
                isPressed && "bg-green-300 bg-opacity-80"
              )}
            >
              <Image 
                src="/images/tree.png" 
                alt="tree" 
                width={80} 
                height={80}
                className={cn(
                  "transition-transform duration-200",
                  isPressed && "scale-110"
                )}
              />
            </div>
          </div>
        </div>

        {/* Procent i opis */}
        <div className="space-y-4">
          <div className={cn(
            "text-6xl font-bold transition-colors duration-300",
            rating === 0 ? "text-gray-600" : 
            rating < 30 ? "text-red-300" :
            rating < 70 ? "text-yellow-500" :
            "text-green-900"
          )}>
            {rating}%
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <AudioLines className="w-4 h-4" />
            <span>Poziom spokoju w tym miejscu</span>
          </div>
        </div>

        {/* Przycisk */}
        <Button 
          onClick={handleShare}
          className="w-full"
          disabled={rating === 0}
        >
          Podziel się oceną ({rating}%)
        </Button>
      </div>
    </div>
  );
}