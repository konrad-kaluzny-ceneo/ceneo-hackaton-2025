"use client";

import React, { useState } from "react";
import { ActiveTrip } from "@/types/active-trip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, MapPin, Plane, Train, Home, Calendar, Euro, Heart, Camera, Plus, Share2, TreePine } from "lucide-react";
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

function getAirportCode(city: string): string {
  const codes: { [key: string]: string } = {
    Wrocław: "WRO",
    Bergamo: "BGY",
    Berlin: "BER",
    Barcelona: "BCN",
    Kraków: "KRA",
    Praga: "PRG",
    Mediolan: "MIL",
  };
  return codes[city] || "XXX";
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
  const completedSteps = trip.bookingStatus.transport ? 1 : 0;
  const totalSteps = trip.destinations.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

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
            <Image src={trip.image || DEFAULT_IMAGE} alt={trip.name} fill className="object-cover rounded-t-2xl" />
          </div>

          <div className="px-6 pb-4 flex flex-col gap-2 w-full mt-4">
            <h2 className="text-primary text-2xl font-bold">{trip.name}</h2>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(trip.startDate.toString())} - {formatDate(trip.endDate.toString())}
              </div>
              <div className="flex items-center gap-1">
                <Euro className="w-4 h-4" />
                {trip.totalPrice} PLN
              </div>
            </div>

            {/* Status info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <Badge variant={trip.bookingStatus.overall ? "default" : "secondary"}>{trip.bookingStatus.overall ? "Zarezerwowane" : "W trakcie"}</Badge>
            </div>

            {/* Progress info */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Postęp podróży</span>
                <span>
                  {completedSteps}/{totalSteps} kroków
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Current location */}
            {trip.currentLocation && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Aktualnie w: </span>
                {getLocationIdByCity(trip.currentLocation) ? (
                  <Link 
                    href={`/location/${getLocationIdByCity(trip.currentLocation)}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {trip.currentLocation}
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
                  <Heart className="w-4 h-4" />
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
                          >
                            {experience.location}
                          </Link>
                        ) : (
                          <span className="font-medium text-sm">{experience.location}</span>
                        )}
                        <span className="text-xs text-gray-500">{experience.date}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <TreePine className="w-3 h-3 text-primary" />
                          <span className="text-xs">{experience.moodRating.peacefulness}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-xs">{experience.moodRating.excitement}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{experience.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add experience buttons */}
            <div className="mt-4">
              <div className="flex gap-2">
                <MoodRatingModal 
                  trigger={
                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                      <TreePine className="w-3 h-3" />
                      Oceń swój mood
                    </Button>
                  }
                  onSave={handleMoodRating}
                />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
