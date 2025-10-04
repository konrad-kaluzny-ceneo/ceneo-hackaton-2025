#!/usr/bin/env python3
"""
Generator locations.json na podstawie cities.json zgodnie z kontraktem locations.contract
"""

import json
import uuid
from pathlib import Path

def load_cities_data():
    """Wczytuje dane miast z pliku cities.json"""
    cities_file = Path(__file__).parent / "cities.json"
    with open(cities_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_location_id(country, city):
    """Generuje unikalny ID dla lokacji"""
    # Generuje ID w formacie: pierwsze 3 litery kraju + pierwsze 3 litery miasta + UUID
    country_code = country[:3].lower()
    city_code = city.replace(" ", "").replace("-", "")[:6].lower()
    unique_id = str(uuid.uuid4())[:8]
    return f"{country_code}-{city_code}-{unique_id}"

def create_location_entry(country, city_data):
    """Tworzy wpis lokacji zgodny z kontraktem locations.contract"""
    city_name = city_data["city"]
    region = city_data["region"]
    
    return {
        "id": generate_location_id(country, city_name),
        "location": {
            "country": country,
            "region": region,
            "city": city_name
        },
        "attractions": [
            {
                "name": None,
                "description": None,
                "price": 0,
                "images": [
                    "https://rudeiczarne.pl/wp-content/uploads/2019/09/sobor-wasyla-blogoslawionego.jpg?is-pending-load=1",
                    "https://tse2.mm.bing.net/th/id/OIP.vDf7w4-HxS5R10hSnCiZNAHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                ]
            },
            {
                "name": None,
                "description": None,
                "price": None,
                "images": [
                    "https://rudeiczarne.pl/wp-content/uploads/2019/09/sobor-wasyla-blogoslawionego.jpg?is-pending-load=1",
                    "https://tse2.mm.bing.net/th/id/OIP.vDf7w4-HxS5R10hSnCiZNAHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                ]
            },
            {
                "name": None,
                "description": None,
                "price": None,
                "images": [
                    "https://rudeiczarne.pl/wp-content/uploads/2019/09/sobor-wasyla-blogoslawionego.jpg?is-pending-load=1",
                    "https://tse2.mm.bing.net/th/id/OIP.vDf7w4-HxS5R10hSnCiZNAHaEo?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                ]
            }
            
        ],
        "conditionsInMonth": {
            "1": { "density": None, "temp": None },
            "2": { "density": None, "temp": None },
            "3": { "density": None, "temp": None },
            "4": { "density": None, "temp": None },
            "5": { "density": None, "temp": None },
            "6": { "density": None, "temp": None },
            "7": { "density": None, "temp": None },
            "8": { "density": None, "temp": None },
            "9": { "density": None, "temp": None },
            "10": { "density": None, "temp": None },
            "11": { "density": None, "temp": None },
            "12": { "density": None, "temp": None }
        }
    }

def generate_locations():
    """Główna funkcja generująca plik locations.json"""
    print("Wczytywanie danych miast...")
    cities_data = load_cities_data()
    
    locations = []
    
    print("Generowanie wpisów lokacji...")
    for country, cities in cities_data.items():
        print(f"Przetwarzanie kraju: {country}")
        for city_data in cities:
            location_entry = create_location_entry(country, city_data)
            locations.append(location_entry)
            print(f"  - Dodano: {city_data['city']}, {city_data['region']}")
    
    # Zapisz do pliku locations.json
    output_file = Path(__file__).parent.parent / "locations.json"
    
    print(f"Zapisywanie do pliku: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(locations, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Wygenerowano {len(locations)} lokacji w pliku {output_file}")
    return locations

if __name__ == "__main__":
    try:
        locations = generate_locations()
        print("🎉 Generator zakończył pracę pomyślnie!")
    except Exception as e:
        print(f"❌ Błąd podczas generowania: {e}")
        raise
