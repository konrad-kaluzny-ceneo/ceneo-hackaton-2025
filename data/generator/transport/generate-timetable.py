#!/usr/bin/env python3
"""
Generator rozkładów transportu między miastami.
Tworzy losowe połączenia kolejowe i lotnicze między dostępnymi lokalizacjami
na najbliższe 60 dni zgodnie z kontraktem transport.contract.
"""

import json
import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import sys
import os

# Przewoźnicy kolejowi
TRAIN_CARRIERS = [
    "PKP Intercity",
    "RegioJet", 
    "Flixbus",
    "PKS",
    "PolRegio",
    "Student Agency", 
    "Czech Railways",
    "Leo Express",
    "Eurolines"
]

# Przewoźnicy lotniczy  
FLIGHT_CARRIERS = [
    "Ryanair",
    "Wizz Air",
    "LOT Polish Airlines",
    "Lufthansa",
    "EasyJet",
    "Czech Airlines",
    "Eurowings",
    "KLM",
    "Austrian Airlines"
]

def load_locations() -> List[Dict]:
    """Wczytuje lokalizacje z pliku locations.json"""
    try:
        with open('locations.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Błąd: Nie znaleziono pliku locations.json")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Błąd przy parsowaniu locations.json: {e}")
        sys.exit(1)

def extract_location_ids(locations: List[Dict]) -> List[str]:
    """Wyciąga ID lokalizacji z danych"""
    return [location['id'] for location in locations]

def generate_transport_id() -> str:
    """Generuje unikalny ID dla połączenia transportowego"""
    return str(uuid.uuid4())

def generate_departure_times() -> List[str]:
    """Generuje 3 losowe godziny odjazdu w formacie HH:MM"""
    times = []
    for _ in range(3):
        hour = random.randint(6, 22)  # Od 6 rano do 22 wieczorem
        minute = random.choice([0, 15, 30, 45])  # Co 15 minut
        times.append(f"{hour:02d}:{minute:02d}")
    return sorted(times)

def generate_transport_type() -> str:
    """Losuje typ transportu w stosunku 1:5 (flight:train)"""
    # 1 część flight, 5 części train = 16.67% flight, 83.33% train
    return random.choices(['flight', 'train'], weights=[1, 5])[0]

def generate_carrier_name(transport_type: str) -> str:
    """Losuje nazwę przewoźnika w zależności od typu transportu"""
    if transport_type == 'flight':
        return random.choice(FLIGHT_CARRIERS)
    else:
        return random.choice(TRAIN_CARRIERS)

def generate_price(transport_type: str, duration_minutes: int) -> float:
    """Generuje cenę na podstawie typu transportu i czasu podróży"""
    if transport_type == 'flight':
        # Loty: 150-800 PLN, zależnie od czasu
        base_price = 150 + (duration_minutes / 500) * 650
        return round(base_price + random.uniform(-50, 100), 2)
    else:
        # Pociągi/autobusy: 30-300 PLN
        base_price = 30 + (duration_minutes / 500) * 270  
        return round(base_price + random.uniform(-20, 50), 2)

def generate_schedule_entry(from_id: str, to_id: str, base_date: datetime, 
                          departure_time: str, duration_minutes: int) -> Dict:
    """Generuje pojedynczy wpis rozkładu jazdy"""
    
    # Parsowanie godziny odjazdu
    hour, minute = map(int, departure_time.split(':'))
    departure_datetime = base_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
    
    # Obliczenie czasu dotarcia
    arrival_datetime = departure_datetime + timedelta(minutes=duration_minutes)
    
    # Typ transportu i przewoźnik
    transport_type = generate_transport_type()
    carrier_name = generate_carrier_name(transport_type)
    
    # Cena
    price = generate_price(transport_type, duration_minutes)
    
    return {
        "id": generate_transport_id(),
        "fromLocationId": from_id,
        "fromDate": departure_datetime.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "toLocationId": to_id,
        "toDate": arrival_datetime.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "price": price,
        "name": carrier_name,
        "type": transport_type
    }

def generate_timetable(location_ids: List[str], num_routes: int = 50) -> List[Dict]:
    """
    Generuje kompletny rozkład jazdy.
    
    Args:
        location_ids: Lista ID lokalizacji
        num_routes: Liczba różnych tras do wygenerowania
    
    Returns:
        Lista wpisów rozkładu jazdy
    """
    timetable = []
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    print(f"Generuję rozkład dla {num_routes} tras na najbliższe 60 dni...")
    
    for route_num in range(num_routes):
        # Losowanie pary miast (różnych)
        from_id, to_id = random.sample(location_ids, 2)
        
        # 3 godziny odjazdu dla tej trasy
        departure_times = generate_departure_times()
        
        print(f"Trasa {route_num + 1}: {from_id[:12]}... -> {to_id[:12]}... ({len(departure_times)} odjazdy)")
        
        for departure_time in departure_times:
            # Czas podróży (50-500 minut)
            duration_minutes = random.randint(50, 500)
            
            # Generowanie rozkładu na 60 dni
            for day_offset in range(60):
                schedule_date = today + timedelta(days=day_offset)
                
                entry = generate_schedule_entry(
                    from_id, to_id, schedule_date, departure_time, duration_minutes
                )
                timetable.append(entry)
    
    print(f"Wygenerowano {len(timetable)} wpisów rozkładu jazdy")
    return timetable

def save_timetable(timetable: List[Dict], output_file: str = 'transport.json'):
    """Zapisuje rozkład do pliku JSON"""
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(timetable, f, ensure_ascii=False, indent=2)
        print(f"Rozkład zapisany do pliku: {output_file}")
    except Exception as e:
        print(f"Błąd przy zapisywaniu do {output_file}: {e}")
        sys.exit(1)

def main():
    """Główna funkcja generatora"""
    print("=== Generator Rozkładów Transportu ===")
    print("Maciej pewnie by tego nie ogarnął tak szybko! 😄")
    
    # Wczytanie lokalizacji
    locations = load_locations()
    location_ids = extract_location_ids(locations)
    
    print(f"Znaleziono {len(location_ids)} lokalizacji:")
    for i, loc_id in enumerate(location_ids, 1):
        print(f"  {i}. {loc_id}")
    
    # Generowanie rozkładu
    # Można zmienić liczbę tras (domyślnie 50)
    num_routes = 50
    timetable = generate_timetable(location_ids, num_routes)
    
    # Statystyki
    flights = sum(1 for entry in timetable if entry['type'] == 'flight')
    trains = sum(1 for entry in timetable if entry['type'] == 'train')
    
    print(f"\nStatystyki:")
    print(f"  Loty: {flights} ({flights/len(timetable)*100:.1f}%)")
    print(f"  Pociągi/autobusy: {trains} ({trains/len(timetable)*100:.1f}%)")
    print(f"  Średnia cena: {sum(entry['price'] for entry in timetable)/len(timetable):.2f} PLN")
    
    # Zapisanie do pliku
    save_timetable(timetable)
    
    print("\n✅ Generator zakończył pracę pomyślnie!")

if __name__ == "__main__":
    main()
