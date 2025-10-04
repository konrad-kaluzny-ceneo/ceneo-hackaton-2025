import React from 'react';
import path from 'path';
import fs from 'fs';
import TripDetail from '@/components/trip/TripDetail';
import { TripSet } from '@/types/trip-set';

function getTripPropositions(): TripSet[] {
    const filePath = path.join(process.cwd(), 'src', 'local-data', 'trip-propositions.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
    const trips = getTripPropositions();
    const trip = trips.find((t: TripSet) => t.id === params.tripId);

    if (!trip) {
        return <div>Trip not found</div>;
    }

    return <TripDetail trip={trip} />;
}
