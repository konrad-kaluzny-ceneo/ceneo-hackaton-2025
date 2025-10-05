import React from 'react';
import path from 'path';
import fs from 'fs';
import TripDetail from '@/components/trip/TripDetail';
import { TripSet } from '@/types/trip-set';

type Props = {
    params: Promise<{ tripId: string }>;
  };
  

function getTripPropositions(): TripSet[] {
    const filePath = path.join(process.cwd(), 'src', 'local-data', 'trip-propositions.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}

export default async function TripDetailPage({ params }: Props) {
    const { tripId } = await params;
    const trips = getTripPropositions();
    const trip = trips.find((t: TripSet) => t.id === tripId);

    if (!trip) {
        return <div>Trip not found</div>;
    }

    return <TripDetail trip={trip} />;
}
