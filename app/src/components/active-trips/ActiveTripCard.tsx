"use client";

import React, { useState, useEffect } from "react";
import { ActiveTrip } from "@/types/active-trip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, MapPin, Plane, Train, Home, Calendar, Euro, Heart, Camera, Plus, Share2, TreePine, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/images";
import MoodRatingModal from "./MoodRatingModal";
import MaxWidthWrapper from "../shared/MaxWidthWrapper";
import Link from "next/link";
import { getLocationIdByCity } from "@/lib/locationMapper";

interface ActiveTripCardProps {
  trip: ActiveTrip;
}

function getTransportIcon(transportName: string) {
  if (transportName.includes("Lot")) return <Plane className="w-5 h-5" />;
  if (transportName.includes("Pociąg")) return <Train className="w-5 h-5" />;
  return <Plane className="w-5 h-5" />;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActiveTripCard({ trip }: ActiveTripCardProps) {
  // Stan dla hydration fix
  const [isClient, setIsClient] = useState(false);
  const [progressData, setProgressData] = useState({
    progressPercentage: 0,
    completedDays: 0,
    totalDays: trip.duration
  });

  // Oblicz rzeczywisty postęp na podstawie dat
  const calculateProgress = () => {
    const now = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    
    // Jeśli trip jeszcze się nie rozpoczął
    if (now < startDate) {
      return { progressPercentage: 0, completedDays: 0, totalDays: trip.duration };
    }
    
    // Jeśli trip się już skończył
    if (now > endDate) {
      return { progressPercentage: 100, completedDays: trip.duration, totalDays: trip.duration };
    }
    
    // Trip jest w trakcie - oblicz ile dni minęło
    const totalMs = endDate.getTime() - startDate.getTime();
    const elapsedMs = now.getTime() - startDate.getTime();
    const progressPercentage = Math.max(0, Math.min(100, (elapsedMs / totalMs) * 100));
    
    const completedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1; // +1 bo pierwszy dzień też się liczy
    const totalDays = trip.duration;
    
    return { progressPercentage, completedDays, totalDays };
  };

  // useEffect dla client-side calculations
  useEffect(() => {
    setIsClient(true);
    setProgressData(calculateProgress());
  }, []);

  const { progressPercentage, completedDays, totalDays } = progressData;

  const handleMoodRating = (rating: { peacefulness: number; excitement: number; comfort: number; overall: number }) => {
    // Tutaj można dodać logikę zapisywania oceny
    console.log("Nowa ocena samopoczucia:", rating);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <MaxWidthWrapper className="w-full">
        <div className=" bg-white w-full rounded-2xl shadow-md flex flex-col">
          {/* Header with image and trip info */}
            <div className="relative w-full h-48 flex items-center justify-center">
              <img 
                src={trip.image || DEFAULT_IMAGE} 
                alt={`Zdjęcie aktywnej wycieczki: ${trip.name}`} 
                className="object-cover rounded-t-2xl w-full h-full" 
                style={{ objectFit: "cover" }} 
              />
            </div>

          <div className="px-6 pb-4 flex flex-col gap-2 w-full mt-4">
            <h2 className="text-primary text-2xl font-bold">{trip.name}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span aria-label={`Data rozpoczęcia: ${formatDate(trip.startDate.toString())}, data zakończenia: ${formatDate(trip.endDate.toString())}`}>
                  {formatDate(trip.startDate.toString())} - {formatDate(trip.endDate.toString())}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" aria-hidden="true" />
                <span aria-label={`Całkowity koszt: ${trip.totalPrice}`}>{trip.totalPrice}</span>
              </div>
            </div>

            {/* Status info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <Badge 
                variant={isClient && progressPercentage >= 100 ? "default" : isClient && progressPercentage > 0 ? "secondary" : "outline"}
                aria-label={`Status rezerwacji: ${trip.bookingStatus.overall ? "Zarezerwowane" : "W trakcie"}`}
              >
                {!isClient ? "Ładowanie..." : progressPercentage >= 100 ? "Zakończona" : progressPercentage > 0 ? "W trakcie" : "Nadchodząca"}
              </Badge>
            </div>

            {/* Progress info */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Postęp podróży</span>
                <span aria-label={`Ukończono ${completedDays} z ${totalDays} dni`}>
                  {completedDays}/{totalDays} dni {isClient && `(${Math.round(progressPercentage)}%)`}
                </span>
              </div>
              <Progress 
                value={isClient ? progressPercentage : 0} 
                className="h-2" 
                aria-label={`Postęp podróży: ${Math.round(progressPercentage)} procent`}
              />
              {isClient && progressPercentage > 0 && progressPercentage < 100 && (
                <div className="text-xs text-gray-500 mt-1">
                  Pozostało {totalDays - completedDays} dni
                </div>
              )}
            </div>

            {/* Current location */}
            {trip.currentLocation && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Aktualnie w: </span>
                {getLocationIdByCity(trip.currentLocation) ? (
                  <Link 
                    href={`/location/${getLocationIdByCity(trip.currentLocation)}`} 
                    className="font-semibold items-center flex gap-1 text-primary hover:underline"
                    aria-label={`Przejdź do czatu miejsca: ${trip.currentLocation}`}
                  >
                    {trip.currentLocation}
                    <div className="ml-2 flex items-center gap-1 text-red-700 text-xs">
                      <span>
                        <MessageCircleIcon className="w-4 h-4 fill-red-700 text-red-700" aria-hidden="true" />
                      </span>
                      <span className="flex font-bold items-center gap-1">CZAT MIEJSCA</span>
                    </div>
                  </Link>
                ) : (
                  <span className="font-semibold">{trip.currentLocation}</span>
                )}
              </div>
            )}

            {/* Experience tracking section */}
            {trip.experiences && trip.experiences.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  Twoje doświadczenia
                </h4>
                <div className="space-y-2">
                  {trip.experiences.map((experience) => (
                    <div key={experience.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        {getLocationIdByCity(experience.location) ? (
                          <Link 
                            href={`/location/${getLocationIdByCity(experience.location)}`} 
                            className="font-medium text-sm text-primary hover:underline"
                            aria-label={`Przejdź do czatu miejsca: ${experience.location}`}
                          >
                            {experience.location}
                          </Link>
                        ) : (
                          <span className="font-medium text-sm">{experience.location}</span>
                        )}
                        <span className="text-xs text-gray-500" aria-label={`Data doświadczenia: ${experience.date}`}>{experience.date}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <TreePine className="w-3 h-3 text-primary" aria-hidden="true" />
                          <span className="text-xs" aria-label={`Poziom spokoju: ${experience.moodRating.peacefulness} procent`}>{experience.moodRating.peacefulness}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" aria-hidden="true" />
                          <span className="text-xs" aria-label={`Poziom ekscytacji: ${experience.moodRating.excitement} procent`}>{experience.moodRating.excitement}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{experience.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
