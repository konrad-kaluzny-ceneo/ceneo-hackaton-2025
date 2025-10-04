import { GetUserTripsHandler } from "@/features/trips/GetUserTrips";
import { inject } from "@/infrastructure/DIContainer";
import { useUserId } from "@/infrastructure/UserAccessor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = useUserId(request);
  const getTripsHandler = inject(GetUserTripsHandler);
  const trips = await getTripsHandler.handle(userId);

  return NextResponse.json(trips?.[0] ?? []);
}