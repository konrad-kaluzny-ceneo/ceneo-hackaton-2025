import React from 'react';
import path from 'path';
import fs from 'fs';

function getTripPropositions() {
    const filePath = path.join(process.cwd(), 'src', 'local-data', 'trip-propositions.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContents);
}

export default function TripPropositionsPage() {
    const trips = getTripPropositions();
    return (
        <main style={{ background: '#f5ecd7', minHeight: '100vh', padding: '2rem' }}>
            <h1 style={{ color: '#355c3c', fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Here.
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#555' }}>
                Specjalnie dla Ciebie
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {trips.map((trip: any) => {
                    // Get the first accommodation image from the trip
                    const firstAccommodation = trip.destinations.find((dest: any) => dest.accommodation)?.accommodation;
                    const tripImage = firstAccommodation?.images?.[0] || '/images/af6a75af62687873e61b92e6eb76db3517d4a3a8.png';
                    
                    return (
                        <div
                            key={trip.id}
                            style={{
                                background: '#fff',
                                borderRadius: '1rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                maxWidth: '800px',
                                display: 'flex',
                                gap: '1.5rem',
                            }}
                        >
                            <img
                                src={tripImage}
                                alt={trip.name}
                                style={{
                                    width: 200,
                                    height: 200,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                }}
                            />
                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <h2 style={{ color: '#355c3c', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
                                        {trip.name}
                                    </h2>
                                    <div style={{ fontSize: '0.95rem', color: '#666', marginBottom: '0.75rem' }}>
                                        Czas trwania: {trip.duration} dni | Całkowity koszt: {trip.totalPrice} PLN
                                    </div>
                                    
                                    {/* Trip route */}
                                    <div style={{ fontSize: '1rem', color: '#355c3c', fontWeight: '500' }}>
                                        {trip.destinations.map((dest: any, idx: number) => {
                                            const cities = [];
                                            if (idx === 0) {
                                                cities.push(dest.transport.from.city);
                                            }
                                            cities.push(dest.transport.destination.city);
                                            return cities;
                                        }).flat().join(' → ')}
                                    </div>
                                </div>

                                <button
                                    style={{
                                        marginTop: '1rem',
                                        background: '#355c3c',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        padding: '0.75rem 2rem',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Sprawdź
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}