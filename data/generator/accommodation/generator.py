#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random
import uuid
import os
from datetime import datetime, timedelta

# Stałe konfiguracyjne
DAYS_TO_GENERATE = 60
HOTELS_PER_CITY = 8
MIN_PRICE = 80
MAX_PRICE = 400
MIN_BEDS = 1
MAX_BEDS = 6
MIN_AVAILABILITY_DAYS = 1
MAX_AVAILABILITY_DAYS = 20

def load_locations():
    """Załaduj dane lokalizacji z pliku JSON"""
    locations_path = 'locations.json'
    
    try:
        with open(locations_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Błąd: Nie znaleziono pliku {locations_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"Błąd podczas parsowania JSON: {e}")
        return None

def save_accommodations(accommodations):
    """Zapisz wygenerowane dane noclegowe do pliku JSON"""
    accommodations_path = 'accommodation.json';
    
    try:
        with open(accommodations_path, 'w', encoding='utf-8') as f:
            json.dump(accommodations, f, ensure_ascii=False, indent=2)
        print(f"Pomyślnie zapisano {len(accommodations)} rekordów do {accommodations_path}")
        return True
    except Exception as e:
        print(f"Błąd podczas zapisywania pliku: {e}")
        return False

def get_hotel_names():
    """Zwróć listę 20 losowych nazw hoteli"""
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

def get_description_image_sets():
    """Zwróć 5 zestawów opisów z odpowiadającymi im obrazkami"""
    return [
        {
            "description": "Luksusowy hotel w centrum miasta z elegancko urządzonymi pokojami, spa i restauracją. Idealny dla podróży biznesowych i turystycznych.",
            "images": [
                "https://u.profitroom.pl/2019-palac-alexandrinum-pl/thumb/1920x1080/uploads/Alexandrinum2zew_082022_45copy.jpg",
                "https://tse4.mm.bing.net/th/id/OIP.DJqSTXtyHD95830UQ1ax3gHaEK?cb=12&pid=ImgDet&w=474&h=266&rs=1&o=7&rm=3"
            ]
        },
        {
            "description": "Klimatyczny boutique hotel z unikalnym wystrojem i personalną obsługą. Komfortowe pokoje z widokiem na miasto.",
            "images": [
                "https://th.bing.com/th/id/R.469e4b467f2868445dd2fbcf33c1098c?rik=TiuhTHfzRRLf9A&pid=ImgRaw&r=0",
                "https://i.pinimg.com/736x/73/12/d6/7312d65449497bc59829cb9b7cb63c72.jpg"
            ]
        },
        {
            "description": "Nowoczesny hotel z doskonałą lokalizacją blisko głównych atrakcji. Przestronne pokoje z pełnym wyposażeniem.",
            "images": [
                "https://th.bing.com/th/id/R.cba835da6d6fd6757599f117cac6c184?rik=cCSXdzUpD7%2bL9w&riu=http%3a%2f%2fwww.homesquare.pl%2ffiles%2fuploads%2f2014%2f12%2fNowoczesny-hotel.jpg&ehk=WVJbKPRopOgqS22KnyLOagDkIgH8RTESs65tXqGqFnw%3d&risl=&pid=ImgRaw&r=0",
                "https://tse2.mm.bing.net/th/id/OIP.Yvg9F9ZKEh17z8WQtqlngQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
            ]
        },
        {
            "description": "Rodzinny hotel oferujący komfortowy pobyt z śniadaniem. Pokoje z balkonami i pięknym widokiem na okolicę.",
            "images": [
                "https://tse4.mm.bing.net/th/id/OIP.qhDkOvbVXX16YZE_ryh57gHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
                "https://tse1.mm.bing.net/th/id/OIP.RauVCLJO8UIGNclIJDBVTwHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
            ]
        },
        {
            "description": "Designerski hotel z artystycznym wystrojem i wyjątkową atmosferą. Każdy pokój to dzieło sztuki z nowoczesnymi udogodnieniami.",
            "images": [
                "https://i.pinimg.com/originals/4b/73/aa/4b73aa8471f42dbff555b38e89ce5466.jpg",
                "https://images.adsttc.com/media/images/634e/5c9b/eb99/d038/7eb2/b3a7/large_jpg/interior-focus-curves_8.jpg?1666079905"
            ]
        }
    ]

def generate_unique_id():
    """Wygeneruj unikalny identyfikator UUID"""
    return str(uuid.uuid4())

def generate_availability_window(start_date, max_days):
    """Wygeneruj okno dostępności dla hotelu"""
    # Losuj datę początku okna (między dziś a dziś + max_days)
    random_days_offset = random.randint(0, max_days)
    window_start = start_date + timedelta(days=random_days_offset)
    
    # Losuj liczbę dni dostępności (1-20)
    availability_days = random.randint(MIN_AVAILABILITY_DAYS, MAX_AVAILABILITY_DAYS)
    
    return window_start, availability_days

def generate_accommodations_for_city(location_id, city_name, hotel_names, description_sets):
    """Wygeneruj noclegi dla danego miasta"""
    accommodations = []
    today = datetime.now().date()
    
    print(f"Generuję noclegi dla miasta: {city_name}")
    
    # Dla każdego miasta uruchom 8 pętli (8 hoteli)
    for hotel_idx in range(HOTELS_PER_CITY):
        hotel_name = random.choice(hotel_names)
        print(f"  - Hotel {hotel_idx + 1}: {hotel_name}")
        
        # (ilość dni generowania)/2 razy - to będą okienka wolnego pokoju  
        windows_count = DAYS_TO_GENERATE // 2
        
        for window_idx in range(windows_count):
            # Wygeneruj okno dostępności
            window_start, availability_days = generate_availability_window(today, DAYS_TO_GENERATE)
            
            # Losuj liczbę łóżek dla tego okna
            beds = random.randint(MIN_BEDS, MAX_BEDS)
            
            # Losuj zestaw opis + zdjęcia
            desc_set = random.choice(description_sets)
            
            # Wykonaj n zapisów (n = availability_days)
            for day_offset in range(availability_days):
                accommodation_date = window_start + timedelta(days=day_offset)
                
                # Nie generuj dat z przeszłości
                if accommodation_date < today:
                    continue
                
                accommodation = {
                    "id": generate_unique_id(),
                    "locationId": location_id,
                    "date": accommodation_date.strftime("%Y-%m-%d"),
                    "price": round(random.uniform(MIN_PRICE, MAX_PRICE), 2),
                    "beds": beds,
                    "name": hotel_name,
                    "description": desc_set["description"],
                    "images": desc_set["images"]
                }
                
                accommodations.append(accommodation)
    
    print(f"  → Wygenerowano {len(accommodations)} rekordów noclegowych")
    return accommodations

def main():
    """Główna funkcja skryptu"""
    print("=== Generator noclegów dla miast ===")
    print("Maciej Padula by na to nie wpadł - za skomplikowane! 😄\\n")
    
    # Załaduj dane lokalizacji
    locations = load_locations()
    if not locations:
        print("Nie udało się załadować danych lokalizacji.")
        return
    
    print(f"Załadowano {len(locations)} lokalizacji")
    print(f"Konfiguracja: {DAYS_TO_GENERATE} dni, {HOTELS_PER_CITY} hoteli na miasto\\n")
    
    # Przygotuj dane pomocnicze
    hotel_names = get_hotel_names()
    description_sets = get_description_image_sets()
    
    print(f"Przygotowano {len(hotel_names)} nazw hoteli i {len(description_sets)} zestawów opisów\\n")
    
    # Wygeneruj noclegi dla wszystkich miast
    all_accommodations = []
    
    for location in locations:
        location_id = location.get('id')
        city_name = location.get('location', {}).get('city', 'Nieznane miasto')
        
        city_accommodations = generate_accommodations_for_city(
            location_id, city_name, hotel_names, description_sets
        )
        
        all_accommodations.extend(city_accommodations)
    
    # Zapisz wszystkie wygenerowane dane
    print(f"\\nŁączna liczba wygenerowanych noclegów: {len(all_accommodations)}")
    
    if save_accommodations(all_accommodations):
        print("\\n✅ Proces zakończony pomyślnie!")
        print(f"   → Miasta: {len(locations)}")
        print(f"   → Hotele na miasto: {HOTELS_PER_CITY}")
        print(f"   → Łączne rekordy: {len(all_accommodations)}")
    else:
        print("\\n❌ Wystąpił błąd podczas zapisywania danych.")

if __name__ == "__main__":
    main()
