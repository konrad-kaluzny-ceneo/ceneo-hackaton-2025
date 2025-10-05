"use client";

import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolokalizacja nie jest wspierana przez tę przeglądarkę',
        loading: false,
      }));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 300000, // 5 minut
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Wystąpił błąd podczas pobierania lokalizacji';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Dostęp do lokalizacji został zablokowany';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Lokalizacja jest niedostępna';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout podczas pobierania lokalizacji';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      defaultOptions
    );
  }, []);

  const getCurrentPosition = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolokalizacja nie jest wspierana przez tę przeglądarkę',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Wystąpił błąd podczas pobierania lokalizacji';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Dostęp do lokalizacji został zablokowany';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Lokalizacja jest niedostępna';
            break;
          case error.TIMEOUT:
            errorMessage = 'Timeout podczas pobierania lokalizacji';
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      }
    );
  };

  return {
    ...state,
    getCurrentPosition,
  };
}