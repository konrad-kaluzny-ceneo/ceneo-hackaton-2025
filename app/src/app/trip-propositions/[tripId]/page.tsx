import React from 'react';
import path from 'path';
import fs from 'fs';
import Link from 'next/link';

function getTripPropositions() {
    const filePath = path.join(process.cwd(), 'src', 'local-data', 'trip-propositions.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
    const trips = getTripPropositions();
    const trip = trips.find((t: any) => t.id === params.tripId);

    if (!trip) {
        return <div>Trip not found</div>;
    }

    // Get all unique cities for the route visualization
    const cities = trip.destinations.map((dest: any, idx: number) => {
        if (idx === 0) {
            return [
                { name: dest.transport.from.city, order: idx },
                { name: dest.transport.destination.city, order: idx + 1 }
            ];
        }
        return { name: dest.transport.destination.city, order: idx + 1 };
    }).flat();

    return (
        <main className="min-h-screen p-8">

            <h1 className="text-primary text-3xl mb-8 text-center">
                Twoja nowa podróż
            </h1>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-8 top-5 bottom-5 w-0.5 bg-primary" />

                {/* Timeline items */}
                {trip.destinations.map((dest: any, idx: number) => (
                    <div key={idx} className="mb-8 relative">
                        {/* Circle marker */}
                        <div className="absolute left-[23px] top-5 w-5 h-5 rounded-full bg-primary border-[3px] border-[#f5ecd7]" />

                        {/* Content */}
                        <div className="ml-16">
                            {/* Transport */}
                            <div className="bg-white rounded-2xl p-6 mb-4">
                                <h3 className="text-primary text-xl mb-2">
                                    {dest.transport.name.includes('Lot') ? '✈️' : 
                                     dest.transport.name.includes('Pociąg') ? '🚂' : '🚌'} {dest.transport.name.split(' ')[0]}
                                </h3>
                                <div className="text-sm text-gray-600 mb-2">
                                    {dest.transport.from.city}({dest.transport.from.city === 'Wrocław' ? 'WRO' : 
                                     dest.transport.from.city === 'Bergamo' ? 'BGY' : 
                                     dest.transport.from.city === 'Berlin' ? 'BER' : 
                                     dest.transport.from.city === 'Barcelona' ? 'BCN' : 'XXX'}) → {dest.transport.destination.city}({dest.transport.destination.city === 'Bergamo' ? 'BGY' : 
                                     dest.transport.destination.city === 'Chiavenna' ? 'CHV' : 
                                     dest.transport.destination.city === 'Wrocław' ? 'WRO' : 
                                     dest.transport.destination.city === 'Berlin' ? 'BER' : 
                                     dest.transport.destination.city === 'Praga' ? 'PRG' : 'XXX'})
                                </div>

                                <div className="text-sm text-primary font-bold mb-2">
                                    Czas na przesiadkę
                                </div>
                                <div className="text-xs text-gray-500">
                                    1h30m
                                </div>

                                {dest.accommodation && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600 m-0">
                                            Pamiętaj o czasie na odbiór bagażu i transfer z lotniska na dworzec kolejowy w {dest.transport.destination.city}.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Accommodation */}
                            {dest.accommodation && (
                                <div className="bg-white rounded-2xl p-6 mb-4">
                                    <h3 className="text-primary text-xl mb-2">
                                        🏠 Zakwaterowanie
                                    </h3>
                                    <div className="text-sm font-bold text-gray-800 mb-1">
                                        {dest.accommodation.name}
                                    </div>
                                    <div className="text-xs text-gray-600 mb-2">
                                        {dest.accommodation.description}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {dest.accommodation.location.city} | {dest.accommodation.price} PLN | {dest.accommodation.beds} łóżka
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Zakończ button */}
            <div className="flex justify-center mt-8 pb-8">
                <Link href="/trip-propositions" className="no-underline">
                    <button className="bg-primary text-white border-none rounded-lg px-12 py-3 text-base font-bold cursor-pointer hover:bg-primary transition-colors">
                        Zakończ
                    </button>
                </Link>
            </div>
        </main>
    );
}
