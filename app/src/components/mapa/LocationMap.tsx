"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type LocationData = {
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  tripName?: string;
};

type Props = {
  locations: LocationData[];
  maxHeight?: string;
};

export default function LocationMap({ locations, maxHeight }: Props) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || locations.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100"
        style={{ height: maxHeight || "88vh" }}
        role="img"
        aria-label="Ładowanie mapy"
      >
        <p className="text-gray-500">Ładowanie mapy...</p>
      </div>
    );
  }

  const centerLocation = locations[0];

  return (
    <MapContainer
      center={[centerLocation.lat, centerLocation.lng]}
      zoom={6}
      style={{ height: maxHeight || "88vh", zIndex: 0 }}
      role="img"
      aria-label={`Mapa pokazująca ${locations.length} lokalizacji`}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locations.map((location, idx) => (
        <Marker 
          key={idx} 
          position={[location.lat, location.lng]} 
          icon={icon}
          aria-label={`Marker dla ${location.city}, ${location.region}, ${location.country}`}
        >
          <Popup>
            <div className="flex h-fit flex-col">
              <div className="font-semibold">
                {location.city}, {location.region}
              </div>
              <div className="text-sm">{location.country}</div>
              {location.tripName && (
                <div className="mt-1 text-xs text-gray-600">
                  Wycieczka: {location.tripName}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
