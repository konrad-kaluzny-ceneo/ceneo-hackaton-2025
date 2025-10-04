#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import uuid
import os

def load_json_file(filename):
    """Załaduj dane z pliku JSON"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Błąd: Nie znaleziono pliku {filename}")
        return None
    except json.JSONDecodeError as e:
        print(f"Błąd podczas parsowania JSON z pliku {filename}: {e}")
        return None

def save_json_file(data, filename):
    """Zapisz dane do pliku JSON"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Pomyślnie zapisano {len(data)} rekordów do {filename}")
        return True
    except Exception as e:
        print(f"Błąd podczas zapisywania pliku {filename}: {e}")
        return False

def generate_unique_id():
    """Wygeneruj unikalny identyfikator UUID"""
    return str(uuid.uuid4())

def get_hotel_names():
    """Zwróć listę nazw hoteli"""
    return [
        "Grand Hotel Europa",
        "Boutique Palace Resort", 
        "Golden Crown Hotel",
        "Royal Garden Suites",
        "Emerald City Lodge",
        "Sapphire Bay Hotel",
        "Diamond Plaza Inn",
        "Crystal Tower Resort",
        "Platinum Stars Hotel",
        "Silver Moon Lodge",
        "Amber Valley Hotel",
        "Ruby Red Suites",
        "Pearl Harbor Inn",
        "Jade Mountain Resort",
        "Opal Beach Hotel",
        "Onyx Castle Lodge",
        "Topaz Garden Hotel",
        "Garnet City Plaza",
        "Turquoise Bay Resort",
        "Amethyst Crown Hotel"
    ]

def generate_accommodations_for_locations(locations, accommodation_templates):
    """Generuj wpisy noclegowe dla wszystkich lokalizacji"""
    accommodations = []
    hotel_names = get_hotel_names()
    
    print("Rozpoczynam generowanie noclegów...")
    
    for location in locations:
        location_id = location.get('id')
        city_name = location.get('location', {}).get('city', 'Nieznane miasto')
        
        print(f"Przetwarzam miasto: {city_name} (ID: {location_id})")
        
        # Dla każdego szablonu hotelu stwórz wpis w tym mieście
        for i, template in enumerate(accommodation_templates):
            hotel_name = hotel_names[i % len(hotel_names)]  # Cyklicznie używaj nazw
            
            accommodation = {
                "id": generate_unique_id(),
                "locationId": location_id,
                "name": hotel_name,
                "description": template.get("description", ""),
                "price": template.get("price", 0),
                "images": template.get("images", [])
            }
            
            accommodations.append(accommodation)
            print(f"  - Dodano hotel: {hotel_name}")
    
    print(f"Wygenerowano łącznie {len(accommodations)} hoteli")
    return accommodations

def create_accommodation_descriptions(locations, accommodations):
    """Utwórz plik accommodation-desc.json łączący opisy atrakcji z opisami hoteli"""
    hotel_descriptions = []
    
    print("Tworzę opisy hoteli łączące atrakcje miasta...")
    
    # Stwórz mapę location_id -> atrakcje
    location_attractions = {}
    for location in locations:
        location_id = location.get('id')
        attractions = location.get('attractions', [])
        location_attractions[location_id] = attractions
    
    for accommodation in accommodations:
        hotel_id = accommodation.get('id')
        location_id = accommodation.get('locationId')
        hotel_name = accommodation.get('name')
        hotel_desc = accommodation.get('description', '')
        
        # Pobierz atrakcje dla tego miasta
        attractions = location_attractions.get(location_id, [])
        
        # Połącz opisy atrakcji
        attraction_descriptions = []
        for attraction in attractions:
            attr_name = attraction.get('name', '')
            attr_desc = attraction.get('description', '')
            if attr_name and attr_desc:
                attraction_descriptions.append(f"{attr_name}: {attr_desc}")
        
        # Utwórz pełny opis
        combined_description = f"Hotel {hotel_name} - {hotel_desc}"
        
        if attraction_descriptions:
            attractions_text = " | ".join(attraction_descriptions[:3])  # Maksymalnie 3 atrakcje
            combined_description += f" | Główne atrakcje miasta: {attractions_text}"
        
        hotel_description_entry = {
            "hotelId": hotel_id,
            "description": combined_description
        }
        
        hotel_descriptions.append(hotel_description_entry)
        print(f"  - Utworzono opis dla hotelu: {hotel_name} (ID: {hotel_id[:8]}...)")
    
    print(f"Utworzono {len(hotel_descriptions)} opisów hoteli")
    return hotel_descriptions

def main():
    """Główna funkcja skryptu"""
    print("=== Generator noclegów i opisów hoteli ===")
    print("Maciej Padula by na to nie wpadł - za zaawansowane! 😄\\n")
    
    # Załaduj dane wejściowe
    print("Ładuję dane wejściowe...")
    locations = load_json_file('locations.json')
    if not locations:
        print("Nie udało się załadować danych lokalizacji.")
        return
    
    accommodation_templates = load_json_file('accommodation.json')
    if not accommodation_templates:
        print("Nie udało się załadować szablonów noclegów.")
        return
    
    print(f"Załadowano {len(locations)} lokalizacji i {len(accommodation_templates)} szablonów hoteli\\n")
    
    # Generuj noclegi zgodnie z kontraktem
    accommodations = generate_accommodations_for_locations(locations, accommodation_templates)
    
    # Zapisz wygenerowane noclegi
    output_accommodations_file = 'generated-accommodations.json'
    if not save_json_file(accommodations, output_accommodations_file):
        print("Nie udało się zapisać noclegów.")
        return
    
    print()
    
    # Utwórz opisy hoteli łączące atrakcje miasta
    hotel_descriptions = create_accommodation_descriptions(locations, accommodations)
    
    # Zapisz opisy hoteli
    output_descriptions_file = 'accommodation-desc.json'
    if not save_json_file(hotel_descriptions, output_descriptions_file):
        print("Nie udało się zapisać opisów hoteli.")
        return
    
    print(f"\\n✅ Proces zakończony pomyślnie!")
    print(f"   → Lokalizacji: {len(locations)}")
    print(f"   → Szablonów hoteli: {len(accommodation_templates)}")
    print(f"   → Wygenerowanych hoteli: {len(accommodations)}")
    print(f"   → Opisów hoteli: {len(hotel_descriptions)}")
    print(f"   → Pliki wyjściowe: {output_accommodations_file}, {output_descriptions_file}")

if __name__ == "__main__":
    main()
