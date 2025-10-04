#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random
import os

def load_locations():
    """Załaduj dane lokalizacji z pliku JSON"""
    locations_path = os.path.join('..', '..', 'locations.json')
    
    try:
        with open(locations_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Błąd: Nie znaleziono pliku {locations_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"Błąd podczas parsowania JSON: {e}")
        return None

def save_locations(locations):
    """Zapisz zaktualizowane dane lokalizacji do pliku JSON"""
    locations_path = os.path.join('..', '..', 'locations.json')
    
    try:
        with open(locations_path, 'w', encoding='utf-8') as f:
            json.dump(locations, f, ensure_ascii=False, indent=2)
        print(f"Pomyślnie zapisano zaktualizowane dane do {locations_path}")
        return True
    except Exception as e:
        print(f"Błąd podczas zapisywania pliku: {e}")
        return False

def get_image_urls():
    """Zwróć tablicę przykładowych URL do obrazków"""
    return [
        "https://th.bing.com/th/id/R.782566d56d9a7dbf8cacca6b1073e8a4?rik=ghfvL9XJ1aPUXw&pid=ImgRaw&r=0",
        "https://tse2.mm.bing.net/th/id/OIP.ZQCLrPqv5lc-uZ9Bd8VANAHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://tse2.mm.bing.net/th/id/OIP.vAbpSfNil47e2wdV4Edi7gHaE7?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://www.planetware.com/photos-large/CZ/czech-republic-prague-pragues-old-town-square-and-wenceslas-square.jpg",
        "https://tse1.mm.bing.net/th/id/OIP.czgeJ-zlOZIJXiXGtxq0DgHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://tse4.mm.bing.net/th/id/OIP.0IYYNgvergJp7TOBve9eIQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://tse2.mm.bing.net/th/id/OIP.cdyg0oR-Dcb4I7rgCyFOZgHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://th.bing.com/th/id/OIP.1DajnpMfyrh9qbZa75azAAHaC6?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://th.bing.com/th/id/R.bd8cf651f60a3651ebdfb3abf916f3ec?rik=AMRVfCpPoVoeQg&pid=ImgRaw&r=0",
        "https://th.bing.com/th/id/OIP.PZxN1xTAWdEao0xYSougFQHaE8?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://www.planetware.com/wpimages/2020/03/poland-top-attractions-marlbork-castle.jpg",
        "https://th.bing.com/th/id/R.faa76861ee5137de7cfd7f500d178067?rik=A36I2BA82MERuQ&pid=ImgRaw&r=0",
        "https://tse3.mm.bing.net/th/id/OIP.6M7AIi7gJZH0UoqCjrbT5AHaEC?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://th.bing.com/th/id/OIP.6bRLj9FjlEW_BWMm0jsRhwHaFj?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://tse4.mm.bing.net/th/id/OIP.q530oz5Cy7UbUTWClJ5R9AHaE8?cb=12&w=1600&h=1067&rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://media.istockphoto.com/id/1167429582/pl/zdj%C4%99cie/krajobraz-g%C3%B3rski-panorama-tatr-polska-kolorowe-kwiaty-i-domki-w-dolinie-gasienicowa-lato.jpg?s=170667a&w=0&k=20&c=XqpVvVKFpX4Z3w6sIREzUXo8nk45jtix2P8alTX5p_w=",
        "https://theuniquepoland.com/wp-content/uploads/2020/06/Neons-Warsaw-768x511.jpg",
        "https://tse4.mm.bing.net/th/id/OIP.DQHAcGJer9Kf_t-uA9aZXwHaEO?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
    ]

def assign_random_images_to_attractions(locations):
    """Przypisz losowe obrazki do każdej atrakcji w każdym mieście"""
    image_urls = get_image_urls()
    updated_count = 0
    total_attractions = 0
    
    print("Rozpoczynam przypisywanie losowych obrazków do atrakcji...")
    
    for location in locations:
        city_name = location.get('location', {}).get('city', 'Nieznane miasto')
        print(f"Przetwarzam miasto: {city_name}")
        
        attractions = location.get('attractions', [])
        for attraction in attractions:
            attraction_name = attraction.get('name', 'Nieznana atrakcja')
            
            # Losuj 2 unikalne obrazki z tablicy
            selected_images = random.sample(image_urls, 2)
            attraction['images'] = selected_images
            
            updated_count += 1
            total_attractions += 1
            
            print(f"  - {attraction_name}: przypisano {len(selected_images)} obrazków")
    
    print(f"\nPodsumowanie:")
    print(f"- Łączna liczba atrakcji: {total_attractions}")
    print(f"- Zaktualizowane atrakcje: {updated_count}")
    print(f"- Dostępne URL obrazków: {len(image_urls)}")
    
    return locations

def main():
    """Główna funkcja skryptu"""
    print("=== Generator losowych obrazków dla atrakcji ===")
    print("Maciej Padula by tego nie wymyślił! 😄\n")
    
    # Załaduj dane lokalizacji
    locations = load_locations()
    if not locations:
        print("Nie udało się załadować danych lokalizacji.")
        return
    
    print(f"Załadowano {len(locations)} lokalizacji")
    
    # Przypisz losowe obrazki
    updated_locations = assign_random_images_to_attractions(locations)
    
    # Zapisz zaktualizowane dane
    if save_locations(updated_locations):
        print("\n✅ Proces zakończony pomyślnie!")
    else:
        print("\n❌ Wystąpił błąd podczas zapisywania danych.")

if __name__ == "__main__":
    main()
