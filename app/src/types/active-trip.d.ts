import { TripSet } from "./trip-set";

export interface BookingStatus {
  transport: boolean;
  accommodation: boolean;
  overall: boolean;
}

export interface MoodRating {
  peacefulness: number; // 0-100
  excitement: number; // 0-100
  comfort: number; // 0-100
  overall: number; // 0-100
}

export interface ExperienceEntry {
  id: string;
  location: string;
  date: string;
  moodRating: MoodRating;
  description: string;
  photos: string[];
  tags: string[];
}

export interface ActiveTrip extends TripSet {
  bookingStatus: BookingStatus;
  currentStep: number;
  isActive: boolean;
  endDate: Date;
  experiences: ExperienceEntry[];
  currentLocation?: string;
}
