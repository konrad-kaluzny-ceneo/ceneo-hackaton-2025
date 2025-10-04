import fs from 'fs/promises';
import path from 'path';
import { LocationWithEmbeddings } from './types';

export class LocationService {
  private locationsPath: string;

  constructor() {
    this.locationsPath = path.join(process.cwd(), 'src', 'local-data', 'locations.json');
  }

  async loadLocations(): Promise<LocationWithEmbeddings[]> {
    const locationsRaw = await fs.readFile(this.locationsPath, 'utf-8');
    return JSON.parse(locationsRaw);
  }

  async saveLocations(locations: LocationWithEmbeddings[]): Promise<void> {
    const updatedJson = JSON.stringify(locations, null, 2);
    await fs.writeFile(this.locationsPath, updatedJson, 'utf-8');
  }

  hasEmbeddings(locations: LocationWithEmbeddings[]): boolean {
    return locations.some(loc =>
      loc.attractions.some(attr => attr.embedding && attr.embedding.length > 0)
    );
  }
}
