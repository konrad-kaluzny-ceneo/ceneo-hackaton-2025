#!/usr/bin/env python3
"""
Country Generator - tworzy osobne pliki JSON dla każdego kraju
na podstawie cities.json zgodnie z kontraktem locations.contract
"""

import json
import uuid
from pathlib import Path
import os

def load_cities_data():
    """Wczytuje dane miast z pliku cities.json"""
    cities_file = Path(__file__).parent / "cities.json"
    with open(cities_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def generate_location_id(country, city):
    """Generuje unikalny ID dla lokacji"""
    country_code = country[:3].lower()
    city_code = city.replace(" ", "").replace("-", "")[:6].lower()
    unique_id = str(uuid.uuid4())[:8]
    return f"{country_code}-{city_code}-{unique_id}"

def create_empty_attractions():
    """Tworzy pustą strukturę dla 3 atrakcji"""
    return [
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
    ]

def create_empty_conditions():
    """Tworzy pustą strukturę dla 12 miesięcy warunków"""
    conditions = {}
    for month in range(1, 13):
        conditions[str(month)] = {
            "density": None,
            "temp": None
        }
    return conditions

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
        "attractions": create_empty_attractions(),
        "conditionsInMonth": create_empty_conditions()
    }

def sanitize_filename(country_name):
    """Czyści nazwę kraju dla nazwy pliku"""
    # Zamienia znaki specjalne na bezpieczne dla nazw plików
    safe_name = country_name.lower()
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
        'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
        ' ': '_', '-': '_', '_': '_'
    }
    
    for old, new in replacements.items():
        safe_name = safe_name.replace(old, new)
    
    # Usuwa wielokrotne podkreślenia i znaki specjalne
    safe_name = ''.join(c for c in safe_name if c.isalnum() or c == '_')
    safe_name = '_'.join(filter(None, safe_name.split('_')))
    
    return safe_name

def generate_country_files():
    """Główna funkcja generująca pliki dla każdego kraju"""
    print("Wczytywanie danych miast...")
    cities_data = load_cities_data()
    
    # Tworz katalog locations jeśli nie istnieje
    output_dir = Path(__file__).parent / "countries"
    output_dir.mkdir(exist_ok=True)
    
    print(f"Katalog wyjściowy: {output_dir}")
    
    for country, cities in cities_data.items():
        print(f"\nPrzetwarzanie kraju: {country}")
        
        # Twórz listę lokacji dla tego kraju
        country_locations = []
        
        for city_data in cities:
            location_entry = create_location_entry(country, city_data)
            country_locations.append(location_entry)
            print(f"  - Dodano: {city_data['city']}, {city_data['region']}")
        
        # Generuj bezpieczną nazwę pliku
        safe_country_name = sanitize_filename(country)
        output_file = output_dir / f"{safe_country_name}.json"
        
        # Zapisz do pliku JSON
        print(f"  📁 Zapisywanie do: {output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(country_locations, f, ensure_ascii=False, indent=2)
        
        print(f"  ✅ Wygenerowano {len(country_locations)} lokacji dla {country}")
    
    print(f"\n🎉 Wygenerowano pliki dla {len(cities_data)} krajów w katalogu {output_dir}")
    
    # Lista wygenerowanych plików
    print("\n📋 Wygenerowane pliki:")
    for country in cities_data.keys():
        safe_name = sanitize_filename(country)
        print(f"  - {safe_name}.json ({country})")

if __name__ == "__main__":
    try:
        generate_country_files()
        print("\n🎉 Country Generator zakończył pracę pomyślnie!")
    except Exception as e:
        print(f"❌ Błąd podczas generowania: {e}")
        raise